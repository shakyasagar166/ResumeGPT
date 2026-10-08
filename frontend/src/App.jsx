import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeAnalysis from './pages/ResumeAnalysis';
import TailorResume from './pages/TailorResume';
import InterviewPrep from './pages/InterviewPrep';
import BulletImprover from './components/BulletImprover';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('resumegpt_user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('resumegpt_token');
    localStorage.removeItem('resumegpt_user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar user={user} onLogout={handleLogout} />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
            <Route path="/login" element={!user ? <Login onLoginSuccess={setUser} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
            <Route path="/analysis/:id" element={user ? <ResumeAnalysis /> : <Navigate to="/login" replace />} />
            <Route path="/tailor/:id" element={user ? <TailorResume /> : <Navigate to="/login" replace />} />
            <Route path="/interview/:jobMatchId" element={user ? <InterviewPrep /> : <Navigate to="/login" replace />} />
            <Route path="/bullet-improver" element={
              user ? (
                <div className="container" style={{ padding: '2rem 1.5rem' }}>
                  <BulletImprover />
                </div>
              ) : <Navigate to="/login" replace />
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
