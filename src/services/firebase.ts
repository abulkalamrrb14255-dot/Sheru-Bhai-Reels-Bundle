import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  FirebaseStorage,
  UploadTask,
} from 'firebase/storage';
import { getAuth, Auth, signInAnonymously } from 'firebase/auth';

// Your web app's Firebase configuration (Provided by user)
export const firebaseConfig = {
  apiKey: "AIzaSyBYKqeUQKnh4vs5q4fWw9cnkffnqzy7p8A",
  authDomain: "reels-bundle-ae85c.firebaseapp.com",
  projectId: "reels-bundle-ae85c",
  storageBucket: "reels-bundle-ae85c.firebasestorage.app",
  messagingSenderId: "682812839301",
  appId: "1:682812839301:web:f1a8fc88b6f0f3190660ec",
  measurementId: "G-ZJ43RC7YQ5",
};

// Initialize Firebase safely (avoid duplicate initialization)
let app: FirebaseApp;
let storage: FirebaseStorage;
let auth: Auth;

try {
  app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  storage = getStorage(app);
  // Set fast retry timeout so uploads never hang indefinitely (default is 10 minutes)
  storage.maxUploadRetryTime = 5000;
  auth = getAuth(app);
} catch (error) {
  console.warn('Firebase initialization warning:', error);
}

export { app, storage, auth };

/**
 * Ensures a background anonymous authentication session so storage rules with
 * `request.auth != null` succeed without requiring manual password login.
 */
async function ensureAuthSession(): Promise<void> {
  if (!auth) return;
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch {
      // Ignore if anonymous auth is not enabled in Firebase Console
    }
  }
}

/**
 * Uploads a file (video, image, zip) to Firebase Storage with resumable progress tracking.
 * Includes an active watchdog to prevent hanging at 0% if blocked by CORS or security rules.
 *
 * @param file The file object (from file input or gallery)
 * @param folder The storage folder (e.g. 'demo-videos', 'demo-thumbnails', 'product-images')
 * @param onProgress Callback invoked with upload percentage (0 - 100)
 * @returns Promise resolving to the public download URL
 */
export async function uploadToFirebaseStorage(
  file: File,
  folder: string,
  onProgress?: (percentage: number) => void
): Promise<string> {
  // Try authenticating in background first
  await ensureAuthSession();

  return new Promise((resolve, reject) => {
    try {
      if (!storage) {
        throw new Error('Firebase Storage is not initialized');
      }

      // Generate a clean safe filename with timestamp
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueFileName = `${Date.now()}_${sanitizedName}`;
      const storagePath = `${folder}/${uniqueFileName}`;
      const fileRef = ref(storage, storagePath);

      // Resumable upload task
      const uploadTask: UploadTask = uploadBytesResumable(fileRef, file, {
        contentType: file.type || (file.name.endsWith('.mp4') ? 'video/mp4' : undefined),
      });

      let hasTransferredBytes = false;
      let isCompleted = false;

      // Watchdog: If after 5 seconds not a single byte has transferred, cancel to prevent 0% freeze
      const watchdogTimer = setTimeout(() => {
        if (!hasTransferredBytes && !isCompleted) {
          console.warn('Firebase Storage upload watchdog triggered: 0 bytes transferred in 5s. Canceling.');
          try {
            uploadTask.cancel();
          } catch {
            // Task cancellation
          }
          reject(new Error('Firebase Storage upload timed out at 0% (Storage Rules / CORS blocked)'));
        }
      }, 5000);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.bytesTransferred > 0) {
            hasTransferredBytes = true;
          }
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(Math.max(1, Math.round(progress)));
          }
        },
        (error) => {
          clearTimeout(watchdogTimer);
          isCompleted = true;
          console.error('Firebase Storage upload failed:', error);
          reject(error);
        },
        async () => {
          clearTimeout(watchdogTimer);
          isCompleted = true;
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (err) {
            console.error('Error fetching download URL:', err);
            reject(err);
          }
        }
      );
    } catch (err) {
      console.error('Upload initiation failed:', err);
      reject(err);
    }
  });
}
