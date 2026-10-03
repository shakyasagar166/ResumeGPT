from fastapi import APIRouter, HTTPException, status
from typing import Dict, Any

from app.models.schemas import (
    APIResponse,
    AnalysisRequest,
    AnalysisResponse,
    QuickScanRequest,
)
from app.services.llm_service import LLMService
from app.services.prompt_service import PromptService

router = APIRouter(prefix="/api/analysis", tags=["Analysis & Matching"])

prompt_service = PromptService()
llm_service = LLMService(prompt_service=prompt_service)

# Pre-configured Job Descriptions for fast one-click demos
SAMPLE_JOB_DESCRIPTIONS = [
    {
        "id": "full-stack",
        "title": "Senior Full Stack Engineer (Python & React)",
        "company": "ScaleAI Innovations",
        "text": """Job Title: Senior Full Stack Engineer
Location: Remote / San Francisco, CA

About the Role:
We are looking for a Senior Full Stack Engineer to lead the development of our customer-facing data platforms.
You will architect high-scale microservices, design modern React user interfaces, and collaborate with cross-functional teams.

Responsibilities:
- Build and maintain high-performance RESTful APIs using Python, FastAPI, and PostgreSQL.
- Develop interactive, responsive single-page applications using React, TypeScript, and Tailwind CSS.
- Orchestrate containerized workloads using Docker and Kubernetes on AWS (ECS, EKS, RDS).
- Implement automated testing with PyTest and maintain CI/CD pipelines via GitHub Actions.
- Optimize database performance, query caching with Redis, and ensure 99.9% uptime.

Required Qualifications:
- 4+ years of professional software engineering experience.
- Strong proficiency in Python and modern JavaScript/TypeScript.
- Hands-on experience with FastAPI, Django, or Flask.
- Deep expertise in React, modern state management, and modern CSS frameworks.
- Production experience with Docker, Kubernetes, and AWS cloud infrastructure.
- Solid understanding of relational databases (PostgreSQL) and caching (Redis).

Bonus Skills:
- Experience with GraphQL, vector databases, or Large Language Models (LLMs).
- Familiarity with Terraform or Infrastructure as Code (IaC)."""
    },
    {
        "id": "ai-engineer",
        "title": "AI / LLM Application Engineer",
        "company": "Cognitive Frontiers",
        "text": """Job Title: AI / LLM Application Engineer
Location: Remote

About the Role:
Join our Applied AI team to develop cutting-edge generative AI agents and RAG pipelines for enterprise clients.

Key Requirements:
- 3+ years experience in Python backend engineering and AI application development.
- Deep knowledge of LangChain, LlamaIndex, OpenAI API, and Google Gemini API.
- Hands-on experience building Retrieval-Augmented Generation (RAG) with vector databases (Pinecone, ChromaDB, Weaviate).
- Proficiency with FastAPI, Docker, and asynchronous Python programming.
- Understanding of prompt engineering, fine-tuning, and LLM evaluation frameworks.

Nice-to-have:
- Experience with PyTorch or HuggingFace transformers.
- Kubernetes deployment and streaming response handling (WebSockets/SSE)."""
    },
    {
        "id": "frontend-dev",
        "title": "Senior Frontend Developer (React & TypeScript)",
        "company": "Vivid Labs",
        "text": """Job Title: Senior Frontend Developer
Location: Hybrid / New York

We are seeking a seasoned frontend developer who loves crafting performant, pixel-perfect user experiences.

Responsibilities:
- Develop modern web applications using React, Next.js, and TypeScript.
- Build clean, accessible, responsive UI components with Tailwind CSS.
- Integrate with REST and GraphQL backend services.
- Optimize web vitals, bundle size, and browser rendering performance.

Requirements:
- 4+ years frontend web development experience.
- Mastery of JavaScript (ES6+), TypeScript, HTML5, and modern CSS.
- Proven experience with state management (Zustand, Redux, or TanStack Query).
- Understanding of Jest, React Testing Library, and Vite build tooling."""
    }
]


@router.post(
    "/match",
    response_model=APIResponse,
    summary="Perform comprehensive LLM ATS analysis",
    description="Compares resume against job description to deliver ATS score, keyword breakdown, bullet rewrites, and interview questions."
)
async def analyze_match(payload: AnalysisRequest):
    if len(payload.resume_text.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Resume text is too short. Please provide at least 20 characters."
        )

    if len(payload.job_description.strip()) < 20:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Job description is too short. Please provide at least 20 characters."
        )

    try:
        result: AnalysisResponse = llm_service.analyze_resume(
            resume_text=payload.resume_text,
            job_description=payload.job_description,
            provider_override=payload.provider
        )
        return APIResponse(
            success=True,
            message="Resume analysis generated successfully.",
            data=result.model_dump()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis pipeline error: {str(exc)}"
        )


@router.get(
    "/presets",
    response_model=APIResponse,
    summary="Get preset job descriptions",
    description="Returns pre-configured realistic job descriptions for instant UI testing."
)
async def get_presets():
    return APIResponse(
        success=True,
        message="Preset job descriptions loaded successfully.",
        data=SAMPLE_JOB_DESCRIPTIONS
    )


@router.post(
    "/quick-scan",
    response_model=APIResponse,
    summary="Quick ATS compatibility preview",
    description="Rapid scoring and keyword overlap computation without full LLM generation."
)
async def quick_scan(payload: QuickScanRequest):
    try:
        quick_result = llm_service._generate_mock_analysis(
            resume_text=payload.resume_text,
            job_description=payload.job_description
        )
        return APIResponse(
            success=True,
            message="Quick scan completed.",
            data={
                "scores": quick_result.scores.model_dump(),
                "matching_skills": quick_result.matching_skills,
                "missing_critical_skills": quick_result.missing_critical_skills,
            }
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quick scan error: {str(exc)}"
        )
