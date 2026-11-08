import React, { useState } from 'react';
import { Crown, Heart, ShieldCheck, Lock } from 'lucide-react';
import { PolicyModal } from './PolicyModals';
import { StoreSettings } from '../types/store';

interface FooterProps {
  settings: StoreSettings;
  onAdminClick: () => void;
  onTrackClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onAdminClick, onTrackClick }) => {
  const currentYear = new Date().getFullYear();
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'refund' | 'contact' | null>(null);

  return (
    <>
      <footer className="w-full bg-[#050509] border-t border-white/10 pt-16 pb-12 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-purple-600 to-blue-500 p-[2px]">
                  <div className="w-full h-full bg-[#0c0c16] rounded-[10px] flex items-center justify-center">
                    <Crown className="w-4 h-4 text-amber-400" />
                  </div>
                </div>
                <span className="font-extrabold text-xl text-white font-['Outfit']">
                  SHERU BHAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-cyan-400">STORE</span>
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md leading-relaxed mb-4">
                India's premier digital store for viral AI Lion and luxury lifestyle vertical reels. Empowering thousands of digital creators, video editors, and agency owners to dominate social media feeds.
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Distribution Rights & Safe UPI Banking</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold font-['Outfit'] text-sm uppercase tracking-wider mb-4">
                Quick Navigation
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <a href="#demo-reels" className="hover:text-purple-400 transition-colors">
                    Demo Reels (4K Previews)
                  </a>
                </li>
                <li>
                  <a href="#instagram-demo" className="hover:text-purple-400 transition-colors">
                    Pages Built With Our Content
                  </a>
                </li>
                <li>
                  <a href="#bonuses" className="hover:text-purple-400 transition-colors">
                    Free Creator Bonuses (Worth ₹12,000)
                  </a>
                </li>
                <li>
                  <button onClick={onTrackClick} className="hover:text-cyan-400 transition-colors text-left cursor-pointer">
                    Track Existing Order Status
                  </button>
                </li>
                <li>
                  <button onClick={onAdminClick} className="hover:text-purple-400 transition-colors text-left cursor-pointer flex items-center gap-1 text-gray-500">
                    <Lock className="w-3 h-3" /> Admin Portal
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal & Policies */}
            <div>
              <h4 className="text-white font-bold font-['Outfit'] text-sm uppercase tracking-wider mb-4">
                Legal & Customer Care
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm">
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    Terms & Conditions
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('refund')}
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    Refund and Return Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('contact')}
                    className="hover:text-purple-400 transition-colors cursor-pointer"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright & Disclaimer Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div>
              © {currentYear} <strong>SHERU BHAI STORE</strong>. All rights reserved.
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <span>Crafted for high virality with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      <PolicyModal type={modalType} onClose={() => setModalType(null)} settings={settings} />
    </>
  );
};
