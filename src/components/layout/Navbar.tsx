import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccountMenu } from '../auth/UserAccountMenu';
import { 
  Flame, 
  Sun, 
  Moon, 
  Terminal,
  Code2,
  Brain,
  Radio,
  LayoutDashboard,
  ChevronDown,
  Compass,
  Trophy,
  Users,
  GitFork,
  FileCode2,
  Youtube,
  MessageSquare
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    userProfile, 
    theme, 
    toggleTheme, 
    activeTab,
    setActiveTab, 
  } = useApp();

  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const moreItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Analytics & progress' },
    { id: 'journey', label: '5-Day Journey', icon: Compass, desc: 'Archetype calibration' },
    { id: 'interview', label: 'Mock Interview', icon: Users, desc: '45-min live FAANG sim' },
    { id: 'tracks', label: 'Learning Tracks', icon: Code2, desc: 'Beginner to CP tracks' },
    { id: 'achievements', label: 'Achievements', icon: Trophy, desc: 'Badges & milestones' },
    { id: 'roadmap', label: 'DSA Roadmap', icon: GitFork, desc: 'Visual progression path' },
    { id: 'code-explainer', label: 'Code Explainer', icon: FileCode2, desc: 'Asymptotic & bug review' },
    { id: 'resources', label: 'Video Vault', icon: Youtube, desc: 'Curated masterclasses' },
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, desc: 'Conversational assistant' },
  ];

  const isMoreActive = moreItems.some(item => item.id === activeTab);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-3 sm:px-6 lg:px-8 bg-white/95 dark:bg-[#0c0d0e]/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 transition-colors duration-200">
      {/* Zone 1: Wordmark */}
      <div 
        onClick={() => setActiveTab('tutor')}
        className="flex items-center gap-2.5 cursor-pointer select-none shrink-0"
      >
        <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold shadow-md shadow-orange-600/30">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <span className="text-lg font-black tracking-tight font-mono text-zinc-900 dark:text-white uppercase hidden sm:inline">
          AlgoMentor<span className="text-orange-600 dark:text-orange-500">.</span>
        </span>
      </div>

      {/* Zone 2: Primary Navigation Tabs */}
      <nav className="flex items-center gap-1 sm:gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-900/90 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-mono">
        <button
          onClick={() => setActiveTab('tutor')}
          id="nav-tab-tutor"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'tutor'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Tutor</span>
        </button>

        <button
          onClick={() => setActiveTab('practice')}
          id="nav-tab-practice"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'practice'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Practice</span>
        </button>

        <button
          onClick={() => setActiveTab('assessment')}
          id="nav-tab-assessment"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'assessment'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Assessment</span>
        </button>

        <button
          onClick={() => setActiveTab('collab')}
          id="nav-tab-collab"
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'collab' || activeTab === 'rooms'
              ? 'bg-orange-600 text-white shadow-sm'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Rooms</span>
          <span className="hidden md:inline text-[9px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
            Live
          </span>
        </button>

        {/* More Arenas & Tools Dropdown */}
        <div className="relative" ref={moreMenuRef}>
          <button
            onClick={() => setIsMoreMenuOpen(prev => !prev)}
            id="nav-tab-more"
            className={`flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all ${
              isMoreActive
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
            }`}
          >
            <span>{isMoreActive ? moreItems.find(i => i.id === activeTab)?.label || 'More' : 'More'}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>

          {isMoreMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase font-bold text-zinc-400 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                Curriculum & Tools
              </div>
              <div className="space-y-0.5">
                {moreItems.map(item => {
                  const Icon = item.icon;
                  const isItemActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isItemActive
                          ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-bold'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/80'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isItemActive ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400'}`} />
                      <div className="truncate">
                        <div className="text-xs font-medium font-sans">{item.label}</div>
                        <div className="text-[10px] text-zinc-400 font-mono truncate">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Zone 3: Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Streak Counter */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 rounded-lg">
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
