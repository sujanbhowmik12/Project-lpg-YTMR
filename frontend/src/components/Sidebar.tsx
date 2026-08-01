import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Flame, 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  Truck, 
  BarChart3, 
  UserCheck, 
  Settings, 
  UserCircle, 
  LogOut, 
  ShieldAlert,
  ChevronDown,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLPG } from '../context/LPGContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { settings } = useLPG();

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Customers', icon: Users, path: '/customers' },
    { label: 'Refill Booking', icon: CalendarCheck, path: '/booking' },
    { label: 'Delivery Tracking', icon: Truck, path: '/delivery' },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/reports' },
    { label: 'Employees', icon: UserCheck, path: '/employees' },
    { label: 'Agency Settings', icon: Settings, path: '/settings' },
    { label: 'Profile', icon: UserCircle, path: '/profile' },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content (Sticky on desktop, Slide-over on mobile) */}
      <aside 
        className={`w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-screen sticky top-0 select-none transition-transform duration-300 z-50 shadow-sm ${
          isOpen ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-700 flex items-center justify-center text-white shadow-md shadow-brand-500/30">
                <Flame className="w-6 h-6 fill-current" />
              </div>
              <div>
                <h1 className="font-extrabold text-slate-900 text-base tracking-tight leading-none">
                  YTMR-<span className="text-brand-500">LPG</span>
                </h1>
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  Distributor Portal
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Organization / Agency Selector Dropdown Pill */}
          <div className="mx-3 my-3 p-3 bg-slate-100/80 hover:bg-slate-100 rounded-2xl border border-slate-200/60 flex items-center justify-between text-xs cursor-pointer transition-colors">
            <div className="truncate">
              <p className="font-bold text-slate-800 truncate">{settings.agencyName || 'YTMR Indane Agency'}</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Code: {settings.distributorCode}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          </div>

          {/* Navigation Menu */}
          <nav className="px-3 py-1 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-brand-500 text-white shadow-md shadow-brand-500/25 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer / Profile Box */}
        <div className="p-3 border-t border-slate-100 bg-white">
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-brand-500 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-brand-500/20 shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              title="Log Out"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
