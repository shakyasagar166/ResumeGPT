import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MessageSquare, Sparkles, ChevronDown, ChevronUp, Loader2, ArrowLeft } from 'lucide-react';
import { agentsAPI, atsAPI } from '../services/api';

export default function InterviewPrep() {
  const { jobMatchId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState(0);

  useEffect(() => {
    const generatePrep = async () => {
      setLoading(true);
      try {
        const res = await agentsAPI.prepareInterview(jobMatchId);
        setQuestions(res.data.interview_qa || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    generatePrep();
  }, [jobMatchId]);

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Interview Preparation Coach</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Role-targeted behavioral & technical questions modeled with STAR answer frameworks
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <Loader2 size={32} className="animate-spin" color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Interview Agent synthesizing questions & STAR blueprints...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No questions generated yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {questions.map((q, idx) => {
            const isExpanded = expandedIdx === idx;
            const star = q.star_framework || {};

            return (
              <div key={idx} className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="badge badge-blue">{q.type || 'Behavioral'}</span>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{q.question}</h3>
                  </div>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>

                {isExpanded && (
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>SITUATION</span>
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem' }}>{star.Situation || 'Baseline project context.'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>TASK</span>
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem' }}>{star.Task || 'Goal or challenge to overcome.'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)' }}>ACTION</span>
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem' }}>{star.Action || 'Technical steps and leadership.'}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>RESULT</span>
                      <p style={{ fontSize: '0.825rem', color: '#334155', marginTop: '0.2rem' }}>{star.Result || 'Measurable outcome & business impact.'}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
