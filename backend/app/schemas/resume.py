from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

class ResumeUploadResponse(BaseModel):
    id: int
    title: str
    filename: str
    ats_score: float
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ResumeResponse(BaseModel):
    id: int
    user_id: int
    title: str
    filename: str
    ats_score: float
    parsed_data: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)

class BulletImproveRequest(BaseModel):
    bullet_point: str = Field(..., min_length=5)
    target_role: Optional[str] = "Software Engineer"

class BulletImproveResponse(BaseModel):
    original: str
    improved_versions: List[Dict[str, str]]  # e.g., [{"type": "Impact & Metric", "text": "..."}]
    critique: str
