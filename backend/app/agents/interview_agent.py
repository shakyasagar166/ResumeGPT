import json
from typing import Dict, Any, List, Optional
from app.llm.llm_service import LLMService, get_llm_service

INTERVIEW_PROMPT = """You are a Senior Technical Recruiter & Interview Coach Agent.
Based on the candidate's resume and target job requirements, generate targeted interview questions with complete STAR (Situation, Task, Action, Result) model answer blueprints.

Produce a valid JSON array of question objects with this schema:
[
  {
    "question": "Specific question testing a core requirement or past achievement",
    "type": "Behavioral" | "Technical" | "Situational",
    "star_framework": {
      "Situation": "Context or baseline problem",
      "Task": "Specific objective",
      "Action": "Actions the candidate took",
      "Result": "Measurable outcome"
    }
  }
]
Do not output any markdown or commentary outside the JSON array.
"""

class InterviewAgent:
    def __init__(self, llm_service: Optional[LLMService] = None):
        self.llm = llm_service or get_llm_service()

    async def generate_questions(
        self,
        resume_text: str,
        job_title: str,
        job_description: str
    ) -> List[Dict[str, Any]]:
        prompt = (
            f"Target Role: {job_title}\n\n"
            f"JOB DESCRIPTION:\n{job_description[:1500]}\n\n"
            f"CANDIDATE BACKGROUND:\n{resume_text[:1500]}\n\n"
            f"Generate 3-5 high-probability interview questions with STAR answer guidelines."
        )

        res = await self.llm.generate(prompt=prompt, system_prompt=INTERVIEW_PROMPT)

        try:
            cleaned = res.strip()
            if cleaned.startswith("```json"): cleaned = cleaned[7:]
            if cleaned.startswith("```"): cleaned = cleaned[3:]
            if cleaned.endswith("```"): cleaned = cleaned[:-3]
            return json.loads(cleaned.strip())
        except Exception:
            return [
                {
                    "question": f"How does your technical experience align with this {job_title} opening?",
                    "type": "Technical Overview",
                    "star_framework": {
                        "Situation": "Handling complex engineering deliverables in previous projects.",
                        "Task": "Delivering scalable, resilient features under tight deadlines.",
                        "Action": "Applied modern design patterns and automated testing pipelines.",
                        "Result": "Delivered high reliability and exceeded project goals."
                    }
                }
            ]

_interview_agent = None

def get_interview_agent() -> InterviewAgent:
    global _interview_agent
    if _interview_agent is None:
        _interview_agent = InterviewAgent()
    return _interview_agent
