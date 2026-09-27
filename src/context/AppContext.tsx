import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DsaLevel, TutorTone, AssessmentResult, PracticeMode, ProblemDifficulty } from '../types';
import confetti from 'canvas-confetti';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AppContextType {
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedTopicId: string | null;
  setSelectedTopicId: (topicId: string | null) => void;
  selectedProblemId: string | null;
  setSelectedProblemId: (problemId: string | null) => void;
  isAssessmentOpen: boolean;
  setIsAssessmentOpen: (isOpen: boolean) => void;
  startAssessment: () => void;
  saveAssessmentResult: (result: AssessmentResult) => void;
  markTopicCompleted: (topicId: string) => void;
  toggleTopicCompletion: (topicId: string) => void;
  recordSolvedProblem: (
    problemId: string, 
    problemTitle: string, 
    difficulty: ProblemDifficulty, 
    topicId: string, 
    timeSpentSeconds: number, 
    mode: PracticeMode
  ) => void;
  updateTutorTone: (tone: TutorTone) => void;
  updatePreferredLanguage: (lang: 'javascript' | 'python' | 'cpp' | 'java') => void;
  setActiveTrack: (track: 'beginner' | 'intermediate' | 'pro') => void;
  resetAllProgress: () => void;
  triggerConfetti: () => void;
}

const STORAGE_KEY = 'algomentor_user_profile_v2';
const THEME_KEY = 'algomentor_theme_v2';

