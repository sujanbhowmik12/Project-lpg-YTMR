import React, { useState } from 'react';
import { 
  Truck, 
  UserCheck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Navigation, 
  AlertTriangle,
  Printer
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { CashMemoModal } from '../components/CashMemoModal';
import { Booking } from '../types';

export const Delivery: React.FC = () => {
  const { deliveries, employees, bookings, updateDeliveryStatus } = useLPG();
  const [selectedBoyFilter, setSelectedBoyFilter] = useState<string>('all');
  const [selectedMemoBooking, setSelectedMemoBooking] = useState<Booking | null>(null);

  const deliveryBoys = employees.filter(e => e.role === 'delivery_boy');

  const filteredDeliveries = deliveries.filter(d => {
    return selectedBoyFilter === 'all' || d.deliveryBoyId === selectedBoyFilter;
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Truck className="w-6 h-6 text-sky-400" /> Delivery Dispatch Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">Live tracking of delivery riders, assigned refill orders, & instant completions</p>
        </div>

        {/* Rider Filter */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 font-semibold">Filter Rider:</label>
          <select
            value={selectedBoyFilter}
            onChange={e => setSelectedBoyFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Delivery Agents ({deliveryBoys.length})</option>
            {deliveryBoys.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.areaAssigned})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Riders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {deliveryBoys.map(boy => {
          const boyAssignedDeliveries = deliveries.filter(d => d.deliveryBoyId === boy.id && d.status !== 'delivered');
          return (
            <div key={boy.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 font-bold flex items-center justify-center border border-sky-500/30">
                    {boy.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-xs">{boy.name}</h3>
                    <p className="text-[10px] text-slate-400">{boy.vehicleNumber || 'E-Rickshaw'}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {boy.status}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Assigned Area:</span>
                  <strong className="text-slate-200">{boy.areaAssigned}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Active Refills in Hand:</span>
                  <strong className="text-sky-400 font-bold">{boyAssignedDeliveries.length} orders</strong>
                </div>
                <div className="flex justify-between">
                  <span>Completed Lifetime:</span>
                  <strong className="text-emerald-400">{boy.deliveriesCompleted}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deliveries Action Board */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
          <Navigation className="w-4 h-4 text-sky-400" /> Active Dispatch Queue & Delivery Logs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDeliveries.map(del => (
            <div key={del.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-md space-y-3 hover:border-slate-700 transition-all">
              
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="font-mono font-bold text-brand-400 text-xs">{del.bookingNo}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  del.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                  del.status === 'out_for_delivery' ? 'bg-sky-500/20 text-sky-400' :
                  'bg-purple-500/20 text-purple-400'
                }`}>
                  {del.status.replace('_', ' ')}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="font-bold text-slate-100 text-sm">{del.customerName}</p>
                <p className="text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" /> {del.address}
                </p>
                <p className="text-slate-400 flex items-center gap-1 font-mono">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> +91 {del.phone}
                </p>
                <p className="text-[11px] text-sky-400 font-semibold mt-2">
                  Assigned Rider: {del.deliveryBoyName}
                </p>
                {del.notes && <p className="text-[10px] text-amber-400 italic">Note: {del.notes}</p>}
              </div>

              {/* Status Change & Cash Memo Buttons */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                {del.status === 'assigned' && (
                  <button
                    onClick={() => updateDeliveryStatus(del.id, 'out_for_delivery')}
                    className="flex-1 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5" /> Start Dispatch
                  </button>
                )}

                {del.status === 'out_for_delivery' && (
                  <button
                    onClick={() => updateDeliveryStatus(del.id, 'delivered')}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark Delivered
                  </button>
                )}

                {del.status === 'delivered' && (
                  <div className="flex-1 py-1 bg-emerald-500/10 text-emerald-400 text-center text-[10px] font-bold rounded-lg border border-emerald-500/20">
                    Delivered on {del.deliveredAt || 'Today'}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const b = bookings.find(x => x.bookingNo === del.bookingNo);
                    if (b) {
                      setSelectedMemoBooking(b);
                    } else {
                      setSelectedMemoBooking({
                        id: del.id,
                        bookingNo: del.bookingNo,
                        consumerNo: `IND-${del.id}`,
                        customerName: del.customerName,
                        customerId: 'cust-1',
                        bookingDate: new Date().toISOString().split('T')[0],
                        amount: 853.50,
                        status: del.status === 'delivered' ? 'delivered' : 'pending',
                        paymentStatus: 'paid',
                        scheme: 'general',
                        cylinderType: '14.2kg',
                        quantity: 1,
                        address: del.address,
                        phone: del.phone,
                        cashMemoNo: `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`
                      });
                    }
                  }}
                  title="Print Cash Memo"
                  className="px-2.5 py-1.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 font-bold text-[11px] rounded-lg border border-brand-500/30 transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Memo
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* Cash Memo Modal */}
      {selectedMemoBooking && (
        <CashMemoModal
          booking={selectedMemoBooking}
          onClose={() => setSelectedMemoBooking(null)}
        />
      )}

    </div>
  );
};
