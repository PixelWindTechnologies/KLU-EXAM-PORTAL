import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiUser, FiHash, FiClock, FiCheckCircle, FiXCircle,
  FiSkipForward, FiAlertTriangle, FiMonitor, FiZap,
  FiCheckSquare, FiArrowLeft, FiShield
} from 'react-icons/fi';

export default function ResultPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    examAPI.getResult()
      .then(({ data }) => setResult(data.result))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (secs) => {
    if (!secs) return 'N/A';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  if (loading) return <div className="loader"><div className="spinner" /></div>;

  const statusLabels = {
    completed: { label: 'Completed', cls: 'badge-green' },
    terminated: { label: 'Terminated', cls: 'badge-red' },
    time_expired: { label: 'Automatically Submitted', cls: 'badge-yellow' },
  };
  const statusInfo = statusLabels[result?.examStatus] || statusLabels.completed;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: 'var(--accent)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap size={14} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>PixelWind <span style={{ color: 'var(--accent)' }}>SecureAssess</span></span>
        </div>
        <button className="btn btn-outline" style={{ fontSize: '0.8rem', gap: 6 }} onClick={() => navigate('/dashboard')}>
          <FiArrowLeft size={15} /> Dashboard
        </button>
      </div>

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '36px 24px' }}>
        {/* Result Card */}
        <div className="card" style={{ textAlign: 'center', marginBottom: 24, padding: '40px 32px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FiShield size={32} color="var(--accent)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
            Exam Submitted
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 20 }}>
            Your responses have been recorded. Results will be announced by the administrator.
          </p>
          <span className={`badge ${statusInfo.cls}`} style={{ fontSize: '0.8rem', padding: '6px 16px' }}>
            {statusInfo.label}
          </span>
        </div>

        {/* Stats: Only answered/unanswered shown — no score, no pass/fail */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <FiCheckCircle size={20} color="var(--green)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--green)' }}>{result?.correctAnswers + result?.wrongAnswers}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Answered</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <FiSkipForward size={20} color="var(--red)" />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: 'var(--red)' }}>{result?.skippedAnswers}</div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Unanswered</div>
          </div>
        </div>

        {/* Student Details */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
            <FiUser size={16} color="var(--accent)" />
            <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>Submission Details</h3>
          </div>
          <div style={{ display: 'grid', gap: 0 }}>
            {[
              { icon: <FiUser size={15} />, label: 'Student Name', value: result?.studentName || user?.name },
              { icon: <FiHash size={15} />, label: 'Roll Number', value: result?.rollNumber || user?.rollNumber },
              { icon: <FiClock size={15} />, label: 'Time Taken', value: formatTime(result?.timeTaken) },
              { icon: <FiMonitor size={15} />, label: 'Tab Switches', value: result?.tabSwitchCount ?? 0 },
              { icon: <FiAlertTriangle size={15} />, label: 'Warnings', value: result?.cheatingWarnings ?? 0 },
              { icon: <FiCheckSquare size={15} />, label: 'Exam Status', value: <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span> },
            ].map((item, i, arr) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                  {item.label}
                </div>
                <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
