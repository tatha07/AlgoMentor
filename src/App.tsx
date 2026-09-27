import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { DashboardView } from './components/dashboard/DashboardView';
import { AiChatView } from './components/chat/AiChatView';
import { LearningTracksView } from './components/tracks/LearningTracksView';
import { PracticeArenaView } from './components/practice/PracticeArenaView';
import { CollabRoomsView } from './components/collab/CollabRoomsView';
import { InterviewModeView } from './components/interview/InterviewModeView';
import { CodeExplainerView } from './components/code-explainer/CodeExplainerView';
import { RoadmapView } from './components/roadmap/RoadmapView';
import { ResourcesView } from './components/resources/ResourcesView';
import { AssessmentModal } from './components/assessment/AssessmentModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthGateView } from './components/auth/AuthGateView';
import { Cpu } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();
  const { activeTab } = useApp();

  // Show loading state while Firebase Auth initializes
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25 animate-pulse">
              <Cpu className="w-7 h-7" />
            </div>
            <div className="absolute -inset-1 rounded-2xl border-2 border-indigo-500/40 animate-ping" />
          </div>
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold font-mono text-zinc-900 dark:text-white">AlgoMentor</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">Initializing your secure workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  // If unauthenticated: Route directly to sign in first
  if (!currentUser) {
    return <AuthGateView />;
  }

  // Once authenticated: Show the app and user progress
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'chat':
        return <AiChatView />;
      case 'tracks':
        return <LearningTracksView />;
      case 'practice':
        return <PracticeArenaView />;
      case 'collab':
        return <CollabRoomsView />;
      case 'interview':
        return <InterviewModeView />;
      case 'code-explainer':
        return <CodeExplainerView />;
      case 'roadmap':
        return <RoadmapView />;
      case 'resources':
        return <ResourcesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-indigo-500/30 selection:text-indigo-600 dark:selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 bg-slate-50 dark:bg-zinc-950 transition-colors duration-200">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <AssessmentModal />
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
