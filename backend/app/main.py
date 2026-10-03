import os
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from app.routes.resume import router as resume_router
from app.routes.analysis import router as analysis_router

load_dotenv()

app = FastAPI(
    title="ResumeGPT API",
    description="Intelligent ATS Resume Analysis & LLM-Powered Candidate Job Matching Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
cors_origins_env = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")
origins = [origin.strip() for origin in cors_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register route blueprints
app.include_router(resume_router)
app.include_router(analysis_router)


@app.get("/", tags=["General"])
async def root():
    """Root entrypoint with API status and quick links."""
    return {
        "project": "ResumeGPT",
        "description": "AI-Powered ATS Resume Matcher & Optimizer",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": {
            "resume_upload": "/api/resume/upload",
            "resume_sample": "/api/resume/sample",
            "analysis_match": "/api/analysis/match",
            "analysis_presets": "/api/analysis/presets",
            "health_check": "/health"
        }
    }


@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint for container monitoring and readiness probes."""
    provider = os.getenv("LLM_PROVIDER", "gemini")
    has_gemini = bool(os.getenv("GEMINI_API_KEY") and os.getenv("GEMINI_API_KEY") != "your_gemini_api_key_here")
    has_openai = bool(os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_API_KEY") != "your_openai_api_key_here")
    has_groq = bool(os.getenv("GROQ_API_KEY") and os.getenv("GROQ_API_KEY") != "your_groq_api_key_here")

    return {
        "status": "healthy",
        "configured_provider": provider,
        "keys_configured": {
            "gemini": has_gemini,
            "openai": has_openai,
            "groq": has_groq,
        },
        "mode": "live_llm" if (has_gemini or has_openai or has_groq) else "heuristic_fallback"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle unexpected server errors gracefully with structured JSON."""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "message": "An internal server error occurred.",
            "error": str(exc),
            "path": request.url.path
        }
    )


if __name__ == "__main__":
    import uvicorn
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
