import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, UserPlus, Inbox } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui';
import TaskStatusBadge from './TaskStatusBadge';
import AssignTaskModal from './AssignTaskModal';
import type { Task } from '@/types';

const TriageQueue = () => {
  const { profile } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const fetchQueue = () => {
    if (!profile) return;
    const query = supabase
      .from('tasks')
      .select('*')
      .eq('status', 'Pending Triage')
      .order('created_at', { ascending: true });

    if (profile.role !== 'Admin') {
      query.eq('department_id', profile.department_id);
    }

    query.then(({ data }) => {
      setTasks(data ?? []);
      setLoading(false);
    });
  };

  useEffect(fetchQueue, [profile]);

  const handleAssigned = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-cabinet font-bold text-lg text-pink-swirl">Pending Triage</h2>
          <span className="font-cabinet font-bold text-xs text-pink-swirl/40 bg-white/10 px-2.5 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>

        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
          </div>
        )}

        {!loading && tasks.length === 0 && (
          <div className="flex flex-col items-center py-12 text-pink-swirl/30">
            <Inbox size={36} strokeWidth={1} className="mb-3" />
            <p className="font-general text-sm">Triage queue is clear.</p>
          </div>
        )}

        {!loading && tasks.length > 0 && (
          <AnimatePresence initial={false}>
            <div className="space-y-3">
              {tasks.map((task, i) => (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, delay: i * 0.04 }}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-general text-sm text-pink-swirl font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <TaskStatusBadge status={task.status} />
                      {task.due_date && (
                        <div className="flex items-center gap-1 text-pink-swirl/40">
                          <CalendarDays size={11} />
                          <span className="font-general text-xs">
                            {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    icon={<UserPlus size={13} />}
                    onClick={() => setActiveTask(task)}
                    className="flex-shrink-0 bg-waxy-corn/15 text-waxy-corn hover:bg-waxy-corn/25 hover:shadow-none"
                  >
                    Assign
                  </Button>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>

      {activeTask && (
        <AssignTaskModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onAssigned={(taskId) => {
            handleAssigned(taskId);
            setActiveTask(null);
          }}
        />
      )}
    </>
  );
};

export default TriageQueue;
