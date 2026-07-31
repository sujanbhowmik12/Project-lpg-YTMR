import React, { useState } from 'react';
import { X, UserPlus, ShieldCheck, FileCheck } from 'lucide-react';
import { Customer, SchemeType, CylinderType } from '../types';

interface AddCustomerModalProps {
  onClose: () => void;
  onSubmit: (customerData: Omit<Customer, 'id' | 'createdAt' | 'totalBookings'>) => void;
  initialData?: Customer | null;
}

export const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    consumerNo: initialData?.consumerNo || '',
    svNumber: initialData?.svNumber || '',
    lpgId: initialData?.lpgId || '',
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    careOf: initialData?.careOf || '',
    scheme: (initialData?.scheme || 'general') as SchemeType,
    cylinderType: (initialData?.cylinderType || '14.2kg') as CylinderType,
    oilCompany: (initialData?.oilCompany || 'Indane Gas') as 'Indane Gas' | 'Bharat Gas' | 'HP Gas',
    connectionCount: initialData?.connectionCount || 2,
    status: initialData?.status || 'active',
    aadhaarLinked: initialData?.aadhaarLinked ?? true,
    bankAccountLinked: initialData?.bankAccountLinked ?? true,
    documentUploaded: initialData?.documentUploaded ?? true,
    lastRefillDate: initialData?.lastRefillDate || new Date().toISOString().split('T')[0],
    nextEligibleDate: initialData?.nextEligibleDate || new Date().toISOString().split('T')[0],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      alert("Please fill in consumer name, phone, and address.");
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">
                {initialData ? 'Edit Consumer KYC Profile' : 'Register New LPG Consumer'}
              </h2>
              <p className="text-xs text-slate-400">Enter SV vouchers, address, and scheme classification</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Consumer No & SV Number */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Consumer Number *</label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.consumerNo}
                onChange={e => setFormData({ ...formData, consumerNo: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Subscription Voucher (SV) No.</label>
              <input
                type="text"
                placeholder=""
                value={formData.svNumber}
                onChange={e => setFormData({ ...formData, svNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* 16-Digit LPG ID & Last Booking Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">16-Digit LPG ID (Optional)</label>
              <input
                type="text"
                maxLength={16}
                placeholder=""
                value={formData.lpgId}
                onChange={e => setFormData({ ...formData, lpgId: e.target.value.replace(/\D/g, '') })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold flex items-center justify-between">
                <span>Last Booking Date</span>
                <span className="text-[10px] text-brand-400 font-normal">(Sets refill cycle)</span>
              </label>
              <input
                type="date"
                value={formData.lastRefillDate}
                onChange={e => setFormData({ ...formData, lastRefillDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Full Name & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Full Name *</label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value.toUpperCase() })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 uppercase focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Mobile Phone *</label>
              <input
                type="tel"
                required
                placeholder=""
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Scheme, Oil Company & Cylinder Type */}
          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Gas Provider</label>
              <select
                value={formData.oilCompany}
                onChange={e => setFormData({ ...formData, oilCompany: e.target.value as 'Indane Gas' | 'Bharat Gas' | 'HP Gas' })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="Indane Gas">Indane Gas</option>
                <option value="Bharat Gas">Bharat Gas</option>
                <option value="HP Gas">HP Gas</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Scheme Category</label>
              <select
                value={formData.scheme}
                onChange={e => setFormData({ ...formData, scheme: e.target.value as SchemeType })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="general">General Domestic</option>
                <option value="ujjwala">PM Ujjwala Yojana (PMUY)</option>
                <option value="commercial">Commercial / Industrial</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Cylinder Capacity</label>
              <select
                value={formData.cylinderType}
                onChange={e => setFormData({ ...formData, cylinderType: e.target.value as CylinderType })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="14.2kg">14.2 kg (Domestic)</option>
                <option value="19kg">19 kg (Commercial)</option>
                <option value="5kg">5 kg (Chhotu)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Connection Type</label>
              <select
                value={formData.connectionCount}
                onChange={e => setFormData({ ...formData, connectionCount: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value={1}>Single (SBC)</option>
                <option value={2}>Double (DBC)</option>
                <option value={4}>Multi (Comm)</option>
              </select>
            </div>
          </div>

          {/* S/O or C/O & Address */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">S/O or C/O Name *</label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.careOf}
                onChange={e => setFormData({ ...formData, careOf: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-slate-400 mb-1 font-semibold">Complete House Address *</label>
              <input
                type="text"
                required
                placeholder=""
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* KYC Status Checks */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-2">
            <p className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Direct Benefit Transfer (DBTL) & KYC Verification
            </p>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.aadhaarLinked}
                  onChange={e => setFormData({ ...formData, aadhaarLinked: e.target.checked })}
                  className="rounded text-brand-500 bg-slate-900 border-slate-700"
                />
                <span>Aadhaar Linked</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.bankAccountLinked}
                  onChange={e => setFormData({ ...formData, bankAccountLinked: e.target.checked })}
                  className="rounded text-brand-500 bg-slate-900 border-slate-700"
                />
                <span>Bank Account Linked</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.documentUploaded}
                  onChange={e => setFormData({ ...formData, documentUploaded: e.target.checked })}
                  className="rounded text-brand-500 bg-slate-900 border-slate-700"
                />
                <span>Documents Verified</span>
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold rounded-lg transition-all shadow-md shadow-brand-500/20"
            >
              {initialData ? 'Save Changes' : 'Register Consumer'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
