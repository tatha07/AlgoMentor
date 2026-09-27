import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  DsaLevel, 
  TutorTone, 
  AssessmentResult, 
  PracticeMode, 
  ProblemDifficulty,
  CoderArchetype,
  FiveDayJourneyState,
  JourneyBadge
} from '../types';
import { 
  INITIAL_FIVE_DAY_JOURNEY, 
  calculateArchetypeFromJourney 
} from '../data/fiveDayJourneyData';
import { 
  FIVE_DAY_JOURNEY_BADGES, 
  evaluateEarnedBadges 
} from '../data/achievementBadgesData';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import confetti from 'canvas-confetti';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
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
  advanceJourneyDay: (dayNumber: number, score: number, notes?: string) => void;
  setJourneyArchetype: (archetype: CoderArchetype) => void;
  resetJourney: () => void;
  resetAllProgress: () => void;
  syncAchievementsWithFirestore: () => Promise<JourneyBadge[]>;
  triggerConfetti: () => void;
}

const STORAGE_KEY = 'algomentor_user_profile_v3';
const THEME_KEY = 'algomentor_theme_v2';

const INITIAL_PROFILE: UserProfile = {
  id: '',
  name: 'DSA Explorer',
  level: 'intermediate',
  coderArchetype: 'intermediate',
  fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
  earnedBadges: evaluateEarnedBadges(INITIAL_FIVE_DAY_JOURNEY, [], 'intermediate'),
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
      localStorage.removeItem('algomentor_user_profile_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && !parsed.id?.includes('demo')) {
          return {
            ...INITIAL_PROFILE,
            ...parsed,
            fiveDayJourney: parsed.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY,
            coderArchetype: parsed.coderArchetype || 'intermediate'
          };
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
            const journeyState = data.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY;
            const solvedProblemsList = Array.isArray(data.solvedProblems) ? data.solvedProblems : [];
            const archetype = data.coderArchetype || 'intermediate';
            const rawBadges = Array.isArray(data.earnedBadges) ? data.earnedBadges : [];
            const evaluatedBadges = evaluateEarnedBadges(journeyState, solvedProblemsList, archetype, rawBadges);

            setUserProfile(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: data.displayName || firebaseUser.displayName || prev.name || 'DSA Explorer',
              level: data.skillLevel || prev.level || 'intermediate',
              coderArchetype: archetype,
              fiveDayJourney: journeyState,
              earnedBadges: evaluatedBadges,
              preferredLanguage: data.preferredLanguage || prev.preferredLanguage || 'javascript',
              activeTrack: data.activeTrack || prev.activeTrack || 'intermediate',
              streakDays: typeof data.streakDays === 'number' ? data.streakDays : 1,
              completedTopicIds: Array.isArray(data.completedTopicIds) ? data.completedTopicIds : [],
              solvedProblems: solvedProblemsList,
              tutorTone: data.tutorTone || prev.tutorTone || 'balanced',
            }));
          } else {
            // First time login - set user document
            const defaultBadges = evaluateEarnedBadges(INITIAL_FIVE_DAY_JOURNEY, [], 'intermediate');
            const initialDoc = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'DSA Explorer',
              email: firebaseUser.email || '',
              skillLevel: 'intermediate',
              coderArchetype: 'intermediate',
              fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
              earnedBadges: defaultBadges,
              activeTrack: 'intermediate',
              preferredLanguage: 'javascript',
              streakDays: 1,
              completedTopicIds: [],
              solvedProblems: [],
              tutorTone: 'balanced',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            setDoc(userDocRef, initialDoc, { merge: true }).catch(console.warn);
            setUserProfile(prev => ({
              ...prev,
              id: firebaseUser.uid,
              name: initialDoc.displayName,
              coderArchetype: 'intermediate',
              fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
              earnedBadges: defaultBadges,
              completedTopicIds: [],
              solvedProblems: [],
              streakDays: 1,
            }));
          }
        });
        return () => unsubscribeDoc();
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Sync profile to localStorage and Cloud Firestore when profile changes
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
        coderArchetype: userProfile.coderArchetype || 'intermediate',
        fiveDayJourney: userProfile.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY,
        earnedBadges: userProfile.earnedBadges || [],
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
        colors: ['#10b981', '#06b6d4', '#f59e0b', '#8b5cf6', '#ec4899']
      });
    } catch {}
  };

  const startAssessment = () => {
    setIsAssessmentOpen(true);
  };

  const saveAssessmentResult = (result: AssessmentResult) => {
    setUserProfile(prev => {
      // Map diagnostic score to coder archetype
      const assessedArchetype: CoderArchetype = 
        result.level === 'pro' ? 'extraordinary' :
        result.level === 'newbie' ? 'beginner' : 'intermediate';

      return {
        ...prev,
        level: result.level,
        coderArchetype: assessedArchetype,
        activeTrack: result.level === 'newbie' ? 'beginner' : result.level === 'pro' ? 'pro' : 'intermediate',
        assessmentResult: result,
        weakTopics: result.weaknesses,
        strongTopics: result.strengths,
        currentTopicId: result.recommendedStartingTopicId || prev.currentTopicId,
      };
    });
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

  const advanceJourneyDay = (dayNumber: number, score: number = 85, notes?: string) => {
    setUserProfile(prev => {
      const currentJourney = prev.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY;
      const updatedDays = {
        ...currentJourney.days,
        [dayNumber]: {
          completed: true,
          score: Math.max(score, 70),
          completedAt: new Date().toISOString(),
          ...(notes ? { notes } : {})
        }
      };

      const solvedCount = prev.solvedProblems.length;
      const hardCount = prev.solvedProblems.filter(p => p.difficulty === 'hard').length;
      const calibration = calculateArchetypeFromJourney(updatedDays, solvedCount, hardCount);

      const nextDay = Math.min(5, Math.max(dayNumber + 1, currentJourney.currentDay));
      const updatedJourneyState: FiveDayJourneyState = {
        currentDay: nextDay,
        assessedArchetype: calibration.archetype,
        overallScore: calibration.overallScore,
        days: updatedDays,
        skills: calibration.skills,
        summary: calibration.summary,
      };

      const updatedBadges = evaluateEarnedBadges(
        updatedJourneyState,
        prev.solvedProblems,
        calibration.archetype,
        prev.earnedBadges
      );

      triggerConfetti();

      return {
        ...prev,
        coderArchetype: calibration.archetype,
        level: calibration.archetype === 'extraordinary' ? 'pro' : calibration.archetype === 'beginner' ? 'newbie' : 'intermediate',
        fiveDayJourney: updatedJourneyState,
        earnedBadges: updatedBadges,
      };
    });
  };

  const setJourneyArchetype = (archetype: CoderArchetype) => {
    setUserProfile(prev => {
      const updatedJourney = {
        ...(prev.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY),
        assessedArchetype: archetype,
        summary: `Manually calibrated starting profile as ${archetype.toUpperCase()} Coder.`
      };
      const updatedBadges = evaluateEarnedBadges(
        updatedJourney,
        prev.solvedProblems,
        archetype,
        prev.earnedBadges
      );

      return {
        ...prev,
        coderArchetype: archetype,
        level: archetype === 'extraordinary' ? 'pro' : archetype === 'beginner' ? 'newbie' : 'intermediate',
        fiveDayJourney: updatedJourney,
        earnedBadges: updatedBadges,
      };
    });
  };

  const resetJourney = () => {
    setUserProfile(prev => ({
      ...prev,
      coderArchetype: 'intermediate',
      fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
      earnedBadges: evaluateEarnedBadges(INITIAL_FIVE_DAY_JOURNEY, prev.solvedProblems, 'intermediate', [])
    }));
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

      const updatedSolved = alreadySolved
        ? prev.solvedProblems.map(p => (p.problemId === problemId ? newRecord : p))
        : [newRecord, ...prev.solvedProblems];

      // Check if this problem corresponds to one of the 5-day journey milestones
      const dayProblemMap: Record<string, number> = {
        'two-sum': 1,
        'container-with-most-water': 2,
        'search-in-rotated-sorted-array': 3,
        'number-of-islands': 4,
        'coin-change': 5,
      };

      const matchedDay = dayProblemMap[problemId];
      let updatedJourney = prev.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY;
      let newArchetype = prev.coderArchetype || 'intermediate';

      if (matchedDay) {
        const updatedDays = {
          ...updatedJourney.days,
          [matchedDay]: {
            completed: true,
            score: 90,
            completedAt: new Date().toISOString()
          }
        };
        const hardCount = updatedSolved.filter(p => p.difficulty === 'hard').length;
        const calibration = calculateArchetypeFromJourney(updatedDays, updatedSolved.length, hardCount);
        newArchetype = calibration.archetype;
        updatedJourney = {
          currentDay: Math.min(5, Math.max(matchedDay + 1, updatedJourney.currentDay)),
          assessedArchetype: calibration.archetype,
          overallScore: calibration.overallScore,
          days: updatedDays,
          skills: calibration.skills,
          summary: calibration.summary
        };
      }

      const updatedBadges = evaluateEarnedBadges(
        updatedJourney,
        updatedSolved,
        newArchetype,
        prev.earnedBadges
      );

      triggerConfetti();

      return {
        ...prev,
        coderArchetype: newArchetype,
        fiveDayJourney: updatedJourney,
        earnedBadges: updatedBadges,
        solvedProblems: updatedSolved,
      };
    });
  };

  const syncAchievementsWithFirestore = async (): Promise<JourneyBadge[]> => {
    const updatedBadges = evaluateEarnedBadges(
      userProfile.fiveDayJourney,
      userProfile.solvedProblems,
      userProfile.coderArchetype,
      userProfile.earnedBadges
    );

    setUserProfile(prev => ({
      ...prev,
      earnedBadges: updatedBadges
    }));

    if (auth.currentUser) {
      const userPath = `users/${auth.currentUser.uid}`;
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await setDoc(userDocRef, {
          earnedBadges: updatedBadges,
          coderArchetype: userProfile.coderArchetype || 'intermediate',
          fiveDayJourney: userProfile.fiveDayJourney || INITIAL_FIVE_DAY_JOURNEY,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, userPath);
      }
    }

    triggerConfetti();
    return updatedBadges;
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
      id: auth.currentUser?.uid || userProfile.id || 'dev_user',
      name: auth.currentUser?.displayName || userProfile.name || 'DSA Explorer',
      level: 'intermediate',
      coderArchetype: 'intermediate',
      fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}

    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      setDoc(userDocRef, {
        completedTopicIds: [],
        solvedProblems: [],
        fiveDayJourney: INITIAL_FIVE_DAY_JOURNEY,
        coderArchetype: 'intermediate',
        streakDays: 1,
        updatedAt: new Date().toISOString(),
      }, { merge: true }).catch(console.warn);
    }
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
        advanceJourneyDay,
        setJourneyArchetype,
        resetJourney,
        resetAllProgress,
        syncAchievementsWithFirestore,
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
