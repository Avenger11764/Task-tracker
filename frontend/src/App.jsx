import React, { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';

// View Components
import LandingView from './components/views/LandingView';
import DashboardView from './components/views/DashboardView';
import ArchiveView from './components/views/ArchiveView';

// Modal and UI Components
import HelpModal from './components/modals/HelpModal';
import SettingsModal from './components/modals/SettingsModal';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  const [view, setView] = useState('landing');
  const [currentTab, setCurrentTab] = useState('tasks');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const taskManager = useTasks(view, currentTab, setCurrentTab);

  useEffect(() => {
    document.documentElement.className = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const handleGenerateSampleDataAndClose = async () => {
    const success = await taskManager.handleGenerateSampleData();
    if (success) {
      setShowSettingsModal(false);
    }
  };

  return (
    <>
      {view === 'landing' && (
        <LandingView 
          setView={setView} 
          onOpenHelp={() => setShowHelpModal(true)} 
          onOpenSettings={() => setShowSettingsModal(true)} 
        />
      )}

      {view === 'dashboard' && (
        <DashboardView 
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          view={view}
          setView={setView}
          onOpenHelp={() => setShowHelpModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          taskManager={taskManager}
        />
      )}

      {view === 'archive' && (
        <ArchiveView 
          tasks={taskManager.tasks}
          loading={taskManager.loading}
          dbStatus={taskManager.dbStatus}
          setView={setView}
          handleQuickToggleStatus={taskManager.handleQuickToggleStatus}
          handleDelete={taskManager.handleDelete}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
      )}

      {/* Global Modals */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal 
          dbStatus={taskManager.dbStatus}
          onRefreshDbStatus={taskManager.fetchDbStatus}
          onGenerateSampleData={handleGenerateSampleDataAndClose}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Global Notifications */}
      <ToastContainer 
        toasts={taskManager.toasts} 
        removeToast={taskManager.removeToast} 
      />
    </>
  );
}

export default App;
