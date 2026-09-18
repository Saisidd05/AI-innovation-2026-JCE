import pandas as pd
import io
import uuid
from typing import Optional
from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.utils.text_converter import row_to_document
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.models.models import Source, Evidence, Entity, Relationship, Case

async def process_and_store_csv(
    file: UploadFile, 
    db: Session, 
    case_id: Optional[str] = None, 
    user_id: Optional[str] = None
):
    contents = await file.read()
    
    # Read CSV using pandas
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise ValueError(f"Invalid CSV format: {e}")

    # Replace NaN with empty string
    df = df.fillna("")

    row_count = len(df)
    columns_list = list(df.columns)

    # 1. Create Source record in relational DB
    source_obj = Source(
        case_id=case_id if case_id else None,
        filename=file.filename,
        row_count=row_count,
        columns=columns_list,
        uploaded_by=user_id
    )
    db.add(source_obj)
    db.flush()

    ids = []
    documents = []
    embeddings = []
    metadatas = []

    for index, row in df.iterrows():
        row_dict = row.to_dict()
        row_num = index + 1
        
        # Readable text document string
        doc_text = row_to_document(row_dict)
        
        # 2. Create Evidence record in relational DB
        ev_id = str(uuid.uuid4())
        ev_obj = Evidence(
            id=ev_id,
            case_id=case_id if case_id else None,
            source_id=source_obj.id,
            type=str(row_dict.get("type", "CSV_ROW")),
            content=doc_text,
            original_row=row_dict,
            row_number=row_num,
            status="OBSERVED"
        )
        db.add(ev_obj)

        # 3. Automatic Entity Extraction from common CSV column headers
        # Supported headers: person, name, phone, email, wallet, account, ip, location
        for col_name, val in row_dict.items():
            if not val or not isinstance(val, (str, int, float)):
                continue
            val_str = str(val).strip()
            if not val_str:
                continue

            col_lower = str(col_name).lower()
            ent_type = None

            if "phone" in col_lower or "mobile" in col_lower:
                ent_type = "Phone"
            elif "person" in col_lower or "caller" in col_lower or "receiver" in col_lower or "suspect" in col_lower:
                ent_type = "Person"
            elif "wallet" in col_lower or "crypto" in col_lower:
                ent_type = "CryptoWallet"
            elif "account" in col_lower or "bank" in col_lower:
                ent_type = "Account"
            elif "ip" in col_lower:
                ent_type = "IPAddress"
            elif "location" in col_lower or "address" in col_lower or "city" in col_lower:
                ent_type = "Location"

            if ent_type and case_id:
                # Deduplicate entity in case
                existing_ent = db.query(Entity).filter(
                    Entity.case_id == case_id,
                    Entity.name == val_str
                ).first()
                if not existing_ent:
                    new_ent = Entity(
                        case_id=case_id,
                        type=ent_type,
                        name=val_str,
                        status="OBSERVED",
                        attributes={"extracted_from": file.filename, "row": row_num}
                    )
                    db.add(new_ent)

        # 4. Generate Embedding for ChromaDB vector store
        embedding = embedding_service.get_embedding(doc_text)
        
        metadata = {
            "filename": file.filename,
            "row_id": str(row_num),
            "case_id": case_id or "",
            "evidence_id": ev_id
        }

        ids.append(ev_id)
        documents.append(doc_text)
        embeddings.append(embedding)
        metadatas.append(metadata)

    db.commit()

    # 5. Batch insert into ChromaDB vector store
    if ids:
        vector_store.add_documents(
            ids=ids,
            documents=documents,
            embeddings=embeddings,
            metadatas=metadatas
        )

    return {
        "filename": file.filename,
        "rows_processed": row_count,
        "case_id": case_id,
        "message": f"Successfully ingested {row_count} records into Evidence Locker & Hacker AI Vector Store."
    }
