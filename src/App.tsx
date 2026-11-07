import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { GnaniTutorView } from './components/tutor/GnaniTutorView';
import { PracticeArenaView } from './components/practice/PracticeArenaView';
import { AssessmentArenaView } from './components/assessment/AssessmentArenaView';
import { AuthModal } from './components/auth/AuthModal';
import { Flame } from 'lucide-react';

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  const { activeTab } = useApp();

  // Show loading state while Firebase Auth initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0d0e] text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/30 animate-pulse">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold font-mono tracking-tight text-zinc-900 dark:text-white uppercase">
              Gnani<span className="text-orange-600">.</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
              Loading your high-energy DSA workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Focused 3-Arena Router: Tutor, Practice, Assessment
  const renderActiveArena = () => {
    switch (activeTab) {
      case 'practice':
        return <PracticeArenaView />;
      case 'assessment':
        return <AssessmentArenaView />;
      case 'tutor':
      default:
        return <GnaniTutorView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 dark:bg-[#0c0d0e] dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-orange-500/25 selection:text-orange-600 dark:selection:text-orange-400">
      {/* Top 3-Zone Navigation Header */}
      <Navbar />

      {/* Main Arena Workspace (Full width, no bloated sidebars) */}
      <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 bg-[#fafafa] dark:bg-[#0c0d0e] transition-colors duration-200">
        <div className="max-w-7xl mx-auto">
          {renderActiveArena()}
        </div>
      </main>

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
