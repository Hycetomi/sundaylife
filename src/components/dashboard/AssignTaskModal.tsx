import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Profile, Task } from '@/types';

interface Props {
  task: Task;
  onClose: () => void;
  onAssigned: (taskId: string, assigneeId: string, assigneeName: string) => void;
}

const AssignTaskModal = ({ task, onClose, onAssigned }: Props) => {
  const { profile } = useAuth();
  const [volunteers, setVolunteers] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from('profiles')
      .select('id, full_name, role, department_id, created_at')
      .eq('department_id', profile.department_id)
      .order('full_name')
      .then(({ data }) => setVolunteers((data as Profile[]) ?? []));
  }, [profile]);

  const handleAssign = async () => {
    if (!selectedId) return;
    setSaving(true);
    const assignee = volunteers.find(v => v.id === selectedId)!;

    const { error } = await supabase
      .from('tasks')
      .update({ assignee_id: selectedId, status: 'Assigned' })
      .eq('id', task.id);

    if (!error) {
      await supabase.from('notifications').insert([{
        user_id: selectedId,
        message: `You've been assigned a new task: "${task.title}"`,
        type: 'task_assigned',
        action_link: '/dashboard',
      }]);
      onAssigned(task.id, selectedId, assignee.full_name);
    }
    setSaving(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-[#1c3828] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-cabinet font-bold text-lg text-pink-swirl">Assign Task</h3>
            <button onClick={onClose} className="text-pink-swirl/40 hover:text-pink-swirl">
              <X size={20} />
            </button>
          </div>

          <p className="font-general text-sm text-pink-swirl/70 bg-white/5 rounded-xl px-4 py-3 mb-5">
            {task.title}
          </p>

          <div className="mb-5">
            <label className="block font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/60 mb-2">
              Assign to
            </label>
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors"
            >
              <option value="" disabled className="bg-bitter-liquorice">Select a team member…</option>
              {volunteers.map(v => (
                <option key={v.id} value={v.id} className="bg-bitter-liquorice">
                  {v.full_name} ({v.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-white/10 text-pink-swirl/60 font-general text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssign}
              disabled={!selectedId || saving}
              className="flex-1 py-3 rounded-xl bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm transition-all hover:shadow-[0_0_16px_rgba(247,181,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Assigning…' : 'Assign'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AssignTaskModal;
