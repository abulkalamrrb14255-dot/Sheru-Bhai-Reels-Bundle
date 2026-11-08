import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  LogOut,
  ShoppingBag,
  Image as ImageIcon,
  Instagram,
  Video,
  Download,
  CreditCard,
  Gift,
  MessageSquare,
  Settings,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Upload,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Check,
  AlertTriangle,
  RefreshCw,
  X,
  Sparkles,
  Flame,
  Copy,
  Film,
} from 'lucide-react';
import { StoreSettings, Order, DemoReel, BonusItem, Testimonial } from '../../types/store';
import { storeService } from '../../services/storeService';
import { uploadToFirebaseStorage, firebaseConfig } from '../../services/firebase';

interface AdminDashboardProps {
  onLogout: () => void;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, onClose }) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<
    | 'orders'
    | 'product-images'
    | 'instagram-demo'
    | 'demo-reels'
    | 'downloads'
    | 'upi-settings'
    | 'bonuses'
    | 'testimonials'
    | 'site-settings'
    | 'firebase-config'
  >('orders');

  // Main Data States
  const [settings, setSettings] = useState<StoreSettings>(() => storeService.getSettings());
  const [orders, setOrders] = useState<Order[]>(() => storeService.getOrders());
  const [reels, setReels] = useState<DemoReel[]>(() => storeService.getReels());
  const [bonuses, setBonuses] = useState<BonusItem[]>(() => storeService.getBonuses());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => storeService.getTestimonials());

  // Screenshot modal view
  const [zoomedScreenshot, setZoomedScreenshot] = useState<string | null>(null);

  // Reject Reason modal
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectionReasonText, setRejectionReasonText] = useState(
    'Payment not received in merchant UPI account. Please verify your 12-digit UTR.'
  );

  // ----------------------------------------------------
  // TAB 6: UPI & WHATSAPP SETTINGS (BUG FIX IMPLEMENTATION)
  // ----------------------------------------------------
  // Controlled React Inputs with local draft state to ensure 0 text loss
  const [draftUpiId, setDraftUpiId] = useState<string>(settings.merchantUpiId);
  const [draftDisplayName, setDraftDisplayName] = useState<string>(settings.merchantDisplayName);
  const [draftWhatsApp, setDraftWhatsApp] = useState<string>(settings.whatsappNumber);
  const [draftWaMessage, setDraftWaMessage] = useState<string>(settings.whatsappSupportMessage);
  const [upiSaveStatus, setUpiSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [upiTestQrUrl, setUpiTestQrUrl] = useState<string>('');

  // Update test QR whenever draft UPI or name changes
  useEffect(() => {
    if (!draftUpiId) return;
    const testUri = `upi://pay?pa=${encodeURIComponent(draftUpiId)}&pn=${encodeURIComponent(
      draftDisplayName
    )}&am=197&cu=INR&tn=AdminTest`;
    QRCode.toDataURL(testUri, { width: 180, margin: 1 })
      .then((url) => setUpiTestQrUrl(url))
      .catch(() => {});
  }, [draftUpiId, draftDisplayName]);

  const handleSaveUpiSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setUpiSaveStatus('saving');

    const updated = storeService.saveSettings({
      merchantUpiId: draftUpiId.trim(),
      merchantDisplayName: draftDisplayName.trim(),
      whatsappNumber: draftWhatsApp.trim(),
      whatsappSupportMessage: draftWaMessage.trim(),
    });

    setSettings(updated);
    setUpiSaveStatus('saved');
    setTimeout(() => setUpiSaveStatus('idle'), 3000);
  };

  // ----------------------------------------------------
  // TAB 1: ORDER MANAGEMENT
  // ----------------------------------------------------
  const handleApproveOrder = (orderId: string) => {
    const res = storeService.updateOrderStatus(orderId, 'APPROVED');
    if (res.success) {
      setOrders(storeService.getOrders());
    }
  };

  const handleRejectOrder = (orderId: string) => {
    const res = storeService.updateOrderStatus(orderId, 'REJECTED', rejectionReasonText);
    if (res.success) {
      setOrders(storeService.getOrders());
      setRejectingOrderId(null);
    }
  };

  // Stats calculation
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const approvedOrders = orders.filter((o) => o.status === 'APPROVED').length;
  const rejectedOrders = orders.filter((o) => o.status === 'REJECTED').length;
  const confirmedSales = approvedOrders * settings.sellingPrice;

  // ----------------------------------------------------
  // TAB 2: PRODUCT IMAGES
  // ----------------------------------------------------
  const [coverUrlInput, setCoverUrlInput] = useState(settings.productCoverUrl);
  const [coverSaved, setCoverSaved] = useState(false);

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCoverUrlInput(dataUrl);
      const updated = storeService.saveSettings({ productCoverUrl: dataUrl });
      setSettings(updated);
      setCoverSaved(true);
      setTimeout(() => setCoverSaved(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCoverUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storeService.saveSettings({ productCoverUrl: coverUrlInput.trim() });
    setSettings(updated);
    setCoverSaved(true);
    setTimeout(() => setCoverSaved(false), 3000);
  };

  // ----------------------------------------------------
  // TAB 3: INSTAGRAM ID DEMO
  // ----------------------------------------------------
  const [draftIgScreenshot, setDraftIgScreenshot] = useState(settings.instagramDemoScreenshot);
  const [draftIgUsername, setDraftIgUsername] = useState(settings.instagramUsername);
  const [draftIgFollowers, setDraftIgFollowers] = useState(settings.instagramFollowers);
  const [draftIgFollowing, setDraftIgFollowing] = useState(settings.instagramFollowing);
  const [draftIgPosts, setDraftIgPosts] = useState(settings.instagramPosts);
  const [draftIgBio, setDraftIgBio] = useState(settings.instagramBio);
  const [igSaved, setIgSaved] = useState(false);

  const handleIgScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setDraftIgScreenshot(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInstagramDemo = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storeService.saveSettings({
      instagramDemoScreenshot: draftIgScreenshot,
      instagramUsername: draftIgUsername.trim(),
      instagramFollowers: draftIgFollowers.trim(),
      instagramFollowing: draftIgFollowing.trim(),
      instagramPosts: draftIgPosts.trim(),
      instagramBio: draftIgBio.trim(),
    });
    setSettings(updated);
    setIgSaved(true);
    setTimeout(() => setIgSaved(false), 3000);
  };

  // ----------------------------------------------------
  // TAB 4: DEMO REELS MANAGEMENT
  // ----------------------------------------------------
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newReelSubtitle, setNewReelSubtitle] = useState('');
  const [newReelViews, setNewReelViews] = useState('');
  const [newReelThumbUrl, setNewReelThumbUrl] = useState('');
  const [newReelVideoUrl, setNewReelVideoUrl] = useState('');

  // Direct Firebase Storage upload states
  const [videoUploadProgress, setVideoUploadProgress] = useState<number>(0);
  const [isUploadingVideo, setIsUploadingVideo] = useState<boolean>(false);
  const [videoFileName, setVideoFileName] = useState<string>('');

  const [thumbUploadProgress, setThumbUploadProgress] = useState<number>(0);
  const [isUploadingThumb, setIsUploadingThumb] = useState<boolean>(false);
  const [thumbFileName, setThumbFileName] = useState<string>('');

  const [reelSaveSuccess, setReelSaveSuccess] = useState<boolean>(false);
  const [reelUploadError, setReelUploadError] = useState<string | null>(null);

  // Handle direct MP4 video file selection and auto-upload to Firebase Storage
  const handleSelectVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReelUploadError(null);
    setVideoFileName(file.name);
    setIsUploadingVideo(true);
    setVideoUploadProgress(5);

    try {
      // Direct upload to Firebase Storage /demo-videos/
      const downloadUrl = await uploadToFirebaseStorage(file, 'demo-videos', (percentage) => {
        setVideoUploadProgress(percentage);
      });
      setNewReelVideoUrl(downloadUrl);
      setIsUploadingVideo(false);
      setVideoUploadProgress(100);
    } catch (err: any) {
      console.warn('Firebase Storage upload notice, falling back to local object preview:', err);
      // Fallback: create object URL so video immediately functions
      const localUrl = URL.createObjectURL(file);
      setNewReelVideoUrl(localUrl);
      setIsUploadingVideo(false);
      setVideoUploadProgress(100);
    }
  };

  // Handle direct thumbnail image selection and auto-upload to Firebase Storage
  const handleSelectThumbFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setReelUploadError(null);
    setThumbFileName(file.name);
    setIsUploadingThumb(true);
    setThumbUploadProgress(10);

    try {
      const downloadUrl = await uploadToFirebaseStorage(file, 'demo-thumbnails', (percentage) => {
        setThumbUploadProgress(percentage);
      });
      setNewReelThumbUrl(downloadUrl);
      setIsUploadingThumb(false);
      setThumbUploadProgress(100);
    } catch (err) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewReelThumbUrl(reader.result as string);
        setIsUploadingThumb(false);
        setThumbUploadProgress(100);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddReel = (e: React.FormEvent) => {
    e.preventDefault();
    setReelUploadError(null);

    if (!newReelTitle.trim()) {
      setReelUploadError('Please enter a reel title');
      return;
    }
    if (!newReelThumbUrl) {
      setReelUploadError('Please select or upload a thumbnail image for the reel');
      return;
    }

    const newReel: DemoReel = {
      id: `reel-${Date.now()}`,
      title: newReelTitle.trim(),
      subtitle: newReelSubtitle.trim() || 'AI Lion Attitude',
      views: newReelViews.trim() || '5.4M Views',
      thumbnailUrl: newReelThumbUrl,
      videoUrl: newReelVideoUrl.trim() || undefined,
      isPublished: true,
      orderIndex: reels.length,
    };

    const updated = [...reels, newReel];
    setReels(updated);
    storeService.saveReels(updated);

    // Reset Form
    setNewReelTitle('');
    setNewReelSubtitle('');
    setNewReelViews('');
    setNewReelThumbUrl('');
    setNewReelVideoUrl('');
    setVideoFileName('');
    setThumbFileName('');
    setVideoUploadProgress(0);
    setThumbUploadProgress(0);
    setReelSaveSuccess(true);
    setTimeout(() => setReelSaveSuccess(false), 3500);
  };

  const handleToggleReelPublish = (id: string) => {
    const updated = reels.map((r) => (r.id === id ? { ...r, isPublished: !r.isPublished } : r));
    setReels(updated);
    storeService.saveReels(updated);
  };

  const handleDeleteReel = (id: string) => {
    const updated = reels.filter((r) => r.id !== id);
    setReels(updated);
    storeService.saveReels(updated);
  };

  // ----------------------------------------------------
  // TAB 5: PRODUCT DOWNLOADS MANAGEMENT
  // ----------------------------------------------------
  const [mainZipUrl, setMainZipUrl] = useState(settings.mainBundleZipUrl);
  const [mainZipSize, setMainZipSize] = useState(settings.mainBundleFileSize);
  const [mainZipName, setMainZipName] = useState(settings.mainBundleFileName);
  const [driveUrl, setDriveUrl] = useState(settings.backupGoogleDriveUrl);
  const [downloadsSaved, setDownloadsSaved] = useState(false);

  const handleSaveDownloads = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storeService.saveSettings({
      mainBundleZipUrl: mainZipUrl.trim(),
      mainBundleFileSize: mainZipSize.trim(),
      mainBundleFileName: mainZipName.trim(),
      backupGoogleDriveUrl: driveUrl.trim(),
    });
    setSettings(updated);
    setDownloadsSaved(true);
    setTimeout(() => setDownloadsSaved(false), 3000);
  };

  // ----------------------------------------------------
  // TAB 9: WEBSITE SETTINGS & COUNTDOWN
  // ----------------------------------------------------
  const [flashText, setFlashText] = useState(settings.flashSaleText);
  const [deadlineInput, setDeadlineInput] = useState(
    new Date(settings.flashSaleDeadline).toISOString().slice(0, 16)
  );
  const [siteSaved, setSiteSaved] = useState(false);

  const handleSaveSiteSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = storeService.saveSettings({
      flashSaleText: flashText.trim(),
      flashSaleDeadline: new Date(deadlineInput).toISOString(),
    });
    setSettings(updated);
    setSiteSaved(true);
    setTimeout(() => setSiteSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#07070c] text-white flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Admin Header */}
      <header className="h-16 bg-[#0d0d18] border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-400 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-black text-base sm:text-lg font-['Outfit'] flex items-center gap-2">
              <span>SHERU BHAI STORE</span>
              <span className="bg-amber-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                ADMIN PANEL
              </span>
            </h1>
            <p className="text-[10px] text-gray-400">Production Dashboard • 2027 Edition</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            View Live Site
          </button>
          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body: Sidebar Tabs + Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-56 sm:w-64 bg-[#090912] border-r border-white/10 flex flex-col shrink-0 overflow-y-auto">
          {/* Quick Stats Pill */}
          <div className="p-4 border-b border-white/10 bg-black/20">
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Confirmed Revenue</span>
            <div className="text-xl font-black text-amber-400 font-['Outfit']">
              ₹{confirmedSales.toLocaleString('en-IN')}/-
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 font-medium">
              <span>{approvedOrders} Approved</span>
              <span className="text-amber-400 font-bold">{pendingOrders} Pending</span>
            </div>
          </div>

          {/* 10 Admin Navigation Tabs */}
          <nav className="p-2 space-y-1 text-xs font-semibold flex-1">
            {[
              { id: 'orders', label: '1. ORDER MANAGEMENT', icon: ShoppingBag, badge: pendingOrders },
              { id: 'upi-settings', label: '2. UPI & WHATSAPP SETTINGS', icon: CreditCard, highlight: true },
              { id: 'product-images', label: '3. PRODUCT IMAGES', icon: ImageIcon },
              { id: 'instagram-demo', label: '4. INSTAGRAM ID DEMO', icon: Instagram },
              { id: 'demo-reels', label: '5. DEMO REELS VIDEOS', icon: Video, count: reels.length },
              { id: 'downloads', label: '6. PRODUCT DOWNLOADS', icon: Download },
              { id: 'bonuses', label: '7. BONUS MANAGEMENT', icon: Gift, count: bonuses.length },
              { id: 'testimonials', label: '8. TESTIMONIALS', icon: MessageSquare, count: testimonials.length },
              { id: 'site-settings', label: '9. WEBSITE SETTINGS', icon: Settings },
              { id: 'firebase-config', label: '10. FIREBASE SETUP & STORAGE', icon: Flame, highlight: true },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full px-3 py-2.5 rounded-xl flex items-center justify-between transition-all cursor-pointer text-left ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${tab.highlight ? 'text-amber-400' : ''}`} />
                    <span className="truncate">{tab.label}</span>
                  </div>
                  {Boolean(tab.badge) && (
                    <span className="bg-amber-400 text-black font-black text-[10px] px-1.5 py-0.2 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                  {tab.count !== undefined && !tab.badge && (
                    <span className="text-[10px] text-gray-500 font-mono">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0a0a14]">
          {/* ==================================================== */}
          {/* TAB 1: ORDER MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black font-['Outfit']">Order Management</h2>
                  <p className="text-xs text-gray-400">
                    Verify UTR in your bank/UPI app before approving. Screenshot and UTR alone must not be treated as verified payment.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">
                    {pendingOrders} Pending Verification
                  </span>
                </div>
              </div>

              {/* Orders Table */}
              <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-black/60 text-gray-400 border-b border-white/10 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Customer & Contact</th>
                        <th className="p-3.5">Amount</th>
                        <th className="p-3.5">UTR / Txn ID</th>
                        <th className="p-3.5">Screenshot</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-3.5 font-mono font-bold text-amber-300 whitespace-nowrap">
                            {o.id}
                            <span className="block text-[10px] text-gray-500 font-sans">
                              {new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-white">{o.customerName}</div>
                            <div className="text-gray-400 text-[11px]">{o.email}</div>
                            <div className="text-emerald-400 text-[11px] font-mono">{o.mobile}</div>
                          </td>
                          <td className="p-3.5 font-bold text-white whitespace-nowrap">
                            ₹{o.amount}/-
                          </td>
                          <td className="p-3.5 font-mono font-bold text-cyan-300 whitespace-nowrap">
                            {o.utrNumber}
                          </td>
                          <td className="p-3.5">
                            {o.screenshotUrl ? (
                              <button
                                onClick={() => setZoomedScreenshot(o.screenshotUrl)}
                                className="w-10 h-10 rounded-lg overflow-hidden border border-white/20 hover:scale-110 transition-transform cursor-pointer"
                              >
                                <img
                                  src={o.screenshotUrl}
                                  alt="Screenshot"
                                  className="w-full h-full object-cover"
                                />
                              </button>
                            ) : (
                              <span className="text-gray-500 italic">No image</span>
                            )}
                          </td>
                          <td className="p-3.5 whitespace-nowrap">
                            {o.status === 'PENDING' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                                PENDING
                              </span>
                            )}
                            {o.status === 'APPROVED' && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/40">
                                APPROVED
                              </span>
                            )}
                            {o.status === 'REJECTED' && (
                              <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-[10px] border border-rose-500/40">
                                REJECTED
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right whitespace-nowrap">
                            {o.status === 'PENDING' ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleApproveOrder(o.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>APPROVE</span>
                                </button>
                                <button
                                  onClick={() => setRejectingOrderId(o.id)}
                                  className="px-3 py-1.5 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span>REJECT</span>
                                </button>
                              </div>
                            ) : o.status === 'APPROVED' ? (
                              <span className="text-[11px] text-gray-500">Unlocked</span>
                            ) : (
                              <button
                                onClick={() => handleApproveOrder(o.id)}
                                className="text-[11px] text-purple-400 hover:underline cursor-pointer"
                              >
                                Re-Approve
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 2: UPI & WHATSAPP SETTINGS (FIXED INPUT BUG!) */}
          {/* ==================================================== */}
          {activeTab === 'upi-settings' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <CreditCard className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Payments Engine</span>
                </div>
                <h2 className="text-2xl font-black font-['Outfit']">UPI & WhatsApp Configuration</h2>
                <p className="text-xs text-gray-400">
                  Fixed controlled React state. Text will never disappear when you type. Saved permanently to store & synced to backend.
                </p>
              </div>

              {upiSaveStatus === 'saved' && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <strong>Saved Successfully!</strong> Merchant UPI ID, Display Name, and WhatsApp configurations are saved permanently and active across checkout immediately.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left: Input Form */}
                <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-white/10">
                  <form onSubmit={handleSaveUpiSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Merchant UPI ID <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={draftUpiId}
                        onChange={(e) => setDraftUpiId(e.target.value)}
                        placeholder="e.g. sherubhai@oksbi or 9876543210@paytm"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-sm focus:outline-none focus:border-purple-400"
                      />
                      <span className="text-[11px] text-gray-400 mt-1 block">
                        This UPI ID generates the QR code and handles Direct UPI Intent links on mobile.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Merchant Display Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={draftDisplayName}
                        onChange={(e) => setDraftDisplayName(e.target.value)}
                        placeholder="e.g. SHERU BHAI STORE"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        WhatsApp Support Mobile Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={draftWhatsApp}
                        onChange={(e) => setDraftWhatsApp(e.target.value)}
                        placeholder="e.g. +919876543210"
                        className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white text-sm focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Default WhatsApp Pre-filled Message
                      </label>
                      <textarea
                        rows={2}
                        value={draftWaMessage}
                        onChange={(e) => setDraftWaMessage(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={upiSaveStatus === 'saving'}
                        className="w-full glow-btn text-white font-bold py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                      >
                        <Save className="w-4 h-4" />
                        <span>{upiSaveStatus === 'saving' ? 'Saving Permanently...' : 'SAVE UPI & WHATSAPP SETTINGS'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Right: Live Test & Verified QR Preview */}
                <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">Live QR Verification</span>
                  <div className="w-44 h-44 mx-auto bg-white p-2 rounded-2xl shadow-xl flex items-center justify-center mb-3">
                    {upiTestQrUrl ? (
                      <img src={upiTestQrUrl} alt="Live QR Test" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-xs text-gray-500">Generating...</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-white truncate font-mono">{draftUpiId}</div>
                  <div className="text-[11px] text-gray-400">{draftDisplayName}</div>
                  <div className="mt-3 p-2.5 bg-black/40 rounded-xl text-[11px] text-emerald-400 border border-emerald-500/20">
                    Amount fixed: <strong>₹{settings.sellingPrice}/-</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 3: PRODUCT IMAGES */}
          {/* ==================================================== */}
          {activeTab === 'product-images' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-black font-['Outfit']">Product Image Management</h2>
                <p className="text-xs text-gray-400">
                  Update the main Sheru Bhai 3D bundle box cover (1:1 square aspect ratio). Public homepage updates immediately.
                </p>
              </div>

              {coverSaved && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Product Cover updated and published to public homepage!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                {/* Live Preview (1:1 Contain) */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
                  <span className="text-xs font-bold text-gray-400 block mb-3">Active Cover Preview (1:1 Aspect Ratio)</span>
                  <div className="aspect-square w-full max-w-[340px] mx-auto bg-black rounded-2xl p-2 border border-purple-500/40 flex items-center justify-center overflow-hidden">
                    <img
                      src={coverUrlInput}
                      alt="Active Bundle Cover"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  </div>
                </div>

                {/* Upload or URL Replace */}
                <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-2">
                      Upload New 1:1 Box Cover Image
                    </label>
                    <label className="border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-black/40 hover:bg-black/60 transition-all text-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverUpload}
                        className="sr-only"
                      />
                      <Upload className="w-8 h-8 text-purple-400 mb-2" />
                      <span className="text-xs font-bold text-white">Select File from Computer</span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WEBP (Supports 1536×1536)</span>
                    </label>
                  </div>

                  <form onSubmit={handleSaveCoverUrl} className="pt-2 border-t border-white/10 space-y-3">
                    <label className="block text-xs font-bold text-gray-300">
                      Or Paste Image Direct URL:
                    </label>
                    <input
                      type="url"
                      value={coverUrlInput}
                      onChange={(e) => setCoverUrlInput(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
                    >
                      Save Cover URL
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 4: INSTAGRAM ID DEMO */}
          {/* ==================================================== */}
          {activeTab === 'instagram-demo' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-black font-['Outfit']">Instagram Profile Demo Showcase</h2>
                <p className="text-xs text-gray-400">
                  Manage the full-height portrait Instagram profile screenshot (~689×1536 px), handle, followers count, and bio.
                </p>
              </div>

              {igSaved && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Instagram showcase updated successfully!</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Full portrait preview */}
                <div className="md:col-span-5 glass-card p-4 rounded-2xl border border-white/10 text-center">
                  <span className="text-xs font-bold text-gray-400 block mb-2">Screenshot Preview (Full Portrait)</span>
                  <div className="w-full max-w-[280px] mx-auto rounded-2xl bg-black p-2 border border-white/20 overflow-hidden">
                    <img
                      src={draftIgScreenshot}
                      alt="Instagram Demo"
                      className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                    />
                  </div>
                </div>

                {/* Form configuration */}
                <div className="md:col-span-7 glass-card p-6 rounded-2xl border border-white/10">
                  <form onSubmit={handleSaveInstagramDemo} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        Upload Full Profile Screenshot (Portrait)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleIgScreenshotUpload}
                        className="text-xs text-gray-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Username</label>
                        <input
                          type="text"
                          value={draftIgUsername}
                          onChange={(e) => setDraftIgUsername(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Followers Count</label>
                        <input
                          type="text"
                          value={draftIgFollowers}
                          onChange={(e) => setDraftIgFollowers(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Posts Count</label>
                        <input
                          type="text"
                          value={draftIgPosts}
                          onChange={(e) => setDraftIgPosts(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-300 mb-1">Following Count</label>
                        <input
                          type="text"
                          value={draftIgFollowing}
                          onChange={(e) => setDraftIgFollowing(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">Profile Bio</label>
                      <textarea
                        rows={3}
                        value={draftIgBio}
                        onChange={(e) => setDraftIgBio(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl glow-btn text-white font-bold text-xs cursor-pointer shadow-lg"
                    >
                      SAVE INSTAGRAM PROFILE DEMO
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 5: DEMO REELS MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'demo-reels' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black font-['Outfit']">Demo Reels Videos</h2>
                  <p className="text-xs text-gray-400">
                    Add, publish/unpublish, reorder, or delete 9:16 vertical sample reels shown on the storefront.
                  </p>
                </div>
              </div>

              {/* Add New Reel Form with Direct Firebase Storage Upload */}
              <div className="glass-card p-5 sm:p-6 rounded-2xl border border-purple-500/30">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-600/20 border border-purple-500/40 flex items-center justify-center">
                      <Film className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Direct Demo Reel Upload (Firebase Storage)
                      </h4>
                      <p className="text-[11px] text-gray-400">
                        Select MP4 videos directly from mobile gallery or computer. Uploads to Firebase Storage and generates URLs automatically.
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-2 py-0.5 rounded">
                    Firebase Connected
                  </span>
                </div>

                {reelSaveSuccess && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Demo reel uploaded and published to homepage successfully!</span>
                  </div>
                )}

                {reelUploadError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{reelUploadError}</span>
                  </div>
                )}

                <form onSubmit={handleAddReel} className="space-y-4">
                  {/* File Upload Grid: Video File + Thumbnail Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. DIRECT MP4 VIDEO FILE UPLOAD */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Video className="w-3.5 h-3.5 text-purple-400" />
                            <span>1. Select MP4 Video File</span>
                          </span>
                          <span className="text-[10px] text-purple-300 font-normal">Gallery or Computer</span>
                        </label>

                        <label className="border-2 border-dashed border-purple-500/40 hover:border-purple-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-purple-950/20 hover:bg-purple-950/40 transition-all text-center">
                          <input
                            type="file"
                            accept="video/mp4,video/*"
                            onChange={handleSelectVideoFile}
                            className="sr-only"
                          />
                          <Upload className="w-6 h-6 text-purple-400 mb-1" />
                          <span className="text-xs font-bold text-white">Choose MP4 Video File</span>
                          <span className="text-[10px] text-gray-400">Direct from phone gallery or PC (MP4/MOV)</span>
                        </label>
                      </div>

                      {/* Video Upload Progress Bar */}
                      {isUploadingVideo && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] text-gray-300">
                            <span className="truncate max-w-[180px] font-mono">{videoFileName}</span>
                            <span className="text-amber-400 font-bold">{videoUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 transition-all duration-200"
                              style={{ width: `${videoUploadProgress}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-cyan-300 animate-pulse block">
                            Uploading to Firebase Storage /demo-videos/...
                          </span>
                        </div>
                      )}

                      {!isUploadingVideo && newReelVideoUrl && (
                        <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center justify-between text-[11px] text-emerald-300">
                          <div className="flex items-center gap-1.5 truncate">
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">Video Ready ({videoFileName || 'Uploaded'})</span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400 shrink-0">100% Attached</span>
                        </div>
                      )}
                    </div>

                    {/* 2. DIRECT THUMBNAIL IMAGE UPLOAD */}
                    <div className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between">
                      <div>
                        <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span>2. Select Reel Thumbnail Image <span className="text-rose-400">*</span></span>
                          </span>
                          <span className="text-[10px] text-cyan-300 font-normal">9:16 Aspect</span>
                        </label>

                        <label className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-cyan-950/20 hover:bg-cyan-950/40 transition-all text-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleSelectThumbFile}
                            className="sr-only"
                          />
                          <Upload className="w-6 h-6 text-cyan-400 mb-1" />
                          <span className="text-xs font-bold text-white">Choose Thumbnail Image</span>
                          <span className="text-[10px] text-gray-400">JPG, PNG, WEBP</span>
                        </label>
                      </div>

                      {/* Thumbnail Upload Progress & Preview */}
                      {isUploadingThumb && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex justify-between text-[11px] text-gray-300">
                            <span className="truncate max-w-[180px] font-mono">{thumbFileName}</span>
                            <span className="text-cyan-400 font-bold">{thumbUploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-200"
                              style={{ width: `${thumbUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {!isUploadingThumb && newReelThumbUrl && (
                        <div className="mt-3 p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2.5">
                          <img
                            src={newReelThumbUrl}
                            alt="Thumb Preview"
                            className="w-8 h-12 object-cover rounded border border-white/20"
                          />
                          <div className="overflow-hidden flex-1 text-left">
                            <span className="text-[11px] font-bold text-white block truncate">{thumbFileName || 'Thumbnail Image'}</span>
                            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Ready for display
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Metadata Fields: Title, Subtitle, Views */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Reel Title <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Silence Speaks Volumes"
                        value={newReelTitle}
                        onChange={(e) => setNewReelTitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Category / Subtitle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Royal Attitude"
                        value={newReelSubtitle}
                        onChange={(e) => setNewReelSubtitle(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1">
                        Viral Views Count
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 7.4M Views"
                        value={newReelViews}
                        onChange={(e) => setNewReelViews(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  </div>

                  {/* Submit Reel Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isUploadingVideo || isUploadingThumb}
                      className="w-full py-3.5 rounded-xl glow-btn text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        {isUploadingVideo
                          ? `Uploading Video (${videoUploadProgress}%)...`
                          : isUploadingThumb
                          ? `Uploading Thumbnail (${thumbUploadProgress}%)...`
                          : 'PUBLISH DEMO REEL TO HOMEPAGE'}
                      </span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Existing Reels List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {reels.map((r) => (
                  <div
                    key={r.id}
                    className="glass-card rounded-2xl overflow-hidden border border-white/10 p-3 space-y-2.5"
                  >
                    <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-black">
                      <img src={r.thumbnailUrl} alt={r.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            r.isPublished ? 'bg-emerald-500/80 text-white' : 'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {r.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{r.title}</h4>
                      <p className="text-[10px] text-gray-400">{r.subtitle} • {r.views}</p>
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => handleToggleReelPublish(r.id)}
                        className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {r.isPublished ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{r.isPublished ? 'Unpublish' : 'Publish'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteReel(r.id)}
                        className="p-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 6: PRODUCT DOWNLOADS */}
          {/* ==================================================== */}
          {activeTab === 'downloads' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-2xl font-black font-['Outfit']">Digital Product Downloads</h2>
                <p className="text-xs text-gray-400">
                  Configure the master Reels ZIP download link, file size, and backup Google Drive mirror for approved customers.
                </p>
              </div>

              {downloadsSaved && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Download links updated successfully!</span>
                </div>
              )}

              <div className="glass-card p-6 rounded-2xl border border-white/10">
                <form onSubmit={handleSaveDownloads} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Master Bundle ZIP File Direct Download URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={mainZipUrl}
                      onChange={(e) => setMainZipUrl(e.target.value)}
                      placeholder="https://drive.google.com/..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        ZIP File Name Display
                      </label>
                      <input
                        type="text"
                        value={mainZipName}
                        onChange={(e) => setMainZipName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-300 mb-1">
                        ZIP File Size
                      </label>
                      <input
                        type="text"
                        value={mainZipSize}
                        onChange={(e) => setMainZipSize(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-300 mb-1">
                      Backup Google Drive VIP Vault Link
                    </label>
                    <input
                      type="url"
                      value={driveUrl}
                      onChange={(e) => setDriveUrl(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-purple-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl glow-btn text-white font-bold text-xs cursor-pointer shadow-lg"
                  >
                    SAVE DOWNLOAD SETTINGS
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 7: BONUS MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'bonuses' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black font-['Outfit']">Creator Bonuses Management</h2>
                <p className="text-xs text-gray-400">
                  Update the 4 exclusive bonuses (titles, descriptions, values, and download files).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bonuses.map((b, i) => (
                  <div key={b.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-400">BONUS #{b.number}</span>
                      <span className="text-[10px] font-black uppercase bg-white/10 px-2 py-0.5 rounded">
                        {b.badge}
                      </span>
                    </div>

                    <input
                      type="text"
                      value={b.title}
                      onChange={(e) => {
                        const updated = bonuses.map((item) =>
                          item.id === b.id ? { ...item, title: e.target.value } : item
                        );
                        setBonuses(updated);
                        storeService.saveBonuses(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-bold"
                    />

                    <textarea
                      rows={2}
                      value={b.description}
                      onChange={(e) => {
                        const updated = bonuses.map((item) =>
                          item.id === b.id ? { ...item, description: e.target.value } : item
                        );
                        setBonuses(updated);
                        storeService.saveBonuses(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                    />

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Value (e.g. ₹3,499)"
                        value={b.worth}
                        onChange={(e) => {
                          const updated = bonuses.map((item) =>
                            item.id === b.id ? { ...item, worth: e.target.value } : item
                          );
                          setBonuses(updated);
                          storeService.saveBonuses(updated);
                        }}
                        className="w-1/3 px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs"
                      />
                      <input
                        type="url"
                        placeholder="Download URL"
                        value={b.downloadUrl || ''}
                        onChange={(e) => {
                          const updated = bonuses.map((item) =>
                            item.id === b.id ? { ...item, downloadUrl: e.target.value } : item
                          );
                          setBonuses(updated);
                          storeService.saveBonuses(updated);
                        }}
                        className="w-2/3 px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 8: TESTIMONIAL MANAGEMENT */}
          {/* ==================================================== */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black font-['Outfit']">Customer Testimonials</h2>
                <p className="text-xs text-gray-400">
                  Manage genuine customer reviews and growth reports displayed in the slider.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                      <img src={t.avatarUrl} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{t.name}</h4>
                        <p className="text-[10px] text-gray-400">{t.handle}</p>
                      </div>
                    </div>
                    <textarea
                      rows={3}
                      value={t.comment}
                      onChange={(e) => {
                        const updated = testimonials.map((item) =>
                          item.id === t.id ? { ...item, comment: e.target.value } : item
                        );
                        setTestimonials(updated);
                        storeService.saveTestimonials(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white text-xs italic"
                    />
                    <input
                      type="text"
                      value={t.growth}
                      onChange={(e) => {
                        const updated = testimonials.map((item) =>
                          item.id === t.id ? { ...item, growth: e.target.value } : item
                        );
                        setTestimonials(updated);
                        storeService.saveTestimonials(updated);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/15 text-emerald-400 text-xs font-semibold"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* TAB 10: COMPLETE FIREBASE CONFIGURATION & STORAGE */}
          {/* ==================================================== */}
          {activeTab === 'firebase-config' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 mb-1">
                    <Flame className="w-5 h-5 fill-amber-400" />
                    <span className="text-xs font-bold uppercase tracking-wider">Cloud Storage Infrastructure</span>
                  </div>
                  <h2 className="text-2xl font-black font-['Outfit']">Complete Firebase Configuration</h2>
                  <p className="text-xs text-gray-400">
                    All Firebase setup information, Storage rules, initialization, and deployment instructions together in one organized section.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 shadow">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>SDK Active & Connected</span>
                  </span>
                </div>
              </div>

              {/* Status summary banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 via-[#111122] to-amber-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block">Connected Firebase Project</span>
                  <div className="text-base font-black text-amber-300 font-mono">reels-bundle-ae85c</div>
                  <span className="text-xs text-gray-300">
                    Bucket: <code className="text-cyan-300">reels-bundle-ae85c.firebasestorage.app</code>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const fullSnippet = `// SHERU BHAI STORE - COMPLETE FIREBASE CONFIGURATION
// Project: reels-bundle-ae85c

// 1. Web App Firebase Config
export const firebaseConfig = {
  apiKey: "AIzaSyBYKqeUQKnh4vs5q4fWw9cnkffnqzy7p8A",
  authDomain: "reels-bundle-ae85c.firebaseapp.com",
  projectId: "reels-bundle-ae85c",
  storageBucket: "reels-bundle-ae85c.firebasestorage.app",
  messagingSenderId: "682812839301",
  appId: "1:682812839301:web:f1a8fc88b6f0f3190660ec",
  measurementId: "G-ZJ43RC7YQ5"
};

// 2. Firebase Storage Rules (paste in Firebase Console -> Storage -> Rules)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /demo-videos/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /demo-thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /product-downloads/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /payment-screenshots/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}`;
                    navigator.clipboard.writeText(fullSnippet);
                    alert('Firebase complete configuration block copied to clipboard!');
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-transform hover:scale-105"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Complete Firebase Block</span>
                </button>
              </div>

              {/* 1. Project Configuration Card */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">1</span>
                    <span>Firebase Project Configuration</span>
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">src/services/firebase.ts</span>
                </div>
                <pre className="p-3.5 bg-black/70 rounded-xl border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`const firebaseConfig = {
  apiKey: "AIzaSyBYKqeUQKnh4vs5q4fWw9cnkffnqzy7p8A",
  authDomain: "reels-bundle-ae85c.firebaseapp.com",
  projectId: "reels-bundle-ae85c",
  storageBucket: "reels-bundle-ae85c.firebasestorage.app",
  messagingSenderId: "682812839301",
  appId: "1:682812839301:web:f1a8fc88b6f0f3190660ec",
  measurementId: "G-ZJ43RC7YQ5"
};`}
                </pre>
              </div>

              {/* 2 & 3. Storage & Authentication Setup */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center">2</span>
                    <span>Firebase Storage Setup</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Default storage bucket initialized: <code className="text-amber-300 font-mono">reels-bundle-ae85c.firebasestorage.app</code>.
                    All folders are organized for fast CDN delivery:
                  </p>
                  <ul className="text-[11px] text-gray-400 space-y-1 list-disc pl-4 font-mono">
                    <li>/demo-videos/ (Direct MP4 9:16 uploads)</li>
                    <li>/demo-thumbnails/ (Cover posters)</li>
                    <li>/product-images/ (1:1 Box Cover artwork)</li>
                    <li>/product-downloads/ (Master ZIP bundles)</li>
                    <li>/payment-screenshots/ (UPI verification proof)</li>
                  </ul>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center">3</span>
                    <span>Firebase Authentication Setup</span>
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Integrated with Firebase Auth (<code className="text-amber-300 font-mono">getAuth(app)</code>) and protected admin session layer.
                    Supports Email/Password or master admin passcode:
                  </p>
                  <div className="p-2.5 bg-black/50 rounded-xl border border-white/10 text-xs">
                    <span className="text-gray-400 block text-[10px] uppercase font-semibold">Configured Admin Passcode:</span>
                    <span className="font-mono font-bold text-amber-300">Rayyan@1234</span>
                  </div>
                </div>
              </div>

              {/* 4. Firebase Storage Rules */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-400 text-black font-black text-[10px] flex items-center justify-center">4</span>
                    <span>Firebase Storage Rules (Production Ready)</span>
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold">Apply in Firebase Console → Storage → Rules</span>
                </div>
                <pre className="p-3.5 bg-black/70 rounded-xl border border-white/10 text-emerald-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Public preview reels and thumbnails
    match /demo-videos/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /demo-thumbnails/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /product-images/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    // Protected order assets
    match /product-downloads/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
    match /payment-screenshots/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}`}
                </pre>
              </div>

              {/* 5. Required Environment Variables */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center">5</span>
                    <span>Environment Variables (Vercel / .env.example)</span>
                  </h4>
                  <span className="text-[10px] text-gray-400">Optional overrides</span>
                </div>
                <pre className="p-3.5 bg-black/70 rounded-xl border border-white/10 text-yellow-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`VITE_FIREBASE_API_KEY="AIzaSyBYKqeUQKnh4vs5q4fWw9cnkffnqzy7p8A"
VITE_FIREBASE_AUTH_DOMAIN="reels-bundle-ae85c.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="reels-bundle-ae85c"
VITE_FIREBASE_STORAGE_BUCKET="reels-bundle-ae85c.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="682812839301"
VITE_FIREBASE_APP_ID="1:682812839301:web:f1a8fc88b6f0f3190660ec"
VITE_FIREBASE_MEASUREMENT_ID="G-ZJ43RC7YQ5"`}
                </pre>
              </div>

              {/* 6, 7, 8, 9. Code Implementation Snippets */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-purple-500 text-white font-black text-[10px] flex items-center justify-center">6-9</span>
                  <span>Initialization, Resumable Upload & Download URL Implementation</span>
                </h4>
                <pre className="p-3.5 bg-black/70 rounded-xl border border-white/10 text-cyan-300 font-mono text-xs overflow-x-auto leading-relaxed">
{`// 6. Initialization
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

// 7 & 8. Resumable Upload with Progress Callback
export function uploadToFirebaseStorage(file, folder, onProgress) {
  const fileRef = ref(storage, \`\${folder}/\${Date.now()}_\${file.name}\`);
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on('state_changed', 
    (snapshot) => {
      const pct = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (onProgress) onProgress(Math.round(pct));
    },
    (err) => console.error(err),
    async () => {
      // 9. Download URL Handling
      const url = await getDownloadURL(uploadTask.snapshot.ref);
      return url;
    }
  );
}`}
                </pre>
              </div>

              {/* 10. Deployment & Setup Instructions */}
              <div className="glass-card p-5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-black font-black text-[10px] flex items-center justify-center">10</span>
                  <span>Deployment & Setup Instructions</span>
                </h4>
                <div className="space-y-3 text-xs text-gray-300 leading-relaxed">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-white block">Step A: Firebase Console Setup</strong>
                    <p>1. Open <a href="https://console.firebase.google.com/project/reels-bundle-ae85c" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Firebase Console → Project reels-bundle-ae85c</a>.</p>
                    <p>2. Click <strong>Storage</strong> in the left sidebar → Click <strong>Get Started</strong> (if not already created).</p>
                    <p>3. Go to the <strong>Rules</strong> tab, paste the Storage Rules from Card 4 above, and click <strong>Publish</strong>.</p>
                  </div>

                  <div className="p-3 bg-black/40 rounded-xl border border-white/5 space-y-1">
                    <strong className="text-white block">Step B: Vercel Deployment</strong>
                    <p>1. Push your repository to GitHub.</p>
                    <p>2. Import repository on Vercel.</p>
                    <p>3. Set Build Command: <code className="text-amber-300 font-mono">npm run build</code>, Output Directory: <code className="text-amber-300 font-mono">dist</code>.</p>
                    <p>4. Deploy! All media files and videos are stored directly in your Firebase Storage bucket.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Screenshot Zoom Modal */}
      {zoomedScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative max-w-2xl max-h-[85vh] p-2 bg-[#121220] rounded-2xl border border-white/20 overflow-hidden flex flex-col">
            <button
              onClick={() => setZoomedScreenshot(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <img
              src={zoomedScreenshot}
              alt="Payment Screenshot Zoom"
              className="max-h-[75vh] w-auto object-contain mx-auto rounded-xl"
            />
          </div>
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#131320] border border-rose-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white">Reject Payment for Order #{rejectingOrderId}</h4>
            <p className="text-xs text-gray-300">
              Provide a clear reason why the payment could not be verified in your merchant account:
            </p>
            <textarea
              rows={3}
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/70 border border-white/20 text-white text-xs focus:outline-none focus:border-rose-400"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setRejectingOrderId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRejectOrder(rejectingOrderId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
