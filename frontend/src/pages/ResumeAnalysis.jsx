import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Mail, Phone, Linkedin, Github, CheckCircle2, AlertCircle, Crosshair, Loader2 } from 'lucide-react';
import { resumesAPI } from '../services/api';
import ScoreGauge from '../components/ScoreGauge';

export default function ResumeAnalysis() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        setLoading(true);
        const res = await resumesAPI.get(id);
        setResume(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
        <p>Loading resume analysis...</p>
      </div>
    );
  }

  if (!resume) {
    return <div className="container" style={{ padding: '2rem' }}>Resume not found.</div>;
  }

  const contact = resume.parsed_data?.contact || {};
  const skills = resume.parsed_data?.skills || [];
  const sections = resume.parsed_data?.sections || {};

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{resume.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Parsed ATS structure and formatting metrics</p>
        </div>
        <Link to={`/tailor/${resume.id}`} className="btn btn-primary">
          <Crosshair size={16} />
          Tailor Against Job Description
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <ScoreGauge score={resume.ats_score} label="Baseline ATS Score" />

        {/* Contact info verification */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Contact Info Check</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={15} color={contact.email ? 'var(--success)' : 'var(--danger)'} />
              <span>{contact.email || 'Email not detected'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={15} color={contact.phone ? 'var(--success)' : 'var(--danger)'} />
              <span>{contact.phone || 'Phone not detected'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Linkedin size={15} color={contact.linkedin ? 'var(--success)' : 'var(--text-muted)'} />
              <span>{contact.linkedin || 'LinkedIn not detected'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Github size={15} color={contact.github ? 'var(--success)' : 'var(--text-muted)'} />
              <span>{contact.github || 'GitHub not detected'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Extracted Skills */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Parsed Skills ({skills.length})
        </h3>
        {skills.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No standard technical skills detected in the parsed resume.</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {skills.map((s, idx) => (
              <span key={idx} className="badge badge-blue" style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>
                {s}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Extracted Sections */}
      <div className="card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Detected Sections</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(sections).map(([secName, secContent], idx) => (
            <div key={idx} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)' }}>
              <h4 style={{ textTransform: 'capitalize', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: 'var(--primary)' }}>
                {secName}
              </h4>
              <p style={{ fontSize: '0.825rem', whiteSpace: 'pre-wrap', color: '#334155', maxHeight: '180px', overflowY: 'auto' }}>
                {secContent}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
