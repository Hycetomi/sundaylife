import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button, Input, Textarea, SelectField, useToast } from '@/components/ui';
import type { TaskTemplate, TemplateField } from '@/types';

const buildSchema = (fields: TemplateField[]) => {
  const dynamic: Record<string, z.ZodTypeAny> = {};
  for (const f of fields) {
    dynamic[f.name] = f.required
      ? z.string().min(1, `${f.label} is required`)
      : z.string().optional().default('');
  }
  return z.object({
    title:       z.string().min(2, 'Task title is required'),
    description: z.string().optional(),
    due_date:    z.string().optional(),
    ...dynamic,
  });
};

interface Props {
  templates: TaskTemplate[];
  selectedTemplate: TaskTemplate | null;
  onTemplateChange: (id: string) => void;
  onCreated: () => void;
  onClose: () => void;
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
  if (field.type === 'textarea') {
    return (
      <Textarea
        label={field.label}
        required={field.required}
        error={error}
        rows={3}
        {...register(field.name)}
      />
    );
  }
  if (field.type === 'select') {
    return (
      <SelectField
        label={field.label}
        required={field.required}
        error={error}
        placeholder="Select…"
        options={(field.options ?? []).map(opt => ({ value: opt, label: opt }))}
        {...register(field.name)}
      />
    );
  }
  return (
    <Input
      label={field.label}
      required={field.required}
      error={error}
      type={field.type}
      {...register(field.name)}
    />
  );
};

const TaskCreatorForm = ({ templates, selectedTemplate, onTemplateChange, onCreated, onClose }: Props) => {
  const { user, profile } = useAuth();
  const toast = useToast();

  const schema = useMemo(
    () => buildSchema(selectedTemplate?.required_fields ?? []),
    [selectedTemplate],
  );

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  useEffect(() => { reset(); }, [selectedTemplate, reset]);

  const onSubmit = async (data: Record<string, string>) => {
    if (!user || !profile) return;
    const { title, description, due_date, ...extraFields } = data;
    const templateData = Object.keys(extraFields).length > 0 ? JSON.stringify(extraFields) : null;
    const { error } = await supabase.from('tasks').insert([{
      title,
      due_date:      due_date || null,
      description:   description?.trim() || templateData || null,
      department_id: profile.department_id,
      requester_id:  user.id,
      status:        'Pending Triage',
    }]);
    if (error) {
      toast.error('Failed to create task', 'Check your permissions and try again.');
      return;
    }
    toast.success('Task submitted to triage');
    reset();
    onCreated();
  };

  const dynamicFields = selectedTemplate?.required_fields ?? [];
  const hasTextareas  = dynamicFields.some(f => f.type === 'textarea');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white/5 border border-white/10 rounded-2xl p-6">

      {/* Row 1: Template · Title · Due Date */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <SelectField
          label="Template (optional)"
          value={selectedTemplate?.id ?? ''}
          onChange={e => onTemplateChange(e.target.value)}
          placeholder="No template"
          options={templates.map(t => ({ value: t.id, label: t.template_name }))}
        />

        <Input
          label="Task Title"
          required
          type="text"
          placeholder="e.g. Set up venue for Night of Worship"
          error={errors.title?.message as string | undefined}
          {...register('title')}
        />

        <Input
          label="Due Date"
          type="date"
          {...register('due_date')}
        />
      </div>

      {/* Row 2: Description */}
      <div className="mb-4">
        <Textarea
          label="Description"
          rows={3}
          placeholder="What needs to be done? Any context or requirements…"
          {...register('description')}
        />
      </div>

      {/* Dynamic template fields */}
      {dynamicFields.length > 0 && (
        <div className={`grid gap-4 mb-4 ${
          hasTextareas ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
        }`}>
          {dynamicFields.map(field => (
            <div key={field.name} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
              <DynamicField
                field={field}
                register={register}
                error={(errors as Record<string, { message?: string }>)[field.name]?.message}
              />
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2 justify-end">
        <Button variant="secondary" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Submit to Triage
        </Button>
      </div>
    </form>
  );
};

export default TaskCreatorForm;
