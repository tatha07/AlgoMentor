import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, DsaLevel, TutorTone, AssessmentResult, PracticeMode, ProblemDifficulty } from '../types';
import { DEMO_PROFILES } from '../data/demoProfiles';
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
  isDevModalOpen: boolean;
  setIsDevModalOpen: (isOpen: boolean) => void;
  startAssessment: () => void;
  saveAssessmentResult: (result: AssessmentResult) => void;
  loadDemoProfile: (level: DsaLevel) => void;
  markTopicCompleted: (topicId: string) => void;
  toggleTopicCompletion: (topicId: string) => void;
  recordSolvedProblem: (problemId: string, problemTitle: string, difficulty: ProblemDifficulty, topicId: string, timeSpentSeconds: number, mode: PracticeMode) => void;
  updateTutorTone: (tone: TutorTone) => void;
  updatePreferredLanguage: (lang: 'javascript' | 'python' | 'cpp' | 'java') => void;
  setActiveTrack: (track: 'beginner' | 'intermediate' | 'pro') => void;
  resetAllProgress: () => void;
  triggerConfetti: () => void;
}

const STORAGE_KEY = 'algomentor_user_profile_v1';
const THEME_KEY = 'algomentor_theme_v1';

const DEFAULT_PROFILE: UserProfile = DEMO_PROFILES.intermediate;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load user profile from localStorage:', e);
    }
    return DEFAULT_PROFILE;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [isDevModalOpen, setIsDevModalOpen] = useState<boolean>(false);

  // Sync with Firebase Firestore whenever user logs in or user doc updates
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
              name: data.displayName || firebaseUser.displayName || prev.name,
              level: data.skillLevel || prev.level,
              preferredLanguage: data.preferredLanguage || prev.preferredLanguage,
              streakDays: data.streakDays !== undefined ? data.streakDays : prev.streakDays,
              completedTopicIds: data.completedTopicIds || prev.completedTopicIds,
              solvedProblems: data.solvedProblems || prev.solvedProblems,
              tutorTone: data.tutorTone || prev.tutorTone,
            }));
          }
        });
        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync profile to localStorage and Cloud Firestore
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to persist user profile locally:', e);
    }

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        displayName: userProfile.name,
        skillLevel: userProfile.level,
        preferredLanguage: userProfile.preferredLanguage,
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

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }, [theme]);

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

  const loadDemoProfile = (level: DsaLevel) => {
    const profile = DEMO_PROFILES[level];
    if (profile) {
      setUserProfile({ ...profile });
      triggerConfetti();
    }
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
    const fresh: UserProfile = {
      id: 'fresh-user',
      name: 'DSA Explorer',
      level: 'newbie',
      preferredLanguage: 'javascript',
      activeTrack: 'beginner',
      completedTopicIds: [],
      solvedProblems: [],
      streakDays: 1,
      lastActiveDate: new Date().toISOString(),
      assessmentResult: null,
      weakTopics: [],
      strongTopics: [],
      currentTopicId: 'big-o-analysis',
      tutorTone: 'balanced',
      dailyGoalProblems: 2,
    };
    setUserProfile(fresh);
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
        isDevModalOpen,
        setIsDevModalOpen,
        startAssessment,
        saveAssessmentResult,
        loadDemoProfile,
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
