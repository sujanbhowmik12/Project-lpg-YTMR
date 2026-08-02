import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Sparkles, CheckCircle2, RefreshCw, AlertCircle, FileText, Zap, Image as ImageIcon } from 'lucide-react';
import Tesseract from 'tesseract.js';
import { Customer, SchemeType } from '../types';

interface ScanCustomerModalProps {
  onClose: () => void;
  onScannedData: (data: Partial<Omit<Customer, 'id' | 'createdAt' | 'totalBookings'>>) => void;
}

export const ScanCustomerModal: React.FC<ScanCustomerModalProps> = ({ onClose, onScannedData }) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [rawOcrText, setRawOcrText] = useState<string>('');
  const [showRawText, setShowRawText] = useState<boolean>(false);

  // Extracted Parsed Form Data
  const [extractedData, setExtractedData] = useState<Partial<Omit<Customer, 'id' | 'createdAt' | 'totalBookings'>>>({
    consumerNo: '',
    svNumber: '',
    lpgId: '',
    name: '',
    phone: '',
    address: '',
    careOf: '',
    scheme: 'general',
    cylinderType: '14.2kg',
    oilCompany: 'Indane Gas',
    connectionCount: 1,
    status: 'active',
    aadhaarLinked: true,
    bankAccountLinked: true,
    documentUploaded: true,
    lastRefillDate: new Date().toISOString().split('T')[0],
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera preview on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err: any) {
      console.warn("Camera access warning:", err);
      setCameraError("Camera permission denied or camera not available. You can upload a photo of the document instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setImageSrc(dataUrl);
      stopCamera();
      processImageOCR(dataUrl);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = evt.target?.result as string;
        setImageSrc(result);
        stopCamera();
        processImageOCR(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Image Preprocessing Filter (Clean Scaling without Destructive Pixel Thresholding)
  const preprocessImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const cvs = document.createElement('canvas');
        // Scale to optimal OCR dimensions
        const maxDim = 1800;
        let scale = 1;
        if (img.width > maxDim || img.height > maxDim) {
          scale = Math.min(maxDim / img.width, maxDim / img.height);
        }
        cvs.width = Math.round(img.width * scale);
        cvs.height = Math.round(img.height * scale);
        const ctx = cvs.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, cvs.width, cvs.height);
        resolve(cvs.toDataURL('image/png'));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  // Optical Character Recognition Algorithm with 15-second Timeout
  const processImageOCR = async (rawImage: string) => {
    setScanning(true);
    setScanProgress(10);
    setStatusMessage("Scanning & analyzing document image...");

    // Create 15-second safety timeout promise
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), 15000);
    });

    try {
      const preprocessed = await preprocessImage(rawImage);
      setScanProgress(30);
      setStatusMessage("Reading document text...");

      const ocrPromise = Tesseract.recognize(
        preprocessed,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setScanProgress(30 + Math.round((m.progress || 0) * 60));
            }
          }
        }
      );

      // Race between Tesseract and 15-second timeout
      const result: any = await Promise.race([ocrPromise, timeoutPromise]);

      if (result && result.data && result.data.text) {
        const recognizedText = result.data.text;
        setRawOcrText(recognizedText);
        parseExtractedText(recognizedText);
      } else {
        fallbackParsing(rawImage);
      }
    } catch (err: any) {
      console.warn("OCR scanner notice:", err);
      fallbackParsing(rawImage);
    } finally {
      setScanProgress(100);
      setScanning(false);
    }
  };

  const parseExtractedText = (text: string) => {
    if (!text || text.trim().length === 0) {
      fallbackParsing('');
      return;
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const upperText = text.toUpperCase();

    // 1. Phone number (10 digits starting with 6,7,8,9)
    const phoneMatches = text.match(/\b[6-9]\d{9}\b/g) || [];
    const phone = phoneMatches.length > 0 ? phoneMatches[0] : '';

    // 2. 16-digit LPG ID (starts with 7000...)
    const lpgIdMatch = text.match(/\b7000\d{12}\b/) || text.match(/\b\d{16}\b/);
    const lpgId = lpgIdMatch ? lpgIdMatch[0] : '';

    // 3. Consumer Number (starts with 70..., CKS..., or labeled "CONSUMER NO: ...")
    let consumerNo = '';
    const consumerNoLabelMatch = text.match(/(CONSUMER\s*NO|CONSUMER\s*NUM|CONS\s*NO)[:\.\s]*([A-Z0-9]{6,14})/i);
    if (consumerNoLabelMatch) {
      consumerNo = consumerNoLabelMatch[2].trim();
    } else {
      const consumerNoMatch = text.match(/\b70\d{8,10}\b/) || text.match(/\b(IND|BGT|CK|CKS)\d{5,10}\b/i) || text.match(/\b\d{9,12}\b/);
      consumerNo = consumerNoMatch ? consumerNoMatch[0] : (lpgId ? lpgId.slice(-10) : '');
    }

    // 4. SV Number
    const svMatch = text.match(/\b(SV|CKS)[-\s]?\d{4,10}\b/i);
    const svNumber = svMatch ? svMatch[0] : '';

    // 5. Scheme
    let scheme: SchemeType = 'general';
    if (upperText.includes('UJJWALA') || upperText.includes('PMUY') || upperText.includes('FREE STOVE')) {
      scheme = 'ujjwala';
    } else if (upperText.includes('COMMERCIAL') || upperText.includes('19KG')) {
      scheme = 'commercial';
    }

    // 6. Oil Company
    let oilCompany: 'Indane Gas' | 'Bharat Gas' | 'HP Gas' = 'Indane Gas';
    if (upperText.includes('BHARAT')) oilCompany = 'Bharat Gas';
    if (upperText.includes('HP GAS') || upperText.includes('HINDUSTAN')) oilCompany = 'HP Gas';

    // 7. Care Of (W/O, S/O, C/O, D/O)
    let careOf = '';
    const careOfMatch = text.match(/(W\/O|S\/O|C\/O|D\/O)[:\s]+([A-Z\s]+)/i);
    if (careOfMatch) {
      careOf = `${careOfMatch[1].toUpperCase()}: ${careOfMatch[2].trim().toUpperCase()}`;
    }

    // 8. Full Name
    let name = '';
    const nameLabelMatch = text.match(/(NAME|CONSUMER NAME|CUSTOMER NAME)[:\.\s]+([A-Z\s]{3,30})/i);
    if (nameLabelMatch) {
      name = nameLabelMatch[2].replace(/[^A-Z\s]/gi, '').trim().toUpperCase();
    } else {
      const excludeWords = ['INDIAN', 'GAS', 'LPG', 'BHARAT', 'INDANE', 'HINDUSTAN', 'CONSUMER', 'NUMBER', 'ADDRESS', 'DATE', 'BILL', 'VOUCHER', 'WB019', 'KESHPUR', 'RAIPUR', 'PATNA', 'MAGRA'];
      for (const line of lines) {
        const cleanLine = line.replace(/[^A-Z\s]/gi, '').trim();
        const words = cleanLine.split(/\s+/);
        if (words.length >= 2 && words.length <= 4 && cleanLine.length >= 4) {
          if (!excludeWords.some(w => cleanLine.toUpperCase().includes(w))) {
            name = cleanLine.toUpperCase();
            break;
          }
        }
      }
    }

    // 9. Address
    let address = '';
    const pinMatch = text.match(/\b7\d{5}\b/);
    const addressLines = lines.filter(l => l.includes('P.O') || l.includes('VL:') || l.includes('BL:') || l.includes('WB') || l.includes('VILL') || l.includes('DIST') || l.includes('PIN'));
    if (addressLines.length > 0) {
      address = addressLines.join(', ').toUpperCase();
    } else if (pinMatch) {
      address = `PIN: ${pinMatch[0]}`;
    }

    setExtractedData(prev => ({
      ...prev,
      consumerNo: consumerNo || prev.consumerNo || '',
      svNumber: svNumber || prev.svNumber || '',
      lpgId: lpgId || prev.lpgId || '',
      phone: phone || prev.phone || '',
      name: name || prev.name || '',
      careOf: careOf || prev.careOf || '',
      address: address || prev.address || '',
      scheme: scheme,
      oilCompany: oilCompany
    }));
  };

  const fallbackParsing = (image: string) => {
    setExtractedData(prev => ({
      ...prev,
      consumerNo: prev.consumerNo || '',
      svNumber: prev.svNumber || '',
      name: prev.name || '',
      phone: prev.phone || '',
      address: prev.address || '',
      careOf: prev.careOf || '',
      scheme: "general",
      oilCompany: "Indane Gas"
    }));
  };

  const handleApplyExtractedData = () => {
    onScannedData(extractedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 select-none">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl relative text-slate-100 flex flex-col max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-2xl border border-brand-500/30">
              <Camera className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <span>Scan Customer Document via Camera or Photo</span>
                <span className="px-2 py-0.5 text-[10px] bg-brand-500/20 text-brand-300 font-bold rounded-full border border-brand-500/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-400" /> Auto Reader
                </span>
              </h2>
              <p className="text-xs text-slate-400">Capture camera photo or upload document image to auto-fill registration form</p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-slate-200 p-2 rounded-xl hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN CAMERA / PHOTO VIEWPORT */}
        <div className="space-y-4">
          
          <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden min-h-[240px] flex items-center justify-center">
            
            {/* Live Camera View */}
            {!imageSrc && (
              <div className="w-full relative flex flex-col items-center justify-center py-4">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full max-h-[280px] object-cover rounded-xl ${cameraActive ? 'block' : 'hidden'}`}
                />

                {/* Target Alignment Box for Camera */}
                {cameraActive && (
                  <div className="absolute inset-4 border-2 border-dashed border-brand-400/70 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-brand-300 font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" /> Hold Document inside Frame
                    </div>
                  </div>
                )}

                {!cameraActive && (
                  <div className="p-6 text-center space-y-3">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto text-slate-500 border border-slate-800">
                      <ImageIcon className="w-8 h-8 text-brand-400" />
                    </div>
                    {cameraError ? (
                      <p className="text-xs text-amber-400 font-medium max-w-sm">{cameraError}</p>
                    ) : (
                      <p className="text-xs text-slate-400">Click below to upload document photo or use camera...</p>
                    )}
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Re-open Camera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 text-xs font-bold text-white rounded-xl transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" /> Choose Photo File
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Captured or Uploaded Image Preview */}
            {imageSrc && (
              <div className="w-full relative">
                <img src={imageSrc} alt="Document capture" className="w-full max-h-[280px] object-contain rounded-xl" />
                <button
                  onClick={() => { setImageSrc(null); startCamera(); setScanning(false); setRawOcrText(''); }}
                  className="absolute top-3 right-3 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-950 text-white font-bold text-xs rounded-xl border border-slate-700 backdrop-blur-md flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retake / Select Another Photo
                </button>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {!imageSrc && cameraActive && (
                <button
                  onClick={handleCapturePhoto}
                  className="px-5 py-2.5 bg-gradient-to-r from-brand-500 to-orange-600 hover:from-brand-600 hover:to-orange-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Capture & Scan Photo
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 bg-brand-500/20 hover:bg-brand-500/30 text-brand-300 font-bold text-xs rounded-2xl border border-brand-500/40 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4 text-brand-400" /> Upload Document Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {scanning && (
              <div className="flex items-center gap-2 text-xs text-brand-400 font-bold animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{statusMessage} ({scanProgress}%)</span>
              </div>
            )}
          </div>

          {/* Direct Text Paste Box */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-brand-400" /> Or Paste / Type Document Text directly:
              </label>
              {rawOcrText && (
                <button
                  onClick={() => setShowRawText(!showRawText)}
                  className="text-[10px] text-brand-400 hover:underline font-bold"
                >
                  {showRawText ? 'Hide Text' : 'Show Text'}
                </button>
              )}
            </div>
            <textarea
              rows={2}
              placeholder="Paste document text here (e.g. SARASWATI MANNA 7044952922 9091406446 RAIPUR W/O HARIPADA MANNA)..."
              value={rawOcrText}
              onChange={e => {
                const txt = e.target.value;
                setRawOcrText(txt);
                parseExtractedText(txt);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-200 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* EXTRACTED FIELDS PREVIEW & VERIFICATION FORM */}
          {(imageSrc || rawOcrText) && !scanning && (
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h3 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Extracted Customer Details from Document
                </h3>
                <span className="text-[10px] text-slate-400">Verify extracted details below</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Consumer Name *</label>
                  <input
                    type="text"
                    value={extractedData.name || ''}
                    onChange={e => setExtractedData({ ...extractedData, name: e.target.value.toUpperCase() })}
                    placeholder="Consumer Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold uppercase focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Consumer No. *</label>
                  <input
                    type="text"
                    value={extractedData.consumerNo || ''}
                    onChange={e => setExtractedData({ ...extractedData, consumerNo: e.target.value })}
                    placeholder="Consumer Number"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-brand-400 font-mono font-bold focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    value={extractedData.phone || ''}
                    onChange={e => setExtractedData({ ...extractedData, phone: e.target.value })}
                    placeholder="10-Digit Mobile"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">S/O or W/O Name</label>
                  <input
                    type="text"
                    value={extractedData.careOf || ''}
                    onChange={e => setExtractedData({ ...extractedData, careOf: e.target.value })}
                    placeholder="Father / Husband Name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] text-slate-400 font-medium mb-1">Complete Address *</label>
                  <input
                    type="text"
                    value={extractedData.address || ''}
                    onChange={e => setExtractedData({ ...extractedData, address: e.target.value })}
                    placeholder="House / Village / Post Office / PIN"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={handleApplyExtractedData}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" /> Fill Registration Form With Extracted Data
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
