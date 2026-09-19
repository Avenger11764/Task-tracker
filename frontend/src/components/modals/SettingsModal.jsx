import React from 'react';
import { Settings as SettingsIcon, X, RefreshCw } from 'lucide-react';
import { API_BASE_URL } from '../../config/api';

export default function SettingsModal({ dbStatus, onRefreshDbStatus, onGenerateSampleData, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title flex items-center gap-2">
            <SettingsIcon className="text-primary" size={20} />
            <span>Settings Console</span>
          </h2>
          <button onClick={onClose} className="action-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-sm">Database Sync Mode</h4>
            <div className="p-3 bg-surface-container-low border border-outline-variant rounded flex items-center justify-between">
              <div className="text-xs text-on-surface-variant font-medium">
                <div>Current Mode: <span className="font-bold capitalize">{dbStatus.mode}</span></div>
                <div>API URL: <span className="font-mono text-[10px] text-muted">{API_BASE_URL}</span></div>
              </div>
              <button onClick={onRefreshDbStatus} className="p-2 hover:bg-surface-container-high rounded" title="Recheck Status">
                <RefreshCw size={14} className="text-secondary" />
              </button>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-outline-variant">
            <h4 className="font-bold text-sm">Mock Data Utilities</h4>
            <p className="text-xs text-on-surface-variant mb-2">
              Populate your dashboard collections with pre-configured sample milestones.
            </p>
            <button
              onClick={onGenerateSampleData}
              className="w-full py-2 border border-secondary text-secondary hover:bg-secondary/5 rounded text-xs font-bold transition-all"
            >
              Generate 3 Sample Tasks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
