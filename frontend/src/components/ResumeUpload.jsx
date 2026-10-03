import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Sparkles, 
  User, 
  Mail, 
  Phone,
  FileCode,
  ArrowRight
} from 'lucide-react';

export default function ResumeUpload({
  resumeData,
  onResumeParsed,
  onTextChange,
  resumeText,
  isLoading,
  setIsLoading
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      await processFileUpload(files[0]);
    }
  };

  const processFileUpload = async (file) => {
    setUploadError(null);
    if (!file.name.match(/\.(pdf|txt)$/i)) {
      setUploadError("Please upload a PDF (.pdf) or text (.txt) file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size exceeds 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsLoading(true);
      const res = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || json.message || "Failed to parse resume document.");
      }

      onResumeParsed(json.data);
    } catch (err) {
      setUploadError(err.message || "Upload error. Verify backend is running on port 8000.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleResume = async () => {
    setUploadError(null);
    try {
      setIsLoading(true);
      const res = await fetch("/api/resume/sample");
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.detail || "Could not load sample resume.");
      }
      onResumeParsed(json.data);
    } catch (err) {
      setUploadError(err.message || "Failed to load sample resume.");
    } finally {
      setIsLoading(false);
    }
  };

  const clearResume = () => {
    onResumeParsed(null);
    onTextChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 min-h-[460px]">
      {/* Card Header & Tab Switcher */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm shadow-blue-500/10">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">1. Candidate Resume</h2>
              <p className="text-xs text-slate-400">Upload PDF or paste raw text</p>
            </div>
          </div>

          {/* Segmented Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'text'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Paste Text
            </button>
          </div>
        </div>

        {uploadError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span className="flex-1">{uploadError}</span>
          </div>
        )}

        {/* Tab 1: Upload File Mode */}
        {activeTab === 'upload' && (
          <div>
            {!resumeData ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative group border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[290px] ${
                  isDragging
                    ? 'border-blue-400 bg-blue-500/15 scale-[1.01] shadow-lg shadow-blue-500/20'
                    : 'border-slate-700/80 hover:border-blue-500/60 bg-slate-900/40 hover:bg-slate-900/70'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:border-blue-400 transition-all duration-300">
                    <UploadCloud className="w-7 h-7" />
                  </div>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">
                  Drag & drop your resume PDF here, or <span className="text-blue-400 underline underline-offset-4 font-bold">browse</span>
                </h3>
                <p className="text-xs text-slate-400 mb-5">
                  Accepts PDF or TXT up to 10MB
                </p>

                {/* 1-Click Sample Resume Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    loadSampleResume();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-white/10 hover:border-blue-500/40 shadow-sm transition-all hover:scale-105"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                  <span>Try with Sample Resume (Alex Rivera • Full Stack)</span>
                </button>
              </div>
            ) : (
              /* Success / Parsed Resume Card */
              <div className="rounded-2xl p-5 border border-blue-500/40 bg-gradient-to-br from-blue-950/30 to-indigo-950/20 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/50 flex items-center justify-center text-blue-300 font-extrabold text-lg shadow-inner">
                      {resumeData.candidate_name ? resumeData.candidate_name[0] : 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">
                          {resumeData.candidate_name || "Parsed Candidate"}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {resumeData.file_name || "resume.pdf"} • {resumeData.page_count || 1} Page(s) • {resumeData.raw_text?.length || 0} Characters
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={clearResume}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Remove and upload different resume"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Contact Badges */}
                {resumeData.contact_info?.email && (
                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/5 text-slate-300">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      {resumeData.contact_info.email}
                    </span>
                    {resumeData.contact_info?.phone && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/5 text-slate-300">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {resumeData.contact_info.phone}
                      </span>
                    )}
                  </div>
                )}

                {/* Extracted Skills Preview */}
                {resumeData.detected_skills && resumeData.detected_skills.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Detected Skills ({resumeData.detected_skills.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                      {resumeData.detected_skills.slice(0, 16).map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-md bg-slate-800/90 text-[11px] font-medium text-slate-200 border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                      {resumeData.detected_skills.length > 16 && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-800/50 text-[11px] font-medium text-slate-400">
                          +{resumeData.detected_skills.length - 16} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Raw Text Mode */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <textarea
              value={resumeText}
              onChange={(e) => onTextChange(e.target.value)}
              rows={11}
              placeholder="Paste raw resume text here (Summary, Work Experience, Education, Skills)..."
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 resize-none font-mono leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{resumeText ? resumeText.trim().split(/\s+/).filter(Boolean).length : 0} words</span>
              <button
                type="button"
                onClick={loadSampleResume}
                className="text-blue-400 hover:text-blue-300 font-medium underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-400" /> Auto-fill with sample resume
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Card Footer Status */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
        <span>PyPDF Parsing Engine</span>
        <span>ATS Schema v1.0</span>
      </div>
    </div>
  );
}
