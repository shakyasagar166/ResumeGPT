from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.models.job_match import JobMatch
from app.models.resume import Resume
from app.schemas.resume import BulletImproveRequest, BulletImproveResponse
from app.schemas.job_match import CoverLetterRequest, JobMatchResponse, InterviewPrepResponse
from app.agents.ats_optimizer_agent import get_optimizer_agent
from app.agents.cover_letter_agent import get_cover_letter_agent
from app.agents.interview_agent import get_interview_agent
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/agents", tags=["AI Agents"])

@router.post("/optimize-bullet", response_model=BulletImproveResponse)
async def optimize_bullet(
    request: BulletImproveRequest,
    current_user: User = Depends(get_current_user)
):
    agent = get_optimizer_agent()
    result = await agent.improve_bullet(bullet=request.bullet_point, target_role=request.target_role or "Software Engineer")
    return result

@router.post("/generate-cover-letter/{job_match_id}", response_model=JobMatchResponse)
async def generate_cover_letter(
    job_match_id: int,
    request: CoverLetterRequest = CoverLetterRequest(),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(JobMatch).join(Resume).filter(
        JobMatch.id == job_match_id,
        Resume.user_id == current_user.id
    ).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job match record not found")

    agent = get_cover_letter_agent()
    cover_letter = await agent.generate_cover_letter(
        resume_text=match.resume.raw_text,
        job_title=match.job_title,
        company=match.company or "Hiring Team",
        job_description=match.job_description,
        tone=request.tone or "confident"
    )

    match.cover_letter = cover_letter
    db.commit()
    db.refresh(match)
    return match

@router.post("/prepare-interview/{job_match_id}", response_model=JobMatchResponse)
async def prepare_interview(
    job_match_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    match = db.query(JobMatch).join(Resume).filter(
        JobMatch.id == job_match_id,
        Resume.user_id == current_user.id
    ).first()
    if not match:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job match record not found")

    agent = get_interview_agent()
    questions = await agent.generate_questions(
        resume_text=match.resume.raw_text,
        job_title=match.job_title,
        job_description=match.job_description
    )

    match.interview_qa = questions
    db.commit()
    db.refresh(match)
    return match
