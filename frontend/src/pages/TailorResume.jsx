import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Crosshair, Sparkles, CheckCircle2, AlertTriangle, FileText, MessageSquare, Loader2, Copy, Check } from 'lucide-react';
import { resumesAPI, atsAPI, agentsAPI } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';

export default function TailorResume() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [jobTitle, setJobTitle] = useState('Senior Backend Engineer');
  const [company, setCompany] = useState('Stripe');
  const [jd, setJd] = useState(
    'We are seeking a Senior Backend Engineer proficient in Python, FastAPI, and Docker. Experience with PostgreSQL, Redis caching, microservices, and AWS is required.'
  );

  const [loadingMatch, setLoadingMatch] = useState(false);
  const [jobMatch, setJobMatch] = useState(null);
  const [coverLetterLoading, setCoverLetterLoading] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await resumesAPI.get(id);
        setResume(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResume();
  }, [id]);

  const handleMatch = async (e) => {
    e.preventDefault();
    if (!jd.trim()) return;
    setLoadingMatch(true);
    try {
      const res = await atsAPI.match(id, {
        job_title: jobTitle,
        company: company,
        job_description: jd
      });
      setJobMatch(res.data);
    } catch (err) {
      alert('Failed to analyze job description.');
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!jobMatch) return;
    setCoverLetterLoading(true);
    try {
      const res = await agentsAPI.generateCoverLetter(jobMatch.id, { tone: 'confident' });
      setJobMatch(res.data);
    } catch (err) {
      alert('Failed to generate cover letter.');
    } finally {
      setCoverLetterLoading(false);
    }
  };

  const copyCoverLetter = () => {
    if (!jobMatch?.cover_letter) return;
    navigator.clipboard.writeText(jobMatch.cover_letter);
    setCopiedCoverLetter(true);
    setTimeout(() => setCopiedCoverLetter(false), 2000);
  };

  const analysis = jobMatch?.analysis_data;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Tailor Resume Against Job Description</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Evaluate ATS compatibility against a target job posting and generate matching applications
        </p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleMatch} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Target Job Title</label>
            <input
              type="text"
              required
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Target Company</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Paste Job Description (JD)</label>
          <textarea
            rows={5}
            required
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste complete job requirements, responsibilities, and qualifications..."
            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem', lineHeight: 1.5 }}
          />
        </div>

        <button type="submit" disabled={loadingMatch} className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
          {loadingMatch ? <Loader2 size={16} className="animate-spin" /> : <Crosshair size={16} />}
          Calculate ATS Match & Gap Analysis
        </button>
      </form>

      {/* Results View */}
      {analysis && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            <ScoreGauge score={analysis.match_score} label="Job Match Score" />

            <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>ATS Dimension Scores</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Keyword Match Ratio:</span>
                  <strong>{analysis.keyword_match_percentage}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Formatting & Layout:</span>
                  <strong>{analysis.formatting_score}%</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Metrics & Impact Density:</span>
                  <strong>{analysis.impact_score}%</strong>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '0.5rem' }}>
                <Link to={`/interview/${jobMatch.id}`} className="btn btn-secondary" style={{ flex: 1, fontSize: '0.75rem' }}>
                  <MessageSquare size={13} />
                  Prep Interview
                </Link>
                <button onClick={handleGenerateCoverLetter} disabled={coverLetterLoading} className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem' }}>
                  <Sparkles size={13} />
                  {coverLetterLoading ? 'Generating...' : 'Cover Letter'}
                </button>
              </div>
            </div>
          </div>

          {/* Keywords Match & Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle2 size={18} color="var(--success)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Matching Keywords ({analysis.matching_keywords?.length || 0})</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.matching_keywords?.map((kw, idx) => (
                  <span key={idx} className="badge badge-green" style={{ fontSize: '0.75rem' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertTriangle size={18} color="var(--danger)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Missing Keywords ({analysis.missing_keywords?.length || 0})</h3>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {analysis.missing_keywords?.map((kw, idx) => (
                  <span key={idx} className="badge badge-red" style={{ fontSize: '0.75rem' }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Critical Recommendations */}
          {analysis.critical_suggestions && analysis.critical_suggestions.length > 0 && (
            <div className="card" style={{ padding: '1.25rem', background: '#fffbeb', border: '1px solid #fef3c7' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#92400e', marginBottom: '0.5rem' }}>
                ATS Optimization Recommendations
              </h3>
              <ul style={{ paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#78350f', lineHeight: 1.6 }}>
                {analysis.critical_suggestions.map((sug, idx) => (
                  <li key={idx}>{sug}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Generated Cover Letter */}
          {jobMatch.cover_letter && (
            <div className="card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="var(--primary)" />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Tailored Cover Letter</h3>
                </div>
                <button onClick={copyCoverLetter} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}>
                  {copiedCoverLetter ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  Copy Cover Letter
                </button>
              </div>
              <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)', fontSize: '0.9rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {jobMatch.cover_letter}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
