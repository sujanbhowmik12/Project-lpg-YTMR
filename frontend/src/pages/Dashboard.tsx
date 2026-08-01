import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Flame, 
  CalendarCheck, 
  Clock, 
  Truck, 
  TrendingUp, 
  PlusCircle, 
  Printer, 
  CheckCircle2, 
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLPG } from '../context/LPGContext';
import { StatCard } from '../components/StatCard';
import { AddBookingModal } from '../components/AddBookingModal';
import { AddCustomerModal } from '../components/AddCustomerModal';
import { CashMemoModal } from '../components/CashMemoModal';
import { EligibleOnwardsSection } from '../components/EligibleOnwardsSection';
import { Booking } from '../types';
import { calculateRefillStatus45Days } from '../utils/refillUtils';

export const Dashboard: React.FC = () => {
  const { customers, bookings, settings, addCustomer } = useLPG();
  const navigate = useNavigate();

  const [isAddBookingOpen, setIsAddBookingOpen] = useState(false);
  const [preselectedCustomerId, setPreselectedCustomerId] = useState<string | undefined>(undefined);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedBookingForMemo, setSelectedBookingForMemo] = useState<Booking | null>(null);

  // Metric counts:
  const totalCustomers = customers.length;
  const ujjwalaCount = customers.filter(c => c.scheme === 'ujjwala').length;
  const generalCount = customers.filter(c => c.scheme === 'general').length;
  const commercialCount = customers.filter(c => c.scheme === 'commercial').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookingsCount = bookings.filter(b => b.bookingDate === todayStr).length;
  
  const pendingDeliveriesCount = bookings.filter(b => b.status === 'pending' || b.status === 'assigned' || b.status === 'out_for_delivery').length;

  // Refill due or overdue customers count based on configured minDaysBetweenRefills
  const due45Customers = customers.filter(c => calculateRefillStatus45Days(c.lastRefillDate, settings.minDaysBetweenRefills).isDueOrOverdue);
  const due45Count = due45Customers.length;

  // Chart dataset for Monthly Refills Trend
  const refillTrendData = [
    { day: 'Mon', bookings: 24, revenue: 20480 },
    { day: 'Tue', bookings: 32, revenue: 27310 },
    { day: 'Wed', bookings: 28, revenue: 23890 },
    { day: 'Thu', bookings: 45, revenue: 38400 },
    { day: 'Fri', bookings: 38, revenue: 32430 },
    { day: 'Sat', bookings: 52, revenue: 44380 },
    { day: 'Sun', bookings: 19, revenue: 16210 },
  ];

  // Pie chart data for Ujjwala vs General using user palette (Coral, Neptune, Sunbeam)
  const schemePieData = [
    { name: 'PMUY Ujjwala', value: ujjwalaCount || 2, color: '#E9633E' }, // CORAL
    { name: 'General Domestic', value: generalCount || 3, color: '#537987' }, // NEPTUNE
    { name: 'Commercial 19kg', value: commercialCount || 1, color: '#EAAA42' }, // SUNBEAM
  ];

  const handleQuickBook = (customerId: string) => {
    setPreselectedCustomerId(customerId);
    setIsAddBookingOpen(true);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 select-none">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neptune-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 flex-wrap">
            <span>Welcome to {settings.agencyName}</span>
            <span className="px-2 py-0.5 text-xs bg-coral-500/20 text-coral rounded-md font-mono border border-coral-500/30">
              {settings.oilCompany}
            </span>
          </h1>
          <p className="text-xs text-seafoam mt-1">
            Distributor Management System • Live Operations Dashboard ({todayStr})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => { setPreselectedCustomerId(undefined); setIsAddBookingOpen(true); }}
            className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-coral-500 to-rose hover:from-coral-600 hover:to-rose-600 text-white font-bold rounded-xl shadow-lg shadow-coral-500/20 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Refill Booking</span>
          </button>
          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-neptune-900 hover:bg-neptune-800 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-neptune-800 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-sunbeam" />
            <span>Register Consumer</span>
          </button>
        </div>
      </div>

      {/* ROADMAP REQUIRED 6 METRIC STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          subText="Registered Connections"
          icon={Users}
          color="neptune"
          trend="+12 this month"
        />
        <StatCard
          title="Ujjwala (PMUY)"
          value={ujjwalaCount}
          subText="Subsidized Connections"
          icon={Flame}
          color="coral"
          trend="Free Stove Scheme"
        />
        <StatCard
          title="General Domestic"
          value={generalCount}
          subText="Standard 14.2kg Users"
          icon={Users}
          color="melon"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookingsCount}
          subText="Refill Requests Today"
          icon={CalendarCheck}
          color="sunbeam"
          trend="Live Count"
        />
        <StatCard
          title="45-Day Refill Due"
          value={due45Count}
          subText="Due Today / 45+ Days"
          icon={Clock}
          color="rose"
          trend="Action Needed"
        />
        <StatCard
          title="Pending Deliveries"
          value={pendingDeliveriesCount}
          subText="Out for Dispatch"
          icon={Truck}
          color="seafoam"
        />
      </div>

      {/* DEDICATED SECTION: CONSUMERS ELIGIBLE FOR BOOKING ONWARDS */}
      <EligibleOnwardsSection onQuickBook={handleQuickBook} />

      {/* 45-DAY REFILL DUE & OVERDUE SECTION */}
      {due45Customers.length > 0 && (
        <div className="bg-slate-900 border border-amber-500/30 rounded-2xl shadow-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>Consumers Due for Booking Today & Overdue (45+ Days)</span>
                <span className="px-2 py-0.5 text-[11px] bg-amber-500/20 text-amber-300 font-extrabold rounded-full border border-amber-500/30">
                  {due45Count} Customers
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                These consumers have completed 45 days since their previous refill date and haven't placed a new order yet.
              </p>
            </div>

            <button
              onClick={() => navigate('/customers')}
              className="text-xs text-brand-400 hover:text-brand-300 font-semibold flex items-center gap-1 self-start sm:self-auto"
            >
              View Full Consumer Database &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Consumer Details</th>
                  <th className="p-3">Scheme & Cylinder</th>
                  <th className="p-3">Last Refill Date</th>
                  <th className="p-3">45-Day Status</th>
                  <th className="p-3 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {due45Customers.map(customer => {
                  const status45 = calculateRefillStatus45Days(customer.lastRefillDate);

                  return (
                    <tr key={customer.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3">
                        <p className="font-bold text-slate-100">{customer.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{customer.consumerNo} • +91 {customer.phone}</p>
                      </td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${customer.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400' : 'bg-sky-500/20 text-sky-400'}`}>
                          {customer.scheme} ({customer.cylinderType})
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-300 font-semibold">
                        {customer.lastRefillDate || 'Never Booked'}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status45.badgeColor}`}>
                          {status45.badgeText}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleQuickBook(customer.id)}
                          className="px-3 py-1 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all inline-flex items-center gap-1"
                        >
                          <CalendarCheck className="w-3.5 h-3.5" /> Book Refill Now
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart - Weekly Booking & Revenue Trends */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-400" /> Refill Cylinder Booking & Revenue Trends
              </h3>
              <p className="text-[11px] text-slate-400">Daily refill volumes for 14.2kg & 19kg cylinders</p>
            </div>
            <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-lg text-slate-300 font-mono border border-slate-700">
              Weekly View
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={refillTrendData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E9633E" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#E9633E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#537987" fontSize={11} />
                <YAxis stroke="#537987" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16242B', borderColor: '#2F4954', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#E9633E" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Ujjwala vs General Distribution */}
        <div className="bg-neptune-900 border border-neptune-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-coral" /> Consumer Scheme Mix
            </h3>
            <p className="text-[11px] text-seafoam">PMUY Ujjwala vs General connections</p>
          </div>

          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={schemePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {schemePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#16242B', borderColor: '#2F4954', borderRadius: '0.75rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#AAC1AD' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-neptune-950 rounded-xl border border-neptune-800 text-[11px] text-slate-300 flex justify-between">
            <span>Ujjwala Subsidy Rate:</span>
            <strong className="text-melon font-bold">₹{settings.subsidyAmount.toFixed(2)} / cylinder</strong>
          </div>
        </div>

      </div>

      {/* RECENT BOOKINGS & DISPATCH TABLE */}
      <div className="bg-neptune-900 border border-neptune-800 rounded-2xl shadow-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-coral" /> Recent Refill Booking Requests
            </h3>
            <p className="text-[11px] text-seafoam">Real-time booking list & printable cash memo generator</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-neptune-950 text-slate-400 uppercase font-semibold border-b border-neptune-800">
              <tr>
                <th className="p-3">Booking Ref</th>
                <th className="p-3">Consumer No & Name</th>
                <th className="p-3">Scheme & Cylinder</th>
                <th className="p-3">Booking Date</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Cash Memo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neptune-800/60">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-neptune-800/40 transition-colors">
                  <td className="p-3 font-mono font-bold text-coral">{b.bookingNo}</td>
                  <td className="p-3">
                    <p className="font-semibold text-slate-100">{b.customerName}</p>
                    <p className="text-[10px] text-seafoam font-mono">{b.consumerNo}</p>
                  </td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold capitalize ${b.scheme === 'ujjwala' ? 'bg-coral-500/20 text-coral border border-coral-500/30' : 'bg-neptune-500/20 text-neptune-300 border border-neptune-500/30'}`}>
                      {b.scheme} ({b.cylinderType})
                    </span>
                  </td>
                  <td className="p-3 font-mono">{b.bookingDate}</td>
                  <td className="p-3 font-bold text-melon">₹{b.amount.toFixed(2)}</td>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'delivered' ? 'bg-melon/20 text-melon border border-melon/30' :
                      b.status === 'out_for_delivery' ? 'bg-neptune-500/20 text-neptune-300 border border-neptune-500/30' :
                      'bg-sunbeam/20 text-sunbeam border border-sunbeam/30'
                    }`}>
                      {b.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedBookingForMemo(b)}
                      className="px-2.5 py-1 bg-neptune-950 hover:bg-neptune-800 text-slate-200 text-[11px] font-medium rounded-lg border border-neptune-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-coral" /> Cash Memo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isAddBookingOpen && (
        <AddBookingModal
          preselectedCustomerId={preselectedCustomerId}
          onClose={() => { setIsAddBookingOpen(false); setPreselectedCustomerId(undefined); }}
          onSuccess={(bId) => {
            const b = bookings.find(x => x.id === bId);
            if (b) setSelectedBookingForMemo(b);
          }}
        />
      )}

      {isAddCustomerOpen && (
        <AddCustomerModal
          onClose={() => setIsAddCustomerOpen(false)}
          onSubmit={(cData) => addCustomer(cData)}
        />
      )}

      {selectedBookingForMemo && (
        <CashMemoModal
          booking={selectedBookingForMemo}
          onClose={() => setSelectedBookingForMemo(null)}
        />
      )}

    </div>
  );
};
