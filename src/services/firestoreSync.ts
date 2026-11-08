/**
 * Central Cloud Database (Firestore) Synchronization Service
 * Ensures 100% Cross-Browser & Cross-Device Data Persistence for Sheru Bhai Store
 * All browsers (mobile Chrome, Firefox, Samsung Internet, WhatsApp in-app browser, Incognito)
 * fetch and synchronize the latest published store settings, reels, and orders in real-time.
 */

import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { db, auth, uploadToFirebaseStorage } from './firebase';
import { StoreSettings, DemoReel, Order, BonusItem, Testimonial } from '../types/store';
import { DEFAULT_SETTINGS, DEFAULT_REELS, DEFAULT_BONUSES, DEFAULT_TESTIMONIALS } from './storeService';

const SETTINGS_DOC_PATH = 'settings/general';
const REELS_COLLECTION = 'reels';
const ORDERS_COLLECTION = 'orders';
const BONUSES_COLLECTION = 'bonuses';
const TESTIMONIALS_COLLECTION = 'testimonials';

export type CloudSyncStatus = 'connecting' | 'connected' | 'offline' | 'error';

class FirestoreSyncService {
  private status: CloudSyncStatus = 'connecting';
  private statusListeners: Array<(status: CloudSyncStatus, error?: string) => void> = [];
  private settingsListeners: Array<(settings: StoreSettings) => void> = [];
  private reelsListeners: Array<(reels: DemoReel[]) => void> = [];
  private ordersListeners: Array<(orders: Order[]) => void> = [];
  private isInitialized = false;

  private unsubSettings: Unsubscribe | null = null;
  private unsubReels: Unsubscribe | null = null;
  private unsubOrders: Unsubscribe | null = null;

  public getStatus(): CloudSyncStatus {
    return this.status;
  }

  public onStatusChange(callback: (status: CloudSyncStatus, error?: string) => void) {
    this.statusListeners.push(callback);
    callback(this.status);
    return () => {
      this.statusListeners = this.statusListeners.filter((cb) => cb !== callback);
    };
  }

  private setStatus(newStatus: CloudSyncStatus, error?: string) {
    this.status = newStatus;
    this.statusListeners.forEach((cb) => cb(newStatus, error));
  }

  /**
   * Initializes real-time Firestore listeners for cross-device synchronization
   */
  public initListeners() {
    if (this.isInitialized || !db) return;
    this.isInitialized = true;
    this.setStatus('connecting');

    try {
      // 1. Real-time Store Settings sync (covers, prices, countdown, UPI ID)
      const settingsRef = doc(db, 'settings', 'general');
      this.unsubSettings = onSnapshot(
        settingsRef,
        (snap) => {
          if (snap.exists()) {
            const cloudSettings = snap.data() as Partial<StoreSettings>;
            const merged = { ...DEFAULT_SETTINGS, ...cloudSettings };
            // Cache locally for zero-latency initial load
            try {
              localStorage.setItem('sheru_bhai_settings_v1', JSON.stringify(merged));
            } catch {}
            this.settingsListeners.forEach((cb) => cb(merged));
          } else {
            // First time: publish defaults to cloud so doc exists
            this.seedInitialSettings();
          }
          this.setStatus('connected');
        },
        (err) => {
          console.warn('Firestore settings listener notice:', err.message);
          this.setStatus('offline', err.message);
        }
      );

      // 2. Real-time Demo Reels sync (videos & thumbnails)
      const reelsRef = collection(db, REELS_COLLECTION);
      this.unsubReels = onSnapshot(
        reelsRef,
        (snap) => {
          if (!snap.empty) {
            const cloudReels: DemoReel[] = [];
            snap.forEach((docSnap) => {
              cloudReels.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            // Sort by orderIndex
            cloudReels.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            try {
              localStorage.setItem('sheru_bhai_reels_v1', JSON.stringify(cloudReels));
            } catch {}
            this.reelsListeners.forEach((cb) => cb(cloudReels));
          } else {
            this.seedInitialReels();
          }
          this.setStatus('connected');
        },
        (err) => {
          console.warn('Firestore reels listener notice:', err.message);
        }
      );

      // 3. Real-time Orders sync
      const ordersRef = collection(db, ORDERS_COLLECTION);
      this.unsubOrders = onSnapshot(
        ordersRef,
        (snap) => {
          if (!snap.empty) {
            const cloudOrders: Order[] = [];
            snap.forEach((docSnap) => {
              cloudOrders.push({ id: docSnap.id, ...(docSnap.data() as any) });
            });
            cloudOrders.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            try {
              localStorage.setItem('sheru_bhai_orders_v1', JSON.stringify(cloudOrders));
            } catch {}
            this.ordersListeners.forEach((cb) => cb(cloudOrders));
          }
        },
        (err) => {
          console.warn('Firestore orders listener notice:', err.message);
        }
      );
    } catch (err: any) {
      console.warn('Error setting up Firestore subscriptions:', err);
      this.setStatus('offline', err?.message);
    }
  }

  // Seed default settings to Firestore if database document is empty
  private async seedInitialSettings() {
    if (!db) return;
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, DEFAULT_SETTINGS, { merge: true });
    } catch (e) {
      console.warn('Notice seeding default settings to Firestore:', e);
    }
  }

