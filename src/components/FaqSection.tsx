import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: '1. When will I receive my product?',
      a: 'Immediately after you complete your ₹197 payment and submit your 12-digit UPI UTR number and payment screenshot on the checkout page, our admin system verifies the transaction in our merchant account. Once verified, your download access unlocks instantly on the Track Order page and is sent to your registered email & WhatsApp.',
    },
    {
      q: '2. What if I lose my product?',
      a: 'No worries at all! Your purchase comes with lifetime access. You can simply go to the "Track Order" button in the top navigation, enter your 10-digit mobile number or Order ID, and re-download your 2000+ reels and bonus files anytime for free.',
    },
    {
      q: '3. How long can I access the material?',
      a: 'You receive Lifetime Access. There are no recurring fees or expiration dates. All 2,000+ AI Reels, bonus editing tools, sound libraries, and the Instagram growth guide remain yours forever.',
    },
    {
      q: '4. Is it a monthly subscription or one-time purchase?',
      a: 'It is strictly a 100% ONE-TIME PURCHASE of ₹197/- only. There are no hidden fees, no subscriptions, and no surprise renewals ever.',
    },
    {
      q: '5. Is my payment safe and secured?',
      a: 'Yes, 100%. Payments are processed directly through official Indian banking UPI rails (Google Pay, PhonePe, Paytm, BHIM). You never enter debit card numbers, CVVs, or bank passwords on our website. You pay directly inside your authorized UPI banking app.',
    },
    {
      q: '6. Can I upload videos on YouTube?',
      a: 'Yes! All reels are rendered in high-definition vertical format (1080×1920) and are 100% ready to upload on YouTube Shorts, Instagram Reels, Facebook Reels, TikTok, and WhatsApp Status.',
    },
    {
      q: '7. Which payment methods are accepted?',
      a: 'We accept all standard UPI applications including Google Pay, PhonePe, Paytm, BHIM, CRED, Amazon Pay, and all major Indian bank UPI apps via direct QR scan or UPI Intent links.',
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-[#080811] to-transparent">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            CLEAR ANSWERS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-['Outfit'] tracking-tight">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Everything you need to know about purchasing, approval, and downloads.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/10 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm sm:text-base font-['Outfit']">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white/5 flex items-center justify-center shrink-0 text-gray-300 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-purple-600/30 text-purple-300' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
