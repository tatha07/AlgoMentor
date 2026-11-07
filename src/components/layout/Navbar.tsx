import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { 
  Flame, 
  Sun, 
  Moon, 
  Terminal,
  Code2,
  Brain,
  Sparkles
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    theme, 
    toggleTheme, 
    activeTab,
    setActiveTab, 
  } = useApp();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-8 bg-white/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Zone 1: Wordmark */}
      <div 
        onClick={() => setActiveTab('tutor')}
        className="flex items-center gap-2.5 cursor-pointer select-none"
      >
        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <span className="text-lg font-black tracking-tight font-mono text-zinc-900 dark:text-white uppercase">
          Gnani<span className="text-orange-600 dark:text-orange-500">.</span>
        </span>
      </div>

      {/* Zone 2: Three Core Arenas (Tutor, Practice, Assessment) */}
      <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-zinc-100 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <button
          onClick={() => setActiveTab('tutor')}
          id="nav-tab-tutor"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'tutor' || activeTab === 'chat'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>Tutor</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          id="nav-tab-practice"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'practice'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>Practice</span>
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          id="nav-tab-assessment"
          className={`flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
            activeTab === 'assessment'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Assessment</span>
        </button>
      </nav>

      {/* Zone 3: Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-lg">
          <Flame className="w-3.5 h-3.5 text-orange-500 fill-current" />
          <span>{userProfile.streakDays}d Streak</span>
        </div>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          id="btn-toggle-theme"
          aria-label="Toggle theme"
          className="p-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-orange-400" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-700" />
          )}
        </button>

        {/* User Account Menu */}
        <UserAccountMenu />
      </div>
    </header>
  );
};
