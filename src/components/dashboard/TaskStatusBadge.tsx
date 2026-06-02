import { cn } from '@/lib/utils';
import type { TaskStatus } from '@/types';

const CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  'Draft':          { label: 'Draft',        className: 'bg-white/10 text-pink-swirl/50' },
  'Pending Triage': { label: 'Pending',       className: 'bg-astral-blue/25 text-sky-300' },
  'Assigned':       { label: 'Assigned',      className: 'bg-waxy-corn/20 text-waxy-corn' },
  'In Review':      { label: 'In Review',     className: 'bg-night-blue/50 text-blue-300' },
  'Completed':      { label: 'Done',          className: 'bg-fluorescence/20 text-fluorescence' },
};

const TaskStatusBadge = ({ status }: { status: TaskStatus }) => {
  const { label, className } = CONFIG[status];
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full font-cabinet font-bold text-xs uppercase tracking-wider', className)}>
      {label}
    </span>
  );
};

export default TaskStatusBadge;
