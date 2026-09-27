import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Compass,
  Trophy,
  Bot, 
  GraduationCap, 
  Code2, 
  Users, 
  FileCode2 
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'journey', label: '5-Day', icon: Compass },
    { id: 'achievements', label: 'Badges', icon: Trophy },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'chat', label: 'Tutor', icon: Bot },
    { id: 'tracks', label: 'Tracks', icon: GraduationCap },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around transition-colors duration-200">
      {mobileTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`mobile-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-colors text-xs ${
              isActive ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
            <span className="text-[10px]">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
