from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.job_match import JobMatch
from app.schemas.job_match import JobMatchRequest, ATSAnalysisResponse, JobMatchResponse
from app.services.resume_service import ResumeService
from app.services.ats_scorer import ATSScorer
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/ats", tags=["ATS Analysis"])

@router.post("/match/{resume_id}", response_model=JobMatchResponse)
def match_resume_to_job(
    resume_id: int,
    request: JobMatchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    resume = resume_service.get_resume(resume_id=resume_id, user_id=current_user.id)

    scorer = ATSScorer()
    analysis = scorer.analyze_job_fit(
        resume_text=resume.raw_text,
        parsed_data=resume.parsed_data or {},
        job_description=request.job_description
    )

    job_match = JobMatch(
        resume_id=resume.id,
        job_title=request.job_title,
        company=request.company,
        job_description=request.job_description,
        match_score=analysis["match_score"],
        analysis_data=analysis
    )
    db.add(job_match)
    db.commit()
    db.refresh(job_match)
    return job_match

@router.get("/matches/{resume_id}", response_model=List[JobMatchResponse])
def get_resume_matches(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume_service = ResumeService(db)
    resume = resume_service.get_resume(resume_id=resume_id, user_id=current_user.id)
    return db.query(JobMatch).filter(JobMatch.resume_id == resume.id).order_by(JobMatch.created_at.desc()).all()
