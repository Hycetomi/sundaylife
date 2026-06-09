import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Info } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui';
import type { Department, Role } from '@/types';

const schema = z.object({
  full_name:     z.string().min(2, 'Enter the full name'),
  email:         z.string().email('Enter a valid email'),
  role:          z.enum(['Volunteer', 'Lead', 'Admin']),
  department_id: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const ROLES: Role[] = ['Volunteer', 'Lead', 'Admin'];

const InviteStaffPanel = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('departments').select('*').order('name').then(({ data }) => {
      setDepartments((data as Department[]) ?? []);
    });
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { role: 'Volunteer' } });

  const onSubmit = async (data: FormValues) => {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) { toast.error('Not authenticated'); return; }

    const res = await supabase.functions.invoke('invite-staff', {
      body: {
        email:         data.email,
        full_name:     data.full_name,
        role:          data.role,
        department_id: data.department_id || null,
      },
    });

    if (res.error || res.data?.error) {
      // FunctionsHttpError wraps the actual response body — read it properly
      let msg = res.data?.error ?? 'Unknown error';
      if (res.error && !res.data?.error) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const body = await (res.error as any).context?.json?.();
          msg = body?.error ?? res.error.message;
        } catch {
          msg = res.error.message;
        }
      }
      toast.error('Invite failed', msg);
      return;
    }

    setSent(data.email);
    reset();
    toast.success('Invite sent', `${data.full_name} will receive an email to set up their account.`);
  };

  return (
    <div className="space-y-6 max-w-xl">

      {/* Info callout */}
      <div className="flex gap-3 bg-waxy-corn/8 border border-waxy-corn/20 rounded-xl p-4">
        <Info size={16} className="text-waxy-corn flex-shrink-0 mt-0.5" />
        <p className="font-general text-sm text-pink-swirl/70 leading-relaxed">
          Staff can only join via invitation. They'll receive an email to set their password and
          activate their account. Their role and department are applied automatically.{' '}
          <span className="text-pink-swirl/50">
            To resend an expired link, submit the form again with the same email address.
          </span>
        </p>
      </div>

      {/* Success banner */}
      {sent && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 bg-fluorescence/10 border border-fluorescence/20 rounded-xl p-4"
        >
          <CheckCircle size={16} className="text-fluorescence flex-shrink-0" />
          <p className="font-general text-sm text-pink-swirl/80">
            Invite sent to <span className="font-medium text-pink-swirl">{sent}</span>
          </p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">
              Full Name <span className="text-hot-red">*</span>
            </label>
            <input
              placeholder="Jane Doe"
              {...register('full_name')}
              className={cn(
                'bg-white/5 border rounded-xl px-4 py-2.5 font-general text-sm text-pink-swirl outline-none transition-colors focus:border-waxy-corn/50 placeholder:text-pink-swirl/20',
                errors.full_name ? 'border-hot-red/60' : 'border-white/10'
              )}
            />
            {errors.full_name && <p className="font-general text-xs text-hot-red">{errors.full_name.message}</p>}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">
              Email <span className="text-hot-red">*</span>
            </label>
            <input
              type="email"
              placeholder="jane@sundaylife.org"
              {...register('email')}
              className={cn(
                'bg-white/5 border rounded-xl px-4 py-2.5 font-general text-sm text-pink-swirl outline-none transition-colors focus:border-waxy-corn/50 placeholder:text-pink-swirl/20',
                errors.email ? 'border-hot-red/60' : 'border-white/10'
              )}
            />
            {errors.email && <p className="font-general text-xs text-hot-red">{errors.email.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">
              Role <span className="text-hot-red">*</span>
            </label>
            <select
              {...register('role')}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-general text-sm text-pink-swirl outline-none focus:border-waxy-corn/50 transition-colors"
            >
              {ROLES.map(r => (
                <option key={r} value={r} className="bg-bitter-liquorice">{r}</option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/40">
              Department
            </label>
            <select
              {...register('department_id')}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-general text-sm text-pink-swirl outline-none focus:border-waxy-corn/50 transition-colors"
            >
              <option value="" className="bg-bitter-liquorice">Unassigned</option>
              {departments.map(d => (
                <option key={d.id} value={d.id} className="bg-bitter-liquorice">{d.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-1">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            className="flex items-center gap-2 px-6 py-2.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-full transition-shadow hover:shadow-[0_0_16px_rgba(247,181,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={14} />
            {isSubmitting ? 'Sending…' : 'Send Invite'}
          </motion.button>
        </div>

      </form>
    </div>
  );
};

export default InviteStaffPanel;
