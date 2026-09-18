from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class EntityBase(BaseModel):
    type: str
    name: str
    attributes: Dict[str, Any] = {}

class EntityCreate(EntityBase):
    pass

class EntitySchema(EntityBase):
    id: str

    class Config:
        from_attributes = True

class RelationshipBase(BaseModel):
    source_id: str
    target_id: str
    type: str
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    attributes: Dict[str, Any] = {}

class RelationshipSchema(RelationshipBase):
    id: str

    class Config:
        from_attributes = True

class StateCrimeRecordBase(BaseModel):
    state_name: str
    crimes_2020: int
    crimes_2021: int
    crimes_2022: int
    population_2022_lakhs: float
    crime_rate_2022: float
    chargesheeting_rate_2022: float

class StateCrimeRecordSchema(StateCrimeRecordBase):
    id: str

    class Config:
        from_attributes = True

class GraphData(BaseModel):
    nodes: List[EntitySchema]
    edges: List[RelationshipSchema]
