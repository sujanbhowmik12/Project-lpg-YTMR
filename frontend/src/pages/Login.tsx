import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flame, ShieldCheck, Lock, Mail, ArrowRight, UserCheck, Phone, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLPG } from '../context/LPGContext';

export const Login: React.FC = () => {
  const { login, signup } = useAuth();
  const { settings } = useLPG();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  // Form states
  const [email, setEmail] = useState('admin@ytmrlpg.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        if (!name || !phone) {
          setError("Please fill in your full name and mobile number.");
          setLoading(false);
          return;
        }
        await signup(email, password, name, phone);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl ring-2 ring-brand-500/30">
            <img src="/logoytmr.png" alt="YTMR LPG Logo" className="w-16 h-16 object-contain rounded-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">YTMR-LPG</h1>
            <p className="text-xs text-brand-400 font-mono mt-0.5">{settings.agencyName} ({settings.distributorCode})</p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-slate-400 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Admin Authentication Console</span>
          </div>
        </div>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 ${
              mode === 'login'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Admin Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); }}
            className={`flex-1 pb-2.5 text-xs font-bold transition-all border-b-2 ${
              mode === 'signup'
                ? 'border-brand-500 text-brand-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            Create Admin Account
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* Name field for Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Amitabh Choudhury"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Phone field for Sign Up */}
          {mode === 'signup' && (
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="e.g. 9800011122"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Admin Email Address *</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Password input with Show / Hide Toggle */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Admin Password *</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-slate-100 focus:border-brand-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-400 transition-colors p-1"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 text-sm mt-3"
          >
            <span>{loading ? 'Authenticating...' : mode === 'login' ? 'Sign In to Admin Panel' : 'Create Admin Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Admin Demo Option */}
        <div className="mt-5 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Admin Demo Login:
          </p>
          <button
            onClick={() => { login('admin@ytmrlpg.com', 'password123'); navigate('/'); }}
            className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-brand-400 font-semibold rounded-lg border border-slate-800 text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Quick Login as Admin
          </button>
        </div>

      </div>
    </div>
  );
};
