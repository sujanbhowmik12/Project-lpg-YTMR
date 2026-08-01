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
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Content (Sticky on desktop, Slide-over on mobile) */}
      <aside 
        className={`w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0 select-none transition-transform duration-300 z-50 ${
          isOpen ? 'fixed inset-y-0 left-0 translate-x-0 shadow-2xl' : 'hidden md:flex'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950">
            <div className="flex items-center gap-3">
              <img 
                src="/logoytmr.png" 
                alt="YTMR LPG Logo" 
                className="w-10 h-10 object-contain rounded-xl shadow-lg ring-1 ring-brand-500/40 bg-slate-900 p-0.5" 
              />
              <div>
                <h1 className="font-extrabold text-slate-100 text-base tracking-tight leading-none">
                  YTMR-<span className="text-brand-500">LPG</span>
                </h1>
                <p className="text-[11px] text-slate-400 font-mono mt-1">
                  Code: <span className="text-slate-300 font-semibold">{settings.distributorCode}</span>
                </p>
              </div>
            </div>

            {/* Mobile Close Button */}
            {onClose && (
              <button 
                onClick={onClose}
                className="md:hidden p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Admin Console Badge */}
          <div className="mx-3 my-3 p-2 bg-slate-900/90 rounded-lg border border-slate-800 flex items-center gap-2 text-xs">
            <ShieldAlert className="w-4 h-4 text-brand-400 shrink-0" />
            <span className="text-slate-300 font-semibold truncate">YTMR Admin Console</span>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-500 to-orange-600 text-white shadow-md shadow-orange-500/20 font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
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
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-brand-500/20 text-brand-400 font-bold text-xs flex items-center justify-center ring-1 ring-slate-700 shrink-0">
                {user?.name ? user.name.charAt(0) : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              title="Log Out"
              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
