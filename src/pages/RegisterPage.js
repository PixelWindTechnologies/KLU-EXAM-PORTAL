import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../utils/api';
import {
  FiUser, FiMail, FiHash, FiLock, FiEye, FiEyeOff,
  FiCheckCircle, FiShield, FiZap, FiAward
} from 'react-icons/fi';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', rollNumber: '', password: '', confirmPassword: '' });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await authAPI.register({ name: form.name, email: form.email, rollNumber: form.rollNumber, password: form.password });
      // Redirect to login with registered email pre-filled
      navigate('/login', { state: { registeredEmail: form.email, fromRegister: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Left Panel */}
      <div className="auth-left" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 48 }}>
          <div style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FiZap size={22} color="white" />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', lineHeight: 1.1 }}>PixelWind Technologies</div>
            <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>SecureAssess Platform</div>
          </div>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
          Start Your Assessment Journey
        </h2>
        <p style={{ opacity: 0.85, fontSize: '1rem', marginBottom: 48, lineHeight: 1.7 }}>
          Register to access our secure, AI-monitored online examination platform.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { icon: <FiShield size={18} />, title: 'Secure & Monitored', desc: 'Anti-cheat system with real-time monitoring' },
            { icon: <FiZap size={18} />, title: 'Randomized Questions', desc: 'Unique question order for every student' },
            { icon: <FiAward size={18} />, title: 'Instant Results', desc: 'Get evaluated immediately after submission' },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{f.title}</div>
                <div style={{ opacity: 0.75, fontSize: '0.82rem' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="auth-right">
        <div className="auth-form-box">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>Create Account</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Fill in your details to register for the exam</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <FiCheckCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <div style={{ position: 'relative' }}>
                <FiUser size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Roll Number</label>
              <div style={{ position: 'relative' }}>
                <FiHash size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="form-input" name="rollNumber" placeholder="e.g. CS2024001" value={form.rollNumber} onChange={handleChange} required style={{ paddingLeft: 38 }} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" name="password" type={showPass ? 'text' : 'password'} placeholder="Min 6 chars" value={form.password} onChange={handleChange} required style={{ paddingLeft: 38, paddingRight: 36 }} />
                  <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                    {showPass ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <FiLock size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input className="form-input" name="confirmPassword" type={showConfirm ? 'text' : 'password'} placeholder="Repeat password" value={form.confirmPassword} onChange={handleChange} required style={{ paddingLeft: 38, paddingRight: 36 }} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                    {showConfirm ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                  </button>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 6 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 24, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
