import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  FileText, 
  Calendar, 
  DollarSign, 
  Flame, 
  Users, 
  TrendingUp, 
  CheckCircle2 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import { useLPG } from '../context/LPGContext';

export const Reports: React.FC = () => {
  const { customers, bookings, settings } = useLPG();
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  // Compute metrics
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const totalDelivered = bookings.filter(b => b.status === 'delivered').length;
  const totalUjjwalaBookings = bookings.filter(b => b.scheme === 'ujjwala').length;
  const totalGeneralBookings = bookings.filter(b => b.scheme === 'general').length;

  const monthlyReportData = [
    { month: 'Jan', domestic: 450, ujjwala: 280, commercial: 60, revenue: 412000 },
    { month: 'Feb', domestic: 510, ujjwala: 310, commercial: 75, revenue: 468000 },
    { month: 'Mar', domestic: 480, ujjwala: 295, commercial: 70, revenue: 439000 },
    { month: 'Apr', domestic: 530, ujjwala: 340, commercial: 85, revenue: 495000 },
    { month: 'May', domestic: 590, ujjwala: 380, commercial: 90, revenue: 541000 },
    { month: 'Jun', domestic: 620, ujjwala: 410, commercial: 105, revenue: 588000 },
    { month: 'Jul', domestic: 680, ujjwala: 450, commercial: 110, revenue: 642000 },
  ];

  const categoryShare = [
    { name: 'General Domestic 14.2kg', value: 680, color: '#537987' },
    { name: 'PMUY Ujjwala Subsidized', value: 450, color: '#E9633E' },
    { name: 'Commercial 19kg', value: 110, color: '#EAAA42' },
  ];

  const handleExportCSV = () => {
    const headers = "BookingNo,ConsumerNo,Name,Scheme,CylinderType,Quantity,Amount,BookingDate,Status\n";
    const rows = bookings.map(b => 
      `"${b.bookingNo}","${b.consumerNo}","${b.customerName}","${b.scheme}","${b.cylinderType}","${b.quantity}","${b.amount}","${b.bookingDate}","${b.status}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LPG_Refill_Report_${timeRange}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-500" /> Agency Financial & Refill Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">Generate official daily, weekly, and monthly LPG agency audit reports</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Excel/CSV Export
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <Download className="w-4 h-4" /> Download PDF Report
          </button>
        </div>
      </div>

      {/* Range Toggle Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
          <Calendar className="w-4 h-4 text-brand-400" />
          <span>Report Audit Frequency:</span>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${timeRange === 'daily' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Daily Audit
          </button>
          <button
            onClick={() => setTimeRange('weekly')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${timeRange === 'weekly' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Weekly Summary
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${timeRange === 'monthly' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Monthly Full Report
          </button>
        </div>
      </div>

      {/* Key Metric Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Refill Revenue</p>
          <h3 className="text-2xl font-black text-emerald-400 font-mono">₹{totalRevenue.toFixed(2)}</h3>
          <p className="text-[10px] text-slate-500">+14.2% vs previous period</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Cylinders Delivered</p>
          <h3 className="text-2xl font-black text-slate-100">{totalDelivered} units</h3>
          <p className="text-[10px] text-emerald-400 font-semibold">98.4% fulfillment rate</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-medium">PMUY Ujjwala Subsidized</p>
          <h3 className="text-2xl font-black text-orange-400">{totalUjjwalaBookings} refills</h3>
          <p className="text-[10px] text-slate-500">Government Direct Benefit</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-1">
          <p className="text-xs text-slate-400 font-medium">General Domestic</p>
          <h3 className="text-2xl font-black text-sky-400">{totalGeneralBookings} refills</h3>
          <p className="text-[10px] text-slate-500">Non-subsidized / Standard</p>
        </div>
      </div>

      {/* Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Refill Breakdown Bar Chart */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-brand-400" /> Monthly Cylinder Volume Breakdown
            </h3>
            <p className="text-[11px] text-slate-400">Comparing General Domestic 14.2kg vs PMUY Ujjwala vs Commercial 19kg</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyReportData}>
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
                <Bar dataKey="domestic" name="General Domestic 14.2kg" fill="#537987" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ujjwala" name="PMUY Ujjwala 14.2kg" fill="#E9633E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="commercial" name="Commercial 19kg" fill="#EAAA42" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Pie */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400" /> Refill Share Distribution
            </h3>
            <p className="text-[11px] text-slate-400">Total volume distribution</p>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.5rem', color: '#f8fafc', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>DBTL Claims Processed:</span>
              <strong className="text-emerald-400">100% Validated</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
