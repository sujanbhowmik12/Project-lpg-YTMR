import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: LucideIcon;
  color?: 'coral' | 'rose' | 'sunbeam' | 'melon' | 'seafoam' | 'neptune' | 'orange' | 'blue' | 'emerald' | 'amber';
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subText,
  icon: Icon,
  color = 'coral',
  trend,
  onClick
}) => {
  const colorStyles = {
    coral: 'from-coral-500/20 to-coral-900/10 text-coral border-coral-500/30 ring-coral-500/10',
    rose: 'from-rose-500/20 to-rose-900/10 text-rose border-rose-500/30 ring-rose-500/10',
    sunbeam: 'from-sunbeam-500/20 to-sunbeam-900/10 text-sunbeam border-sunbeam-500/30 ring-sunbeam-500/10',
    melon: 'from-melon-500/20 to-melon-900/10 text-melon border-melon-500/30 ring-melon-500/10',
    seafoam: 'from-seafoam-500/20 to-seafoam-900/10 text-seafoam border-seafoam-500/30 ring-seafoam-500/10',
    neptune: 'from-neptune-500/20 to-neptune-900/10 text-neptune-400 border-neptune-500/30 ring-neptune-500/10',
    orange: 'from-coral-500/20 to-coral-900/10 text-coral border-coral-500/30 ring-coral-500/10',
    blue: 'from-neptune-500/20 to-neptune-900/10 text-neptune-400 border-neptune-500/30 ring-neptune-500/10',
    emerald: 'from-melon-500/20 to-melon-900/10 text-melon border-melon-500/30 ring-melon-500/10',
    amber: 'from-sunbeam-500/20 to-sunbeam-900/10 text-sunbeam border-sunbeam-500/30 ring-sunbeam-500/10',
  };

  const iconBgStyles = {
    coral: 'bg-coral-500/20 text-coral',
    rose: 'bg-rose-500/20 text-rose',
    sunbeam: 'bg-sunbeam-500/20 text-sunbeam',
    melon: 'bg-melon-500/20 text-melon',
    seafoam: 'bg-seafoam-500/20 text-seafoam',
    neptune: 'bg-neptune-500/20 text-neptune-400',
    orange: 'bg-coral-500/20 text-coral',
    blue: 'bg-neptune-500/20 text-neptune-400',
    emerald: 'bg-melon-500/20 text-melon',
    amber: 'bg-sunbeam-500/20 text-sunbeam',
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${colorStyles[color]} bg-neptune-900/90 rounded-2xl p-5 border shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group relative overflow-hidden`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-black text-slate-100 mt-1 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${iconBgStyles[color]} group-hover:scale-110 transition-transform shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {subText && <span className="text-slate-400 font-medium">{subText}</span>}
        {trend && (
          <span className="bg-neptune-950 px-2 py-0.5 rounded text-[11px] font-semibold text-melon">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
