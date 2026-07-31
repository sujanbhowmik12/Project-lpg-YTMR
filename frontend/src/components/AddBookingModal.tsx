import React, { useState } from 'react';
import { X, CalendarCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useLPG } from '../context/LPGContext';

interface AddBookingModalProps {
  onClose: () => void;
  onSuccess: (bookingId: string) => void;
  preselectedCustomerId?: string;
}

export const AddBookingModal: React.FC<AddBookingModalProps> = ({ onClose, onSuccess, preselectedCustomerId }) => {
  const { customers, settings, addBooking, checkRefillEligibility } = useLPG();

  const [onlyEligibleOnwards, setOnlyEligibleOnwards] = useState<boolean>(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(
    preselectedCustomerId && customers.some(c => c.id === preselectedCustomerId)
      ? preselectedCustomerId
      : customers[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'cod'>('cod');

  const displayedCustomers = onlyEligibleOnwards
    ? customers.filter(c => checkRefillEligibility(c.lastRefillDate).isEligible)
    : customers;

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);
  const eligibility = selectedCustomer ? checkRefillEligibility(selectedCustomer.lastRefillDate) : { isEligible: true, daysRemaining: 0, nextDate: '' };

  // Calculate pricing
  let unitPrice = settings.refillPrice14kg;
  if (selectedCustomer?.cylinderType === '19kg') unitPrice = settings.refillPrice19kg;
  if (selectedCustomer?.cylinderType === '5kg') unitPrice = settings.refillPrice5kg;

  let totalAmount = unitPrice * quantity;
  let subsidy = 0;
  if (selectedCustomer?.scheme === 'ujjwala') {
    subsidy = settings.subsidyAmount * quantity;
    totalAmount = Math.max(0, totalAmount - subsidy);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Please select a consumer.");
      return;
    }

    try {
      const booking = addBooking(selectedCustomerId, quantity, paymentStatus);
      onSuccess(booking.id);
      onClose();
    } catch (err: any) {
      alert(err.message || "Failed to create booking.");
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-brand-500/20 text-brand-400 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Create Cylinder Refill Booking</h2>
              <p className="text-xs text-slate-400">Generates official booking ID & cash memo</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Select Customer Dropdown & Filter */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-400 font-semibold">Select Consumer *</label>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-emerald-400 font-medium">
                <input
                  type="checkbox"
                  checked={onlyEligibleOnwards}
                  onChange={e => setOnlyEligibleOnwards(e.target.checked)}
                  className="rounded accent-emerald-500"
                />
                <span>Only Eligible Onwards</span>
              </label>
            </div>
            <select
              value={selectedCustomerId}
              onChange={e => setSelectedCustomerId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
            >
              {displayedCustomers.map(c => (
                <option key={c.id} value={c.id}>
                  {c.consumerNo} - {c.name} ({c.scheme.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Customer Quick Summary & Eligibility Card */}
          {selectedCustomer && (
            <div className={`p-3 rounded-xl border ${eligibility.isEligible ? 'bg-slate-950/80 border-slate-800' : 'bg-rose-950/20 border-rose-800/60'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-200">{selectedCustomer.name}</h4>
                  <p className="text-slate-400">{selectedCustomer.address}</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Cylinder: <strong className="text-slate-300">{selectedCustomer.cylinderType}</strong> | Last Refill: <strong className="text-slate-300">{selectedCustomer.lastRefillDate}</strong>
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${selectedCustomer.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                  {selectedCustomer.scheme}
                </span>
              </div>

              {/* 15-day eligibility notification */}
              {!eligibility.isEligible ? (
                <div className="mt-2.5 p-2 bg-rose-500/10 text-rose-300 rounded-lg flex items-center gap-2 border border-rose-500/20 text-[11px]">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Refill restricted! Consumer eligible after <strong>{eligibility.daysRemaining} days</strong> ({eligibility.nextDate}).</span>
                </div>
              ) : (
                <div className="mt-2.5 p-2 bg-emerald-500/10 text-emerald-300 rounded-lg flex items-center gap-2 border border-emerald-500/20 text-[11px]">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Consumer is currently eligible for refill booking.</span>
                </div>
              )}
            </div>
          )}

          {/* Quantity & Payment Option */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Cylinder Quantity</label>
              <input
                type="number"
                min={1}
                max={4}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 font-bold focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Payment Mode</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value as 'paid' | 'cod')}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
              >
                <option value="cod">Cash On Delivery (COD)</option>
                <option value="paid">Prepaid / Online UPI</option>
              </select>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex justify-between text-slate-400">
              <span>Base Refill Rate ({selectedCustomer?.cylinderType}):</span>
              <span>₹{unitPrice.toFixed(2)} x {quantity}</span>
            </div>
            {subsidy > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>PMUY Subsidy Deduction:</span>
                <span>-₹{subsidy.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm text-slate-100 border-t border-slate-800 pt-1.5">
              <span>Net Amount Payable:</span>
              <span className="text-brand-400">₹{totalAmount.toFixed(2)}</span>
            </div>
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
              disabled={!eligibility.isEligible}
              className={`px-5 py-2 font-bold rounded-lg transition-all shadow-md ${
                eligibility.isEligible 
                  ? 'bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white shadow-brand-500/20' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 opacity-60'
              }`}
            >
              {eligibility.isEligible ? 'Confirm Booking' : 'Booking Restricted (Not Eligible)'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
