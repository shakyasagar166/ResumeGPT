from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(Integer, primary_key=True, index=True)
    resume_id = Column(Integer, ForeignKey("resumes.id"), nullable=False, index=True)
    job_title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=True, default="")
    job_description = Column(Text, nullable=False)
    match_score = Column(Float, default=0.0)
    analysis_data = Column(JSON, nullable=True)  # matching_keywords, missing_keywords, recommendations
    cover_letter = Column(Text, nullable=True)
    interview_qa = Column(JSON, nullable=True)  # list of STAR Q&A
    created_at = Column(DateTime, default=utc_now)

    resume = relationship("Resume", back_populates="job_matches")
