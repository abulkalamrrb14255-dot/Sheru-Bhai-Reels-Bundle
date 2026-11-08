import React from 'react';
import { Crown, ShieldCheck, Sparkles, Search, Lock } from 'lucide-react';

interface NavbarProps {
  onBuyClick: () => void;
  onTrackClick: () => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBuyClick, onTrackClick, onAdminClick }) => {
  return (
    <nav className="w-full bg-[#090911]/90 backdrop-blur-xl border-b border-white/10 sticky top-[41px] z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-500 p-[2px] shadow-lg shadow-purple-500/20">
            <div className="w-full h-full bg-[#0c0c16] rounded-[10px] flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Outfit']">
                SHERU BHAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-purple-400 to-cyan-400">STORE</span>
              </span>
              <span className="bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                2027
              </span>
            </div>
            <p className="text-[10px] text-gray-400 tracking-wider uppercase font-semibold hidden sm:block">
              Official AI Reels Superstore
            </p>
          </div>
        </div>

        {/* Desktop Quick Links */}
        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#demo-reels" className="hover:text-purple-400 transition-colors">Demo Reels</a>
          <a href="#instagram-demo" className="hover:text-purple-400 transition-colors">Creator Pages</a>
          <a href="#bonuses" className="hover:text-purple-400 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Free Bonuses (₹12K)
          </a>
          <a href="#reviews" className="hover:text-purple-400 transition-colors">Reviews</a>
          <a href="#faq" className="hover:text-purple-400 transition-colors">FAQ</a>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Order Tracking */}
          <button
            onClick={onTrackClick}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all cursor-pointer"
            title="Check verification status and download files"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Track Order</span>
          </button>

          {/* Admin Login */}
          <button
            onClick={onAdminClick}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
            title="Admin Login"
          >
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">Admin</span>
          </button>

          {/* Buy CTA */}
          <button
            onClick={onBuyClick}
            className="glow-btn flex items-center gap-2 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>BUY FOR ₹197</span>
          </button>
        </div>
      </div>
    </nav>
  );
};
