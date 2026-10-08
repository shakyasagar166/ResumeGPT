import React, { useState } from 'react';
import { Sparkles, Copy, Check, ArrowRight, Loader2 } from 'lucide-react';
import { agentsAPI } from '../services/api';

export default function BulletImprover() {
  const [bullet, setBullet] = useState('');
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    if (!bullet.trim()) return;
    setLoading(true);
    try {
      const res = await agentsAPI.optimizeBullet({ bullet_point: bullet, target_role: role });
      setResult(res.data);
    } catch (err) {
      alert('Failed to optimize bullet point.');
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem', borderRadius: '0.4rem', display: 'flex' }}>
          <Sparkles size={18} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>AI Bullet Point Optimizer</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transform passive duties into high-impact XYZ accomplishment metrics</p>
        </div>
      </div>

      <form onSubmit={handleOptimize} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Target Role (e.g. Senior Backend Engineer)"
            style={{ width: '220px', padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem' }}
          />
          <input
            type="text"
            required
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            placeholder="Paste raw resume bullet (e.g., worked on database optimization and fixed queries)"
            style={{ flex: 1, padding: '0.5rem 0.75rem', border: '1px solid var(--border)', borderRadius: '0.5rem', fontSize: '0.85rem' }}
          />
          <button type="submit" disabled={loading || !bullet.trim()} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
            Enhance Bullet
          </button>
        </div>
      </form>

      {result && (
        <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {result.critique && (
            <div style={{ fontSize: '0.825rem', color: '#b45309', background: '#fef3c7', padding: '0.5rem 0.75rem', borderRadius: '0.35rem' }}>
              <strong>Recruiter Feedback:</strong> {result.critique}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {result.improved_versions.map((ver, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid var(--border)',
                  borderRadius: '0.5rem',
                  padding: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div>
                  <span className="badge badge-blue" style={{ fontSize: '0.65rem', marginBottom: '0.25rem' }}>
                    {ver.type}
                  </span>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', marginTop: '0.2rem' }}>{ver.text}</p>
                </div>
                <button
                  onClick={() => copyText(ver.text, idx)}
                  className="btn btn-secondary"
                  style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', flexShrink: 0 }}
                >
                  {copiedIdx === idx ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
