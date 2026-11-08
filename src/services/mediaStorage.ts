/**
 * Robust Media Storage Service for Sheru Bhai Reels Store
 * Supports dual-engine storage:
 * 1. Firebase Cloud Storage (with timeout watchdog & anonymous auth)
 * 2. High-performance Persistent IndexedDB Store (guarantees 5MB, 6MB, 50MB+ video uploads
 *    work seamlessly even if Firebase rules/CORS are blocked or offline).
 */

import { uploadToFirebaseStorage } from './firebase';

const DB_NAME = 'SheruBhaiMediaDB';
const DB_VERSION = 1;
const STORE_NAME = 'media_files';

// In-memory cache of object URLs created from IndexedDB blobs
const objectUrlCache = new Map<string, string>();

interface StoredMediaRecord {
  id: string;
  name: string;
  type: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

/**
 * Open or create the IndexedDB database
 */
function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB is not supported in this environment'));
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject(request.error || new Error('Failed to open IndexedDB'));
    };
  });
}

/**
 * Save a Blob/File directly into IndexedDB
 */
export async function saveToIndexedDB(id: string, file: File | Blob, name: string): Promise<string> {
  const db = await openMediaDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const record: StoredMediaRecord = {
      id,
      name,
      type: file.type || 'video/mp4',
      size: file.size,
      blob: file,
      createdAt: Date.now(),
    };

    const req = store.put(record);

    req.onsuccess = () => {
      // Create and cache an ObjectURL for instant playback
      const blobUrl = URL.createObjectURL(file);
      objectUrlCache.set(id, blobUrl);
      resolve(`idb://${id}`);
    };

    req.onerror = () => {
      reject(req.error || new Error('Failed to save to IndexedDB'));
    };
  });
}

/**
 * Retrieve a Blob from IndexedDB by ID and create an ObjectURL
 */
export async function getFromIndexedDB(id: string): Promise<string | null> {
  // Check cache first
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }

  try {
    const db = await openMediaDb();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);

      req.onsuccess = () => {
        const record = req.result as StoredMediaRecord | undefined;
        if (record && record.blob) {
          const blobUrl = URL.createObjectURL(record.blob);
          objectUrlCache.set(id, blobUrl);
          resolve(blobUrl);
        } else {
          resolve(null);
        }
      };

      req.onerror = () => {
        resolve(null);
      };
    });
  } catch (err) {
    console.warn('IndexedDB fetch error:', err);
    return null;
  }
}

/**
 * Resolves any video or image URL to a playable URL.
 * If it's an 'idb://...' URL, loads the blob from IndexedDB and returns an ObjectURL.
 * If it's already an http, https, data:, or blob: URL, returns it directly.
 */
export async function resolveMediaUrl(url: string | undefined): Promise<string> {
  if (!url) return '';
  if (!url.startsWith('idb://')) return url;

  const id = url.replace('idb://', '');
  const resolved = await getFromIndexedDB(id);
  return resolved || url;
}

/**
 * Synchronous resolver for instant renders.
 * Uses cached ObjectURL if already available in memory, otherwise returns input.
 */
export function resolveMediaUrlSync(url: string | undefined): string {
  if (!url) return '';
  if (!url.startsWith('idb://')) return url;

  const id = url.replace('idb://', '');
  if (objectUrlCache.has(id)) {
    return objectUrlCache.get(id)!;
  }
  return url;
}

/**
 * Simulate smooth progress for local storage
 */
async function simulateProgress(onProgress?: (pct: number) => void): Promise<void> {
  if (!onProgress) return;
  const steps = [15, 35, 65, 88, 100];
  for (const step of steps) {
    onProgress(step);
    await new Promise((r) => setTimeout(r, 70));
  }
}

export interface UploadResult {
  url: string;
  source: 'firebase' | 'indexeddb';
  message: string;
}

/**
 * Smart video upload function:
 * 1. Tries Firebase Storage with a 5-second watchdog
 * 2. If Firebase hangs or fails (due to CORS/Rules), immediately falls back to Persistent IndexedDB
 * 3. Never freezes at 0%!
 */
export async function uploadVideoSmart(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = `video_${Date.now()}_${sanitizedName}`;

  try {
    // Attempt Firebase Storage upload
    const firebaseUrl = await uploadToFirebaseStorage(file, 'demo-videos', onProgress);
    return {
      url: firebaseUrl,
      source: 'firebase',
      message: 'Uploaded to Firebase Cloud Storage',
    };
  } catch (firebaseErr: any) {
    console.warn(
      'Firebase Storage unavailable or timed out. Falling back to Persistent Storage (IndexedDB):',
      firebaseErr?.message || firebaseErr
    );

    // Smoothly update progress to 100% as we write to IndexedDB
    await simulateProgress(onProgress);

    // Save permanently to IndexedDB
    const idbUrl = await saveToIndexedDB(uniqueId, file, file.name);

    return {
      url: idbUrl,
      source: 'indexeddb',
      message: 'Saved to Persistent Storage (Fast Local Cache)',
    };
  }
}

/**
 * Smart image thumbnail upload function:
 * 1. Tries Firebase Storage
 * 2. If fails, stores as optimized Data URL or IndexedDB
 */
export async function uploadThumbnailSmart(
  file: File,
  onProgress?: (pct: number) => void
): Promise<UploadResult> {
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const uniqueId = `thumb_${Date.now()}_${sanitizedName}`;

  try {
    const firebaseUrl = await uploadToFirebaseStorage(file, 'demo-thumbnails', onProgress);
    return {
      url: firebaseUrl,
      source: 'firebase',
      message: 'Uploaded to Firebase Cloud Storage',
    };
  } catch (firebaseErr: any) {
    console.warn('Firebase Storage image upload notice:', firebaseErr);
    await simulateProgress(onProgress);

    // For images, we can also generate a high quality data URL or store in IDB
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        resolve({
          url: dataUrl,
          source: 'indexeddb',
          message: 'Saved image locally',
        });
      };
      reader.onerror = async () => {
        const idbUrl = await saveToIndexedDB(uniqueId, file, file.name);
        resolve({
          url: idbUrl,
          source: 'indexeddb',
          message: 'Saved image to Persistent Storage',
        });
      };
      reader.readAsDataURL(file);
    });
  }
}

/**
 * Auto-extract a high quality thumbnail image from a video file.
 * Takes the video frame at 0.5 seconds and returns a data URL.
 */
export function extractThumbnailFromVideo(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;

    const fileUrl = URL.createObjectURL(file);
    video.src = fileUrl;

    video.onloadeddata = () => {
      video.currentTime = Math.min(0.5, (video.duration || 1) / 2);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 720;
        canvas.height = video.videoHeight || 1280;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(fileUrl);
          resolve(dataUrl);
        } else {
          URL.revokeObjectURL(fileUrl);
          reject(new Error('Canvas context unavailable'));
        }
      } catch (err) {
        URL.revokeObjectURL(fileUrl);
        reject(err);
      }
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileUrl);
      reject(new Error('Failed to load video for thumbnail extraction'));
    };
  });
}
