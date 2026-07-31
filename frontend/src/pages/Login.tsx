import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  UserCheck, 
  Phone, 
  User as UserIcon, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLPG } from '../context/LPGContext';

export const Login: React.FC = () => {
  const { login, loginWithGoogle, signup } = useAuth();
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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError("Google authentication failed. Please try standard sign in.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none">
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Header Logo */}
        <div className="text-center space-y-3 mb-6">
          <div className="inline-flex items-center justify-center p-1 rounded-2xl bg-slate-950 border border-slate-800 shadow-xl ring-2 ring-brand-500/30">
            <img src="/logoytmr.png" alt="YTMR LPG Logo" className="w-14 h-14 object-contain rounded-xl" />
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
                  placeholder="e.g. SUJAN BHOWMIK"
                  value={name}
                  onChange={e => setName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-slate-100 uppercase focus:border-brand-500 focus:outline-none"
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
                  placeholder="e.g. 8207004928"
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

        {/* OR Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider absolute">OR</span>
        </div>

        {/* Google Sign In / Sign Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full py-2.5 bg-slate-950 hover:bg-slate-800/80 text-slate-200 font-semibold rounded-xl border border-slate-800 hover:border-brand-500/40 transition-all flex items-center justify-center gap-2.5 text-xs shadow-sm"
        >
          {/* Google Colorful Logo SVG */}
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{googleLoading ? 'Connecting Google Account...' : mode === 'login' ? 'Continue with Google' : 'Sign Up with Google'}</span>
        </button>

        {/* Quick Admin Demo Option */}
        <div className="mt-4 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-2">
          <p className="font-semibold text-slate-300 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-brand-400" /> Quick Preview Login:
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
