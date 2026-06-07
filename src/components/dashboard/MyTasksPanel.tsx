import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Inbox, ChevronDown, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import TaskStatusBadge from './TaskStatusBadge';
import TaskDetailModal from './TaskDetailModal';
import type { Task } from '@/types';

const MyTasksPanel = () => {
  const { user } = useAuth();
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const fetchTasks = async () => {
    if (!user) return;
    const [activeRes, completedRes] = await Promise.all([
      supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', user.id)
        .neq('status', 'Completed')
        .order('due_date', { ascending: true, nullsFirst: false }),
      supabase
        .from('tasks')
        .select('*')
        .eq('assignee_id', user.id)
        .eq('status', 'Completed')
        .order('completed_at', { ascending: false })
        .limit(20),
    ]);
    setActiveTasks(activeRes.data ?? []);
    setCompletedTasks(completedRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const isOverdue = (dueDate: string | null) =>
    dueDate ? new Date(dueDate) < new Date() : false;

  const formatCompleted = (iso: string | null) => {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  // When a task is updated to Completed, move it between lists
  const handleUpdated = () => {
    fetchTasks();
    // Refresh the selected task object so the modal reflects the new status
    if (selected) {
      const refreshed = [...activeTasks, ...completedTasks].find(t => t.id === selected.id);
      if (refreshed) setSelected(refreshed);
    }
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="font-cabinet font-bold text-lg text-pink-swirl mb-1">My Tasks</h2>
        <p className="font-general text-xs text-pink-swirl/30 mb-5">
          Click a task to update its status or leave a comment.
        </p>

        {/* ── Active tasks ── */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && activeTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-pink-swirl/30">
            <Inbox size={36} strokeWidth={1} className="mb-3" />
            <p className="font-general text-sm">No active tasks assigned to you.</p>
          </div>
        )}

        {!loading && activeTasks.length > 0 && (
          <div className="space-y-3">
            {activeTasks.map((task, i) => (
              <motion.button
                key={task.id}
                onClick={() => setSelected(task)}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="w-full text-left flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 hover:border-waxy-corn/20 border border-transparent transition-all duration-150 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-general text-sm text-pink-swirl font-medium truncate group-hover:text-waxy-corn transition-colors">
                    {task.title}
                  </p>
                  {task.due_date && (
                    <div className={cn(
                      'flex items-center gap-1.5 mt-1',
                      isOverdue(task.due_date) ? 'text-hot-red' : 'text-pink-swirl/40'
                    )}>
                      <CalendarDays size={12} />
                      <span className="font-general text-xs">
                        {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {isOverdue(task.due_date) && ' · Overdue'}
                      </span>
                    </div>
                  )}
                </div>
                <TaskStatusBadge status={task.status} />
              </motion.button>
            ))}
          </div>
        )}

        {/* ── Completed tasks toggle ── */}
        {!loading && completedTasks.length > 0 && (
          <div className="mt-6">
            <button
              onClick={() => setShowCompleted(v => !v)}
              className="flex items-center gap-2 w-full text-left group"
            >
              <CheckCircle2 size={14} className="text-fluorescence/60 flex-shrink-0" />
              <span className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/30 group-hover:text-pink-swirl/50 transition-colors flex-1">
                Completed ({completedTasks.length})
              </span>
              <ChevronDown
                size={14}
                className={cn(
                  'text-pink-swirl/30 transition-transform duration-200',
                  showCompleted && 'rotate-180'
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {showCompleted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 mt-3">
                    {completedTasks.map((task) => (
                      <button
                        key={task.id}
                        onClick={() => setSelected(task)}
                        className="w-full text-left flex items-center justify-between gap-4 px-4 py-3 rounded-xl border border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-general text-sm text-pink-swirl/50 group-hover:text-pink-swirl/80 truncate transition-colors line-through decoration-pink-swirl/20">
                            {task.title}
                          </p>
                          {task.completed_at && (
                            <p className="font-general text-xs text-pink-swirl/25 mt-0.5">
                              Completed {formatCompleted(task.completed_at)}
                            </p>
                          )}
                        </div>
                        <TaskStatusBadge status={task.status} />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <TaskDetailModal
            task={selected}
            onClose={() => setSelected(null)}
            onUpdated={handleUpdated}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default MyTasksPanel;
