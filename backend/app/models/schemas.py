from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from datetime import datetime, timezone


class ContactInfo(BaseModel):
    """Candidate contact information parsed from resume."""
    email: Optional[str] = Field(default=None, description="Candidate email address")
    phone: Optional[str] = Field(default=None, description="Candidate phone number")
    linkedin: Optional[str] = Field(default=None, description="LinkedIn profile URL")
    github: Optional[str] = Field(default=None, description="GitHub profile URL")
    portfolio: Optional[str] = Field(default=None, description="Personal website or portfolio URL")


class ParsedResume(BaseModel):
    """Structured extraction of raw resume data."""
    candidate_name: Optional[str] = Field(default="Candidate", description="Detected candidate name")
    contact_info: ContactInfo = Field(default_factory=ContactInfo)
    summary: Optional[str] = Field(default=None, description="Professional summary or objective")
    detected_skills: List[str] = Field(default_factory=list, description="Extracted technical and soft skills")
    detected_experience_highlights: List[str] = Field(default_factory=list, description="Sample experience bullet points")
    detected_education: List[str] = Field(default_factory=list, description="Degrees, universities, certifications")
    raw_text: str = Field(description="Full sanitized text content extracted from document")
    page_count: int = Field(default=1, description="Number of pages in uploaded document")
    file_name: Optional[str] = Field(default=None, description="Original uploaded file name")


class ResumeScoreBreakdown(BaseModel):
    """Detailed score distribution across major ATS dimensions."""
    overall_score: int = Field(ge=0, le=100, description="Overall ATS compatibility match score (0-100)")
    skills_match_score: int = Field(ge=0, le=100, description="Score evaluating alignment with required skills")
    experience_match_score: int = Field(ge=0, le=100, description="Score evaluating depth and relevance of experience")
    formatting_ats_score: int = Field(ge=0, le=100, description="Score evaluating ATS parsing friendly structure")
    summary_verdict: str = Field(default="Moderate Match", description="One-line qualification status verdict")


class BulletPointImprovement(BaseModel):
    """Actionable before-and-after bullet transformation."""
    original: str = Field(description="Original line extracted from resume")
    improved: str = Field(description="Enhanced XYZ-formula metric-driven version")
    improvement_reason: str = Field(description="Recruiter rationale on why this change improves ATS ranking")


class InterviewQuestion(BaseModel):
    """Targeted interview prep question generated for candidate."""
    question: str = Field(description="High-probability interview question")
    context: str = Field(description="Why the hiring manager will ask this based on gaps/strengths")
    suggested_approach: str = Field(description="Key points and framing advice for answering")


class AnalysisResponse(BaseModel):
    """Comprehensive ATS and Recruiter evaluation payload."""
    candidate_name: str = Field(default="Candidate", description="Detected candidate name")
    target_role: str = Field(default="Target Role", description="Identified role from Job Description")
    scores: ResumeScoreBreakdown
    matching_skills: List[str] = Field(default_factory=list, description="Skills present in both resume and JD")
    missing_critical_skills: List[str] = Field(default_factory=list, description="Critical required skills missing from resume")
    missing_nice_to_have_skills: List[str] = Field(default_factory=list, description="Bonus skills that would strengthen candidacy")
    key_strengths: List[str] = Field(default_factory=list, description="Standout candidate advantages for this position")
    critical_gaps: List[str] = Field(default_factory=list, description="Red flags or gaps requiring addressing")
    bullet_point_improvements: List[BulletPointImprovement] = Field(default_factory=list)
    custom_interview_questions: List[InterviewQuestion] = Field(default_factory=list)
    executive_summary: str = Field(description="Recruiter executive summary and final assessment")
    analyzed_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class AnalysisRequest(BaseModel):
    """Request payload for running a full resume analysis."""
    resume_text: str = Field(min_length=20, description="Full plain text of candidate resume")
    job_description: str = Field(min_length=20, description="Target job description text")
    provider: Optional[str] = Field(default=None, description="Optional override for LLM provider (gemini, openai, groq, mock)")


class QuickScanRequest(BaseModel):
    """Lightweight fast scan request."""
    resume_text: str = Field(min_length=10)
    job_description: str = Field(min_length=10)


class APIResponse(BaseModel):
    """Standardized top-level API envelope."""
    success: bool = True
    message: str = "Operation completed successfully"
    data: Optional[Any] = None
    error: Optional[str] = None
