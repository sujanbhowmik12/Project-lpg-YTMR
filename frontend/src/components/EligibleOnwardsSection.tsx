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
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/40 border border-emerald-500/30 p-5 sm:p-6 rounded-2xl shadow-2xl space-y-5">
      
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 shrink-0 shadow-lg shadow-emerald-500/10">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-extrabold text-slate-100 tracking-tight">
                Booking Permitted Onwards (Eligible Consumers)
              </h2>
              <span className="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-300 font-extrabold rounded-full border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {totalEligibleCount} Ready to Book
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Consumers who have completed the mandatory minimum interval ({settings.minDaysBetweenRefills} days) and are authorized to book refills onwards.
            </p>
          </div>
        </div>

        {/* Search & Scheme Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search eligible consumers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-44 sm:w-56"
            />
          </div>

          <select
            value={schemeFilter}
            onChange={e => setSchemeFilter(e.target.value)}
            className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Schemes</option>
            <option value="ujjwala">PMUY Ujjwala</option>
            <option value="general">General Domestic</option>
            <option value="commercial">Commercial 19kg</option>
          </select>
        </div>
      </div>

      {/* OIL COMPANY FILTER TABS (INDIAN GAS vs BHARAT GAS) */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-950/90 p-1.5 rounded-xl border border-slate-800 text-xs">
        <span className="text-slate-400 font-bold px-2 text-[11px] uppercase tracking-wider">Gas Provider:</span>
        
        <button
          onClick={() => setCompanyFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            companyFilter === 'all'
              ? 'bg-emerald-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          All Providers ({totalEligibleCount})
        </button>

        <button
          onClick={() => setCompanyFilter('Indane Gas')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'Indane Gas'
              ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md'
              : 'text-orange-400 hover:text-orange-300 hover:bg-orange-950/30'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Indane Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-orange-300 border border-orange-500/30">
            {indaneCount}
          </span>
        </button>

        <button
          onClick={() => setCompanyFilter('Bharat Gas')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'Bharat Gas'
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
              : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Bharat Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-cyan-300 border border-cyan-500/30">
            {bharatCount}
          </span>
        </button>

        <button
          onClick={() => setCompanyFilter('HP Gas')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
            companyFilter === 'HP Gas'
              ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md'
              : 'text-rose-400 hover:text-rose-300 hover:bg-rose-950/30'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>HP Gas</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-950 text-rose-300 border border-rose-500/30">
            {hpCount}
          </span>
        </button>
      </div>

      {/* Eligible Customers Grid */}
      {eligibleCustomers.length === 0 ? (
        <div className="p-8 text-center bg-slate-950/50 rounded-xl border border-slate-800/80 text-slate-400 text-xs italic">
          No eligible consumers found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {eligibleCustomers.map(customer => {
            return (
              <div 
                key={customer.id}
                className="bg-slate-950/90 border border-slate-800 hover:border-emerald-500/50 p-4 rounded-xl shadow-lg transition-all flex flex-col justify-between space-y-3 group"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono font-bold text-xs text-emerald-400">{customer.consumerNo}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                          (customer.oilCompany || 'Indane Gas') === 'Bharat Gas' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                          customer.oilCompany === 'HP Gas' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                        }`}>
                          {customer.oilCompany || 'Indane Gas'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-emerald-300 transition-colors">
                        {customer.name}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase shrink-0 ${
                      customer.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      customer.scheme === 'commercial' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    }`}>
                      {customer.scheme} ({customer.cylinderType})
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 truncate">{customer.address}</p>
                  <p className="text-[11px] text-slate-500 font-mono">+91 {customer.phone}</p>
                </div>

                {/* Status & Last Refill Details */}
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 space-y-1 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Last Refill Date:</span>
                    <strong className="text-slate-200 font-mono">{customer.lastRefillDate || 'Never'}</strong>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Booking Status:</span>
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded font-extrabold border border-emerald-500/30">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" /> Permitted Onwards
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onQuickBook(customer.id)}
                    className="flex-1 px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                  >
                    <CalendarCheck className="w-4 h-4" /> Book Refill Onwards
                  </button>

                  <a
                    href={`tel:${customer.phone.replace(/\D/g, '')}`}
                    title={`Direct Call Customer: +91 ${customer.phone}`}
                    className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl transition-colors shrink-0 flex items-center justify-center"
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
