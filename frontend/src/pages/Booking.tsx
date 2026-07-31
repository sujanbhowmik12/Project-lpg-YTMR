import React, { useState } from 'react';
import { 
  CalendarCheck, 
  PlusCircle, 
  Search, 
  Printer, 
  Truck, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { useLPG } from '../context/LPGContext';
import { Booking as BookingType, BookingStatus } from '../types';
import { AddBookingModal } from '../components/AddBookingModal';
import { CashMemoModal } from '../components/CashMemoModal';
import { AssignDeliveryModal } from '../components/AssignDeliveryModal';

export const Booking: React.FC = () => {
  const { bookings, updateBookingStatus } = useLPG();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [memoBooking, setMemoBooking] = useState<BookingType | null>(null);
  const [assignBooking, setAssignBooking] = useState<BookingType | null>(null);

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.bookingNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.consumerNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.includes(searchTerm);

    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-brand-500" /> Refill Booking Module
          </h1>
          <p className="text-xs text-slate-400 mt-1">Manage cylinder refill requests, auto booking numbers, & Cash Memos</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-brand-500/20 flex items-center gap-1.5 transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Create Refill Booking
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs overflow-x-auto">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedStatus === 'all' ? 'bg-brand-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            All Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setSelectedStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedStatus === 'pending' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </button>
          <button
            onClick={() => setSelectedStatus('out_for_delivery')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedStatus === 'out_for_delivery' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Out for Delivery ({bookings.filter(b => b.status === 'out_for_delivery').length})
          </button>
          <button
            onClick={() => setSelectedStatus('delivered')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${selectedStatus === 'delivered' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Delivered ({bookings.filter(b => b.status === 'delivered').length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Booking No, Consumer Name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-all"
          />
        </div>

      </div>

      {/* Bookings Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3.5">Booking Ref</th>
                <th className="p-3.5">Consumer Details</th>
                <th className="p-3.5">Scheme & Type</th>
                <th className="p-3.5">Booking Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Delivery Boy</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredBookings.map(b => (
                <tr key={b.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-brand-400 text-sm">{b.bookingNo}</td>
                  <td className="p-3.5">
                    <p className="font-bold text-slate-100">{b.customerName}</p>
                    <p className="text-[10px] text-slate-400 font-mono">{b.consumerNo} • +91 {b.phone}</p>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${b.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400' : 'bg-sky-500/20 text-sky-400'}`}>
                      {b.scheme} ({b.cylinderType})
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{b.bookingDate}</td>
                  <td className="p-3.5 font-bold text-emerald-400 text-sm">₹{b.amount.toFixed(2)}</td>
                  <td className="p-3.5">
                    {b.deliveryBoyName ? (
                      <span className="text-sky-400 font-semibold">{b.deliveryBoyName}</span>
                    ) : (
                      <span className="text-slate-500 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      b.status === 'delivered' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                      b.status === 'out_for_delivery' ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' :
                      b.status === 'assigned' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                      'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {b.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => setAssignBooking(b)}
                      title="Assign Delivery Boy"
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-sky-400 text-[11px] font-semibold rounded-lg border border-slate-700 transition-colors inline-flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" /> Dispatch
                    </button>
                    <button
                      onClick={() => setMemoBooking(b)}
                      title="Print Cash Memo Invoice"
                      className="px-2.5 py-1 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 text-[11px] font-semibold rounded-lg border border-brand-500/30 transition-colors inline-flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Memo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddBookingModal
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={(bId) => {
            const b = bookings.find(x => x.id === bId);
            if (b) setMemoBooking(b);
          }}
        />
      )}

      {memoBooking && (
        <CashMemoModal
          booking={memoBooking}
          onClose={() => setMemoBooking(null)}
        />
      )}

      {assignBooking && (
        <AssignDeliveryModal
          booking={assignBooking}
          onClose={() => setAssignBooking(null)}
        />
      )}

    </div>
  );
};
