from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5

class SearchResult(BaseModel):
    row_id: str
    filename: Optional[str] = None
    case_id: Optional[str] = None
    content: str
    score: float

class HackerAIRequest(BaseModel):
    question: str

class SourceEvidence(BaseModel):
    filename: Optional[str] = None
    row_id: str
    case_id: Optional[str] = None
    content: str

class HackerAIResponse(BaseModel):
    question: str
    answer: str
    sources: List[SourceEvidence]
