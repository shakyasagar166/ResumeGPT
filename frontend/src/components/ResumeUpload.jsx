import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { resumesAPI } from '../services/api';

export default function ResumeUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF format resume.');
      return;
    }
    setError('');
    setSuccess('');
    setIsUploading(true);

    try {
      const res = await resumesAPI.upload(file);
      setSuccess(`Resume "${file.name}" parsed and scored successfully!`);
      if (onUploadSuccess) onUploadSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to parse resume.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: 'none' }}
        onChange={(e) => e.target.files && handleFile(e.target.files[0])}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed var(--border)',
          borderRadius: '0.75rem',
          padding: '2.5rem 1.5rem',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          background: '#f8fafc',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.75rem',
        }}
      >
        <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.85rem', borderRadius: '9999px' }}>
          {isUploading ? <Loader2 size={28} className="animate-spin" /> : <UploadCloud size={28} />}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>
            {isUploading ? 'Extracting sections & calculating ATS score...' : 'Upload PDF Resume for Analysis'}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Supports standard PDF resumes up to 20MB
          </p>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '0.75rem', color: 'var(--danger)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div style={{ marginTop: '0.75rem', color: 'var(--success)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
          <CheckCircle size={15} />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
}
