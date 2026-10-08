from app.services.parser_service import ParserService
from app.services.ats_scorer import ATSScorer

RESUME_TEXT = """
Jane Doe
jane.doe@techcorp.com | (555) 987-6543 | linkedin.com/in/janedoe | github.com/janedoe

Summary
Senior Software Engineer specialized in Python, AWS cloud infrastructure, and microservices architecture.

Experience
Software Engineer at CloudScale
- Accelerated API latency by 35% through Redis caching and PostgreSQL query optimization.
- Led migration of monolith services to AWS ECS containers, cutting infrastructure costs by $24,000.

Skills
Python, AWS, PostgreSQL, Docker, Redis, REST API, Kubernetes

Education
B.S. in Software Engineering, University of Washington
"""

JOB_DESCRIPTION = """
We are seeking a Senior Backend Engineer proficient in Python, AWS, and Docker.
The ideal candidate has hands-on experience with PostgreSQL, caching strategies with Redis,
and building high-throughput microservices. Kubernetes and GraphQL are a plus.
"""

def test_ats_scoring():
    parser = ParserService()
    scorer = ATSScorer()

    parsed = parser.parse_resume_text(RESUME_TEXT)
    analysis = scorer.analyze_job_fit(
        resume_text=RESUME_TEXT,
        parsed_data=parsed,
        job_description=JOB_DESCRIPTION
    )

    assert analysis["match_score"] > 50.0
    assert analysis["keyword_match_percentage"] > 40.0
    assert "python" in [k.lower() for k in analysis["matching_keywords"]]
    assert len(analysis["matching_keywords"]) >= 3
