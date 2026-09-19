import React from 'react';
import { CalendarDays } from 'lucide-react';
import { formatTaskDate } from '../../utils/taskUtils';

export default function TimelineTab({ tasks }) {
  const tasksWithDueDate = tasks
    .filter(t => t.dueDate)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 space-y-6">
      <div>
        <h3 className="text-headline-md font-headline-md font-bold">Project Timeline Projection</h3>
        <p className="text-body-md text-on-surface-variant">A sequenced list of milestones sorted by their execution due dates.</p>
      </div>

      {tasksWithDueDate.length === 0 ? (
        <div className="text-center p-12 text-on-surface-variant space-y-2">
          <CalendarDays className="mx-auto w-12 h-12 text-outline-variant" />
          <h4 className="font-bold">No Milestones with Due Dates</h4>
          <p className="text-xs">Add due dates to your milestones to see them mapped on this timeline.</p>
        </div>
      ) : (
        <div className="relative border-l border-outline-variant ml-4 pl-8 space-y-8 py-4">
          {tasksWithDueDate.map((task) => {
            const isHigh = task.priority === 'high';
            const isDone = task.status === 'completed';
            return (
              <div key={task._id} className="relative group">
                <div 
                  className={`absolute -left-[41px] top-1.5 w-6 h-6 rounded-full border-4 bg-background flex items-center justify-center ${
                    isDone ? 'border-emerald-500' : isHigh ? 'border-error' : 'border-secondary'
                  }`}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-on-surface"></div>
                </div>
                
                <div className="space-y-1">
                  <span className="text-xs font-bold text-secondary">{formatTaskDate(task.dueDate)}</span>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-body-lg font-bold ${isDone ? 'line-through opacity-60' : ''}`}>
                      {task.title}
                    </h4>
                    <span 
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-tight font-bold ${
                        isDone 
                          ? 'bg-surface-container-high' 
                          : isHigh 
                            ? 'bg-error-container text-on-error-container' 
                            : 'bg-primary-fixed text-primary'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-body-md text-on-surface-variant max-w-xl">{task.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
