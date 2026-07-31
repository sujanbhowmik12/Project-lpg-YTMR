import React, { useState } from 'react';
import { X, Truck, UserCheck } from 'lucide-react';
import { Booking } from '../types';
import { useLPG } from '../context/LPGContext';

interface AssignDeliveryModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const AssignDeliveryModal: React.FC<AssignDeliveryModalProps> = ({ booking, onClose }) => {
  const { employees, assignDelivery } = useLPG();

  const deliveryBoys = employees.filter(e => e.role === 'delivery_boy');
  const [selectedBoyId, setSelectedBoyId] = useState<string>(deliveryBoys[0]?.id || '');
  const [notes, setNotes] = useState<string>('');

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBoyId) {
      alert("Please select a delivery agent.");
      return;
    }
    assignDelivery(booking.id, selectedBoyId, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Assign Delivery Agent</h2>
              <p className="text-xs text-slate-400">Dispatch cylinder refill for delivery</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Booking Summary */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Booking Ref:</span>
              <strong className="font-mono text-slate-200">{booking.bookingNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consumer:</span>
              <strong className="text-slate-200">{booking.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Address:</span>
              <span className="text-slate-300 text-[11px] max-w-[200px] text-right truncate">{booking.address}</span>
            </div>
          </div>

          {/* Select Rider */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Select Delivery Boy / Rider *</label>
            <select
              value={selectedBoyId}
              onChange={e => setSelectedBoyId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
            >
              {deliveryBoys.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} ({emp.areaAssigned}) - {emp.status.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Delivery Notes */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Delivery Instructions / Remarks</label>
            <textarea
              rows={2}
              placeholder="e.g. Call before reaching, COD amount ₹853.50"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-sky-500 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-all shadow-md shadow-sky-500/20 flex items-center gap-1.5"
            >
              <UserCheck className="w-4 h-4" /> Dispatch Delivery
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
