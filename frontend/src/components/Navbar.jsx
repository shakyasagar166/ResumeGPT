import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Award, Sparkles, LogOut } from 'lucide-react';

export default function Navbar({ user, onLogout }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: '#fff', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '4rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontWeight: 800, fontSize: '1.25rem' }}>
          <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.45rem', borderRadius: '0.5rem', display: 'flex' }}>
            <FileText size={20} />
          </div>
          <span>Resume<span style={{ color: 'var(--primary)' }}>GPT</span></span>
        </Link>

        {user ? (
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link to="/dashboard" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              My Resumes
            </Link>
            <Link to="/bullet-improver" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={15} color="var(--primary)" />
              Bullet Improver
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.username}</span>
              <button onClick={onLogout} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                <LogOut size={13} />
                Logout
              </button>
            </div>
          </nav>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/login" className="btn btn-secondary">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </div>
        )}
      </div>
    </header>
  );
}
