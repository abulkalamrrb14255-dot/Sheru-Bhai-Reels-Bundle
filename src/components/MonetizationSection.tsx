import React from 'react';
import { DollarSign, Megaphone, ShoppingBag, Briefcase, Lock, UserCheck, Shirt } from 'lucide-react';

export const MonetizationSection: React.FC = () => {
  const methods = [
    {
      title: 'Sponsored Posts',
      desc: 'Brands frequently sponsor pages with loyal lifestyle and motivation audiences for brand mentions.',
      icon: Megaphone,
    },
    {
      title: 'Sell Your Own Products',
      desc: 'Use high-retention reels to direct bio traffic toward digital templates, guides, or physical products.',
      icon: ShoppingBag,
    },
    {
      title: 'Promote Your Services',
      desc: 'Showcase high-standard editing and creative assets to land freelance video editing and management deals.',
      icon: Briefcase,
    },
    {
      title: 'Exclusive Content',
      desc: 'Funnel active viewers to Telegram channels, subscription newsletters, or private community groups.',
      icon: Lock,
    },
    {
      title: 'Offer Consulting or Coaching',
      desc: 'Leverage established page growth credibility to consult beginner creators and aspiring theme page owners.',
      icon: UserCheck,
    },
    {
      title: 'Merchandise and Shoutouts',
      desc: 'Monetize engaged followers through custom streetwear apparel drops and paid promotional story shoutouts.',
      icon: Shirt,
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            MONETIZATION BLUEPRINT
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight">
            HOW CAN I MAKE MONEY BY POSTING THESE REELS? 💰
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Proven commercial avenues creators utilize once they establish an active viewer base.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {methods.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-emerald-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                  {m.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Responsible Disclaimer */}
        <div className="mt-8 text-center text-xs text-gray-500 max-w-2xl mx-auto">
          *Note: Results depend entirely on your consistency, platform algorithms, and audience engagement. We provide premium visual assets and templates, not guaranteed income or follower guarantees.
        </div>
      </div>
    </section>
  );
};
