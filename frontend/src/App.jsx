import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from './config/api';

// Tab Components
import TasksTab from './components/tabs/TasksTab';
import TimelineTab from './components/tabs/TimelineTab';
import ReportsTab from './components/tabs/ReportsTab';

// View Components
import LandingView from './components/views/LandingView';
import ArchiveView from './components/views/ArchiveView';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Modal and UI Components
import HelpModal from './components/modals/HelpModal';
import SettingsModal from './components/modals/SettingsModal';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  const [view, setView] = useState('landing');
  const [currentTab, setCurrentTab] = useState('tasks');
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'In-Memory Fallback' });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [toasts, setToasts] = useState([]);

  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (view === 'archive') {
        queryParams.append('status', 'completed');
      } else if (filterStatus) {
        queryParams.append('status', filterStatus);
      }
      
      if (filterPriority) queryParams.append('priority', filterPriority);
      if (searchQuery) queryParams.append('search', searchQuery);
      if (sortBy) queryParams.append('sortBy', sortBy);

      const res = await fetch(`${API_BASE_URL}/tasks?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      addToast(err.message || 'Error loading tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchDbStatus = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/status`);
      if (!res.ok) throw new Error('Status check failed');
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      setDbStatus({ connected: false, mode: 'Disconnected/Offline' });
    }
  };

  useEffect(() => {
    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (view === 'dashboard' || view === 'archive') {
      fetchTasks();
    }
  }, [view, filterStatus, filterPriority, searchQuery, sortBy]);

  useEffect(() => {
    document.documentElement.className = 'light';
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Task title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title cannot exceed 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setFormErrors({});
  };

  const handleResetForm = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: ''
    });
    setFormErrors({});
    
    if (currentTab !== 'tasks') {
      setCurrentTab('tasks');
    }
    
    setTimeout(() => {
      const el = document.getElementById('form-title');
      if (el) el.focus();
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const url = editingTask 
        ? `${API_BASE_URL}/tasks/${editingTask._id}`
        : `${API_BASE_URL}/tasks`;
      const method = editingTask ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Operation failed');
      }

      addToast(
        editingTask ? 'Task updated successfully' : 'Task created successfully', 
        'success'
      );
      handleResetForm();
      fetchTasks();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      addToast('Task deleted successfully', 'success');
      if (editingTask && editingTask._id === id) {
        handleResetForm();
      }
      fetchTasks();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleQuickToggleStatus = async (e, task) => {
    e.stopPropagation();
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...task,
          status: newStatus
        })
      });
      if (!res.ok) throw new Error('Failed to update status');
      addToast(`Task marked as ${newStatus}`, 'success');
      fetchTasks();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleGenerateSampleData = async () => {
    const samples = [
      { title: 'Critical Security Patch Deployment', description: 'Deploy the v2.4.1 patch to staging and production.', status: 'pending', priority: 'high', dueDate: new Date().toISOString().split('T')[0] },
      { title: 'Q3 Performance Analytics Export', description: 'Compile weekly data for stakeholders.', status: 'in-progress', priority: 'medium', dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] },
      { title: 'Update Brand Identity Guidelines', description: 'Incorporate slate palette into styles.', status: 'completed', priority: 'low', dueDate: new Date().toISOString().split('T')[0] }
    ];

    try {
      for (const sample of samples) {
        await fetch(`${API_BASE_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sample)
        });
      }
      addToast('Sample milestones added successfully!', 'success');
      fetchTasks();
      setShowSettingsModal(false);
    } catch (e) {
      addToast('Failed to generate samples', 'error');
    }
  };

  const totalTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const efficiencyRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  if (view === 'landing') {
    return (
      <>
        <LandingView 
          setView={setView} 
          onOpenHelp={() => setShowHelpModal(true)} 
          onOpenSettings={() => setShowSettingsModal(true)} 
        />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  if (view === 'archive') {
    return (
      <>
        <ArchiveView 
          tasks={tasks}
          loading={loading}
          dbStatus={dbStatus}
          setView={setView}
          handleQuickToggleStatus={handleQuickToggleStatus}
          handleDelete={handleDelete}
          onOpenSettings={() => setShowSettingsModal(true)}
        />
        {showSettingsModal && (
          <SettingsModal 
            dbStatus={dbStatus}
            onRefreshDbStatus={fetchDbStatus}
            onGenerateSampleData={handleGenerateSampleData}
            onClose={() => setShowSettingsModal(false)}
          />
        )}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </>
    );
  }

  return (
    <div className="bg-background text-on-surface min-h-screen flex w-full">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewTask={handleResetForm}
        onOpenHelp={() => setShowHelpModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
        onGoHome={() => setView('landing')}
      />

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header Navigation */}
        <Header 
          view={view}
          setView={setView}
          dbStatus={dbStatus}
          currentTab={currentTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNotify={() => addToast('No new notifications.', 'success')}
          onOpenSettings={() => setShowSettingsModal(true)}
        />

        <div className="p-margin-desktop space-y-margin-desktop w-full max-w-container-max mx-auto">
          {/* Tasks Tab */}
          {currentTab === 'tasks' && (
            <TasksTab 
              tasks={tasks}
              loading={loading}
              totalTasksCount={totalTasksCount}
              pendingTasksCount={pendingTasksCount}
              completedTasksCount={completedTasksCount}
              efficiencyRate={efficiencyRate}
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
              editingTask={editingTask}
              handleSubmit={handleSubmit}
              handleResetForm={handleResetForm}
              handleOpenEdit={handleOpenEdit}
              handleDelete={handleDelete}
              handleQuickToggleStatus={handleQuickToggleStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filterPriority={filterPriority}
              setFilterPriority={setFilterPriority}
            />
          )}

          {/* Timeline Tab */}
          {currentTab === 'timeline' && (
            <TimelineTab tasks={tasks} />
          )}

          {/* Reports Tab */}
          {currentTab === 'reports' && (
            <ReportsTab 
              tasks={tasks}
              totalTasksCount={totalTasksCount}
              efficiencyRate={efficiencyRate}
              dbStatus={dbStatus}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button (Mobile) */}
      <button 
        onClick={handleResetForm} 
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
        aria-label="New Task"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Help Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <SettingsModal 
          dbStatus={dbStatus}
          onRefreshDbStatus={fetchDbStatus}
          onGenerateSampleData={handleGenerateSampleData}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

export default App;
