"""
Case management routes with role-based access control.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Case, Entity, Relationship, Source, AuditLog, CaseAssignment
from app.schemas.schemas import CaseCreate, CaseUpdate, CaseResponse
from app.dependencies import get_current_user, require_permission
from app.utils.permissions import CREATE_CASE, VIEW_CASES, EDIT_CASE, DELETE_CASE

router = APIRouter(prefix="/api/cases", tags=["Cases"])

@router.get("", response_model=List[CaseResponse])
def list_cases(
    current_user=Depends(require_permission(VIEW_CASES)),
    db: Session = Depends(get_db)
):
    # SUPER_ADMIN and INVESTIGATION_ADMIN see all cases
    if current_user.role in ("SUPER_ADMIN", "INVESTIGATION_ADMIN"):
        cases = db.query(Case).order_by(Case.created_at.desc()).all()
    else:
        # Other roles see only assigned cases
        assigned_ids = db.query(CaseAssignment.case_id).filter(
            CaseAssignment.user_id == current_user.id
        ).subquery()
        cases = db.query(Case).filter(Case.id.in_(assigned_ids)).order_by(Case.created_at.desc()).all()
    
    result = []
    for c in cases:
        entity_count = db.query(Entity).filter(Entity.case_id == c.id).count()
        rel_count = db.query(Relationship).join(
            Entity, Relationship.source_entity_id == Entity.id
        ).filter(Entity.case_id == c.id).count()
        source_count = db.query(Source).filter(Source.case_id == c.id).count()
        
        result.append(CaseResponse(
            id=c.id,
            case_name=c.case_name,
            description=c.description or "",
            status=c.status,
            created_by=c.created_by,
            created_at=c.created_at,
            updated_at=c.updated_at,
            entity_count=entity_count,
            relationship_count=rel_count,
            source_count=source_count,
        ))
    return result

@router.post("", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
def create_case(
    request: CaseCreate,
    current_user=Depends(require_permission(CREATE_CASE)),
    db: Session = Depends(get_db)
):
    case = Case(
        case_name=request.case_name,
        description=request.description,
        status=request.status,
        created_by=current_user.id,
    )
    db.add(case)
    
    # Auto-assign creator
    assignment = CaseAssignment(case_id=case.id, user_id=current_user.id)
    db.add(assignment)
    
    # Audit
    audit = AuditLog(user_id=current_user.id, action="CREATE_CASE", resource_type="case", resource_id=case.id)
    db.add(audit)
    
    db.commit()
    db.refresh(case)
    
    return CaseResponse(
        id=case.id,
        case_name=case.case_name,
        description=case.description or "",
        status=case.status,
        created_by=case.created_by,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(
    case_id: str,
    current_user=Depends(require_permission(VIEW_CASES)),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    entity_count = db.query(Entity).filter(Entity.case_id == case.id).count()
    source_count = db.query(Source).filter(Source.case_id == case.id).count()
    
    return CaseResponse(
        id=case.id,
        case_name=case.case_name,
        description=case.description or "",
        status=case.status,
        created_by=case.created_by,
        created_at=case.created_at,
        updated_at=case.updated_at,
        entity_count=entity_count,
        source_count=source_count,
    )

@router.patch("/{case_id}", response_model=CaseResponse)
def update_case(
    case_id: str,
    request: CaseUpdate,
    current_user=Depends(require_permission(EDIT_CASE)),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if request.case_name is not None:
        case.case_name = request.case_name
    if request.description is not None:
        case.description = request.description
    if request.status is not None:
        case.status = request.status
    
    audit = AuditLog(user_id=current_user.id, action="UPDATE_CASE", resource_type="case", resource_id=case.id)
    db.add(audit)
    
    db.commit()
    db.refresh(case)
    
    return CaseResponse(
        id=case.id,
        case_name=case.case_name,
        description=case.description or "",
        status=case.status,
        created_by=case.created_by,
        created_at=case.created_at,
        updated_at=case.updated_at,
    )

@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_case(
    case_id: str,
    current_user=Depends(require_permission(DELETE_CASE)),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    audit = AuditLog(user_id=current_user.id, action="DELETE_CASE", resource_type="case", resource_id=case.id)
    db.add(audit)
    
    db.delete(case)
    db.commit()
