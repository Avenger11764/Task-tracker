import React from 'react';
import { Database, User } from 'lucide-react';

export default function Header({
  view,
  setView,
  dbStatus,
  currentTab,
  searchQuery,
  setSearchQuery,
  onNotify,
  onOpenSettings
}) {
  return (
    <header className="w-full top-0 sticky z-10 bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline">
      <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <span 
            onClick={() => setView('landing')} 
            className="text-headline-md font-headline-md font-black text-primary dark:text-primary-fixed md:hidden cursor-pointer"
          >
            Chronos
          </span>
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setView('landing')} 
              className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md"
            >
              Home
            </button>
            <button 
              onClick={() => setView('dashboard')} 
              className={`text-label-md font-label-md font-semibold transition-colors ${
                view === 'dashboard'
                  ? 'text-primary dark:text-secondary-fixed-dim border-b-2 border-primary dark:border-secondary-fixed-dim pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setView('archive')} 
              className={`text-label-md font-label-md font-semibold transition-colors ${
                view === 'archive'
                  ? 'text-primary border-b-2 border-primary pb-1'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Archive
            </button>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <span 
            className={`db-badge ${!dbStatus.connected ? 'disconnected' : ''}`} 
            style={{ border: 'none', padding: '4px 10px', fontSize: '11px' }}
          >
            <span className="db-pulse"></span>
            <Database size={12} style={{ marginRight: 2 }} />
            {dbStatus.mode}
          </span>
          
          {currentTab === 'tasks' && (
            <div className="relative group hidden sm:block">
              <input 
                className="bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-body-md focus:ring-1 focus:ring-primary outline-none transition-all w-64" 
                placeholder="Search tasks..." 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <button 
              onClick={onNotify} 
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:opacity-80"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button 
              onClick={onOpenSettings} 
              className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:opacity-80"
              aria-label="Settings"
            >
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2 flex items-center justify-center bg-surface-container-high text-primary">
              <User size={18} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