const INITIAL_PROFILE: UserProfile = {
  id: '',
  name: 'DSA Explorer',
  level: 'intermediate',
  preferredLanguage: 'javascript',
  activeTrack: 'intermediate',
  completedTopicIds: [],
  solvedProblems: [],
  streakDays: 1,
  lastActiveDate: new Date().toISOString(),
  assessmentResult: null,
  weakTopics: [],
  strongTopics: [],
  currentTopicId: 'arrays-two-pointers',
  tutorTone: 'balanced',
  dailyGoalProblems: 2,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      // Purge any legacy demo profile from storage
      localStorage.removeItem('algomentor_user_profile_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.id?.includes('demo')) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load user profile from localStorage:', e);
    }
    return INITIAL_PROFILE;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {}
    return 'dark';
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);

  // Sync theme to document and local storage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

  // Sync with Firebase Firestore whenever user logs in or their user document updates
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: data.displayName || firebaseUser.displayName || prev.name || 'DSA Explorer',
              level: data.skillLevel || prev.level || 'intermediate',
              preferredLanguage: data.preferredLanguage || prev.preferredLanguage || 'javascript',
              activeTrack: data.activeTrack || prev.activeTrack || 'intermediate',
              streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
              completedTopicIds: Array.isArray(data.completedTopicIds) ? data.completedTopicIds : [],
              solvedProblems: Array.isArray(data.solvedProblems) ? data.solvedProblems : [],
              tutorTone: data.tutorTone || prev.tutorTone || 'balanced',
            }));
          } else {
            // First time login - set user document
            const initialDoc = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'DSA Explorer',
              email: firebaseUser.email || '',
              skillLevel: 'intermediate',
              activeTrack: 'intermediate',
              preferredLanguage: 'javascript',
              streakDays: 1,
              completedTopicIds: [],
              solvedProblems: [],
              tutorTone: 'balanced',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setDoc(userDocRef, initialDoc, { merge: true }).catch(console.error);
            setUserProfile(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: initialDoc.displayName,
              completedTopicIds: [],
              solvedProblems: [],
              streakDays: 1,
            }));
          }
        });
        return () => unsubscribeDoc();
      } else {
        // User logged out - reset profile
        setUserProfile(INITIAL_PROFILE);
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync profile to localStorage and Cloud Firestore when profile changes and user is signed in
  useEffect(() => {
    if (userProfile.id && !userProfile.id.includes('demo')) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
      } catch (e) {
        console.warn('Failed to persist user profile locally:', e);
      }
    }

    if (auth.currentUser && userProfile.id === auth.currentUser.uid) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        displayName: userProfile.name,
        skillLevel: userProfile.level,
        preferredLanguage: userProfile.preferredLanguage,
        activeTrack: userProfile.activeTrack,
        streakDays: userProfile.streakDays,
        completedTopicIds: userProfile.completedTopicIds,
        solvedProblems: userProfile.solvedProblems,
        tutorTone: userProfile.tutorTone,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(err => {
        console.warn('Failed to sync profile update to Firestore:', err);
      });
    }
  }, [userProfile]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6']
      });
    } catch {}
  };

  const startAssessment = () => {
    setIsAssessmentOpen(true);
  };

  const saveAssessmentResult = (result: AssessmentResult) => {
    setUserProfile(prev => ({
      ...prev,
      level: result.level,
      activeTrack: result.level === 'newbie' ? 'beginner' : result.level === 'pro' ? 'pro' : 'intermediate',
      assessmentResult: result,
      weakTopics: result.weaknesses,
      strongTopics: result.strengths,
      currentTopicId: result.recommendedStartingTopicId || prev.currentTopicId,
    }));
    setIsAssessmentOpen(false);
    triggerConfetti();
  };

  const markTopicCompleted = (topicId: string) => {
    setUserProfile(prev => {
      if (prev.completedTopicIds.includes(topicId)) return prev;
      triggerConfetti();
      return {
        ...prev,
        completedTopicIds: [...prev.completedTopicIds, topicId],
      };
    });
  };

  const toggleTopicCompletion = (topicId: string) => {
    setUserProfile(prev => {
      const exists = prev.completedTopicIds.includes(topicId);
      if (!exists) triggerConfetti();
      return {
        ...prev,
        completedTopicIds: exists
          ? prev.completedTopicIds.filter(id => id !== topicId)
          : [...prev.completedTopicIds, topicId],
      };
    });
  };

  const recordSolvedProblem = (
    problemId: string,
    problemTitle: string,
    difficulty: ProblemDifficulty,
    topicId: string,
    timeSpentSeconds: number,
    mode: PracticeMode
  ) => {
    setUserProfile(prev => {
      const alreadySolved = prev.solvedProblems.some(p => p.problemId === problemId);
      const newRecord = {
        problemId,
        problemTitle,
        difficulty,
        topicId,
        solvedAt: new Date().toISOString(),
        timeSpentSeconds,
        mode,
      };

      triggerConfetti();

      return {
        ...prev,
        solvedProblems: alreadySolved
          ? prev.solvedProblems.map(p => (p.problemId === problemId ? newRecord : p))
          : [newRecord, ...prev.solvedProblems],
      };
    });
  };

  const updateTutorTone = (tone: TutorTone) => {
    setUserProfile(prev => ({ ...prev, tutorTone: tone }));
  };

  const updatePreferredLanguage = (lang: 'javascript' | 'python' | 'cpp' | 'java') => {
    setUserProfile(prev => ({ ...prev, preferredLanguage: lang }));
  };

  const setActiveTrack = (track: 'beginner' | 'intermediate' | 'pro') => {
    setUserProfile(prev => ({ ...prev, activeTrack: track }));
  };

  const resetAllProgress = () => {
    if (!auth.currentUser) return;
    const fresh: UserProfile = {
      id: auth.currentUser.uid,
      name: auth.currentUser.displayName || 'DSA Explorer',
      level: 'intermediate',
      preferredLanguage: 'javascript',
      activeTrack: 'intermediate',
      completedTopicIds: [],
      solvedProblems: [],
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      assessmentResult: null,
      weakTopics: [],
      strongTopics: [],
      currentTopicId: 'arrays-two-pointers',
      tutorTone: 'balanced',
      dailyGoalProblems: 2,
    };
    setUserProfile(fresh);
    const userDocRef = doc(db, 'users', auth.currentUser.uid);
    setDoc(userDocRef, {
      completedTopicIds: [],
      solvedProblems: [],
      streakDays: 1,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch(console.error);
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        setUserProfile,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        selectedTopicId,
        setSelectedTopicId,
        selectedProblemId,
        setSelectedProblemId,
        isAssessmentOpen,
        setIsAssessmentOpen,
        startAssessment,
        saveAssessmentResult,
        markTopicCompleted,
        toggleTopicCompletion,
        recordSolvedProblem,
        updateTutorTone,
        updatePreferredLanguage,
        setActiveTrack,
        resetAllProgress,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
