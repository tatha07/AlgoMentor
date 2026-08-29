import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  saveCloudProfile: (profile: Partial<UserProfile>) => Promise<void>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'signin' | 'signup' | 'reset';
  setAuthModalMode: (mode: 'signin' | 'signup' | 'reset') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'reset'>('signin');

  const clearAuthError = () => setAuthError(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // Ensure user document exists in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          if (!docSnap.exists()) {
            // Initialize basic profile in Firestore
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email || '',
              displayName: user.displayName || 'DSA Explorer',
              photoURL: user.photoURL || '',
              skillLevel: 'intermediate',
              preferredLanguage: 'javascript',
              streakDays: 1,
              completedTopicIds: [],
              solvedProblems: [],
              tutorTone: 'balanced',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err: any) {
          console.error('Error verifying user doc in Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const userDocRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userDocRef);
      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'DSA Explorer',
          photoURL: user.photoURL || '',
          skillLevel: 'intermediate',
          preferredLanguage: 'javascript',
          streakDays: 1,
          completedTopicIds: [],
          solvedProblems: [],
          tutorTone: 'balanced',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err?.message || 'Google sign-in failed. Please try again.');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Email Sign-In Error:', err);
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Too many failed login attempts. Please try again later or reset password.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setAuthError(null);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && userCred.user) {
        await updateProfile(userCred.user, { displayName: name });
      }

      // Initialize Firestore document
      const userDocRef = doc(db, 'users', userCred.user.uid);
      await setDoc(userDocRef, {
        uid: userCred.user.uid,
        email: email,
        displayName: name || 'DSA Explorer',
        photoURL: '',
        skillLevel: 'intermediate',
        preferredLanguage: 'javascript',
        streakDays: 1,
        completedTopicIds: [],
        solvedProblems: [],
        tutorTone: 'balanced',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      setIsAuthModalOpen(false);
    } catch (err: any) {
      console.error('Sign-Up Error:', err);
      let msg = 'Failed to create account.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'An account with this email already exists. Please log in.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const logout = async () => {
    setAuthError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout Error:', err);
    }
  };

  const resetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      setAuthError(err?.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const saveCloudProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!currentUser) return;
    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        ...profileUpdate,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Could not update Firestore user document:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        authError,
        clearAuthError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        saveCloudProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
