import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiUser, FiHash, FiClock, FiCheckSquare, FiZap,
  FiAlertTriangle, FiMonitor, FiSlash, FiLogOut,
  FiPlay, FiRefreshCw, FiInfo, FiFileText
} from 'react-icons/fi';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const canStart = user?.examStatus === 'not_started' || user?.examStatus === 'in_progress';
  const isCompleted = user?.examStatus === 'completed';
  const isTerminated = user?.examStatus === 'terminated';

  const instructions = [
    { icon: <FiClock size={17} />, text: 'Exam duration is 60 minutes. The timer begins the moment you click Start Exam.' },
    { icon: <FiZap size={17} />, text: 'Questions are uniquely randomized — every student receives a different sequence.' },
    { icon: <FiAlertTriangle size={17} />, text: 'Switching tabs or minimizing the browser window triggers a warning. 1 violation result in automatic termination.' },
    { icon: <FiSlash size={17} />, text: 'Right-click, copy, and paste are disabled throughout the exam session.' },
    { icon: <FiMonitor size={17} />, text: 'Fullscreen mode is enforced. Exiting fullscreen counts as a violation.' },
    { icon: <FiCheckSquare size={17} />, text: 'The exam auto-submits when the timer expires. You may also submit manually.' },
    { icon: <FiInfo size={17} />, text: 'Ensure a stable internet connection before starting. Do not refresh the page during the exam.' },
    { icon: <FiFileText size={17} />, text: 'Each question has one correct answer. Unanswered questions are marked as skipped.' },
  ];

  const statusMap = {
    not_started: { label: 'Not Started', cls: 'badge-gray' },
    in_progress: { label: 'In Progress', cls: 'badge-yellow' },
    completed: { label: 'Completed', cls: 'badge-green' },
    terminated: { label: 'Terminated', cls: 'badge-red' },
  };
  const statusInfo = statusMap[user?.examStatus] || statusMap.not_started;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>PixelWind <span style={{ color: 'var(--accent)' }}>SecureAssess</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{user?.rollNumber}</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={handleLogout} style={{ gap: 6, fontSize: '0.8rem' }}>
            <FiLogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
        {/* Status alerts */}
        {isCompleted && (
          <div className="alert alert-success" style={{ marginBottom: 24 }}>
            <FiCheckSquare size={16} style={{ flexShrink: 0 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <span>Your exam has been submitted successfully.</span>
              <button className="btn btn-success" style={{ padding: '6px 14px', fontSize: '0.8rem', flexShrink: 0 }} onClick={() => navigate('/result')}>View Result</button>
            </div>
          </div>
        )}
        {isTerminated && (
          <div className="alert alert-error" style={{ marginBottom: 24 }}>
            <FiAlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>Your exam was terminated due to repeated policy violations.</span>
          </div>
        )}

        {/* Student Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { icon: <FiUser size={18} />, label: 'Student Name', value: user?.name, color: 'var(--accent)' },
            { icon: <FiHash size={18} />, label: 'Roll Number', value: user?.rollNumber, color: '#0891b2' },
            { icon: <FiClock size={18} />, label: 'Exam Duration', value: '60 Minutes', color: '#d97706' },
            { icon: <FiCheckSquare size={18} />, label: 'Exam Status', value: <span className={`badge ${statusInfo.cls}`}>{statusInfo.label}</span>, color: '#16a34a' },
          ].map((item, i) => (
            <div key={i} className="card" style={{ padding: '18px 20px' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, marginBottom: 12 }}>
                {item.icon}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <FiFileText size={18} color="var(--accent)" />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Exam Instructions</h2>
          </div>
          <div style={{ display: 'grid', gap: 10 }}>
            {instructions.map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>{ins.icon}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.5 }}>{ins.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        {canStart && (
          <div className="card" style={{ textAlign: 'center', background: 'var(--accent-light)', border: '1px solid #bfdbfe' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: 20 }}>
              By starting the exam, you confirm that you have read all instructions and agree to abide by the examination policy.
            </p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/exam')}>
              {user?.examStatus === 'in_progress'
                ? <><FiRefreshCw size={17} /> Resume Exam</>
                : <><FiPlay size={17} /> Start Exam</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
