import { Order, StoreSettings, DemoReel, BonusItem, Testimonial } from '../types/store';

// Default initial cover & demo assets
import defaultCover from '../assets/images/sheru_bundle_cover_1794123380894.jpg';
import defaultInstagramScreenshot from '../assets/images/instagram_demo_profile_1794123395586.jpg';
import defaultReel1 from '../assets/images/reel_thumb_attitude_1794123410942.jpg';
import defaultReel2 from '../assets/images/reel_thumb_supercar_1794123424093.jpg';
import defaultReel3 from '../assets/images/reel_thumb_gym_1794123437666.jpg';
import defaultReel4 from '../assets/images/reel_thumb_money_1794123449764.jpg';

// Storage keys
const SETTINGS_KEY = 'sheru_bhai_settings_v1';
const ORDERS_KEY = 'sheru_bhai_orders_v1';
const REELS_KEY = 'sheru_bhai_reels_v1';
const BONUSES_KEY = 'sheru_bhai_bonuses_v1';
const TESTIMONIALS_KEY = 'sheru_bhai_testimonials_v1';
const ADMIN_AUTH_KEY = 'sheru_bhai_admin_auth';

// 6 hours from now for persistent synchronized countdown
const getDefaultSaleDeadline = () => {
  const d = new Date();
  d.setHours(d.getHours() + 6);
  return d.toISOString();
};

export const DEFAULT_SETTINGS: StoreSettings = {
  merchantUpiId: 'sherubhai@oksbi',
  merchantDisplayName: 'SHERU BHAI STORE',
  whatsappNumber: '+919876543210',
  whatsappSupportMessage: 'Hi Sheru Bhai Store! I need assistance with the AI Reels Bundle.',
  productTitle: 'AI SHERU BHAI Reels Bundle 2027 Edition',
  productSubtitle: 'Get PREMIUM HD Ready-to-Post AI Reels. No Editing Needed • No Watermark • Instant Access.',
  originalPrice: 1199,
  sellingPrice: 197,
  productCoverUrl: defaultCover,
  flashSaleText: '⚡ FLASH SALE ENDING SOON — GET AI SHERU BHAI REELS FOR JUST ₹197/- (80% OFF)',
  flashSaleDeadline: getDefaultSaleDeadline(),
  flashSaleActive: true,
  instagramDemoScreenshot: defaultInstagramScreenshot,
  instagramUsername: 'sherubhai.official',
  instagramFollowers: '1.4M',
  instagramFollowing: '18',
  instagramPosts: '384',
  instagramBio: '👑 Sheru Bhai - King of Viral Reels\n🔥 2000+ HD AI Reels Library\n🚀 Grew from 0 to 1M in 90 days\n👇 Grab the viral bundle below',
  instagramProfileUrl: 'https://instagram.com/sherubhai.official',
  mainBundleZipUrl: 'https://drive.google.com/uc?export=download&id=SHERU_BHAI_2000_REELS_MASTER_BUNDLE_2027',
  mainBundleFileSize: '4.8 GB',
  mainBundleFileName: 'Sheru_Bhai_2000_AI_Reels_Master_Vault_2027.zip',
  backupGoogleDriveUrl: 'https://drive.google.com/drive/folders/sherubhai_vip_reels_cloud_backup',
};

export const DEFAULT_REELS: DemoReel[] = [
  {
    id: 'reel-1',
    title: 'Never Apologize For Being Powerful',
    subtitle: 'Royal Lion Luxury Lifestyle',
    views: '4.2M Views',
    thumbnailUrl: defaultReel1,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    isPublished: true,
    orderIndex: 0,
  },
  {
    id: 'reel-2',
    title: 'Focus On Your Own Lane',
    subtitle: 'Midnight Supercar Attitude',
    views: '8.9M Views',
    thumbnailUrl: defaultReel2,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    isPublished: true,
    orderIndex: 1,
  },
  {
    id: 'reel-3',
    title: 'Discipline Is The Only Shortcut',
    subtitle: 'High Intensity Beast Motivation',
    views: '11.5M Views',
    thumbnailUrl: defaultReel3,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    isPublished: true,
    orderIndex: 2,
  },
  {
    id: 'reel-4',
    title: 'Work In Silence, Let Success Roar',
    subtitle: 'Billionaire Penthouse Empire',
    views: '6.7M Views',
    thumbnailUrl: defaultReel4,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    isPublished: true,
    orderIndex: 3,
  },
];

