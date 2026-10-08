from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    model_config = ConfigDict(extra="allow", env_file=".env", case_sensitive=True)

    APP_ENV: str = "development"
    PROJECT_NAME: str = "ResumeGPT"
    API_V1_STR: str = "/api"

    SECRET_KEY: str = "resumegpt_super_secret_jwt_key_default_value_2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    DATABASE_URL: str = "sqlite:///./data/resumegpt.db"

    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR / "data"
    RESUMES_DIR: Path = STORAGE_DIR / "resumes"

    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"

    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    def setup_directories(self) -> None:
        self.STORAGE_DIR.mkdir(parents=True, exist_ok=True)
        self.RESUMES_DIR.mkdir(parents=True, exist_ok=True)

settings = Settings()
settings.setup_directories()
