import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings as SettingsIcon, 
  Fuel, 
  Building2, 
  ShieldCheck, 
  Bell, 
  CheckCircle2, 
  Save,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';

export const Settings: React.FC = () => {
  const { settings, updateSettings } = useLPG();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ ...settings });
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setShowModal(true);

    // Auto navigate to dashboard after 2.5 seconds
    setTimeout(() => {
      navigate('/');
    }, 2500);
  };

  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-500" /> Agency Configuration & Rates
          </h1>
          <p className="text-xs text-slate-400 mt-1">Configure cylinder rates, subsidy rates, & notification alerts</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Agency Information Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building2 className="w-4 h-4 text-brand-400" /> LPG Agency Profile & Codes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Agency Name</label>
              <input
                type="text"
                required
                value={formData.agencyName}
                onChange={e => setFormData({ ...formData, agencyName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Distributor SAP Code</label>
              <input
                type="text"
                required
                value={formData.distributorCode}
                onChange={e => setFormData({ ...formData, distributorCode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Oil Marketing Company</label>
              <select
                value={formData.oilCompany}
                onChange={e => setFormData({ ...formData, oilCompany: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="Indane Gas">Indane Gas (IOCL)</option>
                <option value="Bharat Gas">Bharat Gas (BPCL)</option>
                <option value="HP Gas">HP Gas (HPCL)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cylinder Refill Pricing & Subsidies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Fuel className="w-4 h-4 text-brand-400" /> Refill Tariff Rates & PMUY Subsidy
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">14.2kg Domestic (₹)</label>
              <input
                type="number"
                step="0.5"
                value={formData.refillPrice14kg}
                onChange={e => setFormData({ ...formData, refillPrice14kg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">19kg Commercial (₹)</label>
              <input
                type="number"
                step="1"
                value={formData.refillPrice19kg}
                onChange={e => setFormData({ ...formData, refillPrice19kg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">5kg FTL / Chhotu (₹)</label>
              <input
                type="number"
                step="1"
                value={formData.refillPrice5kg}
                onChange={e => setFormData({ ...formData, refillPrice5kg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">PMUY Subsidy (₹)</label>
              <input
                type="number"
                step="1"
                value={formData.subsidyAmount}
                onChange={e => setFormData({ ...formData, subsidyAmount: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-bold focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-slate-400 mb-1 font-semibold">Minimum Restriction Days Between Refills</label>
            <input
              type="number"
              value={formData.minDaysBetweenRefills}
              onChange={e => setFormData({ ...formData, minDaysBetweenRefills: Number(e.target.value) })}
              className="w-48 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-brand-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500 mt-1">Standard Government policy requires 15 days minimum between 14.2kg refills.</p>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Bell className="w-4 h-4 text-brand-400" /> Automated Consumer Alerts & SMS
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smsNotifications}
                onChange={e => setFormData({ ...formData, smsNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 bg-slate-950 border-slate-700"
              />
              <div>
                <span className="font-semibold">Send SMS Booking & Cash Memo Link</span>
                <p className="text-[10px] text-slate-400">Sends instant SMS when booking ref ID is created</p>
              </div>
            </label>

            <label className="flex items-center gap-3 text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.whatsappNotifications}
                onChange={e => setFormData({ ...formData, whatsappNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-brand-500 bg-slate-950 border-slate-700"
              />
              <div>
                <span className="font-semibold">WhatsApp Delivery Updates & Rider Info</span>
                <p className="text-[10px] text-slate-400">Notifies consumer when rider starts dispatch</p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all text-xs"
          >
            <Save className="w-4 h-4" /> Save Agency Settings
          </button>
        </div>

      </form>

      {/* DATA UPDATED POPUP MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4 relative text-slate-100">
            
            {/* Animated Success Checkmark Ring */}
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/40 ring-4 ring-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center justify-center gap-1.5">
                <span>Data Updated Successfully!</span>
                <Sparkles className="w-4 h-4 text-brand-400" />
              </h2>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Agency settings and refill tariff rates have been updated. Redirecting to Dashboard...
              </p>
            </div>

            {/* Manual Go to Dashboard Button */}
            <button
              onClick={handleGoToDashboard}
              className="w-full py-2.5 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold rounded-xl text-xs shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <span>Go to Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
