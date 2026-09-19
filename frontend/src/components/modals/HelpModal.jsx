import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export default function HelpModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title flex items-center gap-2">
            <HelpCircle className="text-primary" size={20} />
            <span>Help & Quick Guide</span>
          </h2>
          <button onClick={onClose} className="action-btn" aria-label="Close modal">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-body-lg">How to manage tasks:</h4>
            <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
              <li>Fill in title and select options, then click <strong>Create Milestone</strong> to insert.</li>
              <li>Click on any task card row to populate details into the editing panel.</li>
              <li>Click the circular checkbox on the left of any task row to toggle status quickly.</li>
              <li>Hover over a task row to reveal the deletion button.</li>
            </ul>
          </div>
          <div className="space-y-2 pt-2 border-t border-outline-variant">
            <h4 className="font-bold text-body-lg">Tabs overview:</h4>
            <p className="text-sm text-on-surface-variant">
              Use the sidebar to navigate between Tasks (live stream list), Timeline (due-date projection list), and Reports (progress analytics).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
