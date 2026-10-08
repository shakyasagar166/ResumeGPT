from typing import Optional
from app.llm.llm_service import LLMService, get_llm_service

COVER_LETTER_PROMPT = """You are an Executive Cover Letter Agent.
Generate a tailored, high-converting, professional cover letter that connects the candidate's verified background with the target company's job requirements.

Structure:
1. Hook & Introduction: Why this specific role and company excite the candidate.
2. Value Proposition (2 paragraphs): Two relevant career accomplishments directly demonstrating qualifications.
3. Culture & Team Alignment: How the candidate approaches collaboration and problem solving.
4. Call to Action: Professional closing requesting an interview.
"""

class CoverLetterAgent:
    def __init__(self, llm_service: Optional[LLMService] = None):
        self.llm = llm_service or get_llm_service()

    async def generate_cover_letter(
        self,
        resume_text: str,
        job_title: str,
        company: str,
        job_description: str,
        tone: str = "confident"
    ) -> str:
        prompt = (
            f"Target Role: {job_title}\n"
            f"Company: {company or 'Hiring Team'}\n"
            f"Desired Tone: {tone}\n\n"
            f"JOB DESCRIPTION:\n{job_description}\n\n"
            f"CANDIDATE RESUME SUMMARY:\n{resume_text[:2000]}\n\n"
            f"Please write a compelling, tailored cover letter."
        )
        return await self.llm.generate(prompt=prompt, system_prompt=COVER_LETTER_PROMPT)

_cover_letter_agent = None

def get_cover_letter_agent() -> CoverLetterAgent:
    global _cover_letter_agent
    if _cover_letter_agent is None:
        _cover_letter_agent = CoverLetterAgent()
    return _cover_letter_agent
