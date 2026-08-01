import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Fuel, 
  ShieldCheck, 
  PhoneCall, 
  User, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  CreditCard,
  FileText,
  Menu
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  onSearch?: (term: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, onToggleMobileMenu }) => {
  const { settings, customers, bookings, checkRefillEligibility } = useLPG();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter customers matching Search Term by Phone, LPG ID, Consumer No, SV No, Name
  const term = searchTerm.trim().toLowerCase();
  const searchClean = term.replace(/\D/g, '');

  const matchingCustomers = term ? customers.filter(c => {
    const phoneClean = c.phone.replace(/\D/g, '');
    const matchesPhone = c.phone.includes(term) || (searchClean.length >= 3 && phoneClean.includes(searchClean));
    const matchesLpgId = c.lpgId && c.lpgId.includes(term);
    const matchesConsumerNo = c.consumerNo.toLowerCase().includes(term);
    const matchesSvNumber = c.svNumber.toLowerCase().includes(term);
    const matchesName = c.name.toLowerCase().includes(term);

    return matchesPhone || matchesLpgId || matchesConsumerNo || matchesSvNumber || matchesName;
  }) : [];

  // Compute live notifications
  const dueRefillCustomers = customers.filter(c => checkRefillEligibility(c.lastRefillDate).isEligible);
  const pendingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'assigned');
  const unlinkedKycCustomers = customers.filter(c => !c.aadhaarLinked || !c.bankAccountLinked);

  const totalNotifications = dueRefillCustomers.length + pendingBookings.length + unlinkedKycCustomers.length;

  const handleSelectCustomer = (customerId: string) => {
    setIsSearchFocused(false);
    setSearchTerm('');
    navigate(`/customers/${customerId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    setIsSearchFocused(false);
    navigate(`/customers`);
  };

  return (
    <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none gap-2 shadow-sm">
      
      {/* Mobile Hamburger Button */}
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          title="Open Navigation Menu"
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-xl border border-slate-200 shrink-0 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Global Live Search Bar */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by Phone No, LPG ID, Consumer No, or SV No..."
            value={searchTerm}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsSearchFocused(true);
              if (onSearch) onSearch(e.target.value);
            }}
            className="w-full bg-slate-100/90 border border-slate-200/80 rounded-2xl pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all font-mono shadow-inner"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setIsSearchFocused(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && term && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            <div className="p-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 flex items-center justify-between">
              <span>Matching Consumers ({matchingCustomers.length})</span>
              <span className="text-brand-500 font-mono text-[10px]">Phone • LPG ID • Consumer No</span>
            </div>

            {matchingCustomers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No consumer found matching "<span className="text-slate-800 font-mono">{searchTerm}</span>"
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {matchingCustomers.slice(0, 8).map(c => {
                  const eligibility = checkRefillEligibility(c.lastRefillDate);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCustomer(c.id)}
                      className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-900">{c.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            (c.oilCompany || 'Indane Gas') === 'Bharat Gas' ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' :
                            'bg-orange-50 text-orange-600 border border-orange-200'
                          }`}>
                            {c.oilCompany || 'Indane Gas'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 flex-wrap">
                          <span className="text-brand-600 font-bold">{c.consumerNo}</span>
                          <span>SV: {c.svNumber || 'N/A'}</span>
                          {c.lpgId && <span className="text-emerald-600">LPG ID: {c.lpgId}</span>}
                          <span>Ph: +91 {c.phone}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {eligibility.isEligible ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            {eligibility.daysRemaining}d Left
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Live Agency Metrics Bar */}
      <div className="hidden md:flex items-center gap-3 text-xs font-medium">
        <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <Fuel className="w-4 h-4 text-orange-500" />
          <span className="text-slate-500">14.2kg Refill:</span>
          <span className="text-orange-600 font-bold">₹{settings.refillPrice14kg.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-100/90 px-3 py-1.5 rounded-2xl border border-slate-200/80 shadow-sm">
          <Fuel className="w-4 h-4 text-brand-500" />
          <span className="text-slate-500">Commercial 19kg:</span>
          <span className="text-brand-600 font-bold">₹{settings.refillPrice19kg.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-2xl border border-emerald-200 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Indane Portal Synced</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Support helpline */}
        <a 
          href="tel:1906"
          title="Emergency LPG Helpline: 1906"
          className="hidden md:flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs bg-slate-100/80 px-3 py-1.5 rounded-2xl border border-slate-200/80 transition-colors shadow-sm"
        >
          <PhoneCall className="w-3.5 h-3.5 text-brand-500" />
          <span>Helpline: <strong className="text-slate-900 font-mono">1906</strong></span>
        </a>

        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            title="System Alert Notifications"
            className="relative p-2 text-slate-600 hover:text-slate-900 bg-slate-100 rounded-2xl border border-slate-200 transition-all hover:bg-slate-200/80 shadow-sm"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-brand-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-md shadow-brand-500/30">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50 text-xs">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-500" />
                  <h3 className="font-bold text-slate-900 text-sm">System Notifications</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-brand-100 text-brand-700 font-extrabold rounded-full text-[10px] border border-brand-200">
                  {totalNotifications} Active
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                
                {/* Due Refill Alerts */}
                {dueRefillCustomers.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/customers'); }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{dueRefillCustomers.length} Consumers Eligible for Refill</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Completed mandatory 45-day interval and ready for booking onwards.
                      </p>
                    </div>
                  </div>
                )}

                {/* Pending Delivery Alerts */}
                {pendingBookings.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/delivery'); }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{pendingBookings.length} Pending Cylinder Deliveries</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Refill orders waiting to be assigned or dispatched to delivery riders.
                      </p>
                    </div>
                  </div>
                )}

                {/* Unlinked KYC Warnings */}
                {unlinkedKycCustomers.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/customers'); }}
                    className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div className="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0 mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{unlinkedKycCustomers.length} Unverified DBTL / KYC Profiles</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Consumers requiring Aadhaar or bank account linking for PMUY subsidy.
                      </p>
                    </div>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <div className="p-6 text-center text-slate-400 italic">
                    No active alert notifications. Everything is synchronized.
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

        {/* User Profile Badge */}
        <div 
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 rounded-full bg-brand-500 text-white shadow-md shadow-brand-500/20 flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-bold text-slate-800 truncate max-w-[100px]">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-brand-600 font-semibold">System Admin</p>
          </div>
        </div>

      </div>
    </header>
  );
};
