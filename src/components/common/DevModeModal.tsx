import React from 'react';
import { useApp } from '../../context/AppContext';
import { DsaLevel, TutorTone } from '../../types';
import { 
  X, 
  RotateCcw, 
  UserCheck, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  ShieldAlert,
  Terminal,
  Zap
} from 'lucide-react';

export const DevModeModal: React.FC = () => {
  const { 
    isDevModalOpen, 
    setIsDevModalOpen, 
    loadDemoProfile, 
    userProfile, 
    updateTutorTone, 
    resetAllProgress,
    startAssessment
  } = useApp();

  if (!isDevModalOpen) return null;

  const journeys: { level: DsaLevel; title: string; desc: string; solved: number; streak: number; badge: string; color: string }[] = [
    {
      level: 'newbie',
      title: 'Alex (Beginner Journey)',
      desc: 'Just starting DSA. Mastering Big-O, Array Traversals, and avoiding O(N^2) brute force pitfalls.',
      solved: 1,
      streak: 2,
      badge: 'Newbie Track',
      color: 'border-zinc-800 bg-zinc-950 text-zinc-300',
    },
    {
      level: 'intermediate',
      title: 'Jordan (Intermediate Journey)',
      desc: 'Solid on Two Pointers and Binary Search. Actively tackling Graph BFS/DFS and 1D Dynamic Programming.',
      solved: 5,
      streak: 7,
      badge: 'Intermediate Track',
      color: 'border-zinc-800 bg-zinc-950 text-zinc-300',
    },
    {
      level: 'pro',
      title: 'Devin (Pro / Competitive Journey)',
      desc: 'Trie, Topological Sort, and DSU mastered. Polishing Hard DP and FAANG-style timed mock interviews.',
      solved: 6,
      streak: 19,
      badge: 'Pro Track',
      color: 'border-zinc-800 bg-zinc-950 text-zinc-300',
    },
  ];

  const toneOptions: { id: TutorTone; label: string; icon: any; desc: string }[] = [
    {
      id: 'balanced',
      label: 'Balanced Senior Dev',
      icon: Terminal,
      desc: 'Insightful, encouraging, direct explanations with Big-O rigor.',
    },
    {
      id: 'savage',
      label: 'Savage Roast Mode 🌶️',
      icon: Flame,
      desc: 'Senior dev who roasts inefficient O(N^3) code and bad questions, then teaches the real solution.',
    },
    {
      id: 'socratic',
      label: 'Socratic Guiding Hints',
      icon: HelpCircle,
      desc: 'Never spoils the answer; asks thought-provoking questions to lead you to the breakthrough.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">Demo Journeys & Tutor Settings</h2>
              <p className="text-xs text-zinc-400">Instantly simulate different user levels & test edge cases.</p>
            </div>
          </div>
          <button
            onClick={() => setIsDevModalOpen(false)}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Journey Switcher */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              Switch Persona / Journey
            </label>
            <div className="space-y-3">
              {journeys.map(j => {
                const isActive = userProfile.level === j.level;
                return (
                  <button
                    key={j.level}
                    id={`btn-journey-${j.level}`}
                    onClick={() => {
                      loadDemoProfile(j.level);
                      setIsDevModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/40'
                        : `${j.color} hover:border-zinc-700`
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white font-mono">{j.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-zinc-800 text-zinc-300">
                          {j.badge}
                        </span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-mono text-indigo-400 bg-indigo-500/20 font-semibold border border-indigo-500/30">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{j.desc}</p>
                    </div>
                    <div className="text-right shrink-0 text-xs font-mono text-zinc-400">
                      <div>{j.solved} Solved</div>
                      <div>{j.streak}d Streak</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Tutor Personality Selector */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 block mb-3">
              AI Tutor Persona / Tone
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {toneOptions.map(t => {
                const Icon = t.icon;
                const isSelected = userProfile.tutorTone === t.id;
                return (
                  <button
                    key={t.id}
                    id={`btn-tone-${t.id}`}
                    onClick={() => updateTutorTone(t.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/10 text-white ring-1 ring-indigo-500/40'
                        : 'border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-zinc-400'}`} />
                      <span className="text-xs font-bold font-mono">{t.label}</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">{t.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Diagnostics & Reset Actions */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <button
              onClick={() => {
                setIsDevModalOpen(false);
                startAssessment();
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-semibold rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 10-Q Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => {
                if (confirm('Reset all progress back to a fresh profile?')) {
                  resetAllProgress();
                  setIsDevModalOpen(false);
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors border border-rose-500/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Clean State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
