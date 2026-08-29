import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { 
  Flame, 
  Sparkles, 
  Sun, 
  Moon, 
  Cpu, 
  Zap,
  RotateCcw
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    theme, 
    toggleTheme, 
    startAssessment, 
    setIsDevModalOpen, 
  } = useApp();

  const levelColor = 
    userProfile.level === 'pro' 
      ? 'bg-violet-500/10 text-violet-400 border-violet-500/30' 
      : userProfile.level === 'intermediate'
      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-zinc-900/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      {/* Left: Branding & Tagline */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-mono font-bold shadow-md shadow-indigo-500/20 border border-indigo-400/20">
          <Cpu className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold tracking-tight text-white font-mono">AlgoMentor</span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-wider text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded">
              AI DSA Instructor
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-zinc-400">
            Learn DSA. Solve smarter. Get roasted occasionally.
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-md">
          <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>{userProfile.streakDays}d Streak</span>
        </div>

        {/* Level Badge */}
        <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-semibold uppercase tracking-wider border rounded-md ${levelColor}`}>
          <Zap className="w-3.5 h-3.5" />
          <span>{userProfile.level}</span>
        </div>

        {/* Quick Diagnostic / Assessment Button */}
        <button
          onClick={startAssessment}
          id="btn-take-assessment"
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors rounded-md shadow-sm shadow-indigo-500/20 border border-indigo-500/40"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
          <span className="hidden md:inline">Assessment</span>
          <span className="md:hidden">Test</span>
        </button>

        {/* Demo Mode Trigger */}
        <button
          onClick={() => setIsDevModalOpen(true)}
          id="btn-dev-mode"
          title="Demo Profiles & Level Switcher"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-md transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden lg:inline">Demo Journeys</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-toggle-theme"
          aria-label="Toggle theme"
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 rounded-md transition-colors border border-zinc-800"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
        </button>

        {/* User Authentication & Account Menu */}
        <UserAccountMenu />
      </div>
    </header>
  );
};

