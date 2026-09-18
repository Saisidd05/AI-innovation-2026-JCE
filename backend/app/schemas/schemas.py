from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# ─── Auth Schemas ───
class RegisterRequest(BaseModel):
    full_name: str
    email: str
    password: str
    role: str = "VIEWER"
    department: str = ""
    organization: str = ""

class LoginRequest(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: str
    full_name: str
    email: str
    role: str
    department: str
    organization: str
    is_active: bool
    permissions: List[str]
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ─── Case Schemas ───
class CaseCreate(BaseModel):
    case_name: str
    description: str = ""
    status: str = "ACTIVE"

class CaseUpdate(BaseModel):
    case_name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class CaseResponse(BaseModel):
    id: str
    case_name: str
    description: str
    status: str
    created_by: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    entity_count: int = 0
    relationship_count: int = 0
    source_count: int = 0

    class Config:
        from_attributes = True

# ─── Entity Schemas ───
class EntityBase(BaseModel):
    type: str
    name: str
    attributes: Dict[str, Any] = {}

class EntityCreate(EntityBase):
    case_id: Optional[str] = None

class EntityResponse(EntityBase):
    id: str
    case_id: Optional[str] = None
    status: str = "OBSERVED"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ─── Relationship Schemas ───
class RelationshipBase(BaseModel):
    source_entity_id: str
    target_entity_id: str
    type: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    attributes: Dict[str, Any] = {}

class RelationshipResponse(RelationshipBase):
    id: str
    status: str = "OBSERVED"

    class Config:
        from_attributes = True

# ─── Evidence Schemas ───
class EvidenceResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    source_id: Optional[str] = None
    type: Optional[str] = None
    content: str
    original_row: Dict[str, Any] = {}
    row_number: Optional[int] = None
    status: str
    reviewed_by: Optional[str] = None
    review_comment: str = ""
    reviewed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class EvidenceVerifyRequest(BaseModel):
    status: str  # VERIFIED, FLAGGED, INFERRED
    comment: str = ""

# ─── Event / Timeline Schemas ───
class EventResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    entity_id: Optional[str] = None
    event_type: Optional[str] = None
    description: str
    date_time: Optional[datetime] = None
    status: str = "OBSERVED"
    attributes: Dict[str, Any] = {}
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ─── Graph Schemas ───
class GraphData(BaseModel):
    nodes: List[EntityResponse]
    edges: List[RelationshipResponse]

# ─── Source Schemas ───
class SourceResponse(BaseModel):
    id: str
    case_id: Optional[str] = None
    filename: str
    row_count: int
    columns: List[str] = []
    uploaded_by: Optional[str] = None
    uploaded_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# ─── Audit Log Schemas ───
class AuditLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    action: str
    resource_type: Optional[str] = None
    resource_id: Optional[str] = None
    metadata_: Dict[str, Any] = {}
    timestamp: Optional[datetime] = None

    class Config:
        from_attributes = True

# ─── Hacker AI Schemas ───
class SearchRequest(BaseModel):
    query: str
    top_k: int = 5
    case_id: Optional[str] = None

class SearchResult(BaseModel):
    row_id: str
    filename: Optional[str] = None
    case_id: Optional[str] = None
    content: str
    score: float

class HackerAIRequest(BaseModel):
    question: str
    case_id: Optional[str] = None

class SourceEvidence(BaseModel):
    filename: Optional[str] = None
    row_id: str
    case_id: Optional[str] = None
    content: str

class HackerAIResponse(BaseModel):
    question: str
    answer: str
    sources: List[SourceEvidence]
