import React from 'react';
import { Share2, Check } from 'lucide-react';

export const PlatformSection: React.FC = () => {
  const platforms = [
    { name: 'Instagram', detail: 'Reels & Stories', color: 'from-pink-500 to-purple-600' },
    { name: 'YouTube', detail: 'YouTube Shorts', color: 'from-red-600 to-rose-700' },
    { name: 'Facebook', detail: 'FB Reels & Watch', color: 'from-blue-600 to-indigo-700' },
    { name: 'WhatsApp', detail: 'Status Updates & Channels', color: 'from-emerald-500 to-green-600' },
    { name: 'Meta', detail: 'Meta Ads & Business Suite', color: 'from-blue-500 to-cyan-600' },
    { name: 'Snapchat', detail: 'Spotlight Stories', color: 'from-yellow-400 to-amber-500' },
    { name: 'X (Twitter)', detail: 'Vertical Video Feed', color: 'from-gray-300 to-gray-500' },
  ];

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-transparent via-[#090913] to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Multi-Platform Ready</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight mt-1">
            WHERE CAN I UPLOAD THESE REELS?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Standard 9:16 vertical MP4 format with universal compatibility across all major platforms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
          {platforms.map((p, idx) => (
            <div
              key={idx}
              className="glass-card p-4 rounded-2xl border border-white/10 text-center flex flex-col items-center justify-center hover:border-purple-400/50 hover:bg-white/5 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${p.color} p-[2px] mb-3 group-hover:scale-110 transition-transform`}>
                <div className="w-full h-full bg-[#0d0d18] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-xs text-white uppercase">{p.name.slice(0, 3)}</span>
                </div>
              </div>
              <h4 className="text-sm font-bold text-white mb-0.5">{p.name}</h4>
              <p className="text-[10px] text-gray-400 font-medium">{p.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
