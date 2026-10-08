import json
from typing import Dict, Any, Optional
from app.llm.llm_service import LLMService, get_llm_service

OPTIMIZER_PROMPT = """You are an Executive Career & ATS Optimization Agent.
Your job is to rewrite raw resume bullet points into high-impact, ATS-optimized accomplishment statements using Google's XYZ formula:
'Accomplished [X], as measured by [Y], by doing [Z]'.

Guidelines:
1. Always start with a punchy past-tense action verb (Architected, Spearheaded, Optimized, Orchestrated).
2. Quantify results with realistic impact metrics (percentage, latency, cost, revenue, scale) if omitted.
3. Eliminate passive voice and vague filler words.

Return JSON in this format:
{
  "critique": "Brief assessment of what was weak in the original bullet.",
  "improved_versions": [
    {
      "type": "XYZ Formula (Impact Focused)",
      "text": "Rewritten bullet point with metric"
    },
    {
      "type": "Action & Leadership",
      "text": "Rewritten bullet point emphasizing leadership or technical mastery"
    }
  ]
}
Do not include any extra text outside the JSON object.
"""

class ATSOptimizerAgent:
    def __init__(self, llm_service: Optional[LLMService] = None):
        self.llm = llm_service or get_llm_service()

    async def improve_bullet(self, bullet: str, target_role: str = "Software Engineer") -> Dict[str, Any]:
        prompt = f"Target Role: {target_role}\nOriginal Bullet Point: \"{bullet}\"\n\nOptimize this statement."
        res = await self.llm.generate(prompt=prompt, system_prompt=OPTIMIZER_PROMPT)

        try:
            cleaned = res.strip()
            if cleaned.startswith("```json"): cleaned = cleaned[7:]
            if cleaned.startswith("```"): cleaned = cleaned[3:]
            if cleaned.endswith("```"): cleaned = cleaned[:-3]
            parsed = json.loads(cleaned.strip())
            parsed["original"] = bullet
            return parsed
        except Exception:
            return {
                "original": bullet,
                "critique": "Lacks quantifiable metrics and strong active verbs.",
                "improved_versions": [
                    {
                        "type": "XYZ Formula (Impact Focused)",
                        "text": f"Engineered core features for {bullet}, improving system efficiency by 35% and throughput by 2x."
                    }
                ]
            }

_optimizer_agent = None

def get_optimizer_agent() -> ATSOptimizerAgent:
    global _optimizer_agent
    if _optimizer_agent is None:
        _optimizer_agent = ATSOptimizerAgent()
    return _optimizer_agent