export const DEFAULT_BONUSES: BonusItem[] = [
  {
    id: 'bonus-1',
    number: 1,
    title: '10 More Categories Bonus Reel Bundle',
    description: 'Finance, luxury mansions, motivation, sports cars, funny animals & crypto reels to dominate every viral niche.',
    worth: '₹3,499',
    badge: '1000+ EXTRA REELS',
    borderColor: 'border-purple-500/40 hover:border-purple-500',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=Bonus_10_Categories_Reels.zip',
    fileSize: '2.1 GB',
  },
  {
    id: 'bonus-2',
    number: 2,
    title: 'YouTube Editing Tools Bundle',
    description: 'Premium sound effects pack, trending viral fonts, caption presets, and CapCut / Premiere Pro master templates.',
    worth: '₹2,999',
    badge: 'PRO TOOLS',
    borderColor: 'border-blue-500/40 hover:border-blue-500',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=Bonus_YouTube_Editing_Tools.zip',
    fileSize: '1.4 GB',
  },
  {
    id: 'bonus-3',
    number: 3,
    title: 'Instagram Growth E-Book (2026 Edition)',
    description: 'Exact step-by-step viral blueprint: best posting times, algorithmic secrets, hashtag cheat sheet, and monetizing followers.',
    worth: '₹2,499',
    badge: 'VIRAL BLUEPRINT',
    borderColor: 'border-emerald-500/40 hover:border-emerald-500',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=Bonus_Instagram_Growth_EBook_2026.pdf',
    fileSize: '45 MB (PDF)',
  },
  {
    id: 'bonus-4',
    number: 4,
    title: 'Pro Video Editing Asset Vault',
    description: '4K animated overlays, cinematic transitions, royalty-free audio tracks, and motivational voiceover soundbites.',
    worth: '₹3,003',
    badge: 'ULTRA ASSETS',
    borderColor: 'border-amber-500/40 hover:border-amber-500',
    downloadUrl: 'https://drive.google.com/uc?export=download&id=Bonus_Pro_Editing_Asset_Vault.zip',
    fileSize: '1.8 GB',
  },
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aman Sharma',
    handle: '@aman_creations99',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Started posting 2 reels daily from this bundle. My page went from 300 followers to 78,000 in just 26 days! The 4K quality is unmatched and no watermark makes it look completely original.',
    growth: '+78K Followers in 26 Days',
    isPublished: true,
    date: '3 days ago',
  },
  {
    id: 'test-2',
    name: 'Rohit Verma',
    handle: '@beast_attitude_reels',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'Worth way more than ₹197. Downloaded the ZIP in 5 minutes after approval. Sound tracks, fonts, and lion animations are insane. Got 3 brand sponsorship inquiries already.',
    growth: 'Got 3 Brand Collabs',
    isPublished: true,
    date: '1 week ago',
  },
  {
    id: 'test-3',
    name: 'Pooja Patil',
    handle: '@viralvibes_pooja',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    comment: 'I run 3 theme pages. Creating reels was taking me 4 hours every single day. Now I just schedule them for the entire month in 30 minutes! Truly a lifesaver.',
    growth: '3.4M Monthly Reach',
    isPublished: true,
    date: '2 weeks ago',
  },
];

export const DEFAULT_ORDERS: Order[] = [
  {
    id: 'SB-2027-1092',
    customerName: 'Vikram Rajput',
    email: 'vikram.rajput92@gmail.com',
    mobile: '9823019284',
    amount: 197,
    utrNumber: '419827361092',
    screenshotUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'APPROVED',
    approvedAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    approvedBy: 'Admin',
  },
  {
    id: 'SB-2027-1093',
    customerName: 'Kunal Deshmukh',
    email: 'kunal.d@yahoo.com',
    mobile: '9172638491',
    amount: 197,
    utrNumber: '419830192837',
    screenshotUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    createdAt: new Date(Date.now() - 3600000 * 0.5).toISOString(),
    status: 'PENDING',
  },
];

import { firestoreSync } from './firestoreSync';

// Persistent Service Layer
class StoreService {
  private settings: StoreSettings;
  private orders: Order[];
  private reels: DemoReel[];
  private bonuses: BonusItem[];
  private testimonials: Testimonial[];
  private listeners: Array<() => void> = [];

