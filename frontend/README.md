# 💻 ResumeGPT Frontend

The user interface for **ResumeGPT**, built with React 18, Vite, Lucide Icons, and modern glassmorphic styling.

---

## 🚀 Features

- **Drag-and-Drop Resume Upload**: Seamlessly parse PDF resumes and plain text documents.
- **1-Click Demo Previews**: Pre-loaded with sample resumes and industry job descriptions (Full Stack, AI/LLM Engineer, Frontend).
- **Interactive ATS Scorecard**: Circular SVG match gauge, skills alignment bars, and qualification verdict.
- **Keyword Gap Matrix**: Categorizes matching skills vs missing critical & nice-to-have requirements.
- **Google XYZ Bullet Point Rewrites**: Actionable before-and-after transformations with one-click copy buttons.
- **Targeted Interview Prep**: Custom behavioral and technical interview questions based on candidate vulnerabilities.
- **Export & Share**: Instant copy-to-clipboard report and JSON export.

---

## 📁 Component Structure

```text
src/
├── components/
│   ├── ResumeUpload.jsx       # Drag & drop upload, PDF extractor trigger, text mode
│   ├── JobDescription.jsx     # Job input textarea with 1-click preset selector
│   └── AnalysisResult.jsx     # Score gauge, skill gap matrix, bullet rewrites, interview questions
│
├── pages/
│   └── Home.jsx               # Main workbench layout and coordination
│
├── App.jsx                    # Header, navigation, backend health monitor, footer
├── main.jsx                   # React root entry
└── index.css                  # Modern dark-theme glassmorphism styling
```

---

## 🛠️ Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Vite Dev Server
```bash
npm run dev
```

The frontend will run at `http://localhost:5173`.
All `/api/*` and `/health` requests are automatically proxied to the backend at `http://127.0.0.1:8000`.

### 3. Build for Production
```bash
npm run build
```
Generates optimized production bundle in `dist/`.
