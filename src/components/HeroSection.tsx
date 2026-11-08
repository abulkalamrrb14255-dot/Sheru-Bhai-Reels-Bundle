import React from 'react';
import { CheckCircle2, ShieldAlert, Sparkles, ArrowRight, Zap, Download } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface HeroSectionProps {
  settings: StoreSettings;
  onBuyClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onBuyClick }) => {
  const features = [
    '2000+ Viral Sheru Reels',
    'Trending AI Lion Videos',
    'Sheru Lifestyle & Attitude Reels',
    'Luxury Cars & Royal Lifestyle Videos',
    'Funny Animal Character Reels',
    '100% Copyright Free (only for content with verified distribution rights)',
    'High Quality Videos',
    'Ready To Post: With BGM & Text',
    'Lifetime Access',
    'Instant Delivery on Email and WhatsApp',
    'Free Quality Bonuses Worth ₹12,000/-',
  ];

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:py-20">
      {/* Background ambient neon glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/60 via-indigo-900/60 to-purple-900/60 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold shadow-lg shadow-purple-900/20 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>2027 BESTSELLER REELS BUNDLE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="text-emerald-300 font-bold">READY TO POST</span>
          </div>
        </div>

        {/* Main Heading */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5">
            <span className="block text-gray-200 text-2xl sm:text-3xl lg:text-4xl font-extrabold uppercase tracking-widest text-gray-400 mb-2">
              Get The Ultimate
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-300 to-cyan-400 drop-shadow-sm font-['Outfit']">
              AI SHERU BHAI
            </span>
            <span className="block text-white mt-1">
              Reels Bundle 2027 Edition
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-300 font-medium max-w-2xl mx-auto leading-relaxed">
            {settings.productSubtitle || 'Get PREMIUM HD Ready-to-Post AI Reels. No Editing Needed • No Watermark • Instant Access.'}
          </p>
        </div>

        {/* Main Grid: 1:1 Prominent Box Cover + 11 Features List */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left / Top: Square Product Cover (1:1, 420-520px desktop, full width mobile, object-fit contain, never crop) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative group w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[510px]">
              {/* Luxury Glow Backplate */}
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-65 transition duration-500 group-hover:duration-200 animate-pulse"></div>

              {/* 1:1 Aspect Ratio Container */}
              <div className="relative aspect-square w-full rounded-2xl p-2 bg-[#0d0d17]/90 border border-purple-500/40 shadow-2xl backdrop-blur-xl flex items-center justify-center overflow-hidden">
                <img
                  src={settings.productCoverUrl}
                  alt="Sheru Bhai Viral Reels Bundle 2027 Edition 3D Box Artwork"
                  className="w-full h-full object-contain rounded-xl select-none transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="eager"
                />

                {/* Floating Badges */}
                <div className="absolute top-4 left-4 bg-black/80 border border-amber-400/50 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl">
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-black tracking-wider text-amber-300 uppercase">2000+ AI REELS</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-purple-900/90 to-blue-900/90 border border-cyan-400/50 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl">
                  <Download className="w-4 h-4 text-cyan-300" />
                  <span className="text-[11px] font-black tracking-wider text-cyan-200 uppercase">INSTANT ACCESS</span>
                </div>
              </div>

              {/* Limited spots badge */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 rounded-full py-1.5 px-4 mx-auto w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Includes 100% Verified Content Rights & Royalty Free Audio</span>
              </div>
            </div>
          </div>

          {/* Right / Beside: Features Checklist + Direct Pricing Hook */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/25 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-5 border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base sm:text-lg">What You Will Get:</h3>
                    <p className="text-xs text-gray-400">Everything unlocked immediately upon verification</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-black px-2.5 py-1 rounded-md uppercase">
                    ALL-IN-ONE PACK
                  </span>
                </div>
              </div>

              {/* 11 Bullet Points as specified in prompt */}
              <div className="space-y-3 mb-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm sm:text-base text-gray-200 font-medium leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Banner */}
              <div className="bg-gradient-to-r from-purple-950/80 via-black to-indigo-950/80 border border-purple-500/40 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 line-through text-sm sm:text-base">₹{settings.originalPrice}</span>
                    <span className="text-2xl sm:text-3xl font-black text-amber-400 font-['Outfit']">₹{settings.sellingPrice}/-</span>
                    <span className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-bold px-2 py-0.5 rounded">
                      SAVE 80%
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">One-time payment • Lifetime access</p>
                </div>

                <button
                  onClick={onBuyClick}
                  className="w-full sm:w-auto glow-btn text-white font-black text-sm sm:text-base px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-xl cursor-pointer"
                >
                  <span>GET ACCESS NOW</span>
                  <ArrowRight className="w-4 h-4 text-cyan-200" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
