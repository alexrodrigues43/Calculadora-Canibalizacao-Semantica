import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
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

// Central Database for the Suite (semantico-suite-core)
export const centralDb = getFirestore(app, 'semantico-suite-core');

/**
 * Sanitiza recursivamente objetos removendo campos undefined para compatibilidade com o Firestore
 */
export function sanitizeForFirestore<T extends Record<string, any>>(obj: T): Record<string, any> {
  const clean: Record<string, any> = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val !== undefined) {
      if (val && typeof val === 'object' && !Array.isArray(val) && !(val instanceof Date)) {
        clean[key] = sanitizeForFirestore(val);
      } else {
        clean[key] = val;
      }
    }
  }
  return clean;
}

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
}

/**
 * Creates or synchronizes the user profile in Central Suite (semantico-suite-core)
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
}): Promise<UserProfile> {
  const userRef = doc(centralDb, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  const isSuperAdmin = isSuperAdminEmail(user.email);
  const now = new Date().toISOString();

  if (!userSnap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || user.email?.split('@')[0] || 'Usuário Semântico',
      photoURL: user.photoURL || '',
      role: isSuperAdmin ? 'admin' : 'client',
      status: 'active',
      plan: isSuperAdmin ? 'lifetime' : 'trial',
      creditsBalance: isSuperAdmin ? 999999 : 10,
      creditsUsed: 0,
      usageCount: 0,
      notes: isSuperAdmin ? 'Super Administrador do Sistema' : 'Trial inicial da Suíte',
      createdAt: now,
      lastLoginAt: now,
      lastAppUsed: 'Calculadora de Canibalização',
    };

    await setDoc(userRef, sanitizeForFirestore(newProfile));

    // Grava transação de degustação
    if (!isSuperAdmin) {
      try {
        const { collection } = await import('firebase/firestore');
        const txRef = doc(collection(centralDb, 'credit_transactions'));
        await setDoc(txRef, {
          id: txRef.id,
          uid: user.uid,
          userEmail: user.email || '',
          type: 'trial',
          app: 'Calculadora de Canibalização',
          amount: 10,
          balanceAfter: 10,
          description: 'Bônus de degustação da Suíte Semântico (10 créditos)',
          timestamp: now,
        });
      } catch (txErr) {
        console.warn('[Carteira] Falha ao registrar transação de trial:', txErr);
      }
    }

    return newProfile;
  } else {
    const existing = userSnap.data() as UserProfile;
    const updates: Partial<UserProfile> = {
      lastLoginAt: now,
      lastAppUsed: 'Calculadora de Canibalização',
      displayName: user.displayName || existing.displayName || user.email?.split('@')[0] || 'Usuário Semântico',
      photoURL: user.photoURL || existing.photoURL || '',
    };

    if (isSuperAdmin) {
      updates.role = 'admin';
      updates.status = 'active';
      updates.plan = 'lifetime';
      updates.creditsBalance = 999999;
    }

    await updateDoc(userRef, sanitizeForFirestore(updates));
    return {
      ...existing,
      ...updates,
    };
  }
}

/**
 * Escuta em tempo real o saldo da carteira central no semantico-suite-core
 */
export function subscribeCentralWallet(
  uid: string,
  onUpdate: (profile: UserProfile) => void
): () => void {
  const userRef = doc(centralDb, 'users', uid);
  return onSnapshot(
    userRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as UserProfile);
      }
    },
    (err) => {
      console.warn('[Carteira Central] Erro ao sincronizar carteira:', err);
    }
  );
}

/**
 * Debita créditos atomicamente na base central semantico-suite-core e registra no extrato
 */
export async function deductCredits(
  uid: string,
  amount: number,
  actionDescription: string,
  userEmail?: string
): Promise<boolean> {
  const isSuperAdmin = isSuperAdminEmail(userEmail);
  if (isSuperAdmin) return true; // Super Admin possui créditos infinitos

  const userRef = doc(centralDb, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return false;

  const currentData = snap.data() as UserProfile;
  const currentBalance = currentData.creditsBalance ?? 0;
  if (currentBalance < amount) {
    return false; // Saldo insuficiente
  }

  const now = new Date().toISOString();
  await updateDoc(userRef, {
    creditsBalance: increment(-amount),
    creditsUsed: increment(amount),
    lastAppUsed: 'Calculadora de Canibalização',
  });

  // Registra no extrato de transações
  try {
    const { collection } = await import('firebase/firestore');
    const txRef = doc(collection(centralDb, 'credit_transactions'));
    await setDoc(txRef, {
      id: txRef.id,
      uid,
      userEmail: userEmail || '',
      type: 'usage',
      app: 'Calculadora de Canibalização',
      amount: -amount,
      balanceAfter: currentBalance - amount,
      description: actionDescription,
      timestamp: now,
    });
  } catch (err) {
    console.warn('[Carteira] Falha ao registrar transação no extrato:', err);
  }

  return true;
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

/**
 * Sign in with Google Popup
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const result = await signInWithPopup(auth, googleProvider);
  return await syncUserProfile(result.user);
}

/**
 * Sign in with Google Redirect (fallback para navegadores com restrições rígidas de popup)
 */
export async function loginWithGoogleRedirect(): Promise<void> {
  await signInWithRedirect(auth, googleProvider);
}

export { getRedirectResult };

/**
 * Sign in with Email and Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return await syncUserProfile(result.user);
}

/**
 * Register with Email, Password and Name
 */
export async function registerWithEmail(email: string, pass: string, name: string): Promise<UserProfile> {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (name.trim()) {
    try {
      await updateProfile(result.user, { displayName: name.trim() });
    } catch (e) {
      console.warn('Could not update auth display name:', e);
    }
  }
  return await syncUserProfile(result.user);
}

/**
 * Logout
 */
export async function logoutFirebase(): Promise<void> {
  await signOut(auth);
}
export const logoutUser = logoutFirebase;
