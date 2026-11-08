import React from 'react';
import { X, Shield, FileText, RefreshCcw, Mail, MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface PolicyModalProps {
  type: 'privacy' | 'terms' | 'refund' | 'contact' | null;
  onClose: () => void;
  settings: StoreSettings;
}

export const PolicyModal: React.FC<PolicyModalProps> = ({ type, onClose, settings }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0e0e18] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 border border-white/10 text-gray-300 flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {type === 'privacy' && (
          <div>
            <div className="flex items-center gap-2 text-purple-400 mb-3">
              <Shield className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Legal Document</span>
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit'] mb-4">Privacy Policy</h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>At <strong>SHERU BHAI STORE</strong>, your privacy is of paramount importance. This Privacy Policy outlines what information we collect when you order digital goods from our store.</p>
              <h4 className="font-bold text-white text-base">1. Information We Collect</h4>
              <p>We collect your full name, email address, mobile phone number, and UPI transaction reference (UTR) submitted during checkout solely to verify and fulfill your digital product access.</p>
              <h4 className="font-bold text-white text-base">2. Payment Security</h4>
              <p>We never process, store, or have access to your bank passwords, debit cards, or UPI PINs. All payments are initiated directly through your own authorized UPI applications.</p>
              <h4 className="font-bold text-white text-base">3. Data Retention & Protection</h4>
              <p>Your payment screenshot and order reference are stored in protected storage solely for merchant order verification and tax accounting purposes. We do not sell your personal data to third parties.</p>
            </div>
          </div>
        )}

        {type === 'terms' && (
          <div>
            <div className="flex items-center gap-2 text-blue-400 mb-3">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Agreement</span>
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit'] mb-4">Terms & Conditions</h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>By purchasing the <strong>SHERU BHAI VIRAL REELS BUNDLE</strong> (₹197), you acknowledge and agree to the following terms:</p>
              <h4 className="font-bold text-white text-base">1. Nature of Product</h4>
              <p>This is a purely digital downloadable product consisting of curated AI-generated vertical video files and creative digital assets. No physical box is shipped.</p>
              <h4 className="font-bold text-white text-base">2. License & Content Rights</h4>
              <p>Purchasers receive non-exclusive distribution and posting rights for their personal or client social media channels (Instagram, YouTube, Facebook, WhatsApp, X). You may not re-package or re-sell this complete vault as an unauthorized competitor bundle.</p>
              <h4 className="font-bold text-white text-base">3. Verification Requirement</h4>
              <p>Product download is unlocked upon genuine verification of funds in our merchant UPI account. Fraudulent, altered, or duplicate UTR submissions will be permanently blocked.</p>
            </div>
          </div>
        )}

        {type === 'refund' && (
          <div>
            <div className="flex items-center gap-2 text-amber-400 mb-3">
              <RefreshCcw className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Policy</span>
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit'] mb-4">Refund & Return Policy</h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>Due to the instant, irrevocable nature of digital downloadable assets (2,000+ MP4 files and asset folders), all sales are final once download access is unlocked.</p>
              <h4 className="font-bold text-white text-base">Special Refund Circumstances:</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Duplicate Payment:</strong> If you were accidentally charged twice for the same order, provide both bank UTR numbers to WhatsApp Support and the duplicate payment will be refunded within 24-48 business hours.</li>
                <li><strong>File Corrupted or Broken Link:</strong> If any download link fails, our support team will provide an alternate high-speed cloud mirror immediately.</li>
              </ul>
            </div>
          </div>
        )}

        {type === 'contact' && (
          <div>
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Mail className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Get In Touch</span>
            </div>
            <h3 className="text-2xl font-black text-white font-['Outfit'] mb-4">Contact Customer Support</h3>
            <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
              <p>Need help with your order or download access? Our customer success team is available Monday to Saturday (10:00 AM - 9:00 PM IST).</p>
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs text-gray-400 block">WhatsApp Official Support</span>
                    <a
                      href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(
                        settings.whatsappSupportMessage
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-400 hover:underline"
                    >
                      {settings.whatsappNumber}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <div>
                    <span className="text-xs text-gray-400 block">Email Support</span>
                    <span className="text-sm font-bold text-white">support@sherubhaistore.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
