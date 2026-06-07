import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CalendarDays, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button, Textarea, SelectField, useToast } from '@/components/ui';
import TaskStatusBadge from './TaskStatusBadge';
import type { Task, TaskStatus, TaskUpdate } from '@/types';

const ALL_STATUSES: TaskStatus[] = ['Pending Triage', 'Assigned', 'In Review', 'Completed'];
const STATUS_FLOW: Record<TaskStatus, TaskStatus[]> = {
  'Pending Triage': ['Assigned'],
  'Assigned':       ['In Review', 'Completed'],
  'In Review':      ['Completed', 'Assigned'],
  'Completed':      [],
};

interface Props {
  task: Task;
  onClose: () => void;
  onUpdated: () => void;
}

const TaskDetailModal = ({ task, onClose, onUpdated }: Props) => {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [updates, setUpdates] = useState<TaskUpdate[]>([]);
  const [loadingUpdates, setLoadingUpdates] = useState(true);
  const [newStatus, setNewStatus] = useState<TaskStatus | ''>('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isElevated = profile?.role === 'Admin' || profile?.role === 'Lead';
  const availableStatuses = isElevated
    ? ALL_STATUSES.filter(s => s !== task.status)
    : STATUS_FLOW[task.status];

  useEffect(() => {
    supabase
      .from('task_updates')
      .select('*, profiles(full_name)')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        setUpdates((data as TaskUpdate[]) ?? []);
        setLoadingUpdates(false);
      });
  }, [task.id]);

  const handleSubmit = async () => {
    if (!comment.trim() && !newStatus) {
      toast.warning('Nothing to save', 'Add a comment or select a new status.');
      return;
    }
    setSubmitting(true);

    const [updateRes] = await Promise.all([
      supabase.from('task_updates').insert([{
        task_id:    task.id,
        user_id:    user!.id,
        new_status: newStatus || null,
        comment:    comment.trim() || null,
      }]),
      ...(newStatus ? [
        supabase.from('tasks').update({
          status:       newStatus,
          completed_at: newStatus === 'Completed' ? new Date().toISOString() : null,
        }).eq('id', task.id),
      ] : []),
    ]);

    if (updateRes.error) {
      toast.error('Failed to save update', 'Check your permissions and try again.');
      setSubmitting(false);
      return;
    }

    toast.success('Update saved');
    setComment('');
    setNewStatus('');

    const { data } = await supabase
      .from('task_updates')
      .select('*, profiles(full_name)')
      .eq('task_id', task.id)
      .order('created_at', { ascending: true });
    setUpdates((data as TaskUpdate[]) ?? []);
    setSubmitting(false);
    onUpdated();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-bitter-liquorice border-l border-white/10 z-50 flex flex-col"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <p className="font-cabinet font-bold text-lg text-pink-swirl leading-snug">{task.title}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <TaskStatusBadge status={task.status} />
              {task.due_date && (
                <span className={cn(
                  'flex items-center gap-1 font-general text-xs',
                  new Date(task.due_date) < new Date() && task.status !== 'Completed'
                    ? 'text-hot-red'
                    : 'text-pink-swirl/40'
                )}>
                  <CalendarDays size={11} />
                  {new Date(task.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-pink-swirl/40 hover:text-pink-swirl transition-colors flex-shrink-0 mt-1 p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Description */}
        {task.description && (
          <div className="px-6 py-4 border-b border-white/5 flex-shrink-0">
            <p className="font-general text-xs uppercase tracking-wider text-pink-swirl/30 mb-1.5">Description</p>
            <p className="font-general text-sm text-pink-swirl/70 whitespace-pre-wrap">{task.description}</p>
          </div>
        )}

        {/* Activity feed */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <p className="font-general text-xs uppercase tracking-wider text-pink-swirl/30 flex items-center gap-1.5">
            <MessageSquare size={11} /> Activity
          </p>

          {loadingUpdates && (
            <div className="space-y-3">
              {[1, 2].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          )}

          {!loadingUpdates && updates.length === 0 && (
            <p className="font-general text-xs text-pink-swirl/25 italic">No updates yet.</p>
          )}

          {updates.map(u => (
            <div key={u.id} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-waxy-corn/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="font-cabinet font-bold text-[10px] text-waxy-corn">
                  {u.profiles?.full_name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() ?? '?'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-general text-xs font-medium text-pink-swirl/80">{u.profiles?.full_name}</span>
                  {u.new_status && (
                    <>
                      <span className="text-pink-swirl/30 text-xs">→</span>
                      <TaskStatusBadge status={u.new_status as TaskStatus} />
                    </>
                  )}
                  <span className="font-general text-[10px] text-pink-swirl/25 ml-auto">{formatDate(u.created_at)}</span>
                </div>
                {u.comment && (
                  <p className="font-general text-sm text-pink-swirl/60 mt-1 whitespace-pre-wrap">{u.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Update form */}
        {task.status !== 'Completed' && (
          <div className="px-6 py-5 border-t border-white/10 flex-shrink-0 space-y-3">
            <p className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">Add Update</p>

            {availableStatuses.length > 0 && (
              <SelectField
                value={newStatus}
                onChange={e => setNewStatus(e.target.value as TaskStatus | '')}
                placeholder="Keep current status"
                options={availableStatuses.map(s => ({ value: s, label: s }))}
              />
            )}

            <Textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="What has been done? Any blockers or notes…"
              rows={3}
            />

            <Button
              className="w-full"
              loading={submitting}
              onClick={handleSubmit}
            >
              Save Update
            </Button>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default TaskDetailModal;
