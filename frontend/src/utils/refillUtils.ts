export interface RefillStatus45Days {
  isDueOrOverdue: boolean;
  isDueToday: boolean;
  isOverdue: boolean;
  daysSinceLastRefill: number;
  daysOverdue: number;
  nextBookingDate: string; // YYYY-MM-DD
  badgeText: string;
  badgeColor: string;
}

export const calculateRefillStatus45Days = (lastRefillDateStr?: string, targetDays: number = 45): RefillStatus45Days => {
  if (!lastRefillDateStr) {
    return {
      isDueOrOverdue: true,
      isDueToday: false,
      isOverdue: true,
      daysSinceLastRefill: 999,
      daysOverdue: 999,
      nextBookingDate: 'Never Booked',
      badgeText: 'Never Booked (Overdue)',
      badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30'
    };
  }

  // Current date normalized to midnight
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Last refill date normalized to midnight
  const parts = lastRefillDateStr.split('-').map(Number);
  const lastDate = new Date(parts[0], parts[1] - 1, parts[2]);

  // Next booking date (targetDays after last refill)
  const nextDate = new Date(lastDate);
  nextDate.setDate(lastDate.getDate() + targetDays);

  const year = nextDate.getFullYear();
  const month = String(nextDate.getMonth() + 1).padStart(2, '0');
  const day = String(nextDate.getDate()).padStart(2, '0');
  const nextBookingDate = `${year}-${month}-${day}`;

  // Days elapsed since last refill
  const diffTimeMs = today.getTime() - lastDate.getTime();
  const daysSinceLastRefill = Math.floor(diffTimeMs / (1000 * 60 * 60 * 24));

  // Days overdue relative to targetDays threshold
  const daysOverdue = daysSinceLastRefill - targetDays;

  const isDueToday = daysOverdue === 0;
  const isOverdue = daysOverdue > 0;
  const isDueOrOverdue = daysOverdue >= 0;

  let badgeText = '';
  let badgeColor = '';

  if (isDueToday) {
    badgeText = `Due Today (${targetDays} Days)`;
    badgeColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';
  } else if (isOverdue) {
    badgeText = `Overdue by ${daysOverdue} Day${daysOverdue > 1 ? 's' : ''}`;
    badgeColor = 'bg-rose-500/20 text-rose-400 border border-rose-500/30';
  } else {
    const daysLeft = Math.abs(daysOverdue);
    badgeText = `${daysLeft} Days Left`;
    badgeColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
  }

  return {
    isDueOrOverdue,
    isDueToday,
    isOverdue,
    daysSinceLastRefill,
    daysOverdue,
    nextBookingDate,
    badgeText,
    badgeColor
  };
};
