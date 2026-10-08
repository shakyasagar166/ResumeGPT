import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Download, Trash2, Crosshair, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { resumesAPI } from '../services/api';
import ResumeUpload from '../components/ResumeUpload';
import ScoreGauge from '../components/ScoreGauge';
import BulletImprover from '../components/BulletImprover';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploader, setShowUploader] = useState(false);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      const res = await resumesAPI.list();
      setResumes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume?')) return;
    try {
      await resumesAPI.delete(id);
      setResumes(resumes.filter((r) => r.id !== id));
    } catch (err) {
      alert('Delete failed.');
    }
  };

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Career Command Center</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            ATS scoring, job description tailoring, and AI bullet point enhancement
          </p>
        </div>
        <button onClick={() => setShowUploader(!showUploader)} className="btn btn-primary">
          <Plus size={16} />
          {showUploader ? 'Close Uploader' : 'Upload New Resume'}
        </button>
      </div>

      {showUploader && (
        <ResumeUpload
          onUploadSuccess={(newRes) => {
            setResumes([newRes, ...resumes]);
            setShowUploader(false);
          }}
        />
      )}

      {/* Bullet Point Improver Section */}
      <BulletImprover />

      {/* Resumes Grid */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>My Resumes ({resumes.length})</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
            <p style={{ color: 'var(--text-muted)' }}>Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <FileText size={40} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)' }}>No Resumes Uploaded Yet</h3>
            <p style={{ fontSize: '0.85rem', marginTop: '0.25rem' }}>Upload your PDF resume to compute your baseline ATS compatibility score.</p>
            <button onClick={() => setShowUploader(true)} className="btn btn-primary" style={{ marginTop: '1rem' }}>
              Upload Resume
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {resumes.map((res) => (
              <div key={res.id} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{res.title}</h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{res.filename}</span>
                  </div>
                  <span className={`badge ${res.ats_score >= 70 ? 'badge-green' : res.ats_score >= 50 ? 'badge-yellow' : 'badge-red'}`}>
                    ATS {Math.round(res.ats_score)}%
                  </span>
                </div>

                {res.parsed_data?.skills && res.parsed_data.skills.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {res.parsed_data.skills.slice(0, 6).map((skill, idx) => (
                      <span key={idx} className="badge badge-blue" style={{ fontSize: '0.7rem' }}>
                        {skill}
                      </span>
                    ))}
                    {res.parsed_data.skills.length > 6 && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
                        +{res.parsed_data.skills.length - 6} more
                      </span>
                    )}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                  <Link to={`/tailor/${res.id}`} className="btn btn-primary" style={{ flex: 1, fontSize: '0.75rem', padding: '0.45rem' }}>
                    <Crosshair size={13} />
                    Tailor to Job
                  </Link>
                  <Link to={`/analysis/${res.id}`} className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.45rem' }}>
                    Inspect
                  </Link>
                  <a href={resumesAPI.downloadUrl(res.id)} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.45rem' }}>
                    <Download size={13} />
                  </a>
                  <button onClick={() => handleDelete(res.id)} className="btn btn-danger" style={{ padding: '0.45rem' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
