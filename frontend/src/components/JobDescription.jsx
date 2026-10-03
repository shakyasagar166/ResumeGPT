import React, { useState, useEffect } from 'react';
import { Briefcase, Sparkles, X, CheckCircle, HelpCircle, Layers } from 'lucide-react';

export default function JobDescription({ jobDescription, onJobDescriptionChange }) {
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState(null);

  useEffect(() => {
    fetch('/api/analysis/presets')
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setPresets(data.data);
        }
      })
      .catch(() => {
        setPresets([
          {
            id: 'full-stack',
            title: 'Senior Full Stack Engineer (Python & React)',
            text: 'Job Title: Senior Full Stack Engineer\nProficiency in Python, FastAPI, React, PostgreSQL, Docker, AWS...'
          }
        ]);
      });
  }, []);

  const handleSelectPreset = (preset) => {
    setActivePreset(preset.id);
    onJobDescriptionChange(preset.text);
  };

  const wordCount = jobDescription ? jobDescription.trim().split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="glass-panel-elevated rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 min-h-[460px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-sm shadow-cyan-500/10">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">2. Target Job Description</h2>
              <p className="text-xs text-slate-400">Paste job requirements or load a preset</p>
            </div>
          </div>

          {jobDescription && (
            <button
              type="button"
              onClick={() => {
                onJobDescriptionChange('');
                setActivePreset(null);
              }}
              className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          )}
        </div>

        {/* Demo Preset Selector */}
        {presets.length > 0 && (
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Select 1-Click Demo Preset:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {presets.map((preset) => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 shadow-sm shadow-cyan-500/30 ring-1 ring-cyan-500/40'
                        : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:bg-slate-800'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{preset.title.split('(')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Text Area */}
        <div className="relative">
          <textarea
            value={jobDescription}
            onChange={(e) => {
              onJobDescriptionChange(e.target.value);
              setActivePreset(null);
            }}
            rows={10}
            placeholder="Paste complete Job Description here...
- Responsibilities (e.g. Architect microservices, lead React development)
- Required Tech Stack (Python, FastAPI, Docker, AWS, React, etc.)
- Experience level and preferred qualifications"
            className="w-full bg-slate-900/60 border border-slate-700/80 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 resize-none font-sans leading-relaxed"
          />
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between text-xs">
        <span className={`font-mono ${
          wordCount > 30 ? 'text-emerald-400' : wordCount > 0 ? 'text-amber-400' : 'text-slate-500'
        }`}>
          {wordCount} words {wordCount > 30 ? '✓ Ready for match' : wordCount > 0 ? '(Add more detail)' : ''}
        </span>
        <span className="text-slate-500">
          Target Role & Requirement Alignment
        </span>
      </div>
    </div>
  );
}
