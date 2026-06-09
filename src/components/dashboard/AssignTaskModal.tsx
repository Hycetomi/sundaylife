import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Modal, Button, SelectField } from '@/components/ui';
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
    const assignee = volunteers.find(v => v.id === selectedId);
    if (!assignee) { setSaving(false); return; }

    const { error } = await supabase
      .from('tasks')
      .update({ assignee_id: selectedId, status: 'Assigned' })
      .eq('id', task.id);

    if (!error) {
      await supabase.from('notifications').insert([{
        user_id:     selectedId,
        message:     `You've been assigned a new task: "${task.title}"`,
        type:        'task_assigned',
        action_link: '/dashboard',
      }]);
      onAssigned(task.id, selectedId, assignee.full_name);
    }
    setSaving(false);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Assign Task"
      size="sm"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button className="flex-1" loading={saving} disabled={!selectedId} onClick={handleAssign}>
            Assign
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="font-general text-sm text-pink-swirl/70 bg-white/5 rounded-xl px-4 py-3 leading-relaxed">
          {task.title}
        </p>
        <SelectField
          label="Assign to"
          value={selectedId}
          onChange={e => setSelectedId(e.target.value)}
          placeholder="Select a team member…"
          options={volunteers.map(v => ({ value: v.id, label: `${v.full_name} (${v.role})` }))}
        />
      </div>
    </Modal>
  );
};

export default AssignTaskModal;
