# ResumeGPT - AI-Powered Resume Analyzer, ATS Scorer & Career Agent

ResumeGPT is a full-stack, enterprise-grade AI career suite built with **FastAPI**, **React**, and an intelligent multi-agent pipeline designed to maximize interview callback rates.

---

## 🌟 Key Features

- **Automated Resume Parsing**: Extract contact info, work experiences, education, skills, and projects from PDF/DOCX resumes.
- **Advanced ATS Compatibility Scorer**:
  - Semantic and exact-match keyword overlap calculation.
  - Formatting check (contact detection, section headers, readability index).
  - Skill gap analysis highlighting missing essential & secondary qualifications.
- **Specialized AI Career Agents**:
  - **ATS Optimizer Agent**: Rewrites resume bullet points using the XYZ impact formula (*"Accomplished [X], as measured by [Y], by doing [Z]"*).
  - **Cover Letter Agent**: Crafts targeted, compelling cover letters tailored to specific job postings.
  - **Interview Prep Agent**: Generates behavioral, technical, and situational interview questions with ideal star-method answer blueprints.
- **Interactive Web Interface**:
  - Real-time ATS match percentage gauge.
  - Side-by-side job description comparison.
  - Interactive bullet point enhancer and one-click copy.
- **Production Architecture**:
  - Async FastAPI backend with JWT authentication.
  - SQLite/PostgreSQL database via SQLAlchemy 2.0.
  - Modern React 18 + Vite frontend with Tailwind/Modern CSS.
  - Docker & Docker Compose container orchestration.

---

## 🏗️ Architecture

```
ResumeGPT/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/routes/       # /auth, /resumes, /ats, /agents
│   │   ├── agents/           # ATS Optimizer, Cover Letter, Interview Prep
│   │   ├── services/         # Resume Parser, ATS Scorer, Business Logic
│   │   ├── models/ & schemas/# SQLAlchemy ORM & Pydantic v2 schemas
│   │   ├── llm/              # Unified LLM Service (OpenAI/Gemini/Local)
│   │   └── core/             # Configuration & Security (JWT, Bcrypt)
├── frontend/                 # React + Vite Frontend
│   ├── src/
│   │   ├── components/       # ScoreGauge, BulletImprover, ResumeUpload, Navbar
│   │   ├── pages/            # Dashboard, Analysis, Tailor, InterviewPrep, Auth
│   │   └── services/         # Axios API Client
├── tests/                    # Pytest test suite
└── docs/                     # Architecture & ATS Scoring Specifications
```

---

## 🚀 Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

uvicorn app.main:app --reload --port 8000
```
- Swagger API Docs: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

### 3. Docker Compose
```bash
docker-compose up --build
```

---

## 📄 License
MIT License - see [LICENSE](LICENSE) for details.
