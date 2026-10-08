import re
from pathlib import Path
from typing import Dict, Any, List
from pypdf import PdfReader

COMMON_SKILLS = [
    "python", "javascript", "typescript", "react", "node.js", "docker", "kubernetes", "aws", "gcp",
    "azure", "sql", "postgresql", "mongodb", "fastapi", "django", "flask", "graphql", "rest api",
    "git", "ci/cd", "machine learning", "rag", "pytorch", "tensorflow", "redis", "linux", "c++", "java"
]

class ParserService:
    def extract_text_from_pdf(self, file_path: str | Path) -> str:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Resume file not found at {path}")

        reader = PdfReader(str(path))
        text_parts = [page.extract_text() or "" for page in reader.pages]
        return "\n\n".join(text_parts).strip()

    def parse_resume_text(self, text: str) -> Dict[str, Any]:
        email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
        phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
        linkedin_match = re.search(r'(linkedin\.com/in/[\w\-]+)', text, re.IGNORECASE)
        github_match = re.search(r'(github\.com/[\w\-]+)', text, re.IGNORECASE)

        contact = {
            "email": email_match.group(0) if email_match else "",
            "phone": phone_match.group(0) if phone_match else "",
            "linkedin": linkedin_match.group(0) if linkedin_match else "",
            "github": github_match.group(0) if github_match else ""
        }

        # Detect skills
        text_lower = text.lower()
        extracted_skills = [skill.title() for skill in COMMON_SKILLS if re.search(r'\b' + re.escape(skill) + r'\b', text_lower)]

        # Extract basic sections
        sections = self._split_sections(text)

        return {
            "contact": contact,
            "skills": extracted_skills,
            "sections": sections,
            "word_count": len(text.split()),
            "has_experience": bool(sections.get("experience")),
            "has_education": bool(sections.get("education"))
        }

    def _split_sections(self, text: str) -> Dict[str, str]:
        sections: Dict[str, str] = {}
        headers = ["experience", "work history", "education", "skills", "projects", "certifications", "summary"]
        pattern = r'(?i)\n\s*(' + '|'.join(headers) + r')\s*\n'

        parts = re.split(pattern, text)
        if len(parts) > 1:
            sections["intro"] = parts[0].strip()
            for i in range(1, len(parts), 2):
                header = parts[i].lower().strip()
                content = parts[i + 1].strip() if i + 1 < len(parts) else ""
                sections[header] = content
        else:
            sections["full_text"] = text

        return sections
