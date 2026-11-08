import React from 'react';
import { Video, Sparkles, UserCheck, Share2, Shield, Laptop } from 'lucide-react';

export const AudienceSection: React.FC = () => {
  const audiences = [
    {
      title: 'Content Creators',
      desc: 'Fill your monthly posting schedule with high-retention lion reels without filming.',
      icon: Video,
    },
    {
      title: 'Video Creators',
      desc: 'Study masterclass cinematic pacing, color grading, and viral subtitle positioning.',
      icon: Sparkles,
    },
    {
      title: 'Influencers',
      desc: 'Keep your audience engaged between personal vlogs with high-energy attitude quotes.',
      icon: UserCheck,
    },
    {
      title: 'Social Media Managers',
      desc: 'Deliver consistent viral short-form assets for clients in lifestyle & motivation niches.',
      icon: Share2,
    },
    {
      title: 'Instagram Admins',
      desc: 'Rapidly scale theme pages and brand pages from scratch with proven viral hooks.',
      icon: Shield,
    },
    {
      title: 'Freelancers',
      desc: 'Offer complete short-form video management services and retain monthly retainer clients.',
      icon: Laptop,
    },
  ];

  return (
    <section className="py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase font-bold text-purple-400 tracking-wider">Target Audience</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white font-['Outfit'] tracking-tight mt-1">
            WHO IS THIS BUNDLE FOR?
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Engineered for anyone serious about building a high-reach digital brand.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {audiences.map((aud, idx) => {
            const Icon = aud.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center mb-4 group-hover:bg-purple-600/20 group-hover:border-purple-500/50 transition-colors">
                  <Icon className="w-6 h-6 text-white group-hover:text-purple-300 transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 font-['Outfit']">
                  {aud.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {aud.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
