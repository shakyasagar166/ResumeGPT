@echo off
echo ========================================================
echo Starting ResumeGPT Backend (FastAPI + Uvicorn)
echo ========================================================
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
