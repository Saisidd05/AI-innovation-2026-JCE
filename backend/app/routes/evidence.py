"""
Evidence management routes: list evidence, verify, flag, review.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.database import get_db
from app.models.models import Evidence, AuditLog
from app.schemas.schemas import EvidenceResponse, EvidenceVerifyRequest
from app.dependencies import get_current_user, require_permission
from app.utils.permissions import VERIFY_EVIDENCE

router = APIRouter(prefix="/api/evidence", tags=["Evidence"])

@router.get("", response_model=List[EvidenceResponse])
def get_all_evidence(
    case_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Evidence)
    if case_id:
        query = query.filter(Evidence.case_id == case_id)
    if status_filter:
        query = query.filter(Evidence.status == status_filter)
    return query.order_by(Evidence.created_at.desc()).all()

@router.put("/{evidence_id}/verify", response_model=EvidenceResponse)
def verify_evidence(
    evidence_id: str,
    req: EvidenceVerifyRequest,
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(VERIFY_EVIDENCE))
):
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        raise HTTPException(status_code=404, detail="Evidence record not found")

    ev.status = req.status
    ev.reviewed_by = current_user.id
    ev.review_comment = req.comment
    ev.reviewed_at = datetime.now(timezone.utc)

    # Log action
    log = AuditLog(
        user_id=current_user.id,
        action=f"EVIDENCE_{req.status}",
        resource_type="EVIDENCE",
        resource_id=ev.id,
        metadata_={"comment": req.comment}
    )
    db.add(log)
    db.commit()
    db.refresh(ev)
    return ev
