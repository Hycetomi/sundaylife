import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import type { TaskTemplate, TemplateField } from '@/types';

// Build a zod schema dynamically from a template's required_fields
const buildSchema = (fields: TemplateField[]) => {
  const dynamic: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    dynamic[f.name] = f.required
      ? z.string().min(1, `${f.label} is required`)
      : z.string().optional().default('');
  }
  return z.object({
    title: z.string().min(2, 'Task title is required'),
    due_date: z.string().optional(),
    ...dynamic,
  });
};

interface Props {
  onCreated: () => void;
}

const DynamicField = ({
  field,
  register,
  error,
}: {
  field: TemplateField;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  error?: string;
}) => {
  const base = cn(
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors placeholder:text-pink-swirl/20',
    error && 'border-hot-red/50'
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
        {field.label}{field.required && <span className="text-hot-red ml-0.5">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea {...register(field.name)} rows={3} className={cn(base, 'resize-none')} />
      ) : field.type === 'select' ? (
        <select {...register(field.name)} className={cn(base, 'bg-[#1c3828]')}>
          <option value="" className="bg-bitter-liquorice">Select…</option>
          {field.options?.map(opt => (
            <option key={opt} value={opt} className="bg-bitter-liquorice">{opt}</option>
          ))}
        </select>
      ) : (
        <input type={field.type} {...register(field.name)} className={base} />
      )}
      {error && <p className="font-general text-xs text-hot-red">{error}</p>}
    </div>
  );
};

const TaskCreatorForm = ({ onCreated }: Props) => {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const [templates, setTemplates] = useState<TaskTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);

  useEffect(() => {
    supabase
      .from('task_templates')
      .select('*')
      .then(({ data }) => setTemplates((data as TaskTemplate[]) ?? []));
  }, []);

  const schema = useMemo(
    () => buildSchema(selectedTemplate?.required_fields ?? []),
    [selectedTemplate]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const handleTemplateChange = (id: string) => {
    const t = templates.find(t => t.id === id) ?? null;
    setSelectedTemplate(t);
    reset();
  };

  const onSubmit = async (data: Record<string, string>) => {
    if (!user || !profile) return;
    const { title, due_date, ...extraFields } = data;
    await supabase.from('tasks').insert([{
      title,
      due_date: due_date || null,
      description: JSON.stringify(extraFields),
      department_id: profile.department_id,
      requester_id: user.id,
      status: 'Pending Triage',
    }]);
    reset();
    setSelectedTemplate(null);
    setOpen(false);
    onCreated();
  };

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-xl hover:shadow-[0_0_16px_rgba(247,181,0,0.35)] transition-all"
      >
        <Plus size={16} />
        New Task
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-4"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4"
            >
              <h3 className="font-cabinet font-bold text-base text-pink-swirl">Create New Task</h3>

              {/* Template selector */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                  Template (optional)
                </label>
                <select
                  value={selectedTemplate?.id ?? ''}
                  onChange={e => handleTemplateChange(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 bg-[#1c3828]"
                >
                  <option value="" className="bg-bitter-liquorice">No template</option>
                  {templates.map(t => (
                    <option key={t.id} value={t.id} className="bg-bitter-liquorice">{t.template_name}</option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                  Task Title <span className="text-hot-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Set up venue for Night of Worship"
                  {...register('title')}
                  className={cn(
                    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
                    errors.title && 'border-hot-red/50'
                  )}
                />
                {errors.title?.message && (
                  <p className="font-general text-xs text-hot-red">{String(errors.title.message)}</p>
                )}
              </div>

              {/* Due date */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">Due Date</label>
                <input
                  type="date"
                  {...register('due_date')}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors"
                />
              </div>

              {/* Dynamic template fields */}
              {selectedTemplate?.required_fields.map(field => (
                <DynamicField
                  key={field.name}
                  field={field}
                  register={register}
                  error={(errors as Record<string, { message?: string }>)[field.name]?.message}
                />
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-pink-swirl/60 font-general text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_16px_rgba(247,181,0,0.35)] transition-all"
                >
                  {isSubmitting ? 'Submitting…' : 'Submit to Triage'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskCreatorForm;
