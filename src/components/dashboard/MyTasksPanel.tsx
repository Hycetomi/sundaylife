import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import TaskStatusBadge from './TaskStatusBadge';
import type { Task } from '@/types';

const MyTasksPanel = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('tasks')
      .select('*')
      .eq('assignee_id', user.id)
      .neq('status', 'Completed')
      .order('due_date', { ascending: true, nullsFirst: false })
      .then(({ data }) => {
        setTasks(data ?? []);
        setLoading(false);
      });
  }, [user]);

  const isOverdue = (dueDate: string | null) =>
    dueDate ? new Date(dueDate) < new Date() : false;

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="font-cabinet font-bold text-lg text-pink-swirl mb-5">My Tasks</h2>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-pink-swirl/30">
          <Inbox size={36} strokeWidth={1} className="mb-3" />
          <p className="font-general text-sm">No active tasks assigned to you.</p>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <motion.div
              key={task.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="font-general text-sm text-pink-swirl font-medium truncate group-hover:text-waxy-corn transition-colors">
                  {task.title}
                </p>
                {task.due_date && (
                  <div className={`flex items-center gap-1.5 mt-1 ${isOverdue(task.due_date) ? 'text-hot-red' : 'text-pink-swirl/40'}`}>
                    <CalendarDays size={12} />
                    <span className="font-general text-xs">
                      {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      {isOverdue(task.due_date) && ' · Overdue'}
                    </span>
                  </div>
                )}
              </div>
              <TaskStatusBadge status={task.status} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasksPanel;
