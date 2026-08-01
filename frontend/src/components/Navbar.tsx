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
    <header className="h-16 bg-neptune-950/90 backdrop-blur-md border-b border-neptune-800 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 select-none gap-2">
      
      {/* Mobile Hamburger Button */}
      {onToggleMobileMenu && (
        <button
          onClick={onToggleMobileMenu}
          title="Open Navigation Menu"
          className="md:hidden p-2 text-slate-300 hover:text-white bg-neptune-900 rounded-xl border border-neptune-800 shrink-0 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Global Live Search Bar */}
      <div className="relative flex-1 max-w-md" ref={searchRef}>
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-seafoam absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
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
            className="w-full bg-neptune-900 border border-neptune-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-coral-500 focus:ring-1 focus:ring-coral-500 transition-all font-mono"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => { setSearchTerm(''); setIsSearchFocused(false); }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && term && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-neptune-900 border border-neptune-800 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
            <div className="p-2.5 bg-neptune-950 border-b border-neptune-800 text-[11px] font-bold text-slate-400 flex items-center justify-between">
              <span>Matching Consumers ({matchingCustomers.length})</span>
              <span className="text-coral font-mono text-[10px]">Phone • LPG ID • Consumer No • SV</span>
            </div>

            {matchingCustomers.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 italic">
                No consumer found matching "<span className="text-slate-200 font-mono">{searchTerm}</span>"
              </div>
            ) : (
              <div className="divide-y divide-neptune-800/60">
                {matchingCustomers.slice(0, 8).map(c => {
                  const eligibility = checkRefillEligibility(c.lastRefillDate);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleSelectCustomer(c.id)}
                      className="p-3 hover:bg-neptune-800/60 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-slate-100">{c.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase ${
                            (c.oilCompany || 'Indane Gas') === 'Bharat Gas' ? 'bg-seafoam/20 text-seafoam border border-seafoam/30' :
                            'bg-coral/20 text-coral border border-coral/30'
                          }`}>
                            {c.oilCompany || 'Indane Gas'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-wrap">
                          <span className="text-coral font-bold">{c.consumerNo}</span>
                          <span>SV: {c.svNumber || 'N/A'}</span>
                          {c.lpgId && <span className="text-melon">LPG ID: {c.lpgId}</span>}
                          <span>Ph: +91 {c.phone}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        {eligibility.isEligible ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-melon/20 text-melon border border-melon/30">
                            Eligible
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neptune-800 text-slate-400 border border-neptune-700">
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
      <div className="hidden md:flex items-center gap-4 text-xs font-medium">
        <div className="flex items-center gap-2 bg-neptune-900 px-3 py-1.5 rounded-xl border border-neptune-800">
          <Fuel className="w-4 h-4 text-coral" />
          <span className="text-slate-400">14.2kg Refill:</span>
          <span className="text-coral font-bold">₹{settings.refillPrice14kg.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 bg-neptune-900 px-3 py-1.5 rounded-xl border border-neptune-800">
          <Fuel className="w-4 h-4 text-sunbeam" />
          <span className="text-slate-400">Commercial 19kg:</span>
          <span className="text-sunbeam font-bold">₹{settings.refillPrice19kg.toFixed(2)}</span>
        </div>
        <div className="flex items-center gap-2 bg-melon/10 text-melon px-2.5 py-1 rounded-xl border border-melon/20 text-[11px]">
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
          className="hidden md:flex items-center gap-1.5 text-slate-300 hover:text-white text-xs bg-neptune-900 px-3 py-1.5 rounded-xl border border-neptune-800 transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-coral" />
          <span>Helpline: <strong className="text-sunbeam font-mono">1906</strong></span>
        </a>

        {/* Notification Bell with Interactive Dropdown */}
        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            title="System Alert Notifications"
            className="relative p-2 text-slate-300 hover:text-white bg-neptune-900 rounded-xl border border-neptune-800 transition-all hover:border-coral-500/50"
          >
            <Bell className="w-4 h-4 text-sunbeam" />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-coral-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center animate-pulse shadow-md shadow-coral-500/40">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-neptune-900 border border-neptune-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs">
              <div className="p-3 bg-neptune-950 border-b border-neptune-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-sunbeam" />
                  <h3 className="font-bold text-slate-100 text-sm">System Notifications</h3>
                </div>
                <span className="px-2 py-0.5 bg-coral-500/20 text-coral font-extrabold rounded-full text-[10px] border border-coral-500/30">
                  {totalNotifications} Active
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-neptune-800/60">
                
                {/* Due Refill Alerts */}
                {dueRefillCustomers.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/customers'); }}
                    className="p-3 hover:bg-neptune-800/50 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 bg-melon/20 text-melon rounded-lg shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200">{dueRefillCustomers.length} Consumers Eligible for Refill</h4>
                      <p className="text-[11px] text-seafoam mt-0.5">
                        Completed mandatory 45-day interval and ready for booking onwards.
                      </p>
                    </div>
                  </div>
                )}

                {/* Pending Delivery Alerts */}
                {pendingBookings.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/delivery'); }}
                    className="p-3 hover:bg-neptune-800/50 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 bg-sunbeam/20 text-sunbeam rounded-lg shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200">{pendingBookings.length} Pending Cylinder Deliveries</h4>
                      <p className="text-[11px] text-seafoam mt-0.5">
                        Refill orders waiting to be assigned or dispatched to delivery riders.
                      </p>
                    </div>
                  </div>
                )}

                {/* Unlinked KYC Warnings */}
                {unlinkedKycCustomers.length > 0 && (
                  <div 
                    onClick={() => { setIsNotificationOpen(false); navigate('/customers'); }}
                    className="p-3 hover:bg-neptune-800/50 cursor-pointer transition-colors flex items-start gap-2.5"
                  >
                    <div className="p-1.5 bg-rose-500/20 text-rose rounded-lg shrink-0 mt-0.5">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-200">{unlinkedKycCustomers.length} Unverified DBTL / KYC Profiles</h4>
                      <p className="text-[11px] text-seafoam mt-0.5">
                        Consumers requiring Aadhaar or bank account linking for PMUY subsidy.
                      </p>
                    </div>
                  </div>
                )}

                {totalNotifications === 0 && (
                  <div className="p-6 text-center text-seafoam italic">
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
          className="flex items-center gap-2 pl-2 border-l border-neptune-800 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-full bg-coral-500/20 border border-coral-500/30 text-coral flex items-center justify-center font-bold text-xs">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <p className="text-xs font-semibold text-slate-200 truncate max-w-[100px]">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-sunbeam font-mono">System Admin</p>
          </div>
        </div>

      </div>
    </header>
  );
};
