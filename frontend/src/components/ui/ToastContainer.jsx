import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <AlertCircle size={16} style={{ color: 'var(--color-high)' }} />
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="action-btn"
            style={{ marginLeft: 'auto', padding: 2 }}
            aria-label="Close Alert"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}
