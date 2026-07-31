import React from 'react';
import { X, Printer, CheckCircle2, Flame } from 'lucide-react';
import { Booking } from '../types';
import { useLPG } from '../context/LPGContext';

interface CashMemoModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const CashMemoModal: React.FC<CashMemoModalProps> = ({ booking, onClose }) => {
  const { settings, customers } = useLPG();

  if (!booking) return null;

  const customer = customers.find(c => c.id === booking.customerId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Modal Controls */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-500" />
            <h2 className="text-base font-bold text-slate-200">Refill Cash Memo & Invoice</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-md"
            >
              <Printer className="w-4 h-4" /> Print Cash Memo
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CASH MEMO CONTENT */}
        <div id="printable-memo" className="bg-white text-slate-900 p-6 rounded-xl font-sans text-xs space-y-4 shadow-inner border border-slate-300">
          
          {/* Memo Header */}
          <div className="text-center border-b-2 border-slate-900 pb-3">
            <div className="flex items-center justify-center gap-1.5 text-orange-600 font-extrabold text-lg uppercase tracking-wider">
              <span>🔥 {settings.oilCompany} LPG REFILL CASH MEMO</span>
            </div>
            <h3 className="font-bold text-sm text-slate-900 mt-1">{settings.agencyName}</h3>
            <p className="text-[11px] text-slate-600">Distributor Code: <strong>{settings.distributorCode}</strong> | GSTIN: 09AABCU9603R1ZM</p>
            <p className="text-[10px] text-slate-500">{settings.address} | Ph: {settings.phone}</p>
          </div>

          {/* Memo Info Row */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Cash Memo No.</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{booking.cashMemoNo || 'CM-2026-8841'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">Booking Ref No.</p>
              <p className="font-mono font-semibold text-slate-800">{booking.bookingNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Date & Time</p>
              <p className="font-semibold text-slate-800">{booking.bookingDate} | 10:30 AM</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">Payment Status</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${booking.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Consumer Details */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer No:</span>
              <strong className="font-mono font-bold text-slate-900">{booking.consumerNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer Name:</span>
              <strong className="text-slate-800">{booking.customerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SV Number:</span>
              <span className="font-mono text-slate-700">{customer?.svNumber || 'SV-2021-9941'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="text-slate-700 text-[11px] max-w-[240px] text-right">{booking.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheme Category:</span>
              <span className="capitalize font-semibold text-orange-600">{booking.scheme}</span>
            </div>
          </div>

          {/* Table of items */}
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                <th className="p-2">Item Description</th>
                <th className="p-2 text-center">Qty</th>
                <th className="p-2 text-right">Rate</th>
                <th className="p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-200">
                <td className="p-2 font-medium">LPG Refill Cylinder ({booking.cylinderType})</td>
                <td className="p-2 text-center font-bold">{booking.quantity}</td>
                <td className="p-2 text-right">₹{booking.amount.toFixed(2)}</td>
                <td className="p-2 text-right font-bold">₹{booking.amount.toFixed(2)}</td>
              </tr>
              {booking.scheme === 'ujjwala' && (
                <tr className="bg-orange-50 text-orange-900 border-b border-orange-200">
                  <td className="p-2 italic" colSpan={3}>Less: PMUY Govt Subsidy Discount</td>
                  <td className="p-2 text-right font-bold text-emerald-700">-₹{settings.subsidyAmount.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Row */}
          <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-lg font-bold text-sm">
            <span>NET AMOUNT RECEIVABLE:</span>
            <span className="text-emerald-400 text-base">₹{booking.amount.toFixed(2)}</span>
          </div>

          {/* Statutory & Safety Instructions */}
          <div className="text-[9px] text-slate-500 space-y-1 border-t border-slate-200 pt-2">
            <p><strong>Safety Note:</strong> Always check safety seal on delivery. Keep cylinder vertical in well-ventilated area.</p>
            <p><strong>Emergency Leak Helpline:</strong> Call 1906 (24x7 Toll Free)</p>
          </div>

          {/* Barcode Simulation */}
          <div className="pt-2 text-center border-t border-dashed border-slate-300">
            <div className="inline-block font-mono tracking-widest text-lg font-bold border-y-4 border-slate-900 px-4 py-0.5">
              ||| |||| | ||||| || |||||| |||
            </div>
            <p className="text-[9px] text-slate-400 mt-0.5">Authorized Agency Cashier Stamp & Signature</p>
          </div>

        </div>

      </div>
    </div>
  );
};
