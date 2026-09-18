"""
Timeline Event routes: list timeline events chronologically.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models.models import Event
from app.schemas.schemas import EventResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/timeline", tags=["Timeline"])

@router.get("", response_model=List[EventResponse])
def get_timeline_events(
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    query = db.query(Event)
    if case_id:
        query = query.filter(Event.case_id == case_id)
    return query.order_by(Event.date_time.asc()).all()
