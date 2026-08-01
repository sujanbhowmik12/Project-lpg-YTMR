import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: LucideIcon;
  variant?: 'pink' | 'green' | 'blue' | 'coral' | 'white';
  color?: string; // fallback color mapping
  trend?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subText,
  icon: Icon,
  variant = 'white',
  color,
  trend,
  onClick
}) => {
  // Map legacy color prop to variant if provided
  let activeVariant = variant;
  if (color === 'orange' || color === 'coral' || color === 'amber') activeVariant = 'coral';
  if (color === 'rose' || color === 'pink') activeVariant = 'pink';
  if (color === 'emerald' || color === 'melon' || color === 'green') activeVariant = 'green';
  if (color === 'blue' || color === 'neptune') activeVariant = 'blue';

  const cardStyles = {
    pink: 'bg-[#FF3875] text-white shadow-lg shadow-pink-500/20 border-none',
    green: 'bg-[#00C853] text-white shadow-lg shadow-emerald-500/20 border-none',
    blue: 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 border-none',
    coral: 'bg-[#FF5722] text-white shadow-lg shadow-orange-500/20 border-none',
    white: 'bg-white text-slate-800 border border-slate-200/80 shadow-card hover:shadow-card-hover',
  };

  const iconStyles = {
    pink: 'bg-white/20 text-white',
    green: 'bg-white/20 text-white',
    blue: 'bg-white/20 text-white',
    coral: 'bg-white/20 text-white',
    white: 'bg-brand-50 text-brand-600 border border-brand-100',
  };

  const isSolid = activeVariant !== 'white';

  return (
    <div 
      onClick={onClick}
      className={`${cardStyles[activeVariant]} rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative overflow-hidden flex flex-col justify-between`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs font-bold ${isSolid ? 'text-white/80' : 'text-slate-500'} tracking-tight`}>{title}</p>
          <h3 className="text-2xl sm:text-3xl font-black mt-1 tracking-tight leading-none">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${iconStyles[activeVariant]} group-hover:scale-110 transition-transform shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        {subText && (
          <span className={`font-semibold ${isSolid ? 'text-white/90' : 'text-slate-500'}`}>
            {subText}
          </span>
        )}
        {trend && (
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            isSolid 
              ? 'bg-white/25 text-white' 
              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          }`}>
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
