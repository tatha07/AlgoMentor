import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  LogOut, 
  LogIn, 
  Sparkles, 
  Flame,
  ChevronDown
} from 'lucide-react';

export const UserAccountMenu: React.FC = () => {
  const { currentUser, logout, setIsAuthModalOpen, setAuthModalMode } = useAuth();
  const { userProfile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentUser) {
    return (
      <button
        onClick={() => {
          setAuthModalMode('signin');
          setIsAuthModalOpen(true);
        }}
        id="btn-open-login"
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold text-zinc-700 dark:text-zinc-200 hover:text-zinc-900 dark:hover:text-white bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 rounded-lg transition-all shadow-sm"
      >
        <LogIn className="w-3.5 h-3.5 text-indigo-500" />
        <span>Sign In</span>
      </button>
    );
  }

  const initial = (currentUser.displayName || currentUser.email || 'U')[0].toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        id="btn-user-profile-menu"
        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
      >
        {currentUser.photoURL ? (
          <img
            src={currentUser.photoURL}
            alt={currentUser.displayName || 'Avatar'}
            referrerPolicy="no-referrer"
            className="w-7 h-7 rounded-full border border-indigo-500/40 object-cover"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-mono font-bold shadow-sm shadow-indigo-600/30">
            {initial}
          </div>
        )}
        <span className="hidden lg:inline text-xs font-mono text-zinc-800 dark:text-zinc-200 max-w-[120px] truncate">
          {currentUser.displayName || currentUser.email?.split('@')[0]}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Info Header */}
          <div className="px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800/80 mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono text-zinc-900 dark:text-white truncate">
                {currentUser.displayName || 'DSA Explorer'}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-mono uppercase bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                Synced
              </span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
              {currentUser.email}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="p-2.5 space-y-1.5 bg-zinc-50 dark:bg-zinc-950/60 rounded-lg border border-zinc-200 dark:border-zinc-800/60 mb-2 text-xs font-mono">
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                Streak
              </span>
              <span className="text-zinc-900 dark:text-white font-bold">{userProfile.streakDays} Days</span>
            </div>
            <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Mastered Topics
              </span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{userProfile.completedTopicIds.length}/13</span>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={() => {
              setIsOpen(false);
              logout();
            }}
            id="btn-logout"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};
