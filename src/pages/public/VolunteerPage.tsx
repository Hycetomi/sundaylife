import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DecorativeSVG from '@/components/ui/DecorativeSVG';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HandHeart, CheckCircle, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Input, Textarea, SelectField, Button, useToast } from '@/components/ui';
import type { Department } from '@/types';

type BatchStatus = 'open' | 'full' | 'ongoing';

interface VolunteerBatch {
  status: BatchStatus;
  label: string;
  custom_message: string | null;
}

const schema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email:     z.string().email('Enter a valid email'),
  phone:     z.string().min(7, 'Enter a valid phone number'),
  preferred_department_id: z.string().optional(),
  message:   z.string().min(10, 'Tell us a little more — minimum 10 characters'),
});

type FormValues = z.infer<typeof schema>;

const VolunteerPage = () => {
  const toast = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [batch, setBatch] = useState<VolunteerBatch | null>(null);
  const [batchLoading, setBatchLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('departments').select('*').order('name'),
      supabase
        .from('volunteer_batches')
        .select('status, label, custom_message')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ]).then(([{ data: depts }, { data: batchData }]) => {
      setDepartments((depts as Department[]) ?? []);
      setBatch((batchData as VolunteerBatch) ?? null);
      setBatchLoading(false);
    });
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormValues) => {
    const { error } = await supabase.from('volunteer_applications').insert([{
      full_name:               data.full_name,
      email:                   data.email,
      phone:                   data.phone,
      preferred_department_id: data.preferred_department_id || null,
      message:                 data.message,
    }]);
    if (error) { toast.error('Something went wrong', 'Please try again in a moment.'); return; }
    setSubmitted(true);
  };

  const [hovered, setHovered] = useState(false);

  return (
    <main
      className="min-h-screen bg-bitter-liquorice text-pink-swirl pt-24 relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DecorativeSVG hovered={hovered} src="/star.svg"          size={64} top="8%"    right="3%"  opacity={0.13} rotate={18}  floatDuration={5}   scrollFactor={0.07} />
      <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"  size={52} top="22%"   right="7%"  opacity={0.11} rotate={-20} floatDuration={4.6} scrollFactor={0.06} />
      <DecorativeSVG hovered={hovered} src="/Cross.svg"         size={48} top="45%"   left="2%"   opacity={0.12} rotate={-10} floatDuration={4.2} scrollFactor={0.10} />
      <DecorativeSVG hovered={hovered} src="/8-sided_star.svg"  size={40} top="55%"   right="1%"  opacity={0.11} rotate={5}   floatDuration={3.8} scrollFactor={0.12} />
      <DecorativeSVG hovered={hovered} src="/Clove.svg"         size={44} bottom="20%"left="5%"   opacity={0.10} rotate={25}  floatDuration={5.2} scrollFactor={0.09} />
      <DecorativeSVG hovered={hovered} src="/Cross.svg"         size={36} bottom="8%" right="4%"  opacity={0.11} rotate={40}  floatDuration={3.5} scrollFactor={0.11} />

      {/* ── Hero strip ── */}
      <div className="max-w-3xl mx-auto px-6 pt-16 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-waxy-corn/10 border border-waxy-corn/20 mb-6">
            <HandHeart size={14} className="text-waxy-corn" />
            <span className="font-cabinet font-bold text-xs uppercase tracking-widest text-waxy-corn">
              Join the Team
            </span>
          </div>

          <h1 className="font-cabinet font-black text-4xl md:text-5xl uppercase leading-tight mb-4">
            Volunteer with <br />
            <span className="text-waxy-corn">SundayLife</span>
          </h1>
          <p className="font-general text-lg text-pink-swirl/60 max-w-xl leading-relaxed">
            We review every application personally. Fill in the form below and one of our team
            leads will be in touch to walk you through next steps.
          </p>
        </motion.div>
      </div>

      {/* ── Form / Success ── */}
      <div className="max-w-3xl mx-auto px-6 pb-24">

        {/* Batch closed / full state */}
        {!batchLoading && batch && batch.status !== 'open' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-waxy-corn/10 border border-waxy-corn/15 flex items-center justify-center mx-auto mb-6">
              <Clock size={28} className="text-waxy-corn/70" strokeWidth={1.5} />
            </div>
            <h2 className="font-cabinet font-black text-2xl md:text-3xl uppercase text-pink-swirl mb-3">
              {batch.status === 'full' ? 'This Batch is Full' : 'Applications Paused'}
            </h2>
            <p className="font-general text-pink-swirl/55 text-lg max-w-md mx-auto leading-relaxed">
              {batch.custom_message ?? (
                batch.status === 'full'
                  ? "We've reached capacity for this intake. The next batch will be announced soon — keep an eye on our channels."
                  : "We're currently onboarding our current batch of volunteers. We'll open applications for the next round shortly."
              )}
            </p>
            <p className="font-general text-pink-swirl/30 text-sm mt-6">
              Current batch: {batch.label}
            </p>
          </motion.div>
        )}

        {/* Show form only when batch is open */}
        {(batchLoading || !batch || batch.status === 'open') && (
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-fluorescence/15 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-fluorescence" />
              </div>
              <h2 className="font-cabinet font-black text-3xl uppercase mb-3">
                Application received!
              </h2>
              <p className="font-general text-pink-swirl/60 text-lg max-w-md mx-auto leading-relaxed">
                Thank you for wanting to serve. A team lead will review your application and
                reach out to you soon.
              </p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Full name"
                  required
                  placeholder="Your name"
                  error={errors.full_name?.message}
                  {...register('full_name')}
                />
                <Input
                  label="Email address"
                  required
                  type="email"
                  placeholder="you@example.com"
                  error={errors.email?.message}
                  {...register('email')}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Phone number"
                  required
                  type="tel"
                  placeholder="+1 234 567 8900"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
                <SelectField
                  label="Preferred department (optional)"
                  placeholder="No preference"
                  options={departments.map(d => ({ value: d.id, label: d.name }))}
                  {...register('preferred_department_id')}
                />
              </div>

              <Textarea
                label="Why do you want to volunteer?"
                required
                rows={5}
                placeholder="Tell us a bit about yourself, your skills, and what excites you about serving with SundayLife…"
                error={errors.message?.message}
                {...register('message')}
              />

              <div className="pt-2 flex justify-end">
                <Button type="submit" loading={isSubmitting}>
                  Submit application
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
        )}
      </div>
    </main>
  );
};

export default VolunteerPage;
