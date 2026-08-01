import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Flame, 
  Printer, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  CalendarCheck, 
  CreditCard, 
  FileText,
  FileCheck
} from 'lucide-react';
import { CashMemoModal } from '../components/CashMemoModal';
import { useLPG } from '../context/LPGContext';
import { Customer, Booking } from '../types';

export const CustomerDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { customers, bookings, settings, checkRefillEligibility } = useLPG();

  const customer = customers.find((c: Customer) => c.id === id);
  const [selectedMemoBooking, setSelectedMemoBooking] = useState<Booking | null>(null);

  const [uploadedDocs, setUploadedDocs] = useState({
    aadhaar: true,
    rationCard: true,
    bankPassbook: true,
  });

  if (!customer) {
    return (
      <div className="p-12 text-center text-slate-400">
        <h2 className="text-lg font-bold text-slate-200">Customer Not Found</h2>
        <button onClick={() => navigate('/customers')} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg text-xs">
          Back to Customer Database
        </button>
      </div>
    );
  }

  const customerBookings = bookings.filter((b: Booking) => b.customerId === customer.id || b.consumerNo === customer.consumerNo);
  const eligibility = checkRefillEligibility(customer.lastRefillDate);

  const handlePrintProfile = () => {
    window.print();
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Top Controls */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          onClick={() => navigate('/customers')}
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customer List
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintProfile}
            className="px-3.5 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" /> Print KYC Passbook Profile
          </button>
        </div>
      </div>

      {/* PRINTABLE PROFILE CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Consumer Card & Subscription Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-orange-600 flex items-center justify-center font-extrabold text-white text-xl shadow-lg">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-100">{customer.name}</h2>
              <p className="text-xs text-brand-400 font-mono font-bold">{customer.consumerNo}</p>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                customer.scheme === 'ujjwala' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
              }`}>
                {customer.scheme} Category
              </span>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Subscription Voucher (SV):</span>
              <strong className="font-mono text-slate-200">{customer.svNumber}</strong>
            </div>
            {customer.lpgId && (
              <div className="flex justify-between">
                <span className="text-slate-400">16-Digit LPG ID:</span>
                <strong className="font-mono text-emerald-400">{customer.lpgId}</strong>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-400">Cylinder Type:</span>
              <strong className="text-slate-200">{customer.cylinderType}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Connection Bottle Count:</span>
              <strong className="text-slate-200">{customer.connectionCount === 2 ? 'DBC (2 Bottles)' : 'SBC (1 Bottle)'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Mobile Phone:</span>
              <strong className="font-mono text-slate-200">+91 {customer.phone}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Son of / Care of (S/O or C/O):</span>
              <strong className="text-slate-200">{customer.careOf}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Complete Address:</span>
              <span className="text-slate-300 text-right max-w-[180px]">{customer.address}</span>
            </div>
          </div>

          {/* Eligibility Indicator */}
          <div className={`p-3 rounded-xl border ${eligibility.isEligible ? 'bg-emerald-950/20 border-emerald-800/60 text-emerald-300' : 'bg-amber-950/20 border-amber-800/60 text-amber-300'} text-xs space-y-1`}>
            <p className="font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Refill Eligibility Status
            </p>
            <p className="text-[11px]">
              {eligibility.isEligible ? 'Consumer is currently eligible to book a refill.' : `Next booking eligible on ${eligibility.nextDate} (${eligibility.daysRemaining} days remaining).`}
            </p>
          </div>

        </div>

        {/* Right Columns: KYC Documents & Refill Booking History */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Document Upload & KYC Verification Status */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-brand-400" /> KYC Document Verification & DBTL Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Aadhaar Card</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Verified & Seeded</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Bank Passbook</p>
                  <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">DBTL Direct Active</p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">Ration / PMUY Proof</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Uploaded</p>
                </div>
                <Upload className="w-5 h-5 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Refill Booking History Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-brand-400" /> Complete Refill Booking & Payment History
            </h3>

            {customerBookings.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No refill bookings logged yet for this consumer.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3">Booking Ref</th>
                      <th className="p-3">Booking Date</th>
                      <th className="p-3">Cash Memo No</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Delivery Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {customerBookings.map((b: Booking) => (
                      <tr key={b.id}>
                        <td className="p-3 font-mono font-bold text-brand-400">{b.bookingNo}</td>
                        <td className="p-3 font-mono">{b.bookingDate}</td>
                        <td className="p-3 font-mono text-slate-300">
                          <button
                            type="button"
                            onClick={() => setSelectedMemoBooking(b)}
                            className="text-brand-400 hover:underline font-bold hover:text-brand-300 cursor-pointer"
                          >
                            {b.cashMemoNo || 'CM-2026-9901'}
                          </button>
                        </td>
                        <td className="p-3 font-bold text-emerald-400">₹{b.amount.toFixed(2)}</td>
                        <td className="p-3 uppercase font-semibold text-slate-300">{b.paymentStatus}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                            {b.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedMemoBooking(b)}
                            className="px-2.5 py-1 bg-brand-500/20 hover:bg-brand-500/30 text-brand-400 text-[11px] font-semibold rounded-lg border border-brand-500/30 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Printer className="w-3.5 h-3.5" /> Memo
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

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
