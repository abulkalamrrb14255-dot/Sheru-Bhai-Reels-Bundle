import React from 'react';
import { ShieldCheck, Zap, Sparkles, Check, Lock, Gift, Clock } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface PricingSectionProps {
  settings: StoreSettings;
  onBuyClick: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ settings, onBuyClick }) => {
  return (
    <section id="pricing" className="py-16 sm:py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-amber-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-3.5 h-3.5" />
            LIMITED TIME OFFER
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-400">Viral Vault</span> Today
          </h2>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            One single payment. Lifetime updates. Instant delivery straight to your email & WhatsApp.
          </p>
        </div>

        {/* The SINGLE Product Pricing Card */}
        <div className="relative group">
          {/* Glowing Animated Gradient Border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 via-purple-600 to-cyan-500 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 transition duration-500"></div>

          <div className="relative glass-card bg-[#0d0d18]/95 border-2 border-purple-500/50 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-lg shadow-md uppercase tracking-wider">
                  MASTER BUNDLE
                </span>
                <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-black px-3 py-1.5 rounded-lg uppercase flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5" /> FREE ₹12,000 BONUSES
                </span>
              </div>
              <span className="bg-red-500 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full animate-pulse shadow-md">
                SAVE 80%
              </span>
            </div>

            {/* Product Title */}
            <h3 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mb-2">
              SHERU BHAI VIRAL REELS BUNDLE
            </h3>
            <p className="text-sm text-gray-300 mb-6">
              Full collection of 2000+ AI lion and luxury reels + 4 Exclusive Creator Bonuses.
            </p>

            {/* Price Presentation */}
            <div className="bg-gradient-to-br from-purple-950/60 via-[#11111e] to-indigo-950/60 border border-white/10 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-1">
                  Special Promotional Price
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="text-gray-400 line-through text-xl sm:text-2xl font-bold">
                    ₹{settings.originalPrice}
                  </span>
                  <span className="text-4xl sm:text-5xl font-black text-amber-400 font-['Outfit'] tracking-tight">
                    ₹{settings.sellingPrice}/-
                  </span>
                  <span className="text-emerald-400 text-xs sm:text-sm font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Only ₹{settings.sellingPrice} today
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-right text-xs text-gray-400">
                <div className="font-semibold text-white">⚡ Instant Approval</div>
                <div>No recurring charges</div>
                <div>Lifetime access</div>
              </div>
            </div>

            {/* Highlights included */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
              {[
                '2000+ Ready-to-Post HD AI Reels',
                'No Editing Required - BGM & Subtitles Included',
                'No Watermark - 100% Verified Rights',
                'BONUS #1: 10 Categories Reel Pack (Worth ₹3,499)',
                'BONUS #2: YouTube Editing Tools Pack (Worth ₹2,999)',
                'BONUS #3: Instagram Growth E-Book 2026 (Worth ₹2,499)',
                'BONUS #4: Pro Video Editing Asset Vault (Worth ₹3,003)',
                'Instant WhatsApp & Email Download Access',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-200 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Large Animated Gradient Button */}
            <div className="flex flex-col items-center">
              <button
                onClick={onBuyClick}
                className="w-full sm:w-auto min-w-[320px] sm:min-w-[420px] glow-btn text-white font-black text-base sm:text-xl py-4 sm:py-5 px-8 rounded-2xl shadow-2xl cursor-pointer transform hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300 animate-bounce" />
                <span>🚀 BUY NOW FOR ₹197/- ONLY</span>
              </button>

              {/* Security badge under button as required */}
              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-gray-400 font-medium">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>🔒 100% SECURE CHECKOUT VIA UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
