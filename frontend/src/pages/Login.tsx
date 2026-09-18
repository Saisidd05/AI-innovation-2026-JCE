import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, User } from '../store/authStore';
import { authApi } from '../services/api';
import { Shield, Eye, EyeOff, UserCheck } from 'lucide-react';

const PRESET_USERS = [
  { label: 'Super Admin', email: 'admin@networkhunter.io', pass: 'password123', badge: 'bg-primary/20 text-primary border-primary/30' },
  { label: 'Investigator Admin', email: 'invadmin@networkhunter.io', pass: 'password123', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { label: 'Investigator', email: 'investigator@networkhunter.io', pass: 'password123', badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { label: 'Analyst', email: 'analyst@networkhunter.io', pass: 'password123', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { label: 'Reviewer', email: 'reviewer@networkhunter.io', pass: 'password123', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e?: React.FormEvent, customEmail?: string, customPass?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    const loginEmail = customEmail || email;
    const loginPass = customPass || password;

    try {
      const tokenData = await authApi.login(loginEmail, loginPass);
      const u = tokenData.user;
      const userObj: User = {
        user_id: u.id,
        full_name: u.full_name,
        email: u.email,
        role: u.role as any,
        department: u.department || 'Forensics',
        organization: u.organization || 'Network Hunter',
        permissions: u.permissions || [],
      };
      login(userObj);
      navigate('/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      const detail = err.response?.data?.detail || 'Invalid credentials or server unavailable';
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-panel border border-border rounded-lg shadow-2xl p-8 space-y-6">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-heading text-text-main font-bold tracking-wider">THE NETWORK HUNTER</h1>
          <p className="text-text-secondary text-xs mt-1 font-mono uppercase tracking-widest">Evidence-First Relationship Intelligence</p>
        </div>

        {error && (
          <div className="p-3 bg-status-flagged/10 border border-status-flagged text-status-flagged rounded text-sm font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">Email Identifier</label>
            <input
              type="email"
              required
              className="w-full bg-elevated border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary transition-colors text-sm font-mono"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@networkhunter.io"
            />
          </div>
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-text-secondary mb-1">Access Token / Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full bg-elevated border border-border rounded px-3 py-2 text-text-main focus:outline-none focus:border-primary transition-colors text-sm pr-10 font-mono"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-main p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-light text-white font-mono text-sm uppercase tracking-wider py-2.5 rounded transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-50 font-semibold"
          >
            {loading ? 'Authenticating...' : 'Establish Secure Session'}
          </button>
        </form>

        {/* Preset Quick Logins */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <UserCheck className="w-4 h-4 text-text-secondary" />
            <span className="text-xs font-mono uppercase text-text-secondary">Demo Persona Quick Login</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_USERS.map((p) => (
              <button
                key={p.email}
                type="button"
                onClick={() => {
                  setEmail(p.email);
                  setPassword(p.pass);
                  handleLoginSubmit(undefined, p.email, p.pass);
                }}
                className={`px-2.5 py-1.5 border rounded text-xs font-mono flex items-center justify-between hover:opacity-90 transition-opacity ${p.badge}`}
              >
                <span>{p.label}</span>
                <span className="opacity-60 text-[10px]">➜</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
