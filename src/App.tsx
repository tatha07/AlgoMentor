import React from 'react';
import { AuthProvider } from './context/AuthContext';
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
import { DevModeModal } from './components/common/DevModeModal';
import { AuthModal } from './components/auth/AuthModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

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
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            {renderActiveTab()}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Modals */}
      <AssessmentModal />
      <DevModeModal />
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

