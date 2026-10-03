import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  FileCheck2,
  Award
} from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import JobDescription from '../components/JobDescription';
import AnalysisResult from '../components/AnalysisResult';

export default function Home() {
  const [resumeData, setResumeData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState('gemini');

  const resultsRef = useRef(null);

  const handleResumeParsed = (parsed) => {
    setResumeData(parsed);
    if (parsed && parsed.raw_text) {
      setResumeText(parsed.raw_text);
    }
    setErrorMessage(null);
  };

  const handleRunAnalysis = async () => {
    setErrorMessage(null);

    const activeResumeText = resumeData?.raw_text || resumeText;

    if (!activeResumeText || activeResumeText.trim().length < 20) {
      setErrorMessage("Please upload your resume or paste at least 20 characters of resume content.");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setErrorMessage("Please provide a job description or select one of the demo presets.");
      return;
    }

    try {
      setIsAnalyzing(true);
      const res = await fetch("/api/analysis/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: activeResumeText,
          job_description: jobDescription,
          provider: selectedProvider,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || json.message || "Failed to analyze resume match.");
      }

      setAnalysisResult(json.data);

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred during analysis.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-5 pt-4 sm:pt-8">
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Next-Generation ATS Resume Auditor & Optimizer</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Land More Tech Interviews With <br className="hidden sm:inline" />
          <span className="accent-gradient-text">AI Resume Intelligence</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Audit your resume against any job description using Google Gemini and advanced LLM agents.
          Discover keyword gaps, score your profile across 4 dimensions, rewrite bullet points with Google's XYZ formula, and prep for interviews.
        </p>

        {/* Model Engine Selector (Polished Pill) */}
        <div className="pt-2 flex items-center justify-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/90 border border-white/10 shadow-lg text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> Model Engine:
            </span>
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              className="bg-slate-800 text-slate-200 border border-white/10 rounded-lg px-3 py-1 font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="gemini">Google Gemini 2.5 Flash (Recommended)</option>
              <option value="groq">Groq (Llama-3.3 70B Versatile)</option>
              <option value="openai">OpenAI (GPT-4o Mini)</option>
              <option value="mock">Offline Smart Heuristic Engine</option>
            </select>
          </div>
        </div>
      </section>

      {/* Error Alert */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 shadow-lg shadow-rose-950/20 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <div className="flex-1 font-medium">{errorMessage}</div>
        </div>
      )}

      {/* Main 2-Column Workstation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto items-stretch">
        <ResumeUpload
          resumeData={resumeData}
          onResumeParsed={handleResumeParsed}
          resumeText={resumeText}
          onTextChange={setResumeText}
          isLoading={isUploading}
          setIsLoading={setIsUploading}
        />

        <JobDescription
          jobDescription={jobDescription}
          onJobDescriptionChange={setJobDescription}
        />
      </div>

      {/* Action / Analyze Bar */}
      <div className="max-w-2xl mx-auto text-center pt-2 space-y-4">
        <button
          type="button"
          onClick={handleRunAnalysis}
          disabled={isAnalyzing || isUploading}
          className={`w-full py-4 px-8 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-2xl ${
            isAnalyzing || isUploading
              ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-white/5'
              : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white hover:from-blue-500 hover:to-cyan-400 shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-[1.015] active:scale-[0.99] border border-white/20'
          }`}
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Analyzing Match & Running ATS Algorithms...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Run ATS Match & AI Audit</span>
              <ArrowRight className="w-5 h-5 text-blue-200" />
            </>
          )}
        </button>

        {/* Feature Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-400 pt-1">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 4-Dimension ATS Score
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Keyword Gap Matrix
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Google XYZ Rewrites
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-400" /> Tailored Interview Prep
          </span>
        </div>
      </div>

      {/* Analysis Results Display */}
      <div ref={resultsRef} className="max-w-6xl mx-auto pt-6">
        {analysisResult && <AnalysisResult result={analysisResult} />}
      </div>
    </div>
  );
}
