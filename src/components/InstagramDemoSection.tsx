import React from 'react';
import { BadgeCheck, Users, Eye, Sparkles, TrendingUp, ShieldCheck, Instagram } from 'lucide-react';
import { StoreSettings } from '../types/store';

interface InstagramDemoSectionProps {
  settings: StoreSettings;
  onBuyClick: () => void;
}

export const InstagramDemoSection: React.FC<InstagramDemoSectionProps> = ({ settings, onBuyClick }) => {
  return (
    <section id="instagram-demo" className="py-16 sm:py-24 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Instagram className="w-3.5 h-3.5 text-pink-400" />
            PROOF OF VIRALITY
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            PAGES BUILT WITH OUR CONTENT
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mt-2">
            These creators use our content to build their social media presence.
          </p>
        </div>

        {/* Main Grid: Prominent Full Portrait Instagram Screenshot + Profile Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* COMPLETE INSTAGRAM PROFILE SCREENSHOT (Displayed Prominently: 350-450px wide desktop, full content width on mobile, object-fit contain, no cropping, no stretching) */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative group w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[450px]">
              {/* Outer Neon Glow Ring */}
              <div className="absolute -inset-2 bg-gradient-to-b from-purple-600 via-pink-600 to-amber-500 rounded-[36px] blur-xl opacity-50 group-hover:opacity-75 transition duration-500"></div>

              {/* Portrait Mobile Phone Frame Showcase */}
              <div className="relative rounded-[32px] p-2 bg-[#090910] border-2 border-white/15 shadow-2xl backdrop-blur-2xl">
                {/* Full portrait image container with object-fit: contain, no cropping */}
                <div className="relative w-full overflow-hidden rounded-[26px] bg-black flex items-center justify-center">
                  <img
                    src={settings.instagramDemoScreenshot}
                    alt={`Complete Instagram Profile of ${settings.instagramUsername}`}
                    className="w-full h-auto max-h-[820px] object-contain select-none transition-transform duration-300 group-hover:scale-[1.01]"
                    loading="lazy"
                  />
                </div>

                {/* Verification ribbon */}
                <div className="mt-3 py-2 px-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between text-xs text-gray-300">
                  <span className="flex items-center gap-1.5 font-semibold text-white">
                    <BadgeCheck className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
                    @{settings.instagramUsername || 'sherubhai.official'}
                  </span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {settings.instagramFollowers || '1.4M'} Followers
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Metrics & Real Growth Breakdown */}
          <div className="lg:col-span-6 space-y-6">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-purple-500/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 p-[2px]">
                  <div className="w-full h-full bg-[#0c0c16] rounded-[14px] flex items-center justify-center">
                    <Instagram className="w-6 h-6 text-pink-400" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-xl font-black text-white font-['Outfit']">
                      @{settings.instagramUsername || 'sherubhai.official'}
                    </h3>
                    <BadgeCheck className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
                  </div>
                  <p className="text-xs text-gray-400">Verified AI Theme Page Creator</p>
                </div>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                    {settings.instagramPosts || '384'}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Posts / Reels</div>
                </div>

                <div className="bg-gradient-to-br from-purple-950/40 to-black border border-purple-500/30 rounded-2xl p-3.5 text-center">
                  <div className="text-xl sm:text-2xl font-black text-amber-400 font-['Outfit']">
                    {settings.instagramFollowers || '1.4M'}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Followers</div>
                </div>

                <div className="bg-black/50 border border-white/10 rounded-2xl p-3.5 text-center">
                  <div className="text-xl sm:text-2xl font-black text-white font-['Outfit']">
                    {settings.instagramFollowing || '18'}
                  </div>
                  <div className="text-[11px] text-gray-400 uppercase font-semibold">Following</div>
                </div>
              </div>

              {/* Bio Highlights */}
              <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Page Bio
                </span>
                <p className="text-xs sm:text-sm text-gray-200 whitespace-pre-line leading-relaxed font-mono">
                  {settings.instagramBio || '👑 Sheru Bhai - King of Viral Reels\n🔥 2000+ HD AI Reels Library\n🚀 Grew from 0 to 1M in 90 days\n👇 Grab the viral bundle below'}
                </p>
              </div>

              {/* Why This Works */}
              <div className="space-y-3 mb-6 text-sm text-gray-300">
                <div className="flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                  <span><strong>High Retention Rate:</strong> Fast-paced cuts, masculine luxury visuals, and punchy audio stop users from scrolling past.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                  <span><strong>Massive Shareability:</strong> Motivational quotes and Sheru attitude reels trigger hundreds of thousands of DM shares.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                  <span><strong>Ready to Upload:</strong> Clean exported MP4 reels that you can schedule in Meta Business Suite in minutes.</span>
                </div>
              </div>

              <button
                onClick={onBuyClick}
                className="w-full glow-btn text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>GET THE SAME REELS NOW — ₹197</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
