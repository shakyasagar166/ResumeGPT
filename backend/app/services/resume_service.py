import shutil
from pathlib import Path
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import UploadFile, HTTPException, status
from app.core.config import settings
from app.models.resume import Resume
from app.models.job_match import JobMatch
from app.services.parser_service import ParserService
from app.services.ats_scorer import ATSScorer

class ResumeService:
    def __init__(self, db: Session):
        self.db = db
        self.parser = ParserService()
        self.ats_scorer = ATSScorer()

    def process_upload(self, file: UploadFile, user_id: int) -> Resume:
        if not file.filename.lower().endswith(".pdf"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF resumes are currently supported.")

        filename = f"user_{user_id}_{file.filename}"
        dest_path = settings.RESUMES_DIR / filename

        with open(dest_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        raw_text = self.parser.extract_text_from_pdf(dest_path)
        parsed_data = self.parser.parse_resume_text(raw_text)
        ats_score = self.ats_scorer.compute_general_ats_score(parsed_data, raw_text)

        title = Path(file.filename).stem.replace("_", " ").title()

        resume = Resume(
            user_id=user_id,
            title=title,
            filename=file.filename,
            file_path=str(dest_path),
            raw_text=raw_text,
            parsed_data=parsed_data,
            ats_score=ats_score
        )
        self.db.add(resume)
        self.db.commit()
        self.db.refresh(resume)
        return resume

    def get_user_resumes(self, user_id: int) -> List[Resume]:
        return self.db.query(Resume).filter(Resume.user_id == user_id).order_by(Resume.created_at.desc()).all()

    def get_resume(self, resume_id: int, user_id: int) -> Resume:
        res = self.db.query(Resume).filter(Resume.id == resume_id, Resume.user_id == user_id).first()
        if not res:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found")
        return res

    def delete_resume(self, resume_id: int, user_id: int) -> None:
        res = self.get_resume(resume_id, user_id)
        path = Path(res.file_path)
        if path.exists():
            path.unlink()
        self.db.delete(res)
        self.db.commit()
