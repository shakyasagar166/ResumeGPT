from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import relationship
from app.database.database import Base

def utc_now():
    return datetime.now(timezone.utc)

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False, default="My Resume")
    filename = Column(String(255), nullable=False)
    file_path = Column(String(1024), nullable=False)
    raw_text = Column(Text, nullable=False, default="")
    parsed_data = Column(JSON, nullable=True)  # {contact, skills, experience, education, projects}
    ats_score = Column(Float, default=0.0)
    created_at = Column(DateTime, default=utc_now)
    updated_at = Column(DateTime, default=utc_now, onupdate=utc_now)

    owner = relationship("User", back_populates="resumes")
    job_matches = relationship("JobMatch", back_populates="resume", cascade="all, delete-orphan")
