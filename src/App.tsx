import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RatingBanner } from './components/RatingBanner';
import { PricingSection } from './components/PricingSection';
import { DemoReelsSection } from './components/DemoReelsSection';
import { InstagramDemoSection } from './components/InstagramDemoSection';
import { BonusesSection } from './components/BonusesSection';
import { AudienceSection } from './components/AudienceSection';
import { PlatformSection } from './components/PlatformSection';
import { MonetizationSection } from './components/MonetizationSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackModal } from './components/OrderTrackModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { storeService } from './services/storeService';
import { StoreSettings, Order } from './types/store';

export default function App() {
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [reels, setReels] = useState(() => storeService.getReels());
  const [bonuses, setBonuses] = useState(() => storeService.getBonuses());
  const [testimonials, setTestimonials] = useState(() => storeService.getTestimonials());

  // Modals state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);
  const [activeTrackQuery, setActiveTrackQuery] = useState('');
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(() => storeService.isAdminAuthenticated());

  // Subscribe to real-time central database updates across all devices
  useEffect(() => {
    const unsubscribe = storeService.subscribe(() => {
      refreshStoreData();
    });
    return () => unsubscribe();
  }, []);

  // Sync dynamic Open Graph meta tags for WhatsApp & social previews
  useEffect(() => {
    if (settings.productCoverUrl) {
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (!ogImage) {
        ogImage = document.createElement('meta');
        ogImage.setAttribute('property', 'og:image');
        document.head.appendChild(ogImage);
      }
      ogImage.setAttribute('content', settings.productCoverUrl);

      let twitterImage = document.querySelector('meta[name="twitter:image"]');
      if (!twitterImage) {
        twitterImage = document.createElement('meta');
        twitterImage.setAttribute('name', 'twitter:image');
        document.head.appendChild(twitterImage);
      }
      twitterImage.setAttribute('content', settings.productCoverUrl);
    }
  }, [settings.productCoverUrl]);

  // Check URL params for direct /admin or ?admin=true
  useEffect(() => {
    if (window.location.pathname.includes('/admin') || window.location.search.includes('admin=true')) {
      if (storeService.isAdminAuthenticated()) {
        setIsAdminDashboardOpen(true);
      } else {
        setIsAdminLoginOpen(true);
      }
    }
  }, []);

  const refreshStoreData = () => {
    setSettings(storeService.getSettings());
    setReels(storeService.getReels());
    setBonuses(storeService.getBonuses());
    setTestimonials(storeService.getTestimonials());
  };

  const handleOrderSubmitted = (order: Order) => {
    setActiveTrackQuery(order.id);
    refreshStoreData();
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminDashboardOpen(true);
    refreshStoreData();
  };

  const handleAdminLogout = () => {
    storeService.adminLogout();
    setIsAdminDashboardOpen(false);
    refreshStoreData();
  };

  return (
    <div className="min-h-screen bg-[#06060a] text-white flex flex-col selection:bg-purple-600 selection:text-white">
      {/* 2. Top Flash Sale Announcement Bar */}
      <AnnouncementBar
        settings={settings}
        onBuyClick={() => setIsCheckoutOpen(true)}
      />

      {/* Navigation Header */}
      <Navbar
        onBuyClick={() => setIsCheckoutOpen(true)}
        onTrackClick={() => {
          setActiveTrackQuery('');
          setIsTrackOpen(true);
        }}
        onAdminClick={() => {
          if (storeService.isAdminAuthenticated()) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
      />

      {/* Main Storefront Sections */}
      <main className="flex-1">
        {/* 3. Hero Section (1:1 Box Cover + 11 Features List) */}
        <HeroSection
          settings={settings}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 4. Customer Rating Banner (4.9/5 ⭐⭐⭐⭐⭐) */}
        <RatingBanner />

        {/* 6. Demo Reels Videos Section (9:16 Vertical ratio, preview player) */}
        <DemoReelsSection
          reels={reels}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 7. Instagram ID Demo Section (Full Portrait Screenshot, Profile stats) */}
        <InstagramDemoSection
          settings={settings}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 8. Exclusive Creator Bonuses (4 cards with purple, blue, green, gold borders) */}
        <BonusesSection
          bonuses={bonuses}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 5. Single Product Pricing Section (₹197, 80% off, 100% Secure Checkout) */}
        <PricingSection
          settings={settings}
          onBuyClick={() => setIsCheckoutOpen(true)}
        />

        {/* 10. Who Is This Bundle For? (6 icon cards) */}
        <AudienceSection />

        {/* 11. Where Can I Upload These Reels? (7 platforms) */}
        <PlatformSection />

        {/* 12. How Can I Make Money? (6 avenues) */}
        <MonetizationSection />

        {/* 9. Customer Testimonials (Loved by Content Creators slider) */}
        <TestimonialsSection testimonials={testimonials} />

        {/* 13. FAQ Section (7 expandable FAQs) */}
        <FaqSection />
      </main>

      {/* 14. Footer with dynamic year & legal modals */}
      <Footer
        settings={settings}
        onAdminClick={() => {
          if (storeService.isAdminAuthenticated()) {
            setIsAdminDashboardOpen(true);
          } else {
            setIsAdminLoginOpen(true);
          }
        }}
        onTrackClick={() => {
          setActiveTrackQuery('');
          setIsTrackOpen(true);
        }}
      />

      {/* 26. Floating WhatsApp Support Button */}
      <WhatsAppButton settings={settings} />

      {/* 15 & 16. Checkout & Payment Submission Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        settings={settings}
        onOrderSuccess={handleOrderSubmitted}
      />

      {/* Order Status Tracking & Unlocked Downloads Modal */}
      <OrderTrackModal
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        settings={settings}
        initialQuery={activeTrackQuery}
      />

      {/* 17. Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {/* 18. Full Admin Dashboard (All 9 Tabs + UPI Input Fix) */}
      {isAdminDashboardOpen && (
        <AdminDashboard
          onLogout={handleAdminLogout}
          onClose={() => {
            setIsAdminDashboardOpen(false);
            refreshStoreData();
          }}
        />
      )}
    </div>
  );
}
