import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: LucideIcon;
  color?: 'orange' | 'blue' | 'emerald' | 'amber' | 'purple' | 'rose';
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subText,
  icon: Icon,
  color = 'orange',
  trend,
  onClick
}) => {
  const colorStyles = {
    orange: 'from-orange-500/20 to-brand-500/5 text-brand-400 border-brand-500/20 ring-brand-500/10',
    blue: 'from-sky-500/20 to-blue-500/5 text-sky-400 border-sky-500/20 ring-sky-500/10',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20 ring-emerald-500/10',
    amber: 'from-amber-500/20 to-yellow-500/5 text-amber-400 border-amber-500/20 ring-amber-500/10',
    purple: 'from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/20 ring-purple-500/10',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20 ring-rose-500/10',
  };

  const iconBgStyles = {
    orange: 'bg-brand-500/20 text-brand-400',
    blue: 'bg-sky-500/20 text-sky-400',
    emerald: 'bg-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/20 text-purple-400',
    rose: 'bg-rose-500/20 text-rose-400',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${colorStyles[color]} bg-slate-900/90 rounded-xl p-5 border shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-100 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[color]} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subText && <span className="text-slate-400 font-medium">{subText}</span>}
        {trend && (
          <span className="bg-slate-800/80 px-2 py-0.5 rounded text-[11px] font-semibold text-emerald-400">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
