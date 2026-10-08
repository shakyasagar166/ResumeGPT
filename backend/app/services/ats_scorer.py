import re
from typing import Dict, Any, List

ACTION_VERBS = [
    "accelerated", "architected", "delivered", "developed", "engineered", "executed",
    "implemented", "improved", "launched", "led", "optimized", "orchestrated", "reduced", "scaled", "spearheaded"
]

class ATSScorer:
    def compute_general_ats_score(self, parsed_data: Dict[str, Any], raw_text: str) -> float:
        contact = parsed_data.get("contact", {})
        sections = parsed_data.get("sections", {})
        skills = parsed_data.get("skills", [])

        score = 0.0

        # 1. Contact info completeness (25 pts)
        if contact.get("email"): score += 10
        if contact.get("phone"): score += 5
        if contact.get("linkedin"): score += 5
        if contact.get("github"): score += 5

        # 2. Section completeness (25 pts)
        if "experience" in sections or "work history" in sections: score += 10
        if "education" in sections: score += 5
        if "skills" in sections or len(skills) > 3: score += 5
        if "projects" in sections: score += 5

        # 3. Action verbs and metrics density (30 pts)
        text_lower = raw_text.lower()
        verb_hits = sum(1 for v in ACTION_VERBS if re.search(r'\b' + v + r'\b', text_lower))
        score += min(15.0, verb_hits * 3.0)

        # Quantifiable metrics (% or numbers or $)
        metrics_hits = len(re.findall(r'(\d+%\b|\$\d+|\b\d{2,}\b)', raw_text))
        score += min(15.0, metrics_hits * 2.5)

        # 4. Readability and word count (20 pts)
        words = len(raw_text.split())
        if 350 <= words <= 1200:
            score += 20
        elif words > 200:
            score += 10

        return round(min(100.0, score), 1)

    def analyze_job_fit(self, resume_text: str, parsed_data: Dict[str, Any], job_description: str) -> Dict[str, Any]:
        resume_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', resume_text.lower()))
        jd_words = set(re.findall(r'\b[a-zA-Z]{3,}\b', job_description.lower()))

        # Filter common stop words
        stop_words = {"the", "and", "with", "for", "that", "this", "from", "are", "have", "will", "our", "you", "your", "must", "work"}
        jd_keywords = [w for w in jd_words if w not in stop_words]

        matching = [w for w in jd_keywords if w in resume_words]
        missing = [w for w in jd_keywords if w not in resume_words]

        # Score matching ratio
        match_ratio = len(matching) / max(1, len(jd_keywords))
        keyword_score = round(match_ratio * 100, 1)

        base_ats = self.compute_general_ats_score(parsed_data, resume_text)
        overall_score = round((0.6 * keyword_score) + (0.4 * base_ats), 1)

        suggestions = []
        if len(missing) > 5:
            top_missing = ", ".join(missing[:5])
            suggestions.append(f"Incorporate key technical skills requested in the JD: {top_missing}")
        if base_ats < 70:
            suggestions.append("Add more quantifiable metrics and impact metrics (%, scale, cost reduction) to past work history.")
        if not parsed_data.get("contact", {}).get("linkedin"):
            suggestions.append("Include a live LinkedIn profile link in your contact section.")

        return {
            "match_score": min(100.0, overall_score),
            "keyword_match_percentage": keyword_score,
            "formatting_score": round(base_ats, 1),
            "impact_score": round(min(100.0, base_ats * 1.1), 1),
            "matching_keywords": matching[:15],
            "missing_keywords": missing[:12],
            "critical_suggestions": suggestions
        }
