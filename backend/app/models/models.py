from sqlalchemy import Column, String, Integer, Float, ForeignKey, JSON, DateTime
from sqlalchemy.orm import relationship
import uuid
from app.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, default=generate_uuid)
    type = Column(String, index=True) # PERSON, ORG, ACCOUNT
    name = Column(String, index=True)
    attributes = Column(JSON, default={})

class Relationship(Base):
    __tablename__ = "relationships"

    id = Column(String, primary_key=True, default=generate_uuid)
    source_id = Column(String, ForeignKey("entities.id"))
    target_id = Column(String, ForeignKey("entities.id"))
    type = Column(String, index=True) # COMMUNICATED, TRANSFERRED, ASSOCIATED
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    attributes = Column(JSON, default={})

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=generate_uuid)
    type = Column(String, index=True) # SIGINT, CDR, TXN, NCRB_RECORD
    source_ref = Column(String, index=True)
    content = Column(String)
    attributes = Column(JSON, default={})

class StateCrimeRecord(Base):
    __tablename__ = "state_crime_records"

    id = Column(String, primary_key=True, default=generate_uuid)
    state_name = Column(String, index=True, unique=True)
    crimes_2020 = Column(Integer)
    crimes_2021 = Column(Integer)
    crimes_2022 = Column(Integer)
    population_2022_lakhs = Column(Float)
    crime_rate_2022 = Column(Float)
    chargesheeting_rate_2022 = Column(Float)
