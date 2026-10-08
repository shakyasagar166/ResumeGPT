import React from 'react';
import { Award, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export default function ScoreGauge({ score, label = "ATS Match Score" }) {
  const getScoreColor = (val) => {
    if (val >= 80) return 'var(--success)';
    if (val >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  const getScoreStatus = (val) => {
    if (val >= 80) return { text: 'High Match (Interview Ready)', icon: <CheckCircle size={16} color="var(--success)" /> };
    if (val >= 60) return { text: 'Moderate Match (Needs Optimization)', icon: <AlertTriangle size={16} color="var(--warning)" /> };
    return { text: 'Low Match (Significant Gaps)', icon: <XCircle size={16} color="var(--danger)" /> };
  };

  const color = getScoreColor(score);
  const status = getScoreStatus(score);

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="3.5"
          />
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke={color}
            strokeWidth="3.5"
            strokeDasharray={`${score}, 100`}
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
            {Math.round(score)}%
          </span>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Score
          </span>
        </div>
      </div>

      <div style={{ marginTop: '0.75rem', fontWeight: 700, fontSize: '0.95rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
        {status.icon}
        <span>{status.text}</span>
      </div>
    </div>
  );
}
