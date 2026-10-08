from app.services.parser_service import ParserService

SAMPLE_RESUME = """
Alex Mercer
alex.mercer@gmail.com | (555) 234-5678 | linkedin.com/in/alexmercer | github.com/alexmercer

Summary
Senior Software Engineer with 6+ years designing scalable cloud backends and distributed systems.

Experience
Lead Backend Engineer at FinTech Inc.
- Architected event-driven microservices processing 12M transactions daily using Python, FastAPI, and Docker.
- Reduced database read latency by 45% through Redis caching and PostgreSQL query optimization.

Skills
Python, FastAPI, Docker, Kubernetes, AWS, PostgreSQL, Redis, React, Git, CI/CD

Education
B.S. in Computer Science, University of California (2018)
"""

def test_resume_parser():
    parser = ParserService()
    parsed = parser.parse_resume_text(SAMPLE_RESUME)

    assert parsed["contact"]["email"] == "alex.mercer@gmail.com"
    assert "linkedin.com/in/alexmercer" in parsed["contact"]["linkedin"]
    assert "Python" in parsed["skills"]
    assert "Fastapi" in parsed["skills"]
    assert parsed["word_count"] > 40
    assert "experience" in parsed["sections"]
