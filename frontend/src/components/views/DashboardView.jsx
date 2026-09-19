import React from 'react';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import TasksTab from '../tabs/TasksTab';
import TimelineTab from '../tabs/TimelineTab';
import ReportsTab from '../tabs/ReportsTab';

export default function DashboardView({
  currentTab,
  setCurrentTab,
  view,
  setView,
  onOpenHelp,
  onOpenSettings,
  taskManager
}) {
  const {
    tasks,
    loading,
    dbStatus,
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
    addToast,
    totalTasksCount,
    pendingTasksCount,
    completedTasksCount,
    efficiencyRate
  } = taskManager;

  return (
    <div className="bg-background text-on-surface min-h-screen flex w-full">
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onNewTask={handleResetForm}
        onOpenHelp={onOpenHelp}
        onOpenSettings={onOpenSettings}
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
          onOpenSettings={onOpenSettings}
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
    </div>
  );
}
