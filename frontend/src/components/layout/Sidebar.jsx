import React from 'react';

export default function Sidebar({
  currentTab,
  setCurrentTab,
  onNewTask,
  onOpenHelp,
  onOpenSettings,
  onGoHome
}) {
  return (
    <aside className="hidden md:flex flex-col h-screen sticky left-0 top-0 w-[280px] bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline p-4 space-y-2 flex-shrink-0">
      <div className="flex items-center gap-3 px-2 mb-8 cursor-pointer" onClick={onGoHome}>
        <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-on-primary text-[20px]">check_circle</span>
        </div>
        <div>
          <h1 className="text-headline-md font-headline-md font-bold text-primary dark:text-primary-fixed">Chronos</h1>
          <p className="text-label-md font-label-md text-on-surface-variant">Productivity Suite</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        <button 
          onClick={() => setCurrentTab('tasks')} 
          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${
            currentTab === 'tasks' 
              ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-body-md font-body-md">Tasks</span>
        </button>
        
        <button 
          onClick={() => setCurrentTab('timeline')} 
          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${
            currentTab === 'timeline' 
              ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">view_timeline</span>
          <span className="text-body-md font-body-md">Timeline</span>
        </button>
        
        <button 
          onClick={() => setCurrentTab('reports')} 
          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${
            currentTab === 'reports' 
              ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' 
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          <span className="material-symbols-outlined">analytics</span>
          <span className="text-body-md font-body-md">Reports</span>
        </button>
      </nav>
      
      <div className="pt-4 border-t border-outline-variant">
        <button 
          onClick={onNewTask} 
          className="w-full py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:opacity-90 transition-opacity"
        >
          New Task
        </button>
      </div>
      
      <div className="mt-auto space-y-1">
        <button 
          onClick={onOpenHelp} 
          className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-all text-left"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="text-label-md font-label-md">Help</span>
        </button>
        <button 
          onClick={onOpenSettings} 
          className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-all text-left"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="text-label-md font-label-md">Settings</span>
        </button>
      </div>
    </aside>
  );
}
