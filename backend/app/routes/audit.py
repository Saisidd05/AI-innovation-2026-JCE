"""
Audit Log routes: system activity and access logs.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import AuditLog
from app.schemas.schemas import AuditLogResponse
from app.dependencies import get_current_user, require_permission
from app.utils.permissions import VIEW_AUDIT_LOGS

router = APIRouter(prefix="/api/audit", tags=["Audit Logs"])

@router.get("", response_model=List[AuditLogResponse])
def get_audit_logs(
    db: Session = Depends(get_db),
    current_user = Depends(require_permission(VIEW_AUDIT_LOGS))
):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(100).all()
