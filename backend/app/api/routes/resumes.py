from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database.database import get_db
from app.models.user import User
from app.schemas.resume import ResumeUploadResponse, ResumeResponse
from app.services.resume_service import ResumeService
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/resumes", tags=["Resumes"])

@router.post("/upload", response_model=ResumeUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    service = ResumeService(db)
    return service.process_upload(file=file, user_id=current_user.id)

@router.get("", response_model=List[ResumeResponse])
def list_resumes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ResumeService(db)
    return service.get_user_resumes(user_id=current_user.id)

@router.get("/{resume_id}", response_model=ResumeResponse)
def get_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ResumeService(db)
    return service.get_resume(resume_id=resume_id, user_id=current_user.id)

@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ResumeService(db)
    service.delete_resume(resume_id=resume_id, user_id=current_user.id)
    return None

@router.get("/{resume_id}/download")
def download_resume(resume_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    service = ResumeService(db)
    res = service.get_resume(resume_id=resume_id, user_id=current_user.id)
    return FileResponse(path=res.file_path, filename=res.filename, media_type="application/pdf")
