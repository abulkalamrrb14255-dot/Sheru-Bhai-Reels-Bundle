import React from 'react';
import { Gift, Sparkles, CheckCircle, FolderArchive, ArrowRight } from 'lucide-react';
import { BonusItem } from '../types/store';

interface BonusesSectionProps {
  bonuses: BonusItem[];
  onBuyClick: () => void;
}

export const BonusesSection: React.FC<BonusesSectionProps> = ({ bonuses, onBuyClick }) => {
  return (
    <section id="bonuses" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#090912] to-transparent">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-purple-900/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5" />
            FREE INCLUDED TODAY
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            EXCLUSIVE CREATOR BONUSES
          </h2>
          <div className="mt-2 text-xl sm:text-2xl font-black text-amber-400 font-['Outfit']">
            (WORTH ₹12,000)
          </div>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Order right now for just ₹197 and unlock all 4 VIP bonuses completely free with your bundle.
          </p>
        </div>

        {/* 4 Premium Bonus Cards with Purple, Blue, Green, Golden Borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {bonuses.map((bonus, idx) => {
            // Colors per requirement: Purple, Blue, Green, Golden
            const borderColors = [
              'border-purple-500/40 hover:border-purple-400 group-hover:shadow-purple-900/40',
              'border-blue-500/40 hover:border-blue-400 group-hover:shadow-blue-900/40',
              'border-emerald-500/40 hover:border-emerald-400 group-hover:shadow-emerald-900/40',
              'border-amber-500/40 hover:border-amber-400 group-hover:shadow-amber-900/40',
            ];
            const badgeGradients = [
              'from-purple-600 to-indigo-600',
              'from-blue-600 to-cyan-600',
              'from-emerald-600 to-teal-600',
              'from-amber-500 to-yellow-600 text-black',
            ];

            return (
              <div
                key={bonus.id}
                className={`group glass-card rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between hover:-translate-y-2 hover:shadow-2xl ${
                  borderColors[idx % 4]
                }`}
              >
                <div>
                  {/* Top Badge & Number */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs font-black text-gray-400 uppercase tracking-widest">
                      BONUS #{bonus.number}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-md bg-gradient-to-r shadow ${
                        badgeGradients[idx % 4]
                      }`}
                    >
                      {bonus.badge}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <FolderArchive className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-amber-300 transition-colors">
                    {bonus.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-6">
                    {bonus.description}
                  </p>
                </div>

                {/* Bottom Value & Included Stamp */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-gray-400 block font-semibold">Value</span>
                    <span className="text-sm font-bold text-gray-300 line-through">{bonus.worth}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded uppercase">
                      FREE TODAY
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA banner under bonuses */}
        <div className="mt-12 text-center">
          <button
            onClick={onBuyClick}
            className="glow-gold-btn text-black font-black text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-xl cursor-pointer transform hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <span>GET SHERU BHAI BUNDLE + ALL 4 BONUSES FOR ₹197</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
