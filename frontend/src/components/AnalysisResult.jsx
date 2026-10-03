import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Copy,
  Check,
  Download,
  HelpCircle,
  TrendingUp,
  FileCheck2,
  Briefcase,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function AnalysisResult({ result }) {
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'bullets' | 'interview' | 'summary'
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedReport, setCopiedReport] = useState(false);

  if (!result) return null;

  const {
    candidate_name,
    target_role,
    scores,
    matching_skills = [],
    missing_critical_skills = [],
    missing_nice_to_have_skills = [],
    key_strengths = [],
    critical_gaps = [],
    bullet_point_improvements = [],
    custom_interview_questions = [],
    executive_summary,
    analyzed_at,
  } = result;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
    if (score >= 65) return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
  };

  const getScoreStroke = (score) => {
    if (score >= 80) return '#34d399';
    if (score >= 65) return '#fbbf24';
    return '#f87171';
  };

  const handleCopyBullet = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyFullReport = () => {
    const reportText = `RESUMEGPT ATS ANALYSIS REPORT
Candidate: ${candidate_name}
Target Role: ${target_role}
Overall ATS Match Score: ${scores?.overall_score || 0}/100 (${scores?.summary_verdict})

SCORES BREAKDOWN:
- Skills Match: ${scores?.skills_match_score || 0}/100
- Experience Match: ${scores?.experience_match_score || 0}/100
- Formatting & ATS: ${scores?.formatting_ats_score || 0}/100

MATCHING SKILLS:
${matching_skills.join(', ')}

MISSING CRITICAL SKILLS:
${missing_critical_skills.join(', ')}

EXECUTIVE SUMMARY:
${executive_summary}
`;
    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ResumeGPT_Analysis_${candidate_name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-8 animate-in fade-in-50 duration-500">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
              Analysis Completed
            </span>
            <span className="text-xs text-slate-500">
              {new Date(analyzed_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            {candidate_name} <span className="text-slate-400 font-normal">for</span> {target_role}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyFullReport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-white/10 transition-all"
          >
            {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedReport ? 'Copied Report' : 'Copy Report'}
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-xs text-blue-300 border border-blue-500/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Primary Score Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Main Gauge */}
        <div className="glass-card md:col-span-1 rounded-2xl p-6 flex flex-col items-center justify-center text-center border border-white/10 relative overflow-hidden">
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke={getScoreStroke(scores?.overall_score || 0)}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * (scores?.overall_score || 0)) / 100}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {scores?.overall_score || 0}%
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400">Match</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(scores?.overall_score || 0)}`}>
            {scores?.summary_verdict || 'Match Evaluated'}
          </span>
        </div>

        {/* Sub-scores */}
        <div className="glass-card md:col-span-3 rounded-2xl p-6 flex flex-col justify-center gap-4 border border-white/10">
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> Skills Alignment
              </span>
              <span className="text-white font-mono">{scores?.skills_match_score || 0}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores?.skills_match_score || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Experience Relevance & Depth
              </span>
              <span className="text-white font-mono">{scores?.experience_match_score || 0}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores?.experience_match_score || 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> ATS Readability & Presentation
              </span>
              <span className="text-white font-mono">{scores?.formatting_ats_score || 0}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${scores?.formatting_ats_score || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'skills'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Layers className="w-4 h-4" /> Skills & Keyword Gap
        </button>
        <button
          onClick={() => setActiveTab('bullets')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'bullets'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" /> Bullet Improvements ({bullet_point_improvements.length})
        </button>
        <button
          onClick={() => setActiveTab('interview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'interview'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-cyan-400" /> Interview Prep ({custom_interview_questions.length})
        </button>
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'summary'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4 text-purple-400" /> Executive Summary
        </button>
      </div>

      {/* Tab 1: Skills & Keyword Gap */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Matched Skills */}
            <div className="glass-card rounded-xl p-5 border border-emerald-500/20 bg-emerald-950/10">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Matching Skills ({matching_skills.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matching_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 text-xs border border-emerald-500/30 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Critical Skills */}
            <div className="glass-card rounded-xl p-5 border border-rose-500/20 bg-rose-950/10">
              <div className="flex items-center gap-2 mb-3">
                <XCircle className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white">
                  Missing Critical Skills ({missing_critical_skills.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">High impact on ATS pass rate. Add if experienced.</p>
              <div className="flex flex-wrap gap-1.5">
                {missing_critical_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 text-xs border border-rose-500/30 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Nice to Have */}
            <div className="glass-card rounded-xl p-5 border border-amber-500/20 bg-amber-950/10">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Nice-to-Have Skills ({missing_nice_to_have_skills.length})
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mb-2">Secondary qualifications that set you apart.</p>
              <div className="flex flex-wrap gap-1.5">
                {missing_nice_to_have_skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs border border-amber-500/30 font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Strengths & Critical Gaps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="glass-card rounded-xl p-5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" /> Top Strengths for this Role
              </h3>
              <ul className="space-y-2">
                {key_strengths.map((str, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card rounded-xl p-5 border border-white/10">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Areas for Improvement
              </h3>
              <ul className="space-y-2">
                {critical_gaps.map((gap, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <ChevronRight className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bullet Rewrites */}
      {activeTab === 'bullets' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Google's XYZ Formula Applied:</span> "Accomplished [X] as measured by [Y], by doing [Z]".
              Copy these bullet points directly into your resume's experience section.
            </div>
          </div>

          <div className="space-y-4">
            {bullet_point_improvements.map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 border border-white/10 space-y-3">
                {/* Original */}
                <div className="p-3 rounded-lg bg-rose-500/5 border border-rose-500/15">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    Original Bullet (Weak / Passive):
                  </span>
                  <p className="text-xs text-slate-300 line-through decoration-rose-500/60 font-sans">
                    "{item.original}"
                  </p>
                </div>

                {/* Improved */}
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" /> High-Impact ATS Version:
                    </span>
                    <button
                      onClick={() => handleCopyBullet(item.improved, idx)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs transition-all"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Bullet
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-white font-medium font-sans leading-relaxed">
                    "{item.improved}"
                  </p>
                </div>

                {/* Why it works */}
                <p className="text-[11px] text-slate-400 italic">
                  <span className="font-semibold text-slate-300">Why this ranks higher:</span> {item.improvement_reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tailored Interview Questions */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Based on the qualifications in the job description and potential gaps detected in your background, prepare for these key questions:
          </p>

          <div className="space-y-4">
            {custom_interview_questions.map((q, idx) => (
              <div key={idx} className="glass-card rounded-xl p-5 border border-white/10 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    {q.question}
                  </h4>
                </div>

                <div className="pl-8 space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-white/5 text-slate-400">
                    <span className="text-slate-300 font-semibold">Why they ask this:</span> {q.context}
                  </div>
                  <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-200">
                    <span className="text-blue-300 font-semibold">Recommended Framework / Answer:</span> {q.suggested_approach}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Executive Summary */}
      {activeTab === 'summary' && (
        <div className="glass-card rounded-xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="text-base font-bold text-white">Recruiter's Executive Fit Assessment</h3>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {executive_summary}
          </p>
        </div>
      )}
    </div>
  );
}
