import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../config/api';

export function useTasks(view, currentTab, setCurrentTab) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbStatus, setDbStatus] = useState({ connected: false, mode: 'In-Memory Fallback' });
  
  const [searchQuery, setSearchQuery] = useState('');
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

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (view === 'archive') {
        queryParams.append('status', 'completed');
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
  }, [view, filterPriority, searchQuery, sortBy, addToast]);

  const fetchDbStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/tasks/status`);
      if (!res.ok) throw new Error('Status check failed');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({ connected: false, mode: 'Disconnected/Offline' });
    }
  }, []);

  useEffect(() => {
    fetchDbStatus();
    const interval = setInterval(fetchDbStatus, 10000);
    return () => clearInterval(interval);
  }, [fetchDbStatus]);

  useEffect(() => {
    if (view === 'dashboard' || view === 'archive') {
      fetchTasks();
    }
  }, [view, fetchTasks]);

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
      return true;
    } catch {
      addToast('Failed to generate samples', 'error');
      return false;
    }
  };

  const totalTasksCount = tasks.length;
  const pendingTasksCount = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
  const completedTasksCount = tasks.filter(t => t.status === 'completed').length;
  const efficiencyRate = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  return {
    tasks,
    loading,
    dbStatus,
    fetchTasks,
    fetchDbStatus,
    searchQuery,
    setSearchQuery,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    editingTask,
    formData,
    setFormData,
    formErrors,
    handleOpenEdit,
    handleResetForm,
    handleSubmit,
    handleDelete,
    handleQuickToggleStatus,
    handleGenerateSampleData,
    toasts,
    addToast,
    removeToast,
    totalTasksCount,
    pendingTasksCount,
    completedTasksCount,
    efficiencyRate
  };
}
