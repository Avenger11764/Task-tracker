import React from 'react';

export default function ReportsTab({ tasks, totalTasksCount, efficiencyRate, dbStatus }) {
  const highPriorityCount = tasks.filter(t => t.priority === 'high').length;
  const mediumPriorityCount = tasks.filter(t => t.priority === 'medium').length;
  const lowPriorityCount = tasks.filter(t => t.priority === 'low').length;

  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getPercentage = (count) => {
    return totalTasksCount > 0 ? (count / totalTasksCount) * 100 : 0;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h4 className="text-label-md font-bold text-primary uppercase">Priority Distribution</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>High Priority</span>
                <span className="font-bold">{highPriorityCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-error h-full" style={{ width: `${getPercentage(highPriorityCount)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Medium Priority</span>
                <span className="font-bold">{mediumPriorityCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-amber-500 h-full" style={{ width: `${getPercentage(mediumPriorityCount)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Low Priority</span>
                <span className="font-bold">{lowPriorityCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-full" style={{ width: `${getPercentage(lowPriorityCount)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 space-y-4">
          <h4 className="text-label-md font-bold text-primary uppercase">Status Distribution</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Pending</span>
                <span className="font-bold">{pendingCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-purple-500 h-full" style={{ width: `${getPercentage(pendingCount)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>In Progress</span>
                <span className="font-bold">{inProgressCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-amber-500 h-full" style={{ width: `${getPercentage(inProgressCount)}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Completed</span>
                <span className="font-bold">{completedCount}</span>
              </div>
              <div className="w-full bg-outline-variant/35 h-1.5 rounded-full">
                <div className="bg-emerald-500 h-full" style={{ width: `${getPercentage(completedCount)}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Work Completion Rating */}
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
  );
}
