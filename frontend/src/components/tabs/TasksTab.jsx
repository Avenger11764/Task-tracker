import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatTaskDate, isOverdue } from '../../utils/taskUtils';

export default function TasksTab({
  tasks,
  loading,
  totalTasksCount,
  pendingTasksCount,
  completedTasksCount,
  efficiencyRate,
  formData,
  setFormData,
  formErrors,
  editingTask,
  handleSubmit,
  handleResetForm,
  handleOpenEdit,
  handleDelete,
  handleQuickToggleStatus,
  sortBy,
  setSortBy,
  filterPriority,
  setFilterPriority
}) {
  return (
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
            <div 
              className="bg-secondary h-full" 
              style={{ width: `${totalTasksCount > 0 ? (pendingTasksCount / totalTasksCount) * 100 : 0}%` }}
            ></div>
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
        {/* Task Form Panel */}
        <section className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h3 className="text-headline-md font-headline-md font-bold">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h3>
                <p className="text-body-md text-on-surface-variant">
                  {editingTask ? 'Modify milestone values.' : 'Define your next milestone.'}
                </p>
              </div>
              {editingTask && (
                <button onClick={handleResetForm} className="text-xs text-secondary font-bold hover:underline">
                  Cancel
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-title">
                  Task Title *
                </label>
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
                  <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-due">
                    Due Date
                  </label>
                  <input 
                    className="w-full bg-surface-container-low border border-outline-variant rounded px-4 py-2 text-body-md focus:border-primary outline-none transition-colors" 
                    type="date"
                    id="form-due"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-priority">
                    Priority
                  </label>
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
                <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-status">
                  Status
                </label>
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
                <label className="block text-label-md font-label-md text-on-surface mb-1.5" htmlFor="form-desc">
                  Description
                </label>
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
              <p className="text-body-md text-on-surface-variant leading-snug">
                Toggle task status by clicking the checkboxes in the stream list.
              </p>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">bolt</span>
            </div>
          </div>
        </section>

        {/* Active Stream Panel */}
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
  );
}
