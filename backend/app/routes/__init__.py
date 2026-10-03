"""API Routes for ResumeGPT."""
from app.routes.resume import router as resume_router
from app.routes.analysis import router as analysis_router

__all__ = ["resume_router", "analysis_router"]
