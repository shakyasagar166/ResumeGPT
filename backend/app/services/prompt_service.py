import os
from pathlib import Path


DEFAULT_PROMPT_TEMPLATE = """You are an elite Technical Recruiter, Executive Talent Acquisition Specialist, and Senior ATS Algorithm Auditor.
Analyze the following Resume against the target Job Description.

TARGET JOB DESCRIPTION:
{job_description}

CANDIDATE RESUME:
{resume_text}

OUTPUT FORMAT:
Return ONLY a valid JSON object without markdown code fences matching this schema:
{{
  "candidate_name": "string",
  "target_role": "string",
  "scores": {{
    "overall_score": 85,
    "skills_match_score": 80,
    "experience_match_score": 90,
    "formatting_ats_score": 88,
    "summary_verdict": "Strong Match"
  }},
  "matching_skills": ["Python", "FastAPI"],
  "missing_critical_skills": ["Kubernetes"],
  "missing_nice_to_have_skills": ["GraphQL"],
  "key_strengths": ["Strong backend experience"],
  "critical_gaps": ["Lacks container orchestration at scale"],
  "bullet_point_improvements": [
    {{
      "original": "Worked on backend APIs",
      "improved": "Architected and delivered 15+ RESTful APIs with FastAPI and PostgreSQL, serving 2M+ requests/day with sub-50ms latency.",
      "improvement_reason": "Adds scale, metrics, and specific tech stack."
    }}
  ],
  "custom_interview_questions": [
    {{
      "question": "How did you manage database connection pooling in your high-throughput FastAPI service?",
      "context": "Assesses practical backend scalability.",
      "suggested_approach": "Discuss SQLAlchemy async engines, connection pool size tuning, and handling timeouts."
    }}
  ],
  "executive_summary": "Comprehensive 2-paragraph recruiter overview."
}}
"""


class PromptService:
    """Service to load, cache, and format analysis prompts."""

    def __init__(self, prompt_file_path: str = None):
        self.prompt_file_path = prompt_file_path or self._resolve_prompt_path()
        self._cached_template = None

    def _resolve_prompt_path(self) -> str:
        """Find the location of prompts/resume_analysis.txt relative to repository structure."""
        # 1. Check relative to this file: backend/app/services/ -> ../../../prompts/resume_analysis.txt
        current_dir = Path(__file__).resolve().parent
        candidate_paths = [
            current_dir.parent.parent.parent / "prompts" / "resume_analysis.txt",
            current_dir.parent.parent / "prompts" / "resume_analysis.txt",
            Path.cwd() / "prompts" / "resume_analysis.txt",
            Path.cwd() / "ResumeGPT" / "prompts" / "resume_analysis.txt",
        ]

        for p in candidate_paths:
            if p.exists() and p.is_file():
                return str(p)

        return ""

    def get_template(self) -> str:
        """Read template from disk with fallback."""
        if self._cached_template:
            return self._cached_template

        if self.prompt_file_path and os.path.exists(self.prompt_file_path):
            try:
                with open(self.prompt_file_path, "r", encoding="utf-8") as f:
                    self._cached_template = f.read()
                    return self._cached_template
            except Exception:
                pass

        self._cached_template = DEFAULT_PROMPT_TEMPLATE
        return self._cached_template

    def build_analysis_prompt(self, resume_text: str, job_description: str) -> str:
        """Inject candidate resume and job description into prompt template."""
        template = self.get_template()
        # Truncate if excessively long to avoid token limits
        sanitized_resume = resume_text[:12000].strip()
        sanitized_jd = job_description[:8000].strip()

        # Format prompt safely
        prompt = template.replace("{resume_text}", sanitized_resume).replace("{job_description}", sanitized_jd)
        return prompt
