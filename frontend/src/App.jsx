import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { Sparkles, Terminal, Github, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiInfo, setApiInfo] = useState(null);

  useEffect(() => {
    fetch('/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'healthy') {
          setApiStatus('connected');
          setApiInfo(data);
        } else {
          setApiStatus('offline');
        }
      })
      .catch(() => {
        setApiStatus('offline');
      });
  }, []);

  return (
    <div className="min-h-screen bg-mesh-glow flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#030712]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-white/15 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-xl tracking-tight text-white">
                Resume<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">GPT</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                PRO AI
              </span>
            </div>
          </div>

          {/* Navigation Links & Status */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* System Status Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 text-xs shadow-inner">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  apiStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  apiStatus === 'connected' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}></span>
              </span>
              <span className="text-slate-300 font-medium hidden sm:inline">
                {apiStatus === 'connected'
                  ? (apiInfo?.mode === 'live_llm' ? 'Gemini 2.5 Flash Online' : 'Smart Heuristic Engine')
                  : 'Backend Connecting...'}
              </span>
              <span className="text-slate-300 font-medium sm:hidden">
                {apiStatus === 'connected' ? 'Online' : 'Checking'}
              </span>
            </div>

            {/* Swagger API Docs */}
            <a
              href="http://localhost:8000/docs"
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-white/10 transition-all"
            >
              <Terminal className="w-3.5 h-3.5 text-blue-400" />
              <span>API Docs</span>
            </a>

            {/* GitHub */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all border border-transparent hover:border-white/10"
              title="GitHub Repo"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
      </header>

      {/* Main App Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Home />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#030712]/90 backdrop-blur-md py-6 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ResumeGPT • Enterprise ATS Audit & Career Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Powered by FastAPI & Google Gemini</span>
            <span>•</span>
            <span>Google XYZ Bullet Optimizer</span>
            <span>•</span>
            <span>MIT Open Source</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
