from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class JobMatchRequest(BaseModel):
    job_title: str = Field(..., min_length=2)
    company: Optional[str] = ""
    job_description: str = Field(..., min_length=20)

class ATSAnalysisResponse(BaseModel):
    match_score: float
    keyword_match_percentage: float
    formatting_score: float
    impact_score: float
    matching_keywords: List[str]
    missing_keywords: List[str]
    critical_suggestions: List[str]

class JobMatchResponse(BaseModel):
    id: int
    resume_id: int
    job_title: str
    company: Optional[str] = None
    match_score: float
    analysis_data: Optional[Dict[str, Any]] = None
    cover_letter: Optional[str] = None
    interview_qa: Optional[List[Dict[str, Any]]] = None
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class CoverLetterRequest(BaseModel):
    tone: Optional[str] = "confident"  # confident, formal, enthusiastic

class InterviewPrepResponse(BaseModel):
    role: str
    company: Optional[str] = None
    questions: List[Dict[str, Any]]
