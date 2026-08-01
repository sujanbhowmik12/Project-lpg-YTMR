import React, { useState } from 'react';
import { 
  CalendarCheck, 
  CheckCircle2, 
  PhoneCall, 
  Search, 
  Sparkles, 
  ShieldCheck,
  Flame,
  Zap,
  Shield
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { Customer } from '../types';

interface EligibleOnwardsSectionProps {
  onQuickBook: (customerId: string) => void;
}

export const EligibleOnwardsSection: React.FC<EligibleOnwardsSectionProps> = ({ onQuickBook }) => {
  const { customers, checkRefillEligibility, settings } = useLPG();
  const [searchTerm, setSearchTerm] = useState('');
  const [schemeFilter, setSchemeFilter] = useState<string>('all');
  const [companyFilter, setCompanyFilter] = useState<string>('all');

  // Filter ONLY customers whose booking can be made onwards (isEligible === true)
  const eligibleCustomers = customers.filter(c => {
    const eligibility = checkRefillEligibility(c.lastRefillDate);
    if (!eligibility.isEligible) return false; // Exclude locked/cooldown customers

    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.consumerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.svNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm);

    const matchesScheme = schemeFilter === 'all' || c.scheme === schemeFilter;

    const custCompany = c.oilCompany || 'Indane Gas';
    const matchesCompany = companyFilter === 'all' || custCompany === companyFilter;

    return matchesSearch && matchesScheme && matchesCompany;
  });

  const totalEligible = customers.filter(c => checkRefillEligibility(c.lastRefillDate).isEligible);
  const totalEligibleCount = totalEligible.length;
  const indaneCount = totalEligible.filter(c => (c.oilCompany || 'Indane Gas') === 'Indane Gas').length;
  const bharatCount = totalEligible.filter(c => c.oilCompany === 'Bharat Gas').length;
  const hpCount = totalEligible.filter(c => c.oilCompany === 'HP Gas').length;

  return (
    <div className="bg-white border border-emerald-200 p-5 sm:p-6 rounded-3xl shadow-card space-y-5">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl border border-emerald-200 shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Booking Permitted Onwards (Eligible Consumers)
              </h2>
              <span className="px-2.5 py-0.5 text-xs bg-emerald-100 text-emerald-700 font-extrabold rounded-full border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {totalEligibleCount} Ready to Book
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Consumers who have completed the mandatory minimum interval ({settings.minDaysBetweenRefills} days) and are authorized to book refills onwards.
            </p>
          </div>
        </div>

        {/* Search & Scheme Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search eligible consumers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-100 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-emerald-500 w-44 sm:w-56 font-medium"
            />
          </div>

          <select
            value={schemeFilter}
            onChange={e => setSchemeFilter(e.target.value)}
            className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-emerald-500 font-medium"
          >
            <option value="all">All Schemes</option>
            <option value="ujjwala">PMUY Ujjwala</option>
            <option value="general">General Domestic</option>
            <option value="commercial">Commercial 19kg</option>
          </select>
        </div>
      </div>

      {/* OIL COMPANY FILTER TABS (INDIAN GAS vs BHARAT GAS) */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200/80 text-xs">
        <span className="text-slate-500 font-bold px-2 text-[11px] uppercase tracking-wider">Gas Provider:</span>
        
        <button
          onClick={() => setCompanyFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
            companyFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          All Providers ({totalEligibleCount})
        </button>

        <button
          onClick={() => setCompanyFilter('Indane Gas')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'Indane Gas'
              ? 'bg-orange-500 text-white shadow-sm'
              : 'text-orange-600 hover:bg-orange-100/60'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Indane Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-orange-100 text-orange-700 border border-orange-200">
            {indaneCount}
          </span>
        </button>

        <button
          onClick={() => setCompanyFilter('Bharat Gas')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'Bharat Gas'
              ? 'bg-cyan-600 text-white shadow-sm'
              : 'text-cyan-700 hover:bg-cyan-100/60'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Bharat Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-cyan-100 text-cyan-700 border border-cyan-200">
            {bharatCount}
          </span>
        </button>

        <button
          onClick={() => setCompanyFilter('HP Gas')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'HP Gas'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 hover:bg-rose-100/60'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>HP Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 border border-rose-200">
            {hpCount}
          </span>
        </button>
      </div>

      {/* Eligible Customers Grid */}
      {eligibleCustomers.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs italic">
          No eligible consumers found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibleCustomers.map(customer => {
            return (
              <div 
                key={customer.id}
                className="bg-white border border-slate-200/80 hover:border-emerald-500 p-4 rounded-2xl shadow-card transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono font-bold text-xs text-emerald-600">{customer.consumerNo}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          (customer.oilCompany || 'Indane Gas') === 'Bharat Gas' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' :
                          customer.oilCompany === 'HP Gas' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                          'bg-orange-50 text-orange-600 border border-orange-200'
                        }`}>
                          {customer.oilCompany || 'Indane Gas'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                        {customer.name}
                      </h4>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                      customer.scheme === 'ujjwala' ? 'bg-pink-100 text-pink-700 border border-pink-200' :
                      customer.scheme === 'commercial' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
                      'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {customer.scheme} ({customer.cylinderType})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1 truncate font-medium">{customer.address}</p>
                  <p className="text-[11px] text-slate-600 font-mono">+91 {customer.phone}</p>
                </div>

                {/* Status & Last Refill Details */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-500">
                    <span>Last Refill Date:</span>
                    <strong className="text-slate-800 font-mono">{customer.lastRefillDate || 'Never'}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Booking Status:</span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Permitted Onwards
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onQuickBook(customer.id)}
                    className="flex-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Refill Onwards
                  </button>

                  <a
                    href={`tel:${customer.phone.replace(/\D/g, '')}`}
                    title={`Direct Call Customer: +91 ${customer.phone}`}
                    className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl transition-colors shrink-0 flex items-center justify-center"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
