import React from 'react';
import { Star, ShieldCheck, Heart } from 'lucide-react';

export const RatingBanner: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 my-6">
      <div className="bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-amber-950/40 border border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xl shadow-amber-950/20 backdrop-blur-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          {/* Rating Block */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-amber-400 to-yellow-600 text-black font-black text-xl px-3.5 py-1.5 rounded-xl shadow-md font-['Outfit']">
              4.9/5
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-white font-bold text-sm ml-1.5">| Excellent</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-300 font-medium flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                <span>Trusted by Happy Customers</span>
              </p>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-300 font-medium">
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Creator Content</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <span className="text-cyan-400 font-bold">100%</span>
              <span>HD 1080p & 4K Quality</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              <span className="text-amber-400 font-bold">₹197</span>
              <span>All-In-One Price</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
