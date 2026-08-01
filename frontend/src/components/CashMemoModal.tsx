import React, { useState } from 'react';
import { X, Printer, Flame, Download, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Booking } from '../types';
import { useLPG } from '../context/LPGContext';

interface CashMemoModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const CashMemoModal: React.FC<CashMemoModalProps> = ({ booking, onClose }) => {
  const { settings, customers } = useLPG();
  const [isDownloading, setIsDownloading] = useState(false);

  if (!booking) return null;

  const customer = customers.find(c => c.id === booking.customerId);

  const safeAmount = typeof booking.amount === 'number' ? booking.amount : (settings.refillPrice14kg || 853.50);
  const safeQuantity = booking.quantity || 1;
  const safeCashMemoNo = booking.cashMemoNo || `CM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const safeBookingNo = booking.bookingNo || 'LPG-2026-1001';
  const safeBookingDate = booking.bookingDate || new Date().toISOString().split('T')[0];
  const safeConsumerNo = booking.consumerNo || customer?.consumerNo || 'IND-804912';
  const safeCustomerName = booking.customerName || customer?.name || 'CONSUMER';
  const safeAddress = booking.address || customer?.address || 'Main Road, Agency Area';
  const safeCylinderType = booking.cylinderType || '14.2kg';
  const safeScheme = booking.scheme || 'general';
  const safePaymentStatus = booking.paymentStatus || 'paid';
  const safeSubsidy = settings.subsidyAmount || 200.00;

  const handleDownloadPDF = async () => {
    const memoElement = document.getElementById('printable-memo');
    if (!memoElement) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(memoElement, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth - 20; // 10mm margins on left & right
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 15, imgWidth, imgHeight);
      pdf.save(`Refill_Cash_Memo_${safeCashMemoNo}.pdf`);
    } catch (err) {
      console.error('PDF generation error, switching to print fallback:', err);
      handlePrint();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    const memoElement = document.getElementById('printable-memo');
    if (!memoElement) {
      window.print();
      return;
    }

    // Create a temporary hidden iframe for clean printing without blank page issues
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Collect all loaded stylesheets and style tags from current document
    const styleContent = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('\n');

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Refill Cash Memo - ${safeCashMemoNo}</title>
          ${styleContent}
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            html, body {
              background: #ffffff !important;
              color: #0f172a !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: 100% !important;
              font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              padding: 16px !important;
              box-sizing: border-box !important;
            }
            #printable-memo {
              width: 100% !important;
              max-width: 640px !important;
              margin: 0 auto !important;
              border: 2px solid #0f172a !important;
              border-radius: 12px !important;
              padding: 20px !important;
              background-color: #ffffff !important;
              color: #0f172a !important;
              box-shadow: none !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          </style>
        </head>
        <body>
          <div id="printable-memo">
            ${memoElement.innerHTML}
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 250);
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
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-lg cursor-pointer disabled:opacity-50"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              Download PDF
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Print Cash Memo
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE CASH MEMO CONTENT */}
        <div id="printable-memo" className="bg-white text-slate-900 p-6 rounded-xl font-sans text-xs space-y-4 shadow-inner border border-slate-300">
          
          {/* Memo Header with Official Website Logo */}
          <div className="text-center border-b-2 border-slate-900 pb-3.5 space-y-2">
            <div className="flex items-center justify-center gap-3">
              <img 
                src="/logoytmr.png" 
                alt="YTMR LPG Logo" 
                className="w-12 h-12 object-contain rounded-xl p-0.5 border border-slate-300 bg-white shadow-sm shrink-0" 
              />
              <div className="text-left">
                <div className="flex items-center gap-1 text-orange-600 font-extrabold text-base sm:text-lg uppercase tracking-wider">
                  <span>🔥 {settings.oilCompany || 'Indane Gas'} REFILL CASH MEMO</span>
                </div>
                <h3 className="font-black text-sm sm:text-base text-slate-900 leading-tight">{settings.agencyName}</h3>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">Distributor Code: <strong>{settings.distributorCode}</strong> | GSTIN: 09AABCU9603R1ZM</p>
            <p className="text-[10px] text-slate-500">{settings.address} | Ph: {settings.phone}</p>
          </div>

          {/* Memo Info Row */}
          <div className="grid grid-cols-2 gap-4 border-b border-slate-300 pb-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Cash Memo No.</p>
              <p className="font-mono font-bold text-slate-900 text-sm">{safeCashMemoNo}</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">Booking Ref No.</p>
              <p className="font-mono font-semibold text-slate-800">{safeBookingNo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-500 uppercase font-semibold">Date & Time</p>
              <p className="font-semibold text-slate-800">{safeBookingDate} | 10:30 AM</p>
              <p className="text-[10px] text-slate-500 uppercase font-semibold mt-2">Payment Status</p>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${safePaymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {safePaymentStatus}
              </span>
            </div>
          </div>

          {/* Consumer Details */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer No:</span>
              <strong className="font-mono font-bold text-slate-900">{safeConsumerNo}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Consumer Name:</span>
              <strong className="text-slate-800">{safeCustomerName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">SV Number:</span>
              <span className="font-mono text-slate-700">{customer?.svNumber || 'SV-2021-9941'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Address:</span>
              <span className="text-slate-700 text-[11px] max-w-[240px] text-right">{safeAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Scheme Category:</span>
              <span className="capitalize font-semibold text-orange-600">{safeScheme}</span>
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
                <td className="p-2 font-medium">LPG Refill Cylinder ({safeCylinderType})</td>
                <td className="p-2 text-center font-bold">{safeQuantity}</td>
                <td className="p-2 text-right">₹{safeAmount.toFixed(2)}</td>
                <td className="p-2 text-right font-bold">₹{safeAmount.toFixed(2)}</td>
              </tr>
              {safeScheme === 'ujjwala' && (
                <tr className="bg-orange-50 text-orange-900 border-b border-orange-200">
                  <td className="p-2 italic" colSpan={3}>Less: PMUY Govt Subsidy Discount</td>
                  <td className="p-2 text-right font-bold text-emerald-700">-₹{safeSubsidy.toFixed(2)}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Total Row */}
          <div className="flex justify-between items-center p-3 bg-slate-900 text-white rounded-lg font-bold text-sm">
            <span>NET AMOUNT RECEIVABLE:</span>
            <span className="text-emerald-400 text-base">₹{safeAmount.toFixed(2)}</span>
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

export default CashMemoModal;
