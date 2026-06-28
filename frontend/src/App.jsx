import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Search, Calendar, Trash2, Edit2, CheckCircle2, 
  Circle, Play, AlertCircle, X, Database,
  TrendingUp, CheckSquare, Clock, ListTodo, AlertTriangle,
  Mail, Settings as SettingsIcon, HelpCircle, User, ArrowRight, ShieldAlert,
  Inbox, AlignLeft, Info, BarChart3, CalendarDays, RefreshCw, Archive
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

function ConstellationCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 85;
    const connectionDistance = 125;
    const mouseRadius = 180;
    
    let mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.9,
        vy: (Math.random() - 0.5) * 0.9,
        radius: Math.random() * 2.5 + 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99, 102, 241, 0.45)';
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.lineWidth = 1.0;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouseRadius) {
            const alpha = (1 - dist / mouseRadius) * 0.55;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
    />
  );
}

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

  const formatTaskDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = (dateString, status) => {
    if (!dateString || status === 'completed') return false;
    const today = new Date();
    today.setHours(0,0,0,0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0,0,0,0);
    return dueDate < today;
  };

  if (view === 'landing') {
    return (
      <div className="bg-background text-on-surface min-h-screen relative overflow-x-hidden">
        <ConstellationCanvas />

        <header className="w-full top-0 sticky bg-surface-container-lowest/80 backdrop-blur border-b border-outline-variant z-50">
          <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <div className="text-headline-md font-headline-md font-black text-primary">Chronos</div>
            <nav className="hidden md:flex items-center space-x-8">
              <button onClick={() => setView('landing')} className="font-label-md text-label-md text-primary border-b-2 border-primary pb-1 transition-colors">
                Home
              </button>
              <button onClick={() => setView('dashboard')} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                Dashboard
              </button>
              <button onClick={() => setView('archive')} className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                Archive
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              <button onClick={() => { setView('dashboard'); setShowHelpModal(true); }} className="material-symbols-outlined text-on-surface-variant hover:text-primary active:opacity-80 transition-all">notifications</button>
              <button onClick={() => { setView('dashboard'); setShowSettingsModal(true); }} className="material-symbols-outlined text-on-surface-variant hover:text-primary active:opacity-80 transition-all">settings</button>
              <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant flex items-center justify-center text-primary">
                <User size={18} />
              </div>
            </div>
          </div>
        </header>

        <main className="relative z-10">
          <section className="relative pt-24 pb-32 overflow-hidden">
            <div className="max-w-container-max mx-auto px-margin-desktop grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center px-3 py-1 bg-primary text-on-primary rounded-lg">
                  <span className="font-label-md text-[10px] uppercase tracking-wider">v2.4 Clinical Update</span>
                </div>
                <h1 className="font-headline-lg text-headline-lg md:text-[56px] md:leading-[64px] text-primary max-w-xl">
                  Master Your Workflow, Minus the Friction
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                  The professional task management suite designed for high-density information and zero-latency execution. Focus on what matters, discard the noise.
                </p>
                <div className="flex items-center space-x-4">
                  <button onClick={() => setView('dashboard')} className="px-8 py-4 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 active:scale-95 transition-all">
                    Go to Dashboard
                  </button>
                  <button className="px-8 py-4 bg-surface-container-lowest border border-outline-variant text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-all">
                    View Documentation
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-surface-container-lowest/90 backdrop-blur border border-outline-variant rounded-xl overflow-hidden clinical-shadow">
                  <div className="h-10 bg-surface-container-low border-b border-outline-variant flex items-center px-4 space-x-2">
                    <div className="w-3 h-3 rounded-full bg-error/20"></div>
                    <div className="w-3 h-3 rounded-full bg-tertiary-fixed/40"></div>
                    <div className="w-3 h-3 rounded-full bg-secondary/20"></div>
                    <div className="ml-4 font-label-md text-[11px] text-on-surface-variant">chronos_dashboard_v1.sys</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" onClick={() => setView('dashboard')}>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-[#E11D48]"></div>
                        <span className="font-body-md text-body-md font-semibold">Q3 Financial Audit Preparation</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">Today, 4:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" onClick={() => setView('dashboard')}>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>
                        <span className="font-body-md text-body-md">Refactor API Authentication Layer</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">Tomorrow</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-outline-variant rounded bg-surface-bright hover:border-[#4648d4] transition-all cursor-pointer" onClick={() => setView('dashboard')}>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
                        <span className="font-body-md text-body-md">Documentation review for Project Alpha</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant">Jul 24</span>
                    </div>
                    <div className="h-px bg-outline-variant/30 w-full"></div>
                    <div className="flex items-center justify-between p-3 opacity-40">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 rounded-full bg-outline"></div>
                        <div className="h-4 w-32 bg-outline-variant rounded"></div>
                      </div>
                      <div className="h-4 w-12 bg-outline-variant rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary/5 rounded-full blur-3xl -z-10"></div>
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low/60 backdrop-blur py-24">
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="text-center mb-16 space-y-4">
                <h2 className="font-headline-lg text-headline-lg text-primary">Engineered for Precision</h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">High-performance tools shouldn't look like toys. Chronos uses a clinical design system to maximize your output.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="md:col-span-2 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl flex flex-col justify-between hover:bg-white transition-colors group">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-secondary text-3xl">view_timeline</span>
                    <h3 className="font-headline-md text-headline-md text-primary">Dynamic Timeline Projection</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">Automatically project your roadmap completion dates based on current velocity and task weights.</p>
                  </div>
                  <div className="mt-8 flex space-x-2">
                    <div className="flex-1 h-1 bg-secondary rounded-full"></div>
                    <div className="flex-1 h-1 bg-secondary/40 rounded-full"></div>
                    <div className="flex-1 h-1 bg-secondary/10 rounded-full"></div>
                  </div>
                </div>
                <div className="bg-primary text-on-primary p-8 rounded-xl flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-secondary-fixed text-3xl">bolt</span>
                    <h3 className="font-headline-md text-headline-md">High Velocity Execution</h3>
                    <p className="font-body-md text-body-md opacity-80">Track milestone status updates, filter values instantly, and stay ahead of deadlines.</p>
                  </div>
                  <button onClick={() => setView('dashboard')} className="mt-8 flex items-center font-label-md text-label-md space-x-2 hover:translate-x-2 transition-transform">
                    <span>Go to Live Dashboard</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
                <div className="bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl flex flex-col justify-between hover:bg-white transition-colors">
                  <div className="space-y-4">
                    <span className="material-symbols-outlined text-primary text-3xl">analytics</span>
                    <h3 className="font-headline-md text-headline-md text-primary">Granular Reports</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Audit your time down to the second with automated task logging.</p>
                  </div>
                </div>
                <div className="md:col-span-2 bg-surface-container-lowest/80 backdrop-blur border border-outline-variant p-8 rounded-xl relative overflow-hidden group">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="space-y-4 flex-1">
                      <h3 className="font-headline-md text-headline-md text-primary">High-Density Data Views</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Switch between clinical list views and high-level board views without losing context.</p>
                    </div>
                    <div className="flex-1 w-full bg-surface-container-high h-32 rounded border border-outline-variant flex items-center justify-center">
                      <div className="grid grid-cols-4 gap-2 w-full p-4">
                        <div className="h-12 bg-white border border-outline-variant rounded"></div>
                        <div className="h-12 bg-white border border-outline-variant rounded"></div>
                        <div className="h-12 bg-white border border-outline-variant rounded"></div>
                        <div className="h-12 bg-white border border-outline-variant rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 bg-surface-container-lowest/40 backdrop-blur">
            <div className="max-w-container-max mx-auto px-margin-desktop">
              <div className="bg-surface-bright/90 backdrop-blur border border-outline-variant rounded-2xl p-16 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
                <div className="space-y-4">
                  <h2 className="font-headline-lg text-headline-lg text-primary">Ready to eliminate the noise?</h2>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">Join 20k+ power users who have mastered their schedule.</p>
                </div>
                <div className="mt-8 md:mt-0 flex flex-col md:flex-row gap-4">
                  <button onClick={() => setView('dashboard')} className="px-10 py-5 bg-primary text-on-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-all">
                    Start Dashboard
                  </button>
                  <button className="px-10 py-5 bg-transparent text-primary font-label-md text-label-md border border-primary rounded-lg hover:bg-surface-container-low transition-all">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="bg-surface-container-lowest border-t border-outline-variant py-16 relative z-10">
          <div className="max-w-container-max mx-auto px-margin-desktop grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="text-headline-md font-headline-md font-black text-primary">Chronos</div>
              <p className="font-body-md text-body-md text-on-surface-variant">Precision-engineered workspace for professional teams.</p>
              <div className="flex space-x-4">
                <a className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">public</span>
                </a>
                <a className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-all" href="#">
                  <span className="material-symbols-outlined text-sm">alternate_email</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Product</h4>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">Features</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Integrations</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Pricing</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Changelog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Support</h4>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">Help Center</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">API Reference</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-label-md text-label-md text-primary font-bold uppercase mb-6">Company</h4>
              <ul className="space-y-4 font-body-md text-body-md text-on-surface-variant">
                <li><a className="hover:text-primary transition-colors" href="#">About Us</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-container-max mx-auto px-margin-desktop mt-16 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <span className="font-label-md text-label-md text-on-surface-variant">© 2024 Chronos Productivity Suite. All rights reserved.</span>
            <div className="flex space-x-6 font-label-md text-label-md text-on-surface-variant">
              <a className="hover:text-primary" href="#">System Status</a>
              <a className="hover:text-primary" href="#">Cookie Policy</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'archive') {
    return (
      <div className="bg-background text-on-surface min-h-screen flex flex-col w-full">
        <header className="w-full top-0 sticky z-10 bg-surface-container-lowest border-b border-outline-variant">
          <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-8">
              <span onClick={() => setView('landing')} className="text-headline-md font-headline-md font-black text-primary cursor-pointer">Chronos</span>
              <nav className="hidden md:flex items-center gap-6">
                <button onClick={() => setView('landing')} className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">Home</button>
                <button onClick={() => setView('dashboard')} className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">Dashboard</button>
                <button onClick={() => setView('archive')} className="text-primary border-b-2 border-primary pb-1 text-label-md font-label-md font-semibold">Archive</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`db-badge ${!dbStatus.connected ? 'disconnected' : ''}`} style={{ border: 'none', padding: '4px 10px', fontSize: '11px' }}>
                <span className="db-pulse"></span>
                <Database size={12} style={{ marginRight: 2 }} />
                {dbStatus.mode}
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowSettingsModal(true)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:opacity-80">
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
              <p className="text-body-md text-on-surface-variant mt-1">All objectives marked as completed in your database. Toggle checkboxes to restore milestones to your active stream.</p>
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
              <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">Complete tasks in the Dashboard to store them here.</p>
              <button onClick={() => setView('dashboard')} className="btn btn-primary">Go to Dashboard</button>
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

  return (
    <div className="bg-background text-on-surface min-h-screen flex w-full">
      <aside className="hidden md:flex flex-col h-screen sticky left-0 top-0 w-[280px] bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline p-4 space-y-2 flex-shrink-0">
        <div className="flex items-center gap-3 px-2 mb-8" onClick={() => setView('landing')} style={{ cursor: 'pointer' }}>
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
            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${currentTab === 'tasks' ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">check_circle</span>
            <span className="text-body-md font-body-md">Tasks</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('timeline')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${currentTab === 'timeline' ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">view_timeline</span>
            <span className="text-body-md font-body-md">Timeline</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('reports')} 
            className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-all ${currentTab === 'reports' ? 'bg-surface-container-highest dark:bg-secondary-container text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="text-body-md font-body-md">Reports</span>
          </button>
        </nav>
        
        <div className="pt-4 border-t border-outline-variant">
          <button onClick={handleResetForm} className="w-full py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-medium hover:opacity-90 transition-opacity">
            New Task
          </button>
        </div>
        
        <div className="mt-auto space-y-1">
          <button onClick={() => setShowHelpModal(true)} className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-all text-left">
            <span className="material-symbols-outlined">help</span>
            <span className="text-label-md font-label-md">Help</span>
          </button>
          <button onClick={() => setShowSettingsModal(true)} className="w-full flex items-center gap-3 px-3 py-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-all text-left">
            <span className="material-symbols-outlined">settings</span>
            <span className="text-label-md font-label-md">Settings</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="w-full top-0 sticky z-10 bg-surface-container-lowest dark:bg-surface-dim border-b border-outline-variant dark:border-outline">
          <div className="flex justify-between items-center px-margin-desktop py-4 w-full max-w-container-max mx-auto">
            <div className="flex items-center gap-8">
              <span onClick={() => setView('landing')} className="text-headline-md font-headline-md font-black text-primary dark:text-primary-fixed md:hidden cursor-pointer">Chronos</span>
              <nav className="hidden md:flex items-center gap-6">
                <button onClick={() => setView('landing')} className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">Home</button>
                <button onClick={() => setView('dashboard')} className="text-primary dark:text-secondary-fixed-dim border-b-2 border-primary dark:border-secondary-fixed-dim pb-1 text-label-md font-label-md font-semibold">Dashboard</button>
                <button onClick={() => setView('archive')} className="text-on-surface-variant hover:text-primary transition-colors text-label-md font-label-md">Archive</button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`db-badge ${!dbStatus.connected ? 'disconnected' : ''}`} style={{ border: 'none', padding: '4px 10px', fontSize: '11px' }}>
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
                <button onClick={() => addToast('No new notifications.', 'success')} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:opacity-80">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button onClick={() => setShowSettingsModal(true)} className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors active:opacity-80">
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant ml-2 flex items-center justify-center bg-surface-container-high text-primary">
                  <User size={18} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-margin-desktop space-y-margin-desktop w-full max-w-container-max mx-auto">
          
          {currentTab === 'tasks' && (
            <>
              <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all hover:border-primary/20 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Total Tasks</p>
                      <h2 className="text-headline-lg font-headline-lg mt-1 font-bold">{totalTasksCount}</h2>
                    </div>
                    <div className="bg-primary/5 p-2 rounded">
                      <span className="material-symbols-outlined text-primary">inventory_2</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-emerald-600 text-label-md font-bold">+12%</span>
                    <span className="text-on-surface-variant text-label-md">vs last week</span>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all hover:border-primary/20 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Pending</p>
                      <h2 className="text-headline-lg font-headline-lg mt-1 font-bold">{pendingTasksCount}</h2>
                    </div>
                    <div className="bg-secondary/5 p-2 rounded">
                      <span className="material-symbols-outlined text-secondary">pending_actions</span>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full" style={{ width: `${totalTasksCount > 0 ? (pendingTasksCount / totalTasksCount) * 100 : 0}%` }}></div>
                  </div>
                </div>
                
                <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all hover:border-primary/20 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Completed</p>
                      <h2 className="text-headline-lg font-headline-lg mt-1 font-bold">{completedTasksCount}</h2>
                    </div>
                    <div className="bg-emerald-500/5 p-2 rounded">
                      <span className="material-symbols-outlined text-emerald-600">task_alt</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-emerald-600 text-label-md font-bold">{efficiencyRate}%</span>
                    <span className="text-on-surface-variant text-label-md">efficiency rate</span>
                  </div>
                </div>
              </section>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                <section className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
                  <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
                    <div className="mb-6 flex justify-between items-center">
                      <div>
                        <h3 className="text-headline-md font-headline-md font-bold">{editingTask ? 'Edit Task' : 'New Task'}</h3>
                        <p className="text-body-md text-on-surface-variant">{editingTask ? 'Modify milestone values.' : 'Define your next milestone.'}</p>
                      </div>
                      {editingTask && (
                        <button onClick={handleResetForm} className="text-xs text-secondary font-bold hover:underline">
                          Cancel
                        </button>
                      )}
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-title">Task Title *</label>
                        <input 
                          className={`w-full bg-surface-container-low border ${formErrors.title ? 'border-error' : 'border-outline-variant'} rounded px-4 py-2.5 text-body-md focus:border-primary outline-none transition-colors placeholder:text-outline`} 
                          placeholder="e.g., Q4 Revenue Review" 
                          type="text"
                          id="form-title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        {formErrors.title && <span className="text-error text-xs block mt-1">{formErrors.title}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-due">Due Date</label>
                          <input 
                            className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-2 text-body-md focus:border-primary outline-none transition-colors" 
                            type="date"
                            id="form-due"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-priority">Priority</label>
                          <select 
                            className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-2 text-body-md focus:border-primary outline-none transition-colors"
                            id="form-priority"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-status">Status</label>
                        <select 
                          className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-2 text-body-md focus:border-primary outline-none transition-colors"
                          id="form-status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-desc">Description</label>
                        <textarea 
                          className={`w-full bg-surface-container-low border ${formErrors.description ? 'border-error' : 'border-outline-variant'} rounded px-4 py-2 text-body-md focus:border-primary outline-none transition-colors resize-none`} 
                          placeholder="Briefly describe the objective..." 
                          rows="4"
                          id="form-desc"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        {formErrors.description && <span className="text-error text-xs block mt-1">{formErrors.description}</span>}
                      </div>

                      <div className="flex items-center gap-2 py-2">
                        <input className="w-4 h-4 rounded text-primary focus:ring-primary border-outline-variant" id="reminder" type="checkbox"/>
                        <label className="text-label-md text-on-surface-variant" htmlFor="reminder">Set email reminder</label>
                      </div>

                      <button className="w-full py-3 bg-primary text-on-primary rounded font-bold text-label-md transition-all hover:opacity-90 active:scale-[0.98] mt-2" type="submit">
                        {editingTask ? 'Save Changes' : 'Create Milestone'}
                      </button>
                    </form>
                  </div>

                  <div className="p-6 bg-surface-container-high rounded-lg border border-outline-variant relative overflow-hidden group">
                    <div className="relative z-10">
                      <h4 className="text-label-md font-bold text-primary mb-1">PRO TIP</h4>
                      <p className="text-body-md text-on-surface-variant leading-snug">Toggle task status by clicking the checkboxes in the stream list.</p>
                    </div>
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-[120px]">bolt</span>
                    </div>
                  </div>
                </section>

                <section className="lg:col-span-8 space-y-4">
                  <div className="flex justify-between items-center px-2">
                    <h3 className="text-headline-md font-headline-md font-bold">Active Stream</h3>
                    <div className="flex gap-2">
                      <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-1 px-2 rounded border border-outline-variant text-on-surface-variant bg-surface-container-lowest text-xs outline-none"
                        aria-label="Sort options"
                      >
                        <option value="createdAt">Newest First</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                      </select>
                      <select 
                        value={filterPriority} 
                        onChange={(e) => setFilterPriority(e.target.value)}
                        className="p-1 px-2 rounded border border-outline-variant text-on-surface-variant bg-surface-container-lowest text-xs outline-none"
                        aria-label="Filter priorities"
                      >
                        <option value="">All Priorities</option>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center p-12 bg-surface-container-lowest border border-outline-variant rounded">
                      <div className="db-pulse w-6 h-6 mx-auto mb-2"></div>
                      <span className="text-body-md text-on-surface-variant">Loading Stream...</span>
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center p-16 bg-surface-container-lowest border border-outline-variant rounded space-y-4">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">inbox</span>
                      <h4 className="text-headline-md font-bold">No Milestones Found</h4>
                      <p className="text-body-md text-on-surface-variant max-w-sm mx-auto">Create a task in the panel or adjust your query criteria.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {tasks.map(task => {
                        const isHigh = task.priority === 'high';
                        const isMed = task.priority === 'medium';
                        const isLow = task.priority === 'low';
                        const isDone = task.status === 'completed';
                        const overdue = isOverdue(task.dueDate, task.status);

                        return (
                          <div 
                            key={task._id} 
                            onClick={() => handleOpenEdit(task)}
                            className={`group flex items-center gap-4 p-4 border border-outline-variant hover:border-primary/30 transition-all rounded cursor-pointer relative overflow-hidden ${isDone ? 'bg-surface-container-low opacity-75' : 'bg-surface-container-lowest'}`}
                          >
                            {isHigh && !isDone && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
                            
                            <button 
                              onClick={(e) => handleQuickToggleStatus(e, task)}
                              className={`w-5 h-5 rounded-full border-2 ${isDone ? 'bg-emerald-500 border-emerald-500' : 'border-outline-variant hover:border-primary'} flex items-center justify-center transition-colors flex-shrink-0`}
                              title="Toggle Completion"
                            >
                              {isDone && <span className="material-symbols-outlined text-[12px] text-white font-bold">check</span>}
                            </button>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-0.5">
                                <h4 className={`text-body-lg font-bold truncate ${isDone ? 'task-done' : ''}`}>{task.title}</h4>
                                
                                {isDone ? (
                                  <span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-tighter">Completed</span>
                                ) : isHigh ? (
                                  <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded-full uppercase tracking-tighter">High Priority</span>
                                ) : isLow ? (
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-tighter">Low Priority</span>
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    <span className="text-label-md text-amber-600 font-bold">Medium</span>
                                  </div>
                                )}

                                {task.status === 'in-progress' && !isDone && (
                                  <span className="px-2 py-0.5 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold rounded-full uppercase">In Progress</span>
                                )}
                              </div>

                              {task.description && (
                                <p className={`text-body-md text-on-surface-variant truncate ${isDone ? 'task-done' : ''}`}>{task.description}</p>
                              )}

                              <div className="flex items-center gap-4 mt-2">
                                <div className={`flex items-center gap-1 ${overdue ? 'text-error' : 'text-on-surface-variant'}`}>
                                  <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                                  <span className="text-label-md">
                                    {task.dueDate ? formatTaskDate(task.dueDate) : 'No due date'} {overdue && '(Overdue)'}
                                  </span>
                                </div>
                                {task.status !== 'completed' && (
                                  <div className="flex items-center gap-1 text-on-surface-variant">
                                    <span className="material-symbols-outlined text-[16px]">label</span>
                                    <span className="text-label-md capitalize">{task.status}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={(e) => handleDelete(e, task._id)}
                                className="p-1.5 hover:bg-surface-container-high rounded text-error"
                                title="Delete Milestone"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="p-6 bg-primary text-on-primary rounded-lg flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="flex-1">
                      <h3 className="text-headline-md font-bold mb-2">Weekly Goal Progress</h3>
                      <p className="text-body-md opacity-80 mb-4">You've completed {efficiencyRate}% of your target tasks for this sprint.</p>
                      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                        <div className="bg-secondary-fixed h-full" style={{ width: `${efficiencyRate}%` }}></div>
                      </div>
                      <div className="flex justify-between mt-2 text-label-md font-bold">
                        <span>{completedTasksCount}/{totalTasksCount} Tasks</span>
                        <span>{efficiencyRate}%</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full border-8 border-white/10 flex items-center justify-center">
                        <span className="text-headline-md font-bold">{efficiencyRate}%</span>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </>
          )}

          {currentTab === 'timeline' && (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 space-y-6">
              <div>
                <h3 className="text-headline-md font-headline-md font-bold">Project Timeline Projection</h3>
                <p className="text-body-md text-on-surface-variant">A sequenced list of milestones sorted by their execution due dates.</p>
              </div>

              {tasks.filter(t => t.dueDate).length === 0 ? (
                <div className="text-center p-12 text-on-surface-variant space-y-2">
                  <CalendarDays className="mx-auto w-12 h-12 text-outline-variant" />
                  <h4 className="font-bold">No Milestones with Due Dates</h4>
                  <p className="text-xs">Add due dates to your milestones to see them mapped on this timeline.</p>
                </div>
              ) : (
                <div className="relative border-l border-outline-variant ml-4 pl-8 space-y-8 py-4">
                  {tasks
                    .filter(t => t.dueDate)
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((task, i) => {
                      const isHigh = task.priority === 'high';
                      const isDone = task.status === 'completed';
                      return (
                        <div key={task._id} className="relative group">
                          <div className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center ${isDone ? 'border-emerald-500' : isHigh ? 'border-error' : 'border-secondary'}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-on-surface"></div>
                          </div>
                          
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-secondary">{formatTaskDate(task.dueDate)}</span>
                            <div className="flex items-center gap-2">
                              <h4 className={`text-body-lg font-bold ${isDone ? 'line-through opacity-60' : ''}`}>{task.title}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tight font-bold ${isDone ? 'bg-surface-container-high' : isHigh ? 'bg-error-container text-on-error-container' : 'bg-primary-fixed text-primary'}`}>
                                {task.priority}
                              </span>
                            </div>
                            {task.description && <p className="text-body-md text-on-surface-variant max-w-xl">{task.description}</p>}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {currentTab === 'reports' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
                  <h4 className="text-label-md font-bold text-primary uppercase">Priority Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>High Priority</span>
                        <span className="font-bold">{tasks.filter(t => t.priority === 'high').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-error h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.priority === 'high').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Medium Priority</span>
                        <span className="font-bold">{tasks.filter(t => t.priority === 'medium').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-amber-500 h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.priority === 'medium').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Low Priority</span>
                        <span className="font-bold">{tasks.filter(t => t.priority === 'low').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-emerald-500 h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.priority === 'low').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
                  <h4 className="text-label-md font-bold text-primary uppercase">Status Distribution</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Pending</span>
                        <span className="font-bold">{tasks.filter(t => t.status === 'pending').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-purple-500 h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.status === 'pending').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>In Progress</span>
                        <span className="font-bold">{tasks.filter(t => t.status === 'in-progress').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-amber-500 h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.status === 'in-progress').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span>Completed</span>
                        <span className="font-bold">{tasks.filter(t => t.status === 'completed').length}</span>
                      </div>
                      <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                        <div className="bg-emerald-500 h-full" style={{ width: `${totalTasksCount > 0 ? (tasks.filter(t => t.status === 'completed').length / totalTasksCount) * 100 : 0}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-primary text-on-primary rounded-lg p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-75">Work Completion Rating</span>
                    <h2 className="text-[42px] font-black mt-2">{efficiencyRate}%</h2>
                    <p className="text-xs opacity-80 mt-2">Overall tasks successfully completed on the active database cluster.</p>
                  </div>
                  <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-4">
                    <span className="text-xs">Database Status:</span>
                    <span className="text-xs font-bold capitalize bg-white/15 px-2 py-0.5 rounded">{dbStatus.mode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      <button onClick={handleResetForm} className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {showHelpModal && (
        <div className="modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title flex items-center gap-2">
                <HelpCircle className="text-primary" size={20} />
                <span>Help & Quick Guide</span>
              </h2>
              <button onClick={() => setShowHelpModal(false)} className="action-btn">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-bold text-body-lg">How to manage tasks:</h4>
                <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1">
                  <li>Fill in title and select options, then click **Create Milestone** to insert.</li>
                  <li>Click on any task card row to populate details into the editing panel.</li>
                  <li>Click the circular checkbox on the left of any task row to toggle status quickly.</li>
                  <li>Hover over a task row to reveal the deletion button.</li>
                </ul>
              </div>
              <div className="space-y-2 pt-2 border-t border-outline-variant">
                <h4 className="font-bold text-body-lg">Tabs overview:</h4>
                <p className="text-sm text-on-surface-variant">Use the sidebar to navigate between Tasks (live stream list), and Timeline (due-date projection list).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title flex items-center gap-2">
                <SettingsIcon className="text-primary" size={20} />
                <span>Settings Console</span>
              </h2>
              <button onClick={() => setShowSettingsModal(false)} className="action-btn">
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
                  <button onClick={fetchDbStatus} className="p-2 hover:bg-surface-container-high rounded" title="Recheck Status">
                    <RefreshCw size={14} className="text-secondary" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-outline-variant">
                <h4 className="font-bold text-sm">Mock Data Utilities</h4>
                <p className="text-xs text-on-surface-variant mb-2">Populate your dashboard collections with pre-configured sample milestones.</p>
                <button onClick={handleGenerateSampleData} className="w-full py-2 border border-secondary text-secondary hover:bg-secondary/5 rounded text-xs font-bold transition-all">
                  Generate 3 Sample Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="toast-container" aria-live="polite">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            <AlertCircle size={16} style={{ color: 'var(--color-high)' }} />
            <span>{toast.message}</span>
            <button onClick={() => removeToast(toast.id)} className="action-btn" style={{ marginLeft: 'auto', padding: 2 }} aria-label="Close Alert">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
