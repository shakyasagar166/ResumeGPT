import re
from typing import List, Optional
from app.models.schemas import ParsedResume, ContactInfo

# Comprehensive skill taxonomy for local fast recognition
COMMON_SKILLS_TAXONOMY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "golang",
    "rust", "ruby", "php", "swift", "kotlin", "sql", "html", "css", "r", "scala",
    
    # Frameworks & Libraries
    "fastapi", "flask", "django", "react", "react.js", "next.js", "vue", "angular",
    "node.js", "express", "spring boot", "tailwind css", "bootstrap", "pandas",
    "numpy", "scikit-learn", "pytorch", "tensorflow", "keras", "langchain", "llamaindex",
    
    # Cloud & DevOps
    "docker", "kubernetes", "aws", "amazon web services", "azure", "gcp",
    "google cloud", "terraform", "ci/cd", "github actions", "gitlab ci", "jenkins",
    "linux", "nginx", "helm", "serverless",
    
    # Databases & Storage
    "postgresql", "postgres", "mysql", "mongodb", "redis", "elasticsearch",
    "sqlite", "cassandra", "dynamodb", "neo4j", "supabase", "firebase",
    
    # Architecture & Concepts
    "microservices", "rest api", "restful apis", "graphql", "system design",
    "rag", "llm", "large language models", "prompt engineering", "nlp",
    "machine learning", "deep learning", "agile", "scrum", "git", "vector databases",
    "pinecone", "chromadb", "weaviate", "qdrant"
}


def extract_candidate_name(text: str) -> str:
    """Attempt to detect the candidate's name from the top header lines."""
    lines = [line.strip() for line in text.split("\n") if line.strip()]
    if not lines:
        return "Candidate"
    
    # First few lines typically contain the candidate's name
    for line in lines[:5]:
        # Filter out common header words or lines containing emails/phones/URLs
        if any(marker in line.lower() for marker in ["resume", "curriculum", "email", "phone", "http", "@", "page"]):
            continue
        # Avoid long descriptive sentences
        words = line.split()
        if 1 <= len(words) <= 4 and all(w[0].isupper() for w in words if w):
            return line
            
    return lines[0][:30] if lines else "Candidate"


def extract_contact_info(text: str) -> ContactInfo:
    """Extract email, phone, and profile links using regex."""
    # Email Regex
    email_pattern = r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b"
    email_match = re.search(email_pattern, text)
    email = email_match.group(0) if email_match else None
    
    # Phone Regex (supports international, US, and dotted formats)
    phone_pattern = r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b"
    phone_match = re.search(phone_pattern, text)
    phone = phone_match.group(0) if phone_match else None
    
    # LinkedIn
    linkedin_pattern = r"(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+"
    linkedin_match = re.search(linkedin_pattern, text, re.IGNORECASE)
    linkedin = linkedin_match.group(0) if linkedin_match else None
    
    # GitHub
    github_pattern = r"(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+"
    github_match = re.search(github_pattern, text, re.IGNORECASE)
    github = github_match.group(0) if github_match else None
    
    # Portfolio / generic link
    portfolio = None
    url_pattern = r"https?:\/\/(?:www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?"
    all_urls = re.findall(url_pattern, text)
    for url in all_urls:
        if "linkedin" not in url.lower() and "github" not in url.lower():
            portfolio = url
            break
            
    return ContactInfo(
        email=email,
        phone=phone,
        linkedin=linkedin,
        github=github,
        portfolio=portfolio,
    )


def extract_skills(text: str) -> List[str]:
    """Scan resume text against skill taxonomy using word boundary matches."""
    text_lower = text.lower()
    found_skills = []
    
    for skill in COMMON_SKILLS_TAXONOMY:
        # Match standalone occurrences or hyphenated forms
        pattern = rf"\b{re.escape(skill)}\b"
        if re.search(pattern, text_lower):
            # Format nicely
            pretty_name = " ".join(word.capitalize() for word in skill.split())
            if skill in ["aws", "gcp", "sql", "api", "rest api", "ci/cd", "rag", "llm", "nlp", "html", "css"]:
                pretty_name = skill.upper()
            elif skill == "fastapi":
                pretty_name = "FastAPI"
            elif skill == "postgresql" or skill == "postgres":
                pretty_name = "PostgreSQL"
            elif skill == "mongodb":
                pretty_name = "MongoDB"
            elif skill == "graphql":
                pretty_name = "GraphQL"
            elif skill == "docker":
                pretty_name = "Docker"
            elif skill == "kubernetes":
                pretty_name = "Kubernetes"
            elif skill == "react" or skill == "react.js":
                pretty_name = "React"
            elif skill == "next.js":
                pretty_name = "Next.js"
            elif skill == "node.js":
                pretty_name = "Node.js"
            
            if pretty_name not in found_skills:
                found_skills.append(pretty_name)
                
    return sorted(found_skills)


def extract_experience_highlights(text: str) -> List[str]:
    """Extract metric-rich bullet points and accomplishments from resume."""
    highlights = []
    lines = text.split("\n")
    
    action_verbs = (
        "developed", "built", "architected", "engineered", "implemented", "designed",
        "reduced", "scaled", "led", "optimized", "spearheaded", "accelerated",
        "created", "automated", "improved", "deployed", "integrated", "managed"
    )
    
    for line in lines:
        line_clean = line.strip().lstrip("-*•> ").strip()
        if not line_clean:
            continue
        words = line_clean.lower().split()
        if words and words[0] in action_verbs and len(line_clean) > 30:
            highlights.append(line_clean)
            if len(highlights) >= 6:
                break
                
    return highlights


def extract_education(text: str) -> List[str]:
    """Identify education credentials and institutions."""
    edu_matches = []
    education_keywords = [
        "bachelor", "master", "ph.d", "b.tech", "m.tech", "b.s.", "m.s.",
        "degree", "university", "institute", "college", "polytechnic"
    ]
    
    lines = text.split("\n")
    for line in lines:
        line_clean = line.strip().lstrip("-*•> ").strip()
        if any(keyword in line_clean.lower() for keyword in education_keywords) and len(line_clean) < 120:
            edu_matches.append(line_clean)
            if len(edu_matches) >= 3:
                break
                
    return edu_matches


def parse_resume_content(text: str, page_count: int = 1, file_name: Optional[str] = None) -> ParsedResume:
    """Complete parsing pipeline to convert raw resume text into structured model."""
    name = extract_candidate_name(text)
    contact = extract_contact_info(text)
    skills = extract_skills(text)
    experience_highlights = extract_experience_highlights(text)
    education = extract_education(text)
    
    # Try to grab top summary paragraph
    summary = None
    paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
    for p in paragraphs[:3]:
        if len(p) > 80 and not any(kw in p.lower() for kw in ["education", "experience", "skills", "projects"]):
            summary = p
            break

    return ParsedResume(
        candidate_name=name,
        contact_info=contact,
        summary=summary,
        detected_skills=skills,
        detected_experience_highlights=experience_highlights,
        detected_education=education,
        raw_text=text,
        page_count=page_count,
        file_name=file_name,
    )
