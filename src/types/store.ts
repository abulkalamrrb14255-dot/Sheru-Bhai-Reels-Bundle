export interface Order {
  id: string; // e.g. SB-2027-10928
  customerName: string;
  email: string;
  mobile: string;
  amount: number;
  utrNumber: string;
  screenshotUrl: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export interface DemoReel {
  id: string;
  title: string;
  subtitle: string;
  views: string;
  thumbnailUrl: string;
  videoUrl?: string;
  isPublished: boolean;
  orderIndex: number;
}

export interface BonusItem {
  id: string;
  number: number;
  title: string;
  description: string;
  worth: string;
  badge: string;
  borderColor: string;
  downloadUrl?: string;
  fileSize?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  growth: string;
  isPublished: boolean;
  date: string;
}

export interface StoreSettings {
  // UPI & Payment Settings
  merchantUpiId: string;
  merchantDisplayName: string;
  whatsappNumber: string;
  whatsappSupportMessage: string;
  
  // Product pricing
  productTitle: string;
  productSubtitle: string;
  originalPrice: number;
  sellingPrice: number;
  productCoverUrl: string;

  // Flash Sale Bar
  flashSaleText: string;
  flashSaleDeadline: string; // ISO string or timestamp
  flashSaleActive: boolean;

  // Instagram Demo section
  instagramDemoScreenshot: string;
  instagramUsername: string;
  instagramFollowers: string;
  instagramFollowing: string;
  instagramPosts: string;
  instagramBio: string;
  instagramProfileUrl: string;

  // Product Downloads
  mainBundleZipUrl: string;
  mainBundleFileSize: string;
  mainBundleFileName: string;
  backupGoogleDriveUrl: string;

  // Firebase Config (Optional Custom Integration)
  firebaseConfig?: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}
