import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Bot, 
  GraduationCap, 
  Code2, 
  Users, 
  Radio,
  FileCode2, 
  GitFork, 
  Youtube, 
  Sparkles,
  Award
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'chat', label: 'AI DSA Tutor', icon: Bot, badge: 'Savage AI' },
    { id: 'tracks', label: 'Learning Tracks', icon: GraduationCap, badge: `${userProfile.activeTrack}` },
    { id: 'practice', label: 'Practice Arena', icon: Code2, badge: 'Monaco' },
    { id: 'collab', label: 'Study Rooms', icon: Radio, badge: 'Live' },
    { id: 'interview', label: 'DSA Interview', icon: Users, badge: 'Mock' },
    { id: 'code-explainer', label: 'Code Explainer', icon: FileCode2, badge: null },
    { id: 'roadmap', label: 'DSA Roadmap', icon: GitFork, badge: null },
    { id: 'resources', label: 'Video Vault', icon: Youtube, badge: 'Curated' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-zinc-800 bg-zinc-900/60 dark:bg-zinc-950/80 backdrop-blur-sm shrink-0 select-none">
      {/* Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase font-mono">
          Curriculum & Tools
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-sm shadow-indigo-950/20'
                  : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                <span className={isActive ? 'font-semibold' : ''}>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-semibold ${
                    isActive
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* User Progress Mini Card at bottom */}
      <div className="p-3 m-3 rounded-lg bg-zinc-900/80 border border-zinc-800">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-zinc-400 font-medium">Track Mastery</span>
          <span className="font-mono text-indigo-400 font-bold">
            {userProfile.completedTopicIds.length}/13 Topics
          </span>
        </div>
        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((userProfile.completedTopicIds.length / 13) * 100))}%` }}
          />
        </div>
        <div className="mt-2.5 pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <span className="capitalize">Track: {userProfile.activeTrack}</span>
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Award className="w-3 h-3" />
            {userProfile.solvedProblems.length} Solved
          </span>
        </div>
      </div>
    </aside>
  );
};
