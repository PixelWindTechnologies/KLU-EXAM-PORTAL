import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiUsers, FiFileText, FiStar, FiBarChart2,
  FiCheckCircle, FiXCircle, FiAlertTriangle, FiLogOut, FiZap
} from 'react-icons/fi';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [results, setResults] = useState([]);
  const [shortlist, setShortlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/dashboard'); return; }
    fetchTab('stats');
  }, []);

  const fetchTab = async (tab) => {
    setLoading(true);
    setActiveTab(tab);
    try {
      if (tab === 'stats') { const { data } = await adminAPI.getStats(); setStats(data.stats); }
      if (tab === 'results') { const { data } = await adminAPI.getResults(); setResults(data.results); }
      if (tab === 'shortlist') { const { data } = await adminAPI.getShortlist(); setShortlist(data.shortlisted); }
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const tabs = [
    { key: 'stats', label: 'Statistics', icon: <FiBarChart2 size={16} /> },
    { key: 'results', label: 'All Results', icon: <FiFileText size={16} /> },
    { key: 'shortlist', label: 'Shortlist', icon: <FiStar size={16} /> },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}>
      {/* Topbar */}
      <div style={{ background: 'white', borderBottom: '1px solid var(--border)', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, background: 'var(--accent)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap size={16} color="white" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>PixelWind <span style={{ color: 'var(--accent)' }}>SecureAssess</span></span>
          <span style={{ marginLeft: 4, padding: '2px 8px', background: 'var(--accent-light)', color: 'var(--accent)', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700 }}>ADMIN</span>
        </div>
        <button className="btn btn-ghost" style={{ gap: 6, fontSize: '0.8rem' }} onClick={() => { logout(); navigate('/login'); }}>
          <FiLogOut size={15} /> Logout
        </button>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', border: '1px solid var(--border)', borderRadius: 10, padding: 6, width: 'fit-content', boxShadow: 'var(--shadow-sm)' }}>
          {tabs.map(t => (
            <button key={t.key}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', border: 'none', borderRadius: 7, fontFamily: 'var(--font)', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', background: activeTab === t.key ? 'var(--accent)' : 'transparent', color: activeTab === t.key ? 'white' : 'var(--text-secondary)', transition: 'all 0.18s' }}
              onClick={() => fetchTab(t.key)}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner" /></div>
        ) : (
          <>
            {/* Stats */}
            {activeTab === 'stats' && stats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {[
                  { label: 'Registered Students', value: stats.totalStudents, icon: <FiUsers size={22} />, color: 'var(--accent)', bg: 'var(--accent-light)' },
                  { label: 'Completed Exams', value: stats.completedExams, icon: <FiFileText size={22} />, color: '#0891b2', bg: '#f0f9ff' },
                  { label: 'Passed', value: stats.passed, icon: <FiCheckCircle size={22} />, color: 'var(--green)', bg: 'var(--green-light)' },
                  { label: 'Failed', value: stats.failed, icon: <FiXCircle size={22} />, color: 'var(--red)', bg: 'var(--red-light)' },
                  { label: 'Terminated', value: stats.terminated, icon: <FiAlertTriangle size={22} />, color: 'var(--yellow)', bg: 'var(--yellow-light)' },
                  { label: 'Average Score', value: `${stats.avgScore}/100`, icon: <FiBarChart2 size={22} />, color: '#7c3aed', bg: '#f5f3ff' },
                ].map((s, i) => (
                  <div key={i} className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, flexShrink: 0 }}>{s.icon}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 500 }}>{s.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Results Table */}
            {activeTab === 'results' && (
              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>All Student Results</h3>
                  <span className="badge badge-blue">{results.length} students</span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        {['Rank','Name','Roll No','Score','Correct','Wrong','Skipped','Status','Warnings'].map(h => <th key={h}>{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr key={r._id}>
                          <td><span style={{ fontWeight: 800, color: i < 3 ? 'var(--yellow)' : 'var(--text-primary)' }}>#{r.rank || i+1}</span></td>
                          <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{r.rollNumber}</td>
                          <td><span style={{ fontWeight: 800, color: r.passed ? 'var(--green)' : 'var(--red)' }}>{r.score}</span><span style={{ color: 'var(--text-muted)' }}>/100</span></td>
                          <td style={{ color: 'var(--green)', fontWeight: 600 }}>{r.correctAnswers}</td>
                          <td style={{ color: 'var(--red)', fontWeight: 600 }}>{r.wrongAnswers}</td>
                          <td style={{ color: 'var(--yellow)', fontWeight: 600 }}>{r.skippedAnswers}</td>
                          <td>
                            <span className={`badge ${r.examStatus === 'terminated' ? 'badge-red' : r.passed ? 'badge-green' : 'badge-yellow'}`}>
                              {r.examStatus === 'terminated' ? 'Terminated' : r.passed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td style={{ color: r.cheatingWarnings > 0 ? 'var(--red)' : 'var(--text-muted)' }}>{r.cheatingWarnings || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {results.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No exam results yet</div>}
                </div>
              </div>
            )}

            {/* Shortlist */}
            {activeTab === 'shortlist' && (
              <div>
                <div className="alert alert-info" style={{ marginBottom: 20 }}>
                  <FiStar size={16} style={{ flexShrink: 0 }} />
                  <span>Shortlisted candidates who passed the assessment. Total: <strong>{shortlist.length}</strong></span>
                </div>
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {['Rank','Student Name','Roll Number','Score','Status'].map(h => <th key={h}>{h}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {shortlist.map((s, i) => (
                          <tr key={i}>
                            <td>
                              <span style={{ fontWeight: 800, color: i === 0 ? '#d97706' : i === 1 ? '#6b7280' : i === 2 ? '#92400e' : 'var(--text-primary)', fontSize: i < 3 ? '1.05rem' : '0.875rem' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i+1}`}
                              </span>
                            </td>
                            <td style={{ fontWeight: 700 }}>{s.studentName}</td>
                            <td style={{ color: 'var(--text-secondary)' }}>{s.rollNumber}</td>
                            <td><span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--green)' }}>{s.score}</span><span style={{ color: 'var(--text-muted)' }}>/100</span></td>
                            <td><span className="badge badge-green"><FiCheckCircle size={11} /> Shortlisted</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {shortlist.length === 0 && <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>No shortlisted candidates yet</div>}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
