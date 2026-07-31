import React, { useState } from 'react';
import { UserCircle, Key, CheckCircle2, Activity, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLPG } from '../context/LPGContext';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { settings } = useLPG();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [successMsg, setSuccessMsg] = useState(false);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setSuccessMsg(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMsg(false), 3000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCircle className="w-6 h-6 text-brand-500" /> User Account & Profile
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage staff profile, credential security, & system audit logs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* User Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand-500 to-orange-600 text-white font-extrabold text-3xl mx-auto flex items-center justify-center shadow-lg shadow-brand-500/25">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">{user?.name}</h2>
            <p className="text-xs text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-brand-500/20 text-brand-400 border border-brand-500/30 rounded-full font-mono text-xs font-bold capitalize">
              Role: System Administrator
            </span>
          </div>

          <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 space-y-1.5 text-left">
            <p>Distributor: <strong className="text-slate-200">{settings.agencyName}</strong></p>
            <p>Code: <strong className="text-slate-200 font-mono">{settings.distributorCode}</strong></p>
            <p>Phone: <strong className="text-slate-200 font-mono">+91 {user?.phone}</strong></p>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Key className="w-4 h-4 text-brand-400" /> Password Security Settings
          </h3>

          {successMsg && (
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Password updated successfully!
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPass ? "text" : "password"}
                  required
                  value={passwordForm.currentPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-slate-100 focus:border-brand-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPass(!showCurrentPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-400 transition-colors p-1"
                >
                  {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    required
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 pr-10 text-slate-100 focus:border-brand-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-400 transition-colors p-1"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Confirm New Password</label>
                <input
                  type={showNewPass ? "text" : "password"}
                  required
                  value={passwordForm.confirmPassword}
                  onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-xl transition-all shadow-md shadow-brand-500/20"
              >
                Update Security Password
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Activity Logs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Activity className="w-4 h-4 text-brand-400" /> Recent User Activity Logs
        </h3>

        <div className="space-y-2 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-slate-300">
            <span>LoggedIn to LPG Agency Portal from IP 192.168.1.45</span>
            <span className="font-mono text-slate-500">Today, 07:44 AM</span>
          </div>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-slate-300">
            <span>Generated Cash Memo CM-2026-9040 for Sunita Devi</span>
            <span className="font-mono text-slate-500">Yesterday, 04:30 PM</span>
          </div>
        </div>
      </div>

    </div>
  );
};
