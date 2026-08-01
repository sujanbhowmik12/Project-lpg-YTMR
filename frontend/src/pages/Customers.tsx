import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Flame, 
  Eye, 
  CalendarCheck,
  Clock,
  AlertCircle,
  PhoneCall,
  FileSpreadsheet,
  Sparkles,
  Lock,
  Printer
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { Customer, Booking } from '../types';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { AddBookingModal } from '../components/AddBookingModal';
import { CashMemoModal } from '../components/CashMemoModal';
import { EligibleOnwardsSection } from '../components/EligibleOnwardsSection';
import { calculateRefillStatus45Days } from '../utils/refillUtils';

export const Customers: React.FC = () => {
  const { customers, deleteCustomer, addCustomer, updateCustomer, bookings, checkRefillEligibility, settings, updateSettings } = useLPG();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<string>('all');
  const [onlyKeepEligibleOnwards, setOnlyKeepEligibleOnwards] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  
  // State for quick refill booking modal
  const [quickBookingCustomerId, setQuickBookingCustomerId] = useState<string | null>(null);
  const [selectedMemoBooking, setSelectedMemoBooking] = useState<Booking | null>(null);

  // Compute eligible onwards count
  const eligibleOnwardsCount = customers.filter(c => checkRefillEligibility(c.lastRefillDate).isEligible).length;

  // Compute refill due / overdue counts using dynamic minDaysBetweenRefills
  const dueOrOverdueCustomers = customers.filter(c => calculateRefillStatus45Days(c.lastRefillDate, settings.minDaysBetweenRefills).isDueOrOverdue);
  const dueTodayCount = customers.filter(c => calculateRefillStatus45Days(c.lastRefillDate, settings.minDaysBetweenRefills).isDueToday).length;
  const overdueCount = customers.filter(c => calculateRefillStatus45Days(c.lastRefillDate, settings.minDaysBetweenRefills).isOverdue).length;

  // Filtered customer list
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.consumerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.svNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.lpgId && c.lpgId.includes(searchTerm)) ||
      c.phone.includes(searchTerm);

    // Rule: Filter ONLY those people whose book can be made onwards if toggled or in tab
    if (onlyKeepEligibleOnwards || selectedScheme === 'eligible_onwards') {
      const eligibility = checkRefillEligibility(c.lastRefillDate);
      if (!eligibility.isEligible) return false;
    }

    let matchesFilter = true;
    if (selectedScheme === 'due_45_days') {
      matchesFilter = calculateRefillStatus45Days(c.lastRefillDate).isDueOrOverdue;
    } else if (selectedScheme === 'eligible_onwards') {
      matchesFilter = true; // Handled by checkRefillEligibility check above
    } else if (selectedScheme !== 'all') {
      matchesFilter = c.scheme === selectedScheme;
    }

    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete consumer "${name}"?`)) {
      deleteCustomer(id);
    }
  };

  const handleSendWhatsAppReminder = (customer: Customer) => {
    const status = calculateRefillStatus45Days(customer.lastRefillDate);
    const message = `Hello ${customer.name}, your Indane LPG Cylinder Refill is due for booking today (${status.badgeText}). Your last refill date was ${customer.lastRefillDate || 'N/A'}. Please reply or call our LPG Gas Agency to confirm your refill booking. Thank you!`;
    const encoded = encodeURIComponent(message);
    const cleanPhone = customer.phone.replace(/\D/g, '');
    const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank');
  };

  const handleExportCSV = () => {
    const headers = "ConsumerNo,SVNumber,Name,Phone,Address,CareOf,Scheme,CylinderType,LastBookingDate,NextBookingDate45Days,Status45Days\n";
    const rows = customers.map(c => {
      const status = calculateRefillStatus45Days(c.lastRefillDate);
      return `"${c.consumerNo}","${c.svNumber}","${c.name}","${c.phone}","${c.address}","${c.careOf}","${c.scheme}","${c.cylinderType}","${c.lastRefillDate || 'N/A'}","${status.nextBookingDate}","${status.badgeText}"`;
    }).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LPG_45Day_Refill_Customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };



  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-500" /> LPG Consumer Database
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage SV vouchers, PMUY Ujjwala classifications, & refill booking schedules</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export CSV
          </button>
          <button
            onClick={() => { setEditingCustomer(null); setIsAddModalOpen(true); }}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add New Consumer
          </button>
        </div>
      </div>

      {/* 45-DAY REFILL DUE HIGHLIGHT BANNER */}
      {dueOrOverdueCustomers.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-rose-950/70 border border-amber-500/40 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30 shrink-0">
              <AlertCircle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Refill Alert: {dueOrOverdueCustomers.length} Consumer(s) Due for Booking (45 Days Completed)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                <span className="font-semibold text-amber-400">{dueTodayCount} due today</span> • <span className="font-semibold text-rose-400">{overdueCount} overdue (45+ days)</span> without active booking requests.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedScheme('due_45_days')}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap"
          >
            View 45-Day Due List ({dueOrOverdueCustomers.length})
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedScheme('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedScheme === 'all' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All Connections ({customers.length})
          </button>
          
          {/* ELIGIBLE ONWARDS TAB */}
          <button
            onClick={() => setSelectedScheme('eligible_onwards')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${selectedScheme === 'eligible_onwards' ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md' : 'text-emerald-400 hover:text-emerald-300'}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Eligible Onwards</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950 text-emerald-300 border border-emerald-500/30">
              {eligibleOnwardsCount}
            </span>
          </button>

          {/* 45 DAYS DUE TAB */}
          <button
            onClick={() => setSelectedScheme('due_45_days')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${selectedScheme === 'due_45_days' ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 shadow-md' : 'text-amber-400 hover:text-amber-300'}`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>45+ Days Refill Due</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-950 text-amber-300 border border-amber-500/30">
              {dueOrOverdueCustomers.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedScheme('ujjwala')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1 ${selectedScheme === 'ujjwala' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Flame className="w-3.5 h-3.5" /> PMUY Ujjwala ({customers.filter(c => c.scheme === 'ujjwala').length})
          </button>
          <button
            onClick={() => setSelectedScheme('general')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedScheme === 'general' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            General Domestic ({customers.filter(c => c.scheme === 'general').length})
          </button>
          <button
            onClick={() => setSelectedScheme('commercial')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedScheme === 'commercial' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Commercial ({customers.filter(c => c.scheme === 'commercial').length})
          </button>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Quick Toggle for Keep Only Booking Eligible Onwards */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-400 font-semibold select-none hover:border-emerald-500/40 transition-colors">
            <input
              type="checkbox"
              checked={onlyKeepEligibleOnwards}
              onChange={e => setOnlyKeepEligibleOnwards(e.target.checked)}
              className="rounded accent-emerald-500 w-3.5 h-3.5"
            />
            <span>Only Keep Booking Eligible Onwards</span>
          </label>

          {/* Dynamic Refill Lock-in Interval Days Control */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs shadow-inner">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-slate-300 font-semibold">Refill Gap:</span>
            <input
              type="number"
              min={1}
              max={120}
              title="Set minimum days between booking refills (e.g. 45, 30, 15)"
              value={settings.minDaysBetweenRefills || 45}
              onChange={(e) => {
                const val = Math.max(1, parseInt(e.target.value) || 1);
                updateSettings({ minDaysBetweenRefills: val });
              }}
              className="w-12 bg-slate-900 border border-slate-700 rounded-md px-1.5 py-0.5 text-center font-extrabold text-brand-400 focus:border-brand-500 focus:outline-none font-mono text-xs"
            />
            <span className="text-slate-400 font-bold">Days</span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Consumer No, SV, Name or Mobile..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
            />
          </div>
        </div>

      </div>

      {/* DEDICATED SECTION FOR ELIGIBLE ONWARDS */}
      {(selectedScheme === 'eligible_onwards' || onlyKeepEligibleOnwards) && (
        <EligibleOnwardsSection onQuickBook={(customerId) => setQuickBookingCustomerId(customerId)} />
      )}

      {/* Customer Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Consumer & SV No</th>
                <th className="p-3.5">Consumer Name & Mobile</th>
                <th className="p-3.5">Scheme & Cylinder</th>
                <th className="p-3.5">S/O or C/O & Address</th>
                <th className="p-3.5">Last Booking Date</th>
                <th className="p-3.5">Next Booking Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    No consumer records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => {
                  const status45 = calculateRefillStatus45Days(customer.lastRefillDate, settings.minDaysBetweenRefills);
                  const eligibility = checkRefillEligibility(customer.lastRefillDate);

                  return (
                    <tr key={customer.id} className="hover:bg-slate-800/40 transition-colors">
                      
                      {/* Consumer No & SV */}
                      <td className="p-3.5">
                        <p className="font-mono font-bold text-brand-400 text-sm">{customer.consumerNo}</p>
                        <p className="text-[10px] text-slate-400 font-mono">SV: {customer.svNumber || 'N/A'}</p>
                        {customer.lpgId && (
                          <p className="text-[9px] text-emerald-400 font-mono">LPG ID: {customer.lpgId}</p>
                        )}
                      </td>

                      {/* Name & Mobile */}
                      <td className="p-3.5">
                        <p className="font-bold text-slate-100 text-sm">{customer.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">+91 {customer.phone}</p>
                      </td>

                      {/* Scheme & Gas Provider */}
                      <td className="p-3.5 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            (customer.oilCompany || 'Indane Gas') === 'Bharat Gas' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            customer.oilCompany === 'HP Gas' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                            'bg-orange-500/20 text-orange-300 border border-orange-500/40'
                          }`}>
                            {customer.oilCompany || 'Indane Gas'}
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                            customer.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                            customer.scheme === 'commercial' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                            'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                          }`}>
                            {customer.scheme} ({customer.cylinderType})
                          </span>
                        </div>
                      </td>

                      {/* S/O or C/O & Address */}
                      <td className="p-3.5">
                        <p className="font-semibold text-brand-400">{customer.careOf}</p>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{customer.address}</p>
                      </td>

                      {/* Last Booking Date */}
                      <td className="p-3.5 font-mono text-slate-300 font-semibold">
                        {customer.lastRefillDate || 'Never Booked'}
                      </td>

                      {/* Booking Status */}
                      <td className="p-3.5">
                        <p className="font-mono font-bold text-slate-200 text-xs mb-1">
                          Next Booking Date: <span className="text-amber-400">{status45.nextBookingDate}</span>
                        </p>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status45.badgeColor}`}>
                          {status45.badgeText}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right space-x-1.5">
                        
                        {/* Quick Refill Booking Button - LOCKED if ineligible */}
                        {eligibility.isEligible ? (
                          <button
                            onClick={() => setQuickBookingCustomerId(customer.id)}
                            title="Book Refill Now for this Consumer"
                            className="px-2.5 py-1 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all inline-flex items-center gap-1"
                          >
                            <CalendarCheck className="w-3.5 h-3.5" /> Book Refill
                          </button>
                        ) : (
                          <button
                            disabled
                            title={`Refill Restricted: Consumer has not completed mandatory ${settings.minDaysBetweenRefills || 45} days interval (${eligibility.daysRemaining} days remaining until ${eligibility.nextDate})`}
                            className="px-2.5 py-1 bg-slate-800/90 text-slate-500 font-semibold text-[11px] rounded-lg border border-slate-700/80 cursor-not-allowed inline-flex items-center gap-1 opacity-70"
                          >
                            <Lock className="w-3.5 h-3.5 text-slate-500" /> Locked ({eligibility.daysRemaining}d Left)
                          </button>
                        )}

                        {/* Direct Call Customer Button */}
                        <a
                          href={`tel:${customer.phone.replace(/\D/g, '')}`}
                          title={`Direct Call Customer: +91 ${customer.phone}`}
                          className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg border border-emerald-500/30 transition-colors inline-flex items-center"
                        >
                          <PhoneCall className="w-4 h-4" />
                        </a>

                        <button
                          onClick={() => {
                            const b = bookings.find(x => x.customerId === customer.id || x.consumerNo === customer.consumerNo);
                            if (b) {
                              setSelectedMemoBooking(b);
                            } else {
                              const newMockMemo: Booking = {
                                id: `booking-${Date.now()}`,
                                bookingNo: `LPG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                                consumerNo: customer.consumerNo,
                                customerName: customer.name,
                                customerId: customer.id,
                                bookingDate: customer.lastRefillDate || new Date().toISOString().split('T')[0],
                                amount: (customer.cylinderType === '19kg' ? settings.refillPrice19kg : settings.refillPrice14kg) || 853.50,
                                status: 'delivered',
                                paymentStatus: 'paid',
                                scheme: customer.scheme || 'general',
                                cylinderType: customer.cylinderType || '14.2kg',
                                quantity: 1,
                                address: customer.address,
                                phone: customer.phone,
                                cashMemoNo: `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`
                              };
                              setSelectedMemoBooking(newMockMemo);
                            }
                          }}
                          title="Print Refill Cash Memo"
                          className="p-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 rounded-lg border border-brand-500/30 transition-colors inline-flex items-center cursor-pointer"
                        >
                          <Printer className="w-4 h-4 text-brand-400" />
                        </button>

                        <button
                          onClick={() => navigate(`/customers/${customer.id}`)}
                          title="View Full Profile"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors inline-flex items-center cursor-pointer"
                        >
                          <Eye className="w-4 h-4 text-brand-400" />
                        </button>
                        
                        <button
                          onClick={() => { setEditingCustomer(customer); setIsAddModalOpen(true); }}
                          title="Edit Profile"
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors inline-flex items-center"
                        >
                          <Edit3 className="w-4 h-4 text-sky-400" />
                        </button>

                        <button
                          onClick={() => handleDelete(customer.id, customer.name)}
                          title="Delete Record"
                          className="p-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors inline-flex items-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add or Edit Customer */}
      {isAddModalOpen && (
        <AddCustomerModal
          initialData={editingCustomer}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={(data) => {
            if (editingCustomer) {
              updateCustomer(editingCustomer.id, data);
            } else {
              addCustomer(data);
            }
          }}
        />
      )}

      {/* Modal for Quick Booking */}
      {quickBookingCustomerId && (
        <AddBookingModal
          preselectedCustomerId={quickBookingCustomerId}
          onClose={() => setQuickBookingCustomerId(null)}
          onSuccess={(bId) => {
            const b = bookings.find(x => x.id === bId);
            if (b) setSelectedMemoBooking(b);
          }}
        />
      )}

      {/* Cash Memo Modal */}
      {selectedMemoBooking && (
        <CashMemoModal
          booking={selectedMemoBooking}
          onClose={() => setSelectedMemoBooking(null)}
        />
      )}

    </div>
  );
};
