import os
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from pydantic import BaseModel

from app.models.schemas import APIResponse, ParsedResume
from app.utils.pdf_utils import extract_text_from_pdf_bytes, extract_text_from_pdf_file
from app.services.resume_parser import parse_resume_content

router = APIRouter(prefix="/api/resume", tags=["Resume Operations"])


class ParseTextRequest(BaseModel):
    text: str


def find_sample_pdf_path() -> Path:
    """Find data/sample_resume.pdf across project root."""
    current_dir = Path(__file__).resolve().parent
    candidates = [
        current_dir.parent.parent.parent / "data" / "sample_resume.pdf",
        current_dir.parent.parent / "data" / "sample_resume.pdf",
        Path.cwd() / "data" / "sample_resume.pdf",
        Path.cwd() / "ResumeGPT" / "data" / "sample_resume.pdf",
    ]
    for p in candidates:
        if p.exists() and p.is_file():
            return p
    return candidates[0]


@router.post(
    "/upload",
    response_model=APIResponse,
    summary="Upload and parse a candidate resume",
    description="Accepts a PDF or text file, extracts sanitized content, and structures key sections."
)
async def upload_resume(file: UploadFile = File(...)):
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No filename provided in upload payload."
        )

    filename_lower = file.filename.lower()
    if not (filename_lower.endswith(".pdf") or filename_lower.endswith(".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a PDF (.pdf) or text (.txt) file."
        )

    try:
        content_bytes = await file.read()
        if len(content_bytes) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file is empty."
            )

        # Max file size limit: 10MB
        if len(content_bytes) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail="File size exceeds maximum allowed limit (10MB)."
            )

        if filename_lower.endswith(".pdf"):
            text, page_count = extract_text_from_pdf_bytes(content_bytes)
        else:
            text = content_bytes.decode("utf-8", errors="ignore")
            page_count = 1

        parsed = parse_resume_content(text=text, page_count=page_count, file_name=file.filename)
        return APIResponse(
            success=True,
            message=f"Successfully extracted {len(text)} characters across {page_count} page(s).",
            data=parsed.model_dump()
        )

    except HTTPException:
        raise
    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(val_err)
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred while processing resume: {str(exc)}"
        )


@router.get(
    "/sample",
    response_model=APIResponse,
    summary="Retrieve pre-configured sample resume",
    description="Loads data/sample_resume.pdf for instantaneous demo and one-click testing."
)
async def get_sample_resume():
    sample_path = find_sample_pdf_path()
    if not sample_path.exists():
        # Fallback to realistic demo data if sample PDF is still being generated
        demo_text = (
            "Alex Rivera\n"
            "San Francisco, CA | alex.rivera@email.com | +1 (555) 234-5678\n"
            "linkedin.com/in/alexrivera-dev | github.com/alexrivera\n\n"
            "PROFESSIONAL SUMMARY\n"
            "Full Stack Software Engineer with 5+ years of experience designing, developing, and scaling "
            "distributed cloud microservices and responsive web applications. Proven track record of improving "
            "system latency and team throughput.\n\n"
            "TECHNICAL SKILLS\n"
            "Languages: Python, JavaScript, TypeScript, SQL\n"
            "Frameworks: FastAPI, Django, React, Node.js, Express, Tailwind CSS\n"
            "Cloud & DevOps: Docker, Kubernetes, AWS (ECS, S3, RDS), CI/CD, Git\n"
            "Databases: PostgreSQL, Redis, MongoDB\n\n"
            "WORK EXPERIENCE\n"
            "Senior Software Engineer | CloudScale Technologies (2022 - Present)\n"
            "- Architected and deployed 15+ RESTful microservices using FastAPI and PostgreSQL, serving 2M+ requests/day.\n"
            "- Reduced API response latency by 35% through Redis query caching and asynchronous request handlers.\n"
            "- Spearheaded migration of legacy monolithic system to AWS containerized infrastructure using Docker & Terraform.\n\n"
            "Software Engineer | Nexa Solutions (2020 - 2022)\n"
            "- Built responsive customer-facing portals with React, TypeScript, and Tailwind CSS used by 45,000+ active users.\n"
            "- Designed automated testing suites using PyTest and Jest, elevating code coverage from 62% to 91%.\n\n"
            "EDUCATION\n"
            "Bachelor of Science in Computer Science | University of California, Berkeley (2016 - 2020)"
        )
        parsed = parse_resume_content(demo_text, page_count=1, file_name="sample_resume.pdf")
        return APIResponse(
            success=True,
            message="Loaded default sample resume data.",
            data=parsed.model_dump()
        )

    try:
        text, page_count = extract_text_from_pdf_file(str(sample_path))
        parsed = parse_resume_content(text, page_count=page_count, file_name="sample_resume.pdf")
        return APIResponse(
            success=True,
            message="Loaded sample resume from data/sample_resume.pdf.",
            data=parsed.model_dump()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to load sample resume: {str(exc)}"
        )


@router.post(
    "/parse-text",
    response_model=APIResponse,
    summary="Parse plain text resume",
    description="Extracts candidate structure directly from pasted raw text."
)
async def parse_text_endpoint(payload: ParseTextRequest):
    if len(payload.text.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text must be at least 20 characters."
        )
    parsed = parse_resume_content(payload.text.strip(), page_count=1, file_name="pasted_text.txt")
    return APIResponse(
        success=True,
        message="Parsed text resume successfully.",
        data=parsed.model_dump()
    )
