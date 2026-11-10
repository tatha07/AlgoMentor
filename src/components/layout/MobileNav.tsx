import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Compass, 
  Brain, 
  Code2, 
  Radio
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const mobileTabs = [
    { id: 'tutor', label: 'Tutor', icon: Brain },
    { id: 'practice', label: 'Practice', icon: Code2 },
    { id: 'collab', label: 'Rooms', icon: Radio },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'journey', label: '5-Day', icon: Compass },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c0d0e]/95 border-t border-zinc-200 dark:border-zinc-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around transition-colors duration-200">
      {mobileTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`mobile-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-md transition-colors text-xs ${
              isActive ? 'text-orange-600 dark:text-orange-400 font-bold' : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
            <span className="text-[10px] font-mono">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
