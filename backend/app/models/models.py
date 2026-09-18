from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, DateTime, Boolean, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
import enum
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def utcnow():
    return datetime.now(timezone.utc)

# ─── Role Enum ───
class RoleEnum(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    INVESTIGATION_ADMIN = "INVESTIGATION_ADMIN"
    INVESTIGATOR = "INVESTIGATOR"
    ANALYST = "ANALYST"
    EVIDENCE_REVIEWER = "EVIDENCE_REVIEWER"
    VIEWER = "VIEWER"

# ─── Case Status Enum ───
class CaseStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    CLOSED = "CLOSED"
    ARCHIVED = "ARCHIVED"
    UNDER_REVIEW = "UNDER_REVIEW"

# ─── Evidence Status Enum ───
class EvidenceStatus(str, enum.Enum):
    OBSERVED = "OBSERVED"
    VERIFIED = "VERIFIED"
    INFERRED = "INFERRED"
    FLAGGED = "FLAGGED"

# ═══════════════════════════════════════════
# USER
# ═══════════════════════════════════════════
class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default=RoleEnum.VIEWER.value, index=True)
    department = Column(String, default="")
    organization = Column(String, default="")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=utcnow)
    last_login = Column(DateTime, nullable=True)

# ═══════════════════════════════════════════
# CASE
# ═══════════════════════════════════════════
class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_name = Column(String, nullable=False, index=True)
    description = Column(Text, default="")
    status = Column(String, default=CaseStatus.ACTIVE.value, index=True)
    created_by = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=utcnow)
    updated_at = Column(DateTime, default=utcnow, onupdate=utcnow)

    # Relationships
    entities = relationship("Entity", back_populates="case", cascade="all, delete-orphan")
    sources = relationship("Source", back_populates="case", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="case", cascade="all, delete-orphan")

# ═══════════════════════════════════════════
# CASE ASSIGNMENT (many-to-many)
# ═══════════════════════════════════════════
class CaseAssignment(Base):
    __tablename__ = "case_assignments"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=False, index=True)
    assigned_at = Column(DateTime, default=utcnow)

# ═══════════════════════════════════════════
# ENTITY
# ═══════════════════════════════════════════
class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"), nullable=True, index=True)
    type = Column(String, index=True)  # PERSON, PHONE, ACCOUNT, VEHICLE, LOCATION, ORG
    name = Column(String, index=True)
    attributes = Column(JSON, default={})
    status = Column(String, default=EvidenceStatus.OBSERVED.value)
    created_at = Column(DateTime, default=utcnow)

    case = relationship("Case", back_populates="entities")

# ═══════════════════════════════════════════
# RELATIONSHIP
# ═══════════════════════════════════════════
class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String, primary_key=True, default=generate_uuid)
    source_entity_id = Column(String, ForeignKey("entities.id"), nullable=False)
    target_entity_id = Column(String, ForeignKey("entities.id"), nullable=False)
    type = Column(String, index=True)  # COMMUNICATED, TRANSFERRED, ASSOCIATED
    status = Column(String, default=EvidenceStatus.OBSERVED.value)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    attributes = Column(JSON, default={})
    created_at = Column(DateTime, default=utcnow)

    source_entity = relationship("Entity", foreign_keys=[source_entity_id])
    target_entity = relationship("Entity", foreign_keys=[target_entity_id])

# ═══════════════════════════════════════════
# SOURCE (uploaded CSV files)
# ═══════════════════════════════════════════
class Source(Base):
    __tablename__ = "sources"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"), nullable=True, index=True)
    filename = Column(String, nullable=False)
    row_count = Column(Integer, default=0)
    columns = Column(JSON, default=[])
    uploaded_by = Column(String, ForeignKey("users.id"), nullable=True)
    uploaded_at = Column(DateTime, default=utcnow)

    case = relationship("Case", back_populates="sources")

# ═══════════════════════════════════════════
# EVIDENCE
# ═══════════════════════════════════════════
class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"), nullable=True, index=True)
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    entity_id = Column(String, ForeignKey("entities.id"), nullable=True)
    relationship_id = Column(String, ForeignKey("relationships.id"), nullable=True)
    type = Column(String, index=True)  # CSV_ROW, SIGINT, CDR, TXN
    content = Column(Text, default="")
    original_row = Column(JSON, default={})
    row_number = Column(Integer, nullable=True)
    status = Column(String, default=EvidenceStatus.OBSERVED.value, index=True)
    reviewed_by = Column(String, ForeignKey("users.id"), nullable=True)
    review_comment = Column(Text, default="")
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=utcnow)

# ═══════════════════════════════════════════
# EVENT (for timeline)
# ═══════════════════════════════════════════
class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=generate_uuid)
    case_id = Column(String, ForeignKey("cases.id"), nullable=True, index=True)
    entity_id = Column(String, ForeignKey("entities.id"), nullable=True)
    event_type = Column(String, index=True)  # COMMUNICATION, FINANCIAL, LOCATION, SYSTEM
    description = Column(Text, default="")
    date_time = Column(DateTime, nullable=True)
    source_id = Column(String, ForeignKey("sources.id"), nullable=True)
    status = Column(String, default=EvidenceStatus.OBSERVED.value)
    attributes = Column(JSON, default={})
    created_at = Column(DateTime, default=utcnow)

    case = relationship("Case", back_populates="events")

# ═══════════════════════════════════════════
# AUDIT LOG
# ═══════════════════════════════════════════
class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False, index=True)  # LOGIN, LOGOUT, UPLOAD_CSV, CREATE_CASE, etc.
    resource_type = Column(String, nullable=True)  # case, evidence, user, dataset
    resource_id = Column(String, nullable=True)
    metadata_ = Column("metadata", JSON, default={})
    timestamp = Column(DateTime, default=utcnow, index=True)
