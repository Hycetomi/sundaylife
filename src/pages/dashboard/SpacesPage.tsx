import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import SpacesGrid from '@/components/dashboard/SpacesGrid';
import type { Department } from '@/types';

const schema = z.object({
  title:         z.string().min(2, 'Title is required'),
  external_link: z.string().url('Must be a valid URL (include https://)'),
  department_id: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const SpacesPage = () => {
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const canManage = profile?.role === 'Admin' || profile?.role === 'Lead';

  useEffect(() => {
    supabase.from('departments').select('*').order('name')
      .then(({ data }) => setDepartments((data as Department[]) ?? []));
  }, []);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    await supabase.from('spaces').insert([{
      title:         data.title,
      external_link: data.external_link,
      department_id: data.department_id || profile?.department_id || null,
    }]);
    reset();
    setShowForm(false);
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="font-general text-sm text-pink-swirl/50">
          SOPs, brand guidelines, and operational documents for your team.
        </p>
        {canManage && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-xl hover:shadow-[0_0_14px_rgba(247,181,0,0.35)] transition-all flex-shrink-0"
          >
            <Plus size={15} />
            Add Resource
          </button>
        )}
      </div>

      {/* Add resource form */}
      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                  Title <span className="text-hot-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brand Guidelines 2026"
                  {...register('title')}
                  className={cn(
                    'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
                    errors.title && 'border-hot-red/50'
                  )}
                />
                {errors.title && <p className="font-general text-xs text-hot-red">{errors.title.message}</p>}
              </div>

              {/* Link */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                  Link <span className="text-hot-red">*</span>
                </label>
                <input
                  type="url"
                  placeholder="https://docs.google.com/..."
                  {...register('external_link')}
                  className={cn(
                    'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
                    errors.external_link && 'border-hot-red/50'
                  )}
                />
                {errors.external_link && <p className="font-general text-xs text-hot-red">{errors.external_link.message}</p>}
              </div>

              {/* Department — Admins can pick any; Leads default to their own */}
              {profile?.role === 'Admin' && (
                <div className="flex flex-col gap-1.5">
                  <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                    Department
                  </label>
                  <select
                    {...register('department_id')}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors bg-[#1c3828]"
                  >
                    <option value="" className="bg-bitter-liquorice">All departments</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id} className="bg-bitter-liquorice">{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Actions */}
              <div className={cn('flex gap-3', profile?.role === 'Admin' ? 'sm:col-span-2' : 'sm:col-span-2')}>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); reset(); }}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-pink-swirl/60 font-general text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm disabled:opacity-50 hover:shadow-[0_0_14px_rgba(247,181,0,0.35)] transition-all"
                >
                  {isSubmitting ? 'Adding…' : 'Add Resource'}
                </button>
              </div>

            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <SpacesGrid key={refreshKey} onDeleted={() => setRefreshKey(k => k + 1)} />
    </div>
  );
};

export default SpacesPage;
