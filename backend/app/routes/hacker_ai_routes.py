"""
Hacker AI routes: CSV upload, semantic search, RAG question answering.
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.schemas import SearchRequest, SearchResult, HackerAIRequest, HackerAIResponse
from app.services.csv_processor import process_and_store_csv
from app.services.rag_service import rag_service
from app.dependencies import get_current_user, require_permission
from app.utils.permissions import UPLOAD_DATASET, USE_RAG
from app.models.models import AuditLog

router = APIRouter(prefix="/api/hacker-ai", tags=["Hacker AI"])

@router.post("/upload-csv")
async def upload_csv(
    file: UploadFile = File(...),
    case_id: Optional[str] = Query(None),
    current_user=Depends(require_permission(UPLOAD_DATASET)),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    try:
        result = await process_and_store_csv(
            file=file, 
            db=db, 
            case_id=case_id, 
            user_id=current_user.id
        )
        
        # Audit
        audit = AuditLog(
            user_id=current_user.id,
            action="UPLOAD_CSV",
            resource_type="DATASET",
            resource_id=case_id,
            metadata_={"filename": file.filename, "rows": result.get("rows_processed")}
        )
        db.add(audit)
        db.commit()
        
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/search", response_model=List[SearchResult])
async def search_records(
    request: SearchRequest,
    current_user=Depends(require_permission(USE_RAG))
):
    try:
        results = rag_service.search(request.query, request.top_k, request.case_id)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.post("/ask", response_model=HackerAIResponse)
async def ask_question(
    request: HackerAIRequest,
    current_user=Depends(require_permission(USE_RAG)),
    db: Session = Depends(get_db)
):
    try:
        response = rag_service.ask(request.question, request.case_id)
        
        # Audit
        audit = AuditLog(
            user_id=current_user.id,
            action="RAG_QUERY",
            resource_type="HACKER_AI",
            metadata_={"question": request.question, "case_id": request.case_id}
        )
        db.add(audit)
        db.commit()
        
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Hacker AI failed to answer: {str(e)}")

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Hacker AI"}
