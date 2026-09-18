"""
Network Graph routes: retrieve graph nodes (entities) and edges (relationships).
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models.models import Entity, Relationship, Case
from app.schemas.schemas import GraphData, EntityResponse, RelationshipResponse
from app.dependencies import get_current_user

router = APIRouter(prefix="/api/graph", tags=["Graph Explorer"])

@router.get("", response_model=GraphData)
def get_graph_data(
    case_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    nodes_query = db.query(Entity)
    edges_query = db.query(Relationship)

    if case_id:
        nodes_query = nodes_query.filter(Entity.case_id == case_id)
        # get entity ids
        nodes = nodes_query.all()
        node_ids = {n.id for n in nodes}
        edges = edges_query.filter(
            (Relationship.source_entity_id.in_(node_ids)) | 
            (Relationship.target_entity_id.in_(node_ids))
        ).all()
    else:
        nodes = nodes_query.limit(200).all()
        edges = edges_query.limit(500).all()

    return GraphData(
        nodes=[EntityResponse.model_validate(n) for n in nodes],
        edges=[RelationshipResponse.model_validate(e) for e in edges]
    )
