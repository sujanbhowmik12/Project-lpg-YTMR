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
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
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

  // Pie chart data matching StaffCentral signature colors (Pink, Blue, Green)
  const schemePieData = [
    { name: 'PMUY Ujjwala', value: ujjwalaCount || 2, color: '#FF3875' },
    { name: 'General Domestic', value: generalCount || 3, color: '#0066FF' },
    { name: 'Commercial 19kg', value: commercialCount || 1, color: '#00C853' },
  ];

  const handleQuickBook = (customerId: string) => {
    setPreselectedCustomerId(customerId);
    setIsAddBookingOpen(true);
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto space-y-6 select-none">
      
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5 flex-wrap">
            <span>Welcome back, {settings.agencyName}</span>
            <span className="px-2.5 py-0.5 text-xs bg-brand-100 text-brand-700 rounded-full font-bold border border-brand-200">
              {settings.oilCompany}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            YTMR LPG Distributor Portal • Live Operations Dashboard ({todayStr})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => { setPreselectedCustomerId(undefined); setIsAddBookingOpen(true); }}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-2xl shadow-md shadow-brand-500/25 text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Refill Booking</span>
          </button>
          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 border border-slate-200/80 shadow-sm transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-brand-500" />
            <span>Register Consumer</span>
          </button>
        </div>
      </div>

      {/* VIBRANT SIGNATURE METRIC CARDS (Matching StaffCentral Screenshot Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={totalCustomers}
          subText="Registered LPG Connections"
          icon={Users}
          variant="blue"
          trend="+12 this month"
        />
        <StatCard
          title="Ujjwala (PMUY)"
          value={ujjwalaCount}
          subText="Subsidized Connections"
          icon={Flame}
          variant="pink"
          trend="Free Stove Scheme"
        />
        <StatCard
          title="General Domestic"
          value={generalCount}
          subText="Standard 14.2kg Users"
          icon={Users}
          variant="green"
        />
        <StatCard
          title="Today's Bookings"
          value={todayBookingsCount}
          subText="Refill Requests Today"
          icon={CalendarCheck}
          variant="coral"
          trend="Live Count"
        />
        <StatCard
          title="45-Day Refill Due"
          value={due45Count}
          subText="Due Today / 45+ Days"
          icon={Clock}
          variant="white"
          trend="Action Needed"
        />
        <StatCard
          title="Pending Deliveries"
          value={pendingDeliveriesCount}
          subText="Out for Dispatch"
          icon={Truck}
          variant="white"
        />
      </div>

      {/* STAFFCENTRAL SIGNATURE HERO BANNER CARD */}
      <div className="bg-gradient-to-r from-brand-500 via-[#007DFE] to-[#00D2A0] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>YTMR LPG Pro Portal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            Manage your agency workflow & consumer refills efficiently
          </h2>
          <p className="text-xs sm:text-sm text-white/90 font-medium">
            Real-time synchronization with Indane DBTL portal, mandatory 45-day eligibility tracking, and instant cash memo printing.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => navigate('/booking')}
            className="px-5 py-3 bg-white text-brand-600 font-black text-xs rounded-2xl shadow-lg hover:bg-slate-100 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>Go to Refill Booking Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* DEDICATED SECTION: CONSUMERS ELIGIBLE FOR BOOKING ONWARDS */}
      <EligibleOnwardsSection onQuickBook={handleQuickBook} />

      {/* 45-DAY REFILL DUE & OVERDUE SECTION */}
      {due45Customers.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-3xl shadow-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Consumers Due for Booking Today & Overdue (45+ Days)</span>
                <span className="px-2.5 py-0.5 text-[11px] bg-amber-100 text-amber-700 font-bold rounded-full border border-amber-200">
                  {due45Count} Customers
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                These consumers have completed 45 days since their previous refill date and haven't placed a new order yet.
              </p>
            </div>

            <button
              onClick={() => navigate('/customers')}
              className="text-xs text-brand-600 hover:text-brand-700 font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              View Full Consumer Database &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Consumer Details</th>
                  <th className="p-3.5">Scheme & Cylinder</th>
                  <th className="p-3.5">Last Refill Date</th>
                  <th className="p-3.5">45-Day Status</th>
                  <th className="p-3.5 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {due45Customers.map(customer => {
                  const status45 = calculateRefillStatus45Days(customer.lastRefillDate);

                  return (
                    <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5">
                        <p className="font-bold text-slate-900">{customer.name}</p>
                        <p className="text-[10px] text-slate-500 font-mono">{customer.consumerNo} • +91 {customer.phone}</p>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${customer.scheme === 'ujjwala' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                          {customer.scheme} ({customer.cylinderType})
                        </span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-700 font-bold">
                        {customer.lastRefillDate || 'Never Booked'}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${status45.badgeColor}`}>
                          {status45.badgeText}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleQuickBook(customer.id)}
                          className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-[11px] rounded-xl shadow-sm transition-all inline-flex items-center gap-1 cursor-pointer"
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
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-500" /> Refill Cylinder Booking & Revenue Trends
              </h3>
              <p className="text-[11px] text-slate-500">Daily refill volumes for 14.2kg & 19kg cylinders</p>
            </div>
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-xl text-slate-600 font-bold border border-slate-200">
              Weekly View
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={refillTrendData}>
                <defs>
                  <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0066FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '1rem', color: '#0F172A', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="bookings" stroke="#0066FF" strokeWidth={3} fillOpacity={1} fill="url(#colorBookings)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Ujjwala vs General Distribution */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-card flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-pink-500" /> Consumer Scheme Mix
            </h3>
            <p className="text-[11px] text-slate-500">PMUY Ujjwala vs General connections</p>
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
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '1rem', color: '#0F172A', fontSize: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px', color: '#475569' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-[11px] text-slate-600 flex justify-between">
            <span>Ujjwala Subsidy Rate:</span>
            <strong className="text-emerald-600 font-bold">₹{settings.subsidyAmount.toFixed(2)} / cylinder</strong>
          </div>
        </div>

      </div>

      {/* RECENT BOOKINGS & DISPATCH TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-500" /> Recent Refill Booking Requests
            </h3>
            <p className="text-[11px] text-slate-500">Real-time booking list & printable cash memo generator</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-3.5">Booking Ref</th>
                <th className="p-3.5">Consumer No & Name</th>
                <th className="p-3.5">Scheme & Cylinder</th>
                <th className="p-3.5">Booking Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Cash Memo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map(b => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-brand-600">{b.bookingNo}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-900">{b.customerName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">{b.consumerNo}</p>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${b.scheme === 'ujjwala' ? 'bg-pink-100 text-pink-700 border border-pink-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                      {b.scheme} ({b.cylinderType})
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-600">{b.bookingDate}</td>
                  <td className="p-3.5 font-bold text-emerald-600">₹{b.amount.toFixed(2)}</td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'delivered' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                      b.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                      'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {b.status === 'delivered' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setSelectedBookingForMemo(b)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-xl border border-slate-200 transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5 text-brand-500" /> Cash Memo
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
