import React from 'react';
import { MessageCircle } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface WhatsAppButtonProps {
  settings: StoreSettings;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ settings }) => {
  const cleanNumber = (settings.whatsappNumber || '+919876543210').replace(/\D/g, '');
  const message = encodeURIComponent(
    settings.whatsappSupportMessage || 'Hi Sheru Bhai Store! I need assistance with the AI Reels Bundle.'
  );
  const waUrl = `https://wa.me/${cleanNumber}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-xl bg-black/80 border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Need Help? Chat with us on WhatsApp
      </span>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-600/40 hover:scale-110 active:scale-95 transition-all duration-300 relative"
        title="WhatsApp Support"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-black animate-pulse" />
        <MessageCircle className="w-7 h-7 fill-white" />
      </a>
    </div>
  );
};
