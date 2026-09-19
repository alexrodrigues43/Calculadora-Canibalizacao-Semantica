import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, googleProvider, db, syncUserProfile, SUPER_ADMIN_EMAIL } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isActive: boolean;
  isPaywallOpen: boolean;
  paywallReason: string | null;
  openPaywall: (reason?: string) => void;
  closePaywall: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPaywallOpen, setIsPaywallOpen] = useState<boolean>(false);
  const [paywallReason, setPaywallReason] = useState<string | null>(null);

  const openPaywall = (reason?: string) => {
    setPaywallReason(reason || 'Para executar cálculos de canibalização e diagnósticos avançados de SEO, é necessário uma conta ativa.');
    setIsPaywallOpen(true);
  };

  const closePaywall = () => {
    setIsPaywallOpen(false);
    setPaywallReason(null);
  };

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (currentUser) {
        try {
          // Initialize/sync profile
          const initialProfile = await syncUserProfile(currentUser);
          setUserProfile(initialProfile);

          // Listen in real-time to profile changes (approval by admin, plan changes, etc.)
          const userDocRef = doc(db, 'users', currentUser.uid);
          unsubscribeFirestore = onSnapshot(userDocRef, (snapshot) => {
            if (snapshot.exists()) {
              const updatedData = snapshot.data() as UserProfile;
              setUserProfile((prev) => {
                // If previously not active, and now active, close paywall automatically!
                if (prev && prev.status !== 'active' && updatedData.status === 'active') {
                  setIsPaywallOpen(false);
                }
                return updatedData;
              });
            }
          });
        } catch (err) {
          console.error('Error synchronizing user profile:', err);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUserProfile(profile);
        if (profile.status === 'active' || profile.role === 'admin') {
          closePaywall();
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        const profile = await syncUserProfile(result.user);
        setUserProfile(profile);
        if (profile.status === 'active' || profile.role === 'admin') {
          closePaywall();
        }
      }
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        if (name) {
          await updateProfile(result.user, { displayName: name });
        }
        const profile = await syncUserProfile({
          uid: result.user.uid,
          email: result.user.email,
          displayName: name || result.user.displayName,
        });
        setUserProfile(profile);
        if (profile.status === 'active' || profile.role === 'admin') {
          closePaywall();
        }
      }
    } catch (err: any) {
      console.error('Registration Error:', err);
      throw err;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const isSuperAdminEmail = user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL.toLowerCase();
  const isAdmin = isSuperAdminEmail || userProfile?.role === 'admin';
  const isActive = isAdmin || userProfile?.status === 'active';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        isActive,
        isPaywallOpen,
        paywallReason,
        openPaywall,
        closePaywall,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
