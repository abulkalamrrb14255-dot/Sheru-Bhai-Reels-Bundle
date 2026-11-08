import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, X, Eye, Flame } from 'lucide-react';
import { DemoReel } from '../types/store';
import { resolveMediaUrl } from '../services/mediaStorage';

interface DemoReelsSectionProps {
  reels: DemoReel[];
  onBuyClick: () => void;
}

export const DemoReelsSection: React.FC<DemoReelsSectionProps> = ({ reels, onBuyClick }) => {
  const publishedReels = reels.filter((r) => r.isPublished);
  const [activeModalReel, setActiveModalReel] = useState<DemoReel | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>('');

  useEffect(() => {
    if (!activeModalReel?.videoUrl) {
      setResolvedVideoUrl('');
      return;
    }
    let isCurrent = true;
    resolveMediaUrl(activeModalReel.videoUrl).then((url) => {
      if (isCurrent) {
        setResolvedVideoUrl(url);
      }
    });
    return () => {
      isCurrent = false;
    };
  }, [activeModalReel]);

  return (
    <section id="demo-reels" className="py-16 sm:py-24 bg-gradient-to-b from-transparent via-[#0b0b14] to-transparent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Flame className="w-3.5 h-3.5 fill-orange-400" />
            SAMPLE PREVIEWS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            DEMO REELS VIDEOS 🔥
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Click on any reel to preview the actual 4K quality, viral captions, and energetic background music.
          </p>
        </div>

        {/* 9:16 Video Previews: 4 side-by-side on desktop, horizontal scroll on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-thin">
          {publishedReels.map((reel) => (
            <div
              key={reel.id}
              className="relative group rounded-2xl overflow-hidden glass-card border border-purple-500/30 shadow-xl cursor-pointer snap-center min-w-[260px] sm:min-w-0 transform transition-all duration-300 hover:-translate-y-2 hover:border-purple-400 hover:shadow-2xl hover:shadow-purple-900/30"
              onClick={() => {
                setActiveModalReel(reel);
                setIsPlaying(true);
              }}
            >
              {/* 9:16 Aspect Ratio Thumbnail Container */}
              <div className="relative aspect-[9/16] w-full overflow-hidden bg-black">
                <img
                  src={reel.thumbnailUrl}
                  alt={reel.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 group-hover:from-black/95 transition-all" />

                {/* Top Badge: Views count */}
                <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-gray-200">
                  <Eye className="w-3 h-3 text-cyan-400" />
                  <span>{reel.views}</span>
                </div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-400 to-purple-600 p-[2px] shadow-2xl transform transition-transform group-hover:scale-110">
                    <div className="w-full h-full rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-white">
                      <Play className="w-6 h-6 text-yellow-300 fill-yellow-300 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Bottom Info */}
                <div className="absolute bottom-0 inset-x-0 p-4 text-left">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-1">
                    {reel.subtitle}
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-tight drop-shadow">
                    {reel.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                    <span className="bg-purple-900/70 border border-purple-500/40 px-2 py-0.5 rounded text-purple-200">
                      4K Ultra HD
                    </span>
                    <span className="text-emerald-400">Ready To Post</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA under Demo Section */}
        <div className="mt-12 text-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3">
            Get access to all 2,000+ reels like these ready to download instantly.
          </p>
          <button
            onClick={onBuyClick}
            className="glow-btn text-white font-bold text-sm sm:text-base px-8 py-3 rounded-xl shadow-lg cursor-pointer transform hover:scale-105 active:scale-95 transition-all"
          >
            GET FULL 2000+ REELS BUNDLE — ₹197
          </button>
        </div>
      </div>

      {/* Video Preview Modal */}
      {activeModalReel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm sm:max-w-md bg-[#0e0e17] border border-purple-500/40 rounded-3xl overflow-hidden shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setActiveModalReel(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/70 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Player Header */}
            <div className="p-3 bg-black/50 border-b border-white/10 flex items-center justify-between text-xs text-gray-300">
              <span className="font-semibold truncate max-w-[220px]">{activeModalReel.title}</span>
              <span className="text-amber-400 font-bold">{activeModalReel.views}</span>
            </div>

            {/* 9:16 Video player container */}
            <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center overflow-hidden">
              {activeModalReel.videoUrl ? (
                <video
                  src={resolvedVideoUrl || activeModalReel.videoUrl}
                  poster={activeModalReel.thumbnailUrl}
                  controls={false}
                  autoPlay={isPlaying}
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={activeModalReel.thumbnailUrl}
                  alt={activeModalReel.title}
                  className="w-full h-full object-cover"
                />
              )}

              {/* In-video controls bar */}
              <div className="absolute bottom-3 inset-x-3 bg-black/70 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between border border-white/10 text-white">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 hover:text-amber-400 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                </button>

                <span className="text-[11px] text-gray-300 font-medium">9:16 HD Preview</span>

                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 bg-[#0a0a10] border-t border-white/10 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-gray-400 block">Complete Bundle</span>
                <span className="text-lg font-black text-amber-400 font-['Outfit']">₹197/-</span>
              </div>
              <button
                onClick={() => {
                  setActiveModalReel(null);
                  onBuyClick();
                }}
                className="glow-btn text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl cursor-pointer"
              >
                BUY BUNDLE NOW
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
