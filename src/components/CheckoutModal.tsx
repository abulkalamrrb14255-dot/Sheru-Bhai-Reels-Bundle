import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  X,
  Copy,
  Check,
  Upload,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Smartphone,
  ExternalLink,
  AlertCircle,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { StoreSettings, Order } from '../types/store';
import { storeService } from '../services/storeService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  settings,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  // Generate Unique Order ID once on open
  const [orderId, setOrderId] = useState<string>('');
  useEffect(() => {
    setOrderId(`SB-2027-${Math.floor(10000 + Math.random() * 90000)}`);
  }, [isOpen]);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotData, setScreenshotData] = useState<string>('');
  const [screenshotName, setScreenshotName] = useState<string>('');

  // UI States
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'intent'>('qr');
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);

  // Generate dynamic UPI URI: upi://pay?pa=...&pn=...&am=197&cu=INR&tn=...
  const merchantUpi = settings.merchantUpiId || 'sherubhai@oksbi';
  const merchantName = settings.merchantDisplayName || 'SHERU BHAI STORE';
  const amount = settings.sellingPrice || 197;
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(merchantUpi)}&pn=${encodeURIComponent(
    merchantName
  )}&am=${amount}&cu=INR&tn=${encodeURIComponent(orderId)}`;

  // Generate QR Code
  useEffect(() => {
    if (!merchantUpi || !orderId) return;
    QRCode.toDataURL(upiIntentUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
      .then((url) => setQrCodeDataUrl(url))
      .catch((err) => console.error('QR generation error', err));
  }, [merchantUpi, merchantName, amount, orderId]);

  // Handle Screenshot Upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (PNG, JPG, JPEG, WEBP)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit. Please upload a smaller screenshot.');
      return;
    }

    setScreenshotName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotData(reader.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Copy UPI ID
  const handleCopyUpi = () => {
    navigator.clipboard.writeText(merchantUpi);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2500);
  };

  // Submit Payment Details
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please enter your full customer name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }
    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      setErrorMessage('Please enter your 12-digit UPI UTR / Transaction ID from your payment app');
      return;
    }
    if (!screenshotData) {
      setErrorMessage('Please upload your payment confirmation screenshot');
      return;
    }

    setSubmitting(true);

    const result = storeService.submitOrder({
      customerName: customerName.trim(),
      email: email.trim(),
      mobile: cleanMobile,
      utrNumber: cleanUtr,
      screenshotUrl: screenshotData,
    });

    setSubmitting(false);

    if (!result.success || !result.order) {
      setErrorMessage(result.error || 'Failed to submit payment. Please verify information.');
      return;
    }

    setSubmittedOrder(result.order);
    onOrderSuccess(result.order);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-xl overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0d0d17] border border-purple-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl my-6 max-h-[92vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* State: Submitted Confirmation View */}
        {submittedOrder ? (
          <div className="text-center py-6 sm:py-8 space-y-6">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Clock className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 block mb-1">
                ORDER RECEIVED • PENDING VERIFICATION
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
                YOUR PAYMENT IS UNDER VERIFICATION
              </h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto mt-2">
                Your product download will be unlocked after Admin approval. We are verifying your ₹197 transfer in our merchant bank account.
              </p>
            </div>

            {/* Order Summary Box */}
            <div className="bg-[#131322] border border-white/10 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-gray-400">Order ID:</span>
                <span className="font-mono font-bold text-amber-300">{submittedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Customer Name:</span>
                <span className="font-semibold text-white">{submittedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registered Email:</span>
                <span className="font-semibold text-white">{submittedOrder.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Registered Mobile:</span>
                <span className="font-semibold text-white">{submittedOrder.mobile}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">UTR / Ref Number:</span>
                <span className="font-mono font-semibold text-cyan-300">{submittedOrder.utrNumber}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-gray-400">Amount Paid:</span>
                <span className="font-black text-amber-400">₹{submittedOrder.amount}/-</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto glow-btn text-white font-bold text-sm px-6 py-3 rounded-xl cursor-pointer"
              >
                GOT IT, CLOSE
              </button>
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi Admin! I just submitted ₹197 payment for Order ID: ${submittedOrder.id} with UTR: ${submittedOrder.utrNumber}. Please approve!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-600/50 text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Notify On WhatsApp</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ) : (
          /* Normal Checkout View */
          <div>
            {/* Header: Product Preview & Pricing */}
            <div className="flex items-center gap-4 pb-5 border-b border-white/10">
              <div className="w-16 h-16 rounded-xl bg-black/60 border border-purple-500/30 overflow-hidden shrink-0 flex items-center justify-center p-1">
                <img
                  src={settings.productCoverUrl}
                  alt="Product Cover"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 bg-purple-900/50 border border-purple-400/30 px-2 py-0.5 rounded">
                    ORDER #{orderId}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                    SAVE 80%
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white font-['Outfit'] truncate mt-0.5">
                  {settings.productTitle || 'AI SHERU BHAI Reels Bundle 2027'}
                </h3>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs text-gray-400 line-through">₹{settings.originalPrice}</span>
                  <span className="text-xl font-black text-amber-400 font-['Outfit']">₹{amount}/-</span>
                  <span className="text-[11px] text-gray-400">All 4 Bonuses Included</span>
                </div>
              </div>
            </div>

            {/* UPI Payment Options Side By Side (Left: QR Code, Right: Direct UPI Apps) */}
            <div className="mt-5 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* LEFT: UPI QR CODE SCANNER */}
                <div className="md:col-span-6 bg-[#121220] border border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-between text-center relative overflow-hidden">
                  <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                      <QrCode className="w-4 h-4 text-cyan-400" />
                      <span>Option 1: Scan & Pay</span>
                    </span>
                    <span className="text-[11px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/30 px-2 py-0.5 rounded">
                      ₹{amount}/-
                    </span>
                  </div>

                  <div className="w-44 h-44 sm:w-48 sm:h-48 bg-white p-2.5 rounded-2xl shadow-xl flex items-center justify-center my-2">
                    {qrCodeDataUrl ? (
                      <img
                        src={qrCodeDataUrl}
                        alt="UPI Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-xs text-black animate-pulse">Generating QR...</div>
                    )}
                  </div>

                  <p className="text-[11px] text-gray-300 font-medium mt-1">
                    Scan with any UPI Scanner: GPay, PhonePe, Paytm, BHIM
                  </p>

                  {/* Merchant Details & Copy Button */}
                  <div className="w-full mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2 bg-black/40 p-2 rounded-xl text-left">
                    <div className="overflow-hidden">
                      <span className="text-[9px] text-gray-400 uppercase font-semibold block">UPI ID</span>
                      <span className="font-mono font-bold text-amber-300 text-xs truncate block">{merchantUpi}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    >
                      {copiedUpi ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-300" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* RIGHT: DIRECT UPI APP PAYMENT OPTIONS */}
                <div className="md:col-span-6 bg-[#121220] border border-purple-500/30 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wide">
                        <Smartphone className="w-4 h-4 text-purple-400" />
                        <span>Option 2: Direct UPI Apps</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                        1-Click Pay
                      </span>
                    </div>

                    <p className="text-xs text-gray-300 mb-3">
                      Tap below to open your installed UPI app prefilled with <strong className="text-amber-400">₹{amount}</strong>:
                    </p>

                    {/* Direct Apps Grid: Google Pay, PhonePe, Paytm, Other UPI */}
                    <div className="space-y-2 mb-3">
                      {/* Google Pay */}
                      <a
                        href={upiIntentUrl}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-blue-950/60 to-black hover:from-blue-900/80 border border-blue-500/40 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all transform hover:scale-[1.02] shadow"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-black font-black text-xs">
                            G
                          </div>
                          <span>Pay via Google Pay</span>
                        </div>
                        <span className="text-amber-400 font-mono text-xs font-black">₹{amount}</span>
                      </a>

                      {/* PhonePe */}
                      <a
                        href={upiIntentUrl}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-black hover:from-purple-900/80 border border-purple-500/40 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all transform hover:scale-[1.02] shadow"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xs">
                            पे
                          </div>
                          <span>Pay via PhonePe</span>
                        </div>
                        <span className="text-amber-400 font-mono text-xs font-black">₹{amount}</span>
                      </a>

                      {/* Paytm */}
                      <a
                        href={upiIntentUrl}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-cyan-950/60 to-black hover:from-cyan-900/80 border border-cyan-500/40 text-white font-bold text-xs sm:text-sm flex items-center justify-between transition-all transform hover:scale-[1.02] shadow"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-black font-black text-[10px]">
                            Pay
                          </div>
                          <span>Pay via Paytm</span>
                        </div>
                        <span className="text-amber-400 font-mono text-xs font-black">₹{amount}</span>
                      </a>

                      {/* Any Other UPI App */}
                      <a
                        href={upiIntentUrl}
                        className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Smartphone className="w-4 h-4 text-gray-400" />
                          <span>Other UPI Apps (BHIM, CRED, Bank UPI)</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                      </a>
                    </div>
                  </div>

                  <div className="p-2 bg-black/40 rounded-xl border border-white/5 text-[11px] text-gray-400 text-center">
                    ⚡ After paying, enter your 12-digit UTR number below to receive instant access.
                  </div>
                </div>
              </div>
            </div>

              {/* PAYMENT SUBMISSION FORM */}
              <form onSubmit={handleSubmitPayment} className="space-y-4">
                <div className="border-t border-white/10 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Submit Payment Details for Verification
                    </h4>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      Email Address <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      WhatsApp Mobile Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">
                      UPI UTR / Transaction ID (12-digit) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 419827361092"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white placeholder-gray-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 transition-colors font-mono"
                    />
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Upload Payment Screenshot <span className="text-rose-400">*</span>
                  </label>
                  <label className="relative border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-black/30 hover:bg-black/50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleScreenshotChange}
                      className="sr-only"
                    />
                    {screenshotData ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={screenshotData}
                          alt="Screenshot Preview"
                          className="w-12 h-12 object-cover rounded-lg border border-white/20"
                        />
                        <div className="overflow-hidden flex-1 text-left">
                          <span className="text-xs font-bold text-white block truncate">{screenshotName}</span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Screenshot attached successfully
                          </span>
                        </div>
                        <span className="text-xs text-purple-300 hover:underline">Change</span>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-purple-400 mb-1" />
                        <span className="text-xs font-semibold text-white">Click to upload payment screenshot</span>
                        <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (Max 15MB)</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full glow-btn text-white font-black text-sm sm:text-base py-3.5 rounded-xl shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Submitting Details...</span>
                  ) : (
                    <>
                      <span>SUBMIT PAYMENT DETAILS</span>
                      <ArrowRight className="w-4 h-4 text-cyan-200" />
                    </>
                  )}
                </button>

                <div className="text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Your payment info is verified manually against merchant bank records</span>
                </div>
              </form>
            </div>
        )}
      </div>
    </div>
  );
};
