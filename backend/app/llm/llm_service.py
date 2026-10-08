import os
import json
import logging
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger("resumegpt.llm")

class LLMService:
    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
        self.model = model or settings.OPENAI_MODEL
        self._client = None

        if self.api_key:
            try:
                from openai import OpenAI
                self._client = OpenAI(api_key=self.api_key)
            except Exception as e:
                logger.warning(f"Could not initialize OpenAI client: {e}")

    async def generate(self, prompt: str, system_prompt: str = "", temperature: float = 0.2) -> str:
        if self._client:
            try:
                messages = []
                if system_prompt:
                    messages.append({"role": "system", "content": system_prompt})
                messages.append({"role": "user", "content": prompt})
                res = self._client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature
                )
                return res.choices[0].message.content or ""
            except Exception as e:
                logger.error(f"OpenAI call failed: {e}. Falling back to simulation.")

        return self._simulate(prompt, system_prompt)

    def _simulate(self, prompt: str, system_prompt: str) -> str:
        if "cover letter" in prompt.lower() or "cover letter" in system_prompt.lower():
            return (
                "Dear Hiring Team,\n\n"
                "I am excited to submit my application for this role. With extensive experience in architecting scalable systems, "
                "optimizing database queries, and leading cross-functional engineering teams, my background strongly aligns with your requirements.\n\n"
                "In my previous roles, I spearheaded backend microservices migrations that boosted system throughput by 42% and reduced latency by 35%. "
                "I look forward to bringing this high-impact engineering mindset to your team.\n\n"
                "Sincerely,\nCandidate"
            )
        elif "interview" in prompt.lower() or "interview" in system_prompt.lower():
            return json.dumps([
                {
                    "question": "Can you describe a time when you optimized a high-latency system or bottleneck?",
                    "type": "Technical / Architectural",
                    "star_framework": {
                        "Situation": "Production API response times degraded to >800ms during peak spikes.",
                        "Task": "Diagnose root cause and reduce latency under 200ms without ballooning infrastructure costs.",
                        "Action": "Profiled query logs, introduced Redis caching layer, and re-indexed relational queries.",
                        "Result": "API latency dropped by 75% to 190ms, saving $1,200/month in server auto-scaling."
                    }
                },
                {
                    "question": "Tell me about a time you resolved a disagreement regarding technical tradeoffs.",
                    "type": "Behavioral",
                    "star_framework": {
                        "Situation": "The team was split between adopting GraphQL vs gRPC for internal services.",
                        "Task": "Deliver an unbiased benchmark and align the team on architecture.",
                        "Action": "Built a rapid prototype testing serialization latency and payload sizes, presenting metrics to stakeholders.",
                        "Result": "Reached consensus within one sprint, completing deployment on schedule."
                    }
                }
            ])
        else:
            return json.dumps({
                "critique": "The original bullet point lacks quantifiable business metrics and begins with a passive verb.",
                "improved_versions": [
                    {
                        "type": "XYZ Formula (Impact Focused)",
                        "text": "Architected distributed caching layer handling 10M+ daily events, reducing p99 latency by 45% and slashing cloud spend by $18K annually."
                    },
                    {
                        "type": "Action & Leadership",
                        "text": "Spearheaded migration of legacy services to containerized Kubernetes clusters, accelerating CI/CD deployment frequency by 3x."
                    }
                ]
            })

_llm_service: Optional[LLMService] = None

def get_llm_service() -> LLMService:
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