  // Seed default reels to Firestore if empty
  private async seedInitialReels() {
    if (!db) return;
    try {
      for (const reel of DEFAULT_REELS) {
        await setDoc(doc(db, REELS_COLLECTION, reel.id), reel, { merge: true });
      }
    } catch (e) {
      console.warn('Notice seeding default reels to Firestore:', e);
    }
  }

  // --- SUBSCRIBERS ---
  public subscribeSettings(cb: (settings: StoreSettings) => void) {
    this.settingsListeners.push(cb);
    return () => {
      this.settingsListeners = this.settingsListeners.filter((c) => c !== cb);
    };
  }

  public subscribeReels(cb: (reels: DemoReel[]) => void) {
    this.reelsListeners.push(cb);
    return () => {
      this.reelsListeners = this.reelsListeners.filter((c) => c !== cb);
    };
  }

  public subscribeOrders(cb: (orders: Order[]) => void) {
    this.ordersListeners.push(cb);
    return () => {
      this.ordersListeners = this.ordersListeners.filter((c) => c !== cb);
    };
  }

  // --- SAVE OPERATIONS (WRITES TO SHARED FIRESTORE DATABASE) ---

  /**
   * Save store settings (product cover, pricing, UPI details) to shared Firestore
   */
  public async saveSettingsToCloud(partial: Partial<StoreSettings>): Promise<boolean> {
    if (!db) return false;
    try {
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, partial, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to save settings to Firestore:', err);
      return false;
    }
  }

  /**
   * Save or update a single Demo Reel in shared Firestore
   */
  public async saveReelToCloud(reel: DemoReel): Promise<boolean> {
    if (!db) return false;
    try {
      const reelRef = doc(db, REELS_COLLECTION, reel.id);
      await setDoc(reelRef, reel, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to save reel to Firestore:', err);
      return false;
    }
  }

  /**
   * Delete a Demo Reel from shared Firestore
   */
  public async deleteReelFromCloud(reelId: string): Promise<boolean> {
    if (!db) return false;
    try {
      const reelRef = doc(db, REELS_COLLECTION, reelId);
      await deleteDoc(reelRef);
      return true;
    } catch (err) {
      console.error('Failed to delete reel from Firestore:', err);
      return false;
    }
  }

  /**
   * Submit or update an Order in shared Firestore
   */
  public async saveOrderToCloud(order: Order): Promise<boolean> {
    if (!db) return false;
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, order.id);
      await setDoc(orderRef, order, { merge: true });
      return true;
    } catch (err) {
      console.error('Failed to save order to Firestore:', err);
      return false;
    }
  }

  /**
   * Syncs existing locally-saved data from Admin's current browser to Cloud Firestore.
   * This ensures that any cover or reels the admin configured in their mobile Chrome
   * are immediately pushed to Firestore so other devices see them!
   */
  public async syncLocalDataToCloud(
    localSettings: StoreSettings,
    localReels: DemoReel[]
  ): Promise<{ success: boolean; syncedCount: number; error?: string }> {
    if (!db) return { success: false, syncedCount: 0, error: 'Firestore not connected' };

    try {
      let count = 0;
      // 1. Sync settings
      const settingsRef = doc(db, 'settings', 'general');
      await setDoc(settingsRef, localSettings, { merge: true });
      count++;

      // 2. Sync reels
      for (const reel of localReels) {
        await setDoc(doc(db, REELS_COLLECTION, reel.id), reel, { merge: true });
        count++;
      }

      return { success: true, syncedCount: count };
    } catch (err: any) {
      console.error('Local to Cloud sync error:', err);
      return { success: false, syncedCount: 0, error: err?.message || 'Sync failed' };
    }
  }
}

export const firestoreSync = new FirestoreSyncService();
