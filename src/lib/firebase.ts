import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile } from '../types';

export const SUPER_ADMIN_EMAIL = 'alexrodrigues43@gmail.com';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID from config
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

/**
 * Creates or synchronizes the user profile in Firestore
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
}): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const isSuperAdmin = user.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();

  const now = new Date().toISOString();

  if (!userSnap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Usuário',
      role: isSuperAdmin ? 'admin' : 'client',
      status: isSuperAdmin ? 'active' : 'pending',
      plan: isSuperAdmin ? 'lifetime' : 'trial',
      usageCount: 0,
      notes: isSuperAdmin ? 'Super Administrador do Sistema' : 'Cadastro inicial via web',
      createdAt: now,
      lastLoginAt: now,
    };

    await setDoc(userRef, newProfile);
    return newProfile;
  } else {
    const existing = userSnap.data() as UserProfile;
    const updates: Partial<UserProfile> = {
      lastLoginAt: now,
    };

    if (user.displayName && !existing.displayName) {
      updates.displayName = user.displayName;
    }

    // Ensure super admin always maintains admin role and lifetime active status
    if (isSuperAdmin && (existing.role !== 'admin' || existing.status !== 'active' || existing.plan !== 'lifetime')) {
      updates.role = 'admin';
      updates.status = 'active';
      updates.plan = 'lifetime';
    }

    await updateDoc(userRef, updates);
    return {
      ...existing,
      ...updates,
    };
  }
}

/**
 * Atomically increments the usage counter for an active user
 */
export async function recordSuccessfulUsage(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      usageCount: increment(1),
    });
  } catch (err) {
    console.error('Failed to increment usageCount in Firestore:', err);
  }
}
