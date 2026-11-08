import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, TrendingUp } from 'lucide-react';
import { Testimonial } from '../types/store';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const published = testimonials.filter((t) => t.isPublished);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (published.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % published.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + published.length) % published.length);

  return (
    <section id="reviews" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Star className="w-3.5 h-3.5 fill-yellow-400" />
            COMMUNITY RESULTS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            LOVED BY CONTENT CREATORS
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Real feedback from creators who publish Sheru Bhai AI Reels daily.
          </p>
        </div>

        {/* Desktop 3-Card Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {published.map((t) => (
            <div
              key={t.id}
              className="glass-card rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-purple-500/40 transition-all hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400 gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono">{t.date}</span>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                <img
                  src={t.avatarUrl}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                />
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                  <p className="text-xs text-gray-400 truncate">{t.handle}</p>
                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
                    <TrendingUp className="w-3 h-3" /> {t.growth}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Slider View */}
        <div className="md:hidden relative">
          <div className="glass-card rounded-3xl p-6 border border-purple-500/40">
            <div className="flex items-center justify-between mb-4">
              <div className="flex text-amber-400 gap-1">
                {[...Array(published[currentIndex].rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-mono">{published[currentIndex].date}</span>
            </div>

            <p className="text-sm text-gray-200 leading-relaxed mb-6 italic">
              "{published[currentIndex].comment}"
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={published[currentIndex].avatarUrl}
                  alt={published[currentIndex].name}
                  className="w-10 h-10 rounded-full object-cover border border-purple-400/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{published[currentIndex].name}</h4>
                  <p className="text-xs text-gray-400">{published[currentIndex].handle}</p>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {published[currentIndex].growth}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prev}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
