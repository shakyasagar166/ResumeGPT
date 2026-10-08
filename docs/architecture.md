# ResumeGPT Architecture

## 1. High-Level Architecture

ResumeGPT operates as a modular, decoupled platform:

```
    ┌────────────────┐
    │  React Web UI  │ (Vite, Score Gauge, Bullet Improver, Tailoring Workspace)
    └───────┬────────┘
            │ REST / JSON (JWT Authenticated)
            ▼
    ┌────────────────┐
    │  FastAPI Core  │ (Auth, Document Ingestion, ATS Scoring Engine)
    └───────┬────────┘
            ├──► Parser Service (PyPDF layout & section extraction)
            ├──► ATS Scorer Service (TF-IDF keyword overlap + Semantic matching)
            ├──► Multi-Agent Pipeline
            │      ├── ATS Optimizer Agent (XYZ impact bullet formula)
            │      ├── Cover Letter Agent (Personalized targeted pitch)
            │      └── Interview Prep Agent (STAR situational Q&A generator)
            └──► Unified LLM Service (OpenAI / Gemini / Local Fallback)
```

## 2. Core Modules

### 2.1 Backend Services
- **`ParserService`**: Extracts candidate name, email, phone, LinkedIn, work history, education, skills, and projects from PDF and raw text.
- **`ATSScorer`**: Calculates match score (0-100), detects missing keywords, checks formatting compatibility, and computes readability scores.
- **`Agents`**:
  - `ATSOptimizerAgent`: Replaces weak passive phrases with strong action verbs and quantifiable results.
  - `CoverLetterAgent`: Synthesizes resume experience and job requirements into an executive cover letter.
  - `InterviewAgent`: Generates predicted interview questions with STAR methodology answers.
