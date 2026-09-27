import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Cpu, 
  Zap
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    theme, 
    toggleTheme, 
    startAssessment,
    setActiveTab, 
  } = useApp();

  const archetype = userProfile.coderArchetype || 'intermediate';
  const archetypeColor = 
    archetype === 'extraordinary' 
      ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' 
      : archetype === 'beginner'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
      : 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/30';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Left: Branding & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-mono font-bold shadow-md shadow-indigo-500/20 border border-indigo-400/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-white font-mono">
              AlgoMentor
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 rounded">
              AI DSA Instructor
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-zinc-500 dark:text-zinc-400">
            Learn DSA. Solve smarter. Get roasted occasionally.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{userProfile.streakDays}d Streak</span>
        </div>

        {/* Coder Archetype Badge */}
        <button
          onClick={() => setActiveTab('journey')}
          id="btn-nav-archetype"
          title="Click to view your 5-Day Coding Journey & Archetype breakdown"
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider border rounded-lg hover:opacity-90 transition-opacity cursor-pointer ${archetypeColor}`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{archetype} Coder</span>
        </button>

        {/* Diagnostic Assessment Button */}
        <button
          onClick={startAssessment}
          id="btn-take-assessment"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-lg shadow-sm shadow-indigo-500/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span className="hidden md:inline">Diagnostic Quiz</span>
          <span className="md:hidden">Quiz</span>
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-toggle-theme"
          aria-label="Toggle theme"
          className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-500" />
          )}
        </button>

        {/* User Account Menu */}
        <UserAccountMenu />
      </div>
    </header>
  );
};
