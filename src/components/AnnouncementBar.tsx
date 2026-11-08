import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface AnnouncementBarProps {
  settings: StoreSettings;
  onBuyClick: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ settings, onBuyClick }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number; isEnded: boolean }>({
    hours: 5,
    minutes: 41,
    seconds: 20,
    isEnded: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      if (!settings.flashSaleDeadline) return;
      const target = new Date(settings.flashSaleDeadline).getTime();
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isEnded: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [settings.flashSaleDeadline]);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="sticky top-0 z-50 w-full bg-gradient-to-r from-purple-950 via-indigo-900 to-blue-950 border-b border-purple-500/30 text-white shadow-lg backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm font-medium">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </span>
          <span className="text-yellow-300 font-bold uppercase tracking-wide flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {settings.flashSaleText || '⚡ FLASH SALE ENDING SOON — GET AI SHERU BHAI REELS FOR JUST ₹197/- (80% OFF)'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 border border-purple-400/30 px-3 py-1 rounded-full shadow-inner font-mono text-xs">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            {timeLeft.isEnded ? (
              <span className="text-rose-400 font-bold tracking-wider">SALE ENDED</span>
            ) : (
              <div className="flex items-center gap-1 text-white font-bold">
                <span className="bg-purple-900/60 px-1.5 py-0.5 rounded text-yellow-300">{pad(timeLeft.hours)}</span>
                <span>:</span>
                <span className="bg-purple-900/60 px-1.5 py-0.5 rounded text-yellow-300">{pad(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="bg-purple-900/60 px-1.5 py-0.5 rounded text-cyan-300">{pad(timeLeft.seconds)}</span>
              </div>
            )}
          </div>

          <button
            onClick={onBuyClick}
            className="hidden md:inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-extrabold text-xs px-3 py-1 rounded-full shadow-md transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            CLAIM ₹197 OFFER
          </button>
        </div>
      </div>
    </div>
  );
};
