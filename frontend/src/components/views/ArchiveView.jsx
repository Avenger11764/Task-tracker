import React from 'react';
import { Archive, Trash2, Database, User } from 'lucide-react';

export default function ArchiveView({
  tasks,
  loading,
  dbStatus,
  setView,
  handleQuickToggleStatus,
  handleDelete,
  onOpenSettings
}) {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col w-full">
      <header className="w-full top-0 sticky z-10 bg-surface-container-lowest border-b border-outline-variant">
        <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-8">
            <span 
              onClick={() => setView('landing')} 
              className="text-headline-md font-headline-md font-black text-primary cursor-pointer"
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
                className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md"
              >
                Dashboard
              </button>
              <button 
                onClick={() => setView('archive')} 
                className="text-primary border-b-2 border-primary pb-1 text-label-md font-label-md font-semibold"
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
            <div className="flex items-center gap-2">
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

      <div className="p-margin-desktop space-y-margin-desktop w-full max-w-container-max mx-auto flex-1">
        <div className="flex justify-between items-center border-b border-outline-variant pb-4">
          <div>
            <h3 className="text-headline-lg font-bold flex items-center gap-2 text-primary">
              <Archive size={28} />
              <span>Milestone Archive</span>
            </h3>
            <p className="text-body-md text-on-surface-variant mt-1">
              All objectives marked as completed in your database. Toggle checkboxes to restore milestones to your active stream.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="text-center p-12">
            <div className="db-pulse w-6 h-6 mx-auto mb-2"></div>
            <span className="text-body-md text-on-surface-variant">Loading Archive...</span>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center p-16 bg-surface-container-lowest border border-outline-variant rounded space-y-4">
            <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
            <h4 className="text-headline-md font-bold">Archive is Empty</h4>
            <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">
              Complete tasks in the Dashboard to store them here.
            </p>
            <button onClick={() => setView('dashboard')} className="btn btn-primary">
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map(task => (
              <div key={task._id} className="p-4 border border-outline-variant rounded-lg bg-surface-container-lowest flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <button 
                    onClick={(e) => handleQuickToggleStatus(e, task)}
                    className="w-5 h-5 rounded-full bg-emerald-500 border border-emerald-500 flex items-center justify-center transition-colors flex-shrink-0"
                    title="Click to Restore"
                  >
                    <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>
                  </button>
                  <div className="min-w-0">
                    <h4 className="text-body-lg font-bold truncate line-through text-on-surface-variant opacity-75">{task.title}</h4>
                    {task.description && <p className="text-body-md text-on-surface-variant truncate text-xs">{task.description}</p>}
                  </div>
                </div>
                
                <button 
                  onClick={(e) => handleDelete(e, task._id)}
                  className="p-1.5 hover:bg-surface-container-high rounded text-error flex-shrink-0"
                  title="Delete permanently"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