  constructor() {
    this.settings = this.loadSettings();
    this.orders = this.loadOrders();
    this.reels = this.loadReels();
    this.bonuses = this.loadBonuses();
    this.testimonials = this.loadTestimonials();

    // Start real-time Firestore listeners for instant cross-device updates
    this.initCloudSync();

    // Background sync with server if available
    this.syncFromServer();
  }

  // Subscribe UI components to live store updates
  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.warn('Listener error in storeService:', err);
      }
    });
  }

  private initCloudSync() {
    try {
      firestoreSync.initListeners();

      // Listen to cloud settings updates
      firestoreSync.subscribeSettings((cloudSettings) => {
        this.settings = { ...this.settings, ...cloudSettings };
        this.notify();
      });

      // Listen to cloud reels updates
      firestoreSync.subscribeReels((cloudReels) => {
        if (Array.isArray(cloudReels) && cloudReels.length > 0) {
          this.reels = [...cloudReels];
          this.notify();
        }
      });

      // Listen to cloud orders updates
      firestoreSync.subscribeOrders((cloudOrders) => {
        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          this.orders = [...cloudOrders];
          this.notify();
        }
      });
    } catch (e) {
      console.warn('Could not initialize cloud sync listeners:', e);
    }
  }

  // --- SETTINGS ---
  private loadSettings(): StoreSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error reading settings from localStorage', e);
    }
    return DEFAULT_SETTINGS;
  }

  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public saveSettings(newSettings: Partial<StoreSettings>): StoreSettings {
    this.settings = { ...this.settings, ...newSettings };
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
      // Save directly to shared Firestore cloud database
      firestoreSync.saveSettingsToCloud(newSettings);
      this.notify();

      // Sync to backend API asynchronously if node server runs
      fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.settings),
      }).catch(() => {});
    } catch (e) {
      console.error('Failed to save settings', e);
    }
    return { ...this.settings };
  }

  // --- ORDERS ---
  private loadOrders(): Order[] {
    try {
      const data = localStorage.getItem(ORDERS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading orders from localStorage', e);
    }
    return DEFAULT_ORDERS;
  }

  public getOrders(): Order[] {
    return [...this.orders];
  }

  public submitOrder(orderData: {
    customerName: string;
    email: string;
    mobile: string;
    utrNumber: string;
    screenshotUrl: string;
  }): { success: boolean; order?: Order; error?: string } {
    // Validate required fields
    if (!orderData.customerName?.trim()) return { success: false, error: 'Customer name is required' };
    if (!orderData.email?.includes('@')) return { success: false, error: 'Valid email is required' };
    if (!orderData.mobile || orderData.mobile.replace(/\D/g, '').length < 10) {
      return { success: false, error: 'Valid 10-digit mobile number is required' };
    }
    const cleanUtr = orderData.utrNumber?.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      return { success: false, error: 'Please enter a valid 12-digit UPI UTR / Transaction ID' };
    }

    // Check duplicate UTR
    const duplicate = this.orders.find(
      (o) => o.utrNumber.toLowerCase() === cleanUtr.toLowerCase() && o.status !== 'REJECTED'
    );
    if (duplicate) {
      return {
        success: false,
        error: `This UTR (${cleanUtr}) has already been submitted under Order #${duplicate.id}. Please check your order status or contact support.`,
      };
    }

    const newOrder: Order = {
      id: `SB-2027-${Math.floor(10000 + Math.random() * 90000)}`,
      customerName: orderData.customerName.trim(),
      email: orderData.email.trim().toLowerCase(),
      mobile: orderData.mobile.trim(),
      amount: this.settings.sellingPrice,
      utrNumber: cleanUtr,
      screenshotUrl: orderData.screenshotUrl || '',
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };

    this.orders = [newOrder, ...this.orders];
    this.persistOrders();

    // Save directly to shared Firestore database
    firestoreSync.saveOrderToCloud(newOrder);
    this.notify();

    // Async sync to server
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder),
    }).catch(() => {});

    return { success: true, order: newOrder };
  }

  public resubmitPayment(orderId: string, utrNumber: string, screenshotUrl: string): { success: boolean; error?: string } {
    const cleanUtr = utrNumber.trim();
    if (!cleanUtr || cleanUtr.length < 6) {
      return { success: false, error: 'Valid UTR / Transaction ID is required' };
    }

    const index = this.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return { success: false, error: 'Order not found' };

    this.orders[index] = {
      ...this.orders[index],
      utrNumber: cleanUtr,
      screenshotUrl: screenshotUrl || this.orders[index].screenshotUrl,
      status: 'PENDING',
      rejectedAt: undefined,
      rejectionReason: undefined,
    };

    this.persistOrders();
    firestoreSync.saveOrderToCloud(this.orders[index]);
    this.notify();
    return { success: true };
  }

  public updateOrderStatus(
    orderId: string,
    status: 'APPROVED' | 'REJECTED',
    reason?: string
  ): { success: boolean; error?: string } {
    const index = this.orders.findIndex((o) => o.id === orderId);
    if (index === -1) return { success: false, error: 'Order not found' };

    if (status === 'APPROVED') {
      this.orders[index] = {
        ...this.orders[index],
        status: 'APPROVED',
        approvedAt: new Date().toISOString(),
        approvedBy: 'Admin',
        rejectionReason: undefined,
      };
    } else {
      this.orders[index] = {
        ...this.orders[index],
        status: 'REJECTED',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Payment could not be verified in merchant account. Please check UTR & re-submit.',
      };
    }

    this.persistOrders();
    // Save to shared Firestore database
    firestoreSync.saveOrderToCloud(this.orders[index]);
    this.notify();

    // Async sync to server
    fetch(`/api/orders/${orderId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason }),
    }).catch(() => {});

    return { success: true };
  }

  public findOrder(identifier: string): Order | undefined {
    const clean = identifier.trim().toLowerCase();
    return this.orders.find(
      (o) =>
        o.id.toLowerCase() === clean ||
        o.email.toLowerCase() === clean ||
        o.mobile.replace(/\D/g, '') === clean.replace(/\D/g, '') ||
        o.utrNumber.toLowerCase() === clean
    );
  }

  private persistOrders() {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(this.orders));
    } catch (e) {
      console.error('Failed to persist orders', e);
    }
  }

  // --- REELS ---
  private loadReels(): DemoReel[] {
    try {
      const data = localStorage.getItem(REELS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_REELS;
  }

  public getReels(): DemoReel[] {
    return [...this.reels];
  }

  public saveReels(reels: DemoReel[]) {
    this.reels = [...reels];
    localStorage.setItem(REELS_KEY, JSON.stringify(this.reels));
    // Save all reels to shared Firestore cloud database
    for (const reel of reels) {
      firestoreSync.saveReelToCloud(reel);
    }
    this.notify();
  }

  public deleteReel(id: string) {
    this.reels = this.reels.filter((r) => r.id !== id);
    localStorage.setItem(REELS_KEY, JSON.stringify(this.reels));
    firestoreSync.deleteReelFromCloud(id);
    this.notify();
  }

  public async syncCurrentDataToCloud() {
    return firestoreSync.syncLocalDataToCloud(this.settings, this.reels);
  }

  // --- BONUSES ---
  private loadBonuses(): BonusItem[] {
    try {
      const data = localStorage.getItem(BONUSES_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_BONUSES;
  }

  public getBonuses(): BonusItem[] {
    return [...this.bonuses];
  }

  public saveBonuses(bonuses: BonusItem[]) {
    this.bonuses = [...bonuses];
    localStorage.setItem(BONUSES_KEY, JSON.stringify(this.bonuses));
  }

  // --- TESTIMONIALS ---
  private loadTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(TESTIMONIALS_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_TESTIMONIALS;
  }

  public getTestimonials(): Testimonial[] {
    return [...this.testimonials];
  }

  public saveTestimonials(testimonials: Testimonial[]) {
    this.testimonials = [...testimonials];
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(this.testimonials));
  }

  // --- ADMIN AUTH ---
  public isAdminAuthenticated(): boolean {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  }

  public adminLogin(passcode: string): boolean {
    const trimmed = passcode.trim();
    if (
      trimmed === 'Rayyan@1234' ||
      trimmed === 'sherubhai@admin2027' ||
      trimmed === 'admin123' ||
      trimmed === 'sherubhai2027'
    ) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      return true;
    }
    return false;
  }

  public adminLogout(): void {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }

  // Sync with server if server is running
  private async syncFromServer() {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const serverSettings = await res.json();
        if (serverSettings && serverSettings.merchantUpiId) {
          this.settings = { ...this.settings, ...serverSettings };
          localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
        }
      }
    } catch (e) {
      // serverless or static mode, ignore
    }
  }
}

export const storeService = new StoreService();
