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
import {
  auth,
  googleProvider,
  centralDb,
  syncUserProfile,
  subscribeCentralWallet,
  deductCredits,
  isSuperAdminEmail,
  SUPER_ADMIN_EMAIL,
} from '../lib/firebase';
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
  guardAction: (action: () => void, featureName?: string, creditCost?: number) => boolean;
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
    setPaywallReason(reason || 'Para executar cálculos de canibalização e diagnósticos avançados de SEO, é necessário uma conta ativa com saldo de créditos.');
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
          // Initialize/sync profile with Central Suite Core
          const initialProfile = await syncUserProfile(currentUser);
          setUserProfile(initialProfile);

          // Listen in real-time to central wallet and profile updates
          unsubscribeFirestore = subscribeCentralWallet(currentUser.uid, (updatedData) => {
            setUserProfile(updatedData);
            if ((updatedData.status === 'active' || updatedData.role === 'admin') && (updatedData.creditsBalance ?? 0) > 0) {
              setIsPaywallOpen(false);
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

  const isUserSuperAdmin = isSuperAdminEmail(user?.email);
  const isAdmin = isUserSuperAdmin || userProfile?.role === 'admin';
  const isActive = isAdmin || userProfile?.status === 'active';

  /**
   * Guards a key feature: verifies active subscriber and credit balance;
   * otherwise, displays the graceful paywall modal explaining access.
   */
  const guardAction = (action: () => void, featureName = 'esta ferramenta', creditCost = 1): boolean => {
    if (isAdmin) {
      action();
      return true;
    }

    if (!user) {
      openPaywall(`Para utilizar ${featureName}, é necessário estar conectado à sua conta de assinante da Suíte Semântico.`);
      return false;
    }

    if (userProfile?.status !== 'active') {
      const reason = userProfile?.status === 'pending'
        ? `Sua solicitação de acesso para ${featureName} está aguardando liberação da equipe.`
        : `O seu acesso a ${featureName} está temporariamente bloqueado ou expirado. Faça uma recarga ou renove seu plano na Suíte Semântico.`;
      openPaywall(reason);
      return false;
    }

    const currentBalance = userProfile?.creditsBalance ?? 0;
    if (currentBalance < creditCost) {
      openPaywall(`A ação "${featureName}" requer ${creditCost} crédito(s), mas seu saldo atual na carteira é de ${currentBalance} crédito(s). Adquira créditos adicionais para continuar.`);
      return false;
    }

    // Debita atomicamente da carteira central
    deductCredits(user.uid, creditCost, featureName, user.email || undefined).catch(console.warn);
    action();
    return true;
  };

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
        guardAction,
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
