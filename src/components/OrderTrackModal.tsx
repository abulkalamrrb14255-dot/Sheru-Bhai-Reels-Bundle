import React, { useState } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  FolderArchive,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';
import { Order, StoreSettings } from '../types/store';
import { storeService } from '../services/storeService';

interface OrderTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
  initialQuery?: string;
}

export const OrderTrackModal: React.FC<OrderTrackModalProps> = ({
  isOpen,
  onClose,
  settings,
  initialQuery = '',
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialQuery) {
      return storeService.findOrder(initialQuery) || null;
    }
    return null;
  });
  const [hasSearched, setHasSearched] = useState(Boolean(initialQuery));
  const [reSubmitMode, setReSubmitMode] = useState(false);
  const [correctedUtr, setCorrectedUtr] = useState('');
  const [resubmitting, setResubmitting] = useState(false);
  const [resubmitSuccess, setResubmitSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const found = storeService.findOrder(searchQuery.trim());
    setSearchedOrder(found || null);
    setHasSearched(true);
    setReSubmitMode(false);
    setResubmitSuccess(false);
  };

  const handleResubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchedOrder) return;
    if (!correctedUtr.trim()) return;

    setResubmitting(true);
    const res = storeService.resubmitPayment(searchedOrder.id, correctedUtr.trim(), '');
    setResubmitting(false);

    if (res.success) {
      setResubmitSuccess(true);
      setReSubmitMode(false);
      const updated = storeService.findOrder(searchedOrder.id);
      if (updated) setSearchedOrder(updated);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e18] border border-white/15 rounded-3xl p-5 sm:p-8 shadow-2xl my-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-400 hover:text-white flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-black text-white font-['Outfit']">Track Order & Downloads</h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Enter your Order ID (e.g. SB-2027-1092), 10-digit mobile number, or email to check approval status.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            required
            placeholder="Enter Order ID, Mobile Number, or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-purple-400"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Track</span>
          </button>
        </form>

        {/* Search Results */}
        {hasSearched && (
          <div>
            {!searchedOrder ? (
              <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Order Found</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">
                  We could not find any order matching "{searchQuery}". Please check your Order ID or contact support on WhatsApp.
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* Order Summary Header */}
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                    <div>
                      <span className="text-[11px] text-gray-400 block">Order Reference</span>
                      <span className="font-mono font-bold text-amber-400 text-base">{searchedOrder.id}</span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {searchedOrder.status === 'PENDING' && (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 animate-pulse">
                          <Clock className="w-3.5 h-3.5" /> PENDING VERIFICATION
                        </span>
                      )}
                      {searchedOrder.status === 'APPROVED' && (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAYMENT APPROVED
                        </span>
                      )}
                      {searchedOrder.status === 'REJECTED' && (
                        <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5" /> PAYMENT REJECTED
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Customer</span>
                      <span className="font-semibold text-white truncate block">{searchedOrder.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Mobile</span>
                      <span className="font-semibold text-white block">{searchedOrder.mobile}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">UTR Number</span>
                      <span className="font-mono text-cyan-300 block truncate">{searchedOrder.utrNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase">Amount</span>
                      <span className="font-bold text-amber-400 block">₹{searchedOrder.amount}/-</span>
                    </div>
                  </div>
                </div>

                {/* STATUS: PENDING */}
                {searchedOrder.status === 'PENDING' && (
                  <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-3 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <Clock className="w-6 h-6 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="text-sm font-bold text-white">
                          YOUR PAYMENT IS UNDER VERIFICATION
                        </h4>
                        <p className="text-xs text-gray-300 mt-0.5">
                          Your product download will be unlocked after Admin approval. Once our merchant bank verifies the ₹197 transfer, this page will unlock your high-speed ZIP download links automatically.
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <a
                        href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                          `Hi Admin! Please verify my ₹197 payment for Order #${searchedOrder.id} with UTR: ${searchedOrder.utrNumber}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:underline"
                      >
                        <span>Need faster verification? Contact Admin on WhatsApp</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* STATUS: APPROVED -> UNLOCKED DOWNLOADS */}
                {searchedOrder.status === 'APPROVED' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white">Payment Verified & Approved!</h4>
                          <p className="text-xs text-emerald-200/80">
                            Approved by {searchedOrder.approvedBy || 'Admin'}. All files are unlocked for instant high-speed download.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Master Download Box */}
                    <div className="relative group">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-purple-600 rounded-2xl blur opacity-40"></div>
                      <div className="relative p-5 rounded-2xl bg-[#121222] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                          <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                            <FolderArchive className="w-6 h-6 text-purple-300" />
                          </div>
                          <div className="overflow-hidden">
                            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                              MASTER VAULT (2,000+ REELS)
                            </span>
                            <h4 className="text-sm font-bold text-white truncate">
                              {settings.mainBundleFileName || 'Sheru_Bhai_2000_AI_Reels_Master_Vault_2027.zip'}
                            </h4>
                            <span className="text-xs text-gray-400">
                              Size: {settings.mainBundleFileSize || '4.8 GB'} • 4K HD MP4
                            </span>
                          </div>
                        </div>

                        <a
                          href={settings.mainBundleZipUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto glow-btn text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          <span>DOWNLOAD YOUR REELS</span>
                        </a>
                      </div>
                    </div>

                    {/* Bonus Downloads Grid */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                        <span>Included Free Creator Bonuses (₹12,000 Value)</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { title: 'Bonus #1: 10 Categories Reel Pack', size: '2.1 GB', url: 'https://drive.google.com' },
                          { title: 'Bonus #2: YouTube Editing Tools Pack', size: '1.4 GB', url: 'https://drive.google.com' },
                          { title: 'Bonus #3: Instagram Growth E-Book 2026', size: '45 MB PDF', url: 'https://drive.google.com' },
                          { title: 'Bonus #4: Pro Editing Asset Vault', size: '1.8 GB', url: 'https://drive.google.com' },
                        ].map((b, i) => (
                          <div
                            key={i}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-2"
                          >
                            <div className="overflow-hidden text-left">
                              <h5 className="text-xs font-bold text-white truncate">{b.title}</h5>
                              <span className="text-[10px] text-gray-400">{b.size}</span>
                            </div>
                            <a
                              href={b.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Download className="w-3 h-3" />
                              <span>Get</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Cloud Mirror Backup */}
                    <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>Alternate Google Drive VIP Folder:</span>
                      <a
                        href={settings.backupGoogleDriveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>Open Drive Vault</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* STATUS: REJECTED -> RESUBMISSION FORM */}
                {searchedOrder.status === 'REJECTED' && (
                  <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/40 space-y-4 text-left">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-rose-300">
                          Payment Verification Failed
                        </h4>
                        <p className="text-xs text-gray-300 mt-1">
                          <strong>Admin Reason:</strong> {searchedOrder.rejectionReason || 'UTR not reflected in merchant bank account. Please verify 12-digit reference.'}
                        </p>
                      </div>
                    </div>

                    {resubmitSuccess ? (
                      <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Updated UTR submitted successfully! Status reset to PENDING for admin re-verification.</span>
                      </div>
                    ) : reSubmitMode ? (
                      <form onSubmit={handleResubmit} className="space-y-3 pt-2 border-t border-rose-500/20">
                        <label className="block text-xs font-bold text-white">
                          Enter Correct 12-Digit UTR / Transaction ID:
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 419827361092"
                          value={correctedUtr}
                          onChange={(e) => setCorrectedUtr(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={resubmitting}
                            className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                          >
                            {resubmitting ? 'Submitting...' : 'Re-Submit for Verification'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setReSubmitMode(false)}
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-rose-500/20">
                        <button
                          onClick={() => setReSubmitMode(true)}
                          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Re-Submit Correct UTR Number</span>
                        </button>
                        <a
                          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hi Admin! My Order #${searchedOrder.id} was rejected. I need help verifying my payment.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>Talk to Support on WhatsApp</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
