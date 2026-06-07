import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, User, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button, Input, SelectField, useToast } from '@/components/ui';
import type { Lifehouse, Profile } from '@/types';

type LifehouseRow = Lifehouse & { profiles: { full_name: string } | null };

const schema = z.object({
  name:         z.string().min(2, 'Name is required'),
  location:     z.string().optional(),
  meeting_time: z.string().optional(),
  lead_user_id: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const LifehouseManager = () => {
  const toast = useToast();
  const [lifehouses, setLifehouses] = useState<LifehouseRow[]>([]);
  const [leads, setLeads] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [assignValue, setAssignValue] = useState('');

  const fetchData = () =>
    Promise.all([
      supabase.from('lifehouses').select('*, profiles!lead_user_id(full_name)').order('name'),
      supabase.from('profiles').select('id, full_name, role, department_id, created_at').in('role', ['Lead', 'Admin']).order('full_name'),
    ]).then(([{ data: lh }, { data: p }]) => {
      setLifehouses((lh as LifehouseRow[]) ?? []);
      setLeads((p as Profile[]) ?? []);
      setLoading(false);
    });

  useEffect(() => { fetchData(); }, []);

  const {
    register, handleSubmit, reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onCreate = async (data: FormValues) => {
    const { error } = await supabase.from('lifehouses').insert([{
      name:         data.name,
      location:     data.location || null,
      meeting_time: data.meeting_time || null,
      lead_user_id: data.lead_user_id || null,
    }]);
    if (error) {
      toast.error('Failed to create Lifehouse', 'Check your permissions.');
    } else {
      toast.success('Lifehouse created');
      reset();
      setShowForm(false);
      fetchData();
    }
  };

  const assignLead = async (lifehouseId: string) => {
    await supabase
      .from('lifehouses')
      .update({ lead_user_id: assignValue || null })
      .eq('id', lifehouseId);
    if (assignValue) {
      await supabase
        .from('profiles')
        .update({ role: 'Lead' })
        .eq('id', assignValue)
        .eq('role', 'Volunteer');
    }
    toast.success('Lead updated');
    setAssigningId(null);
    setAssignValue('');
    fetchData();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2, 3].map(i => <div key={i} className="h-36 rounded-2xl bg-white/5 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          icon={<span className="text-base leading-none">+</span>}
          onClick={() => setShowForm(v => !v)}
        >
          New Lifehouse
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onCreate)}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                required
                type="text"
                placeholder="e.g. Westlands Lifehouse"
                error={errors.name?.message}
                {...register('name')}
              />
              <Input
                label="Location"
                type="text"
                placeholder="e.g. Westlands, Nairobi"
                {...register('location')}
              />
              <Input
                label="Meeting Time"
                type="text"
                placeholder="e.g. Sundays 4:00 PM"
                {...register('meeting_time')}
              />
              <SelectField
                label="Assign Lead"
                placeholder="No lead yet"
                options={leads.map(l => ({ value: l.id, label: l.full_name }))}
                {...register('lead_user_id')}
              />

              <div className="sm:col-span-2 flex gap-3">
                <Button variant="secondary" className="flex-1" type="button" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" type="submit" loading={isSubmitting}>
                  Create Lifehouse
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {lifehouses.length === 0 && (
        <p className="font-general text-sm text-pink-swirl/30 text-center py-10">
          No Lifehouses yet. Create one above.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {lifehouses.map(lh => (
          <div key={lh.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
            <p className="font-cabinet font-bold text-base text-pink-swirl">{lh.name}</p>

            <div className="space-y-1.5">
              {lh.location && (
                <div className="flex items-center gap-2 text-pink-swirl/50">
                  <MapPin size={13} className="flex-shrink-0" />
                  <span className="font-general text-xs">{lh.location}</span>
                </div>
              )}
              {lh.meeting_time && (
                <div className="flex items-center gap-2 text-pink-swirl/50">
                  <Clock size={13} className="flex-shrink-0" />
                  <span className="font-general text-xs">{lh.meeting_time}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-pink-swirl/50">
                <User size={13} className="flex-shrink-0" />
                <span className="font-general text-xs">
                  {lh.profiles?.full_name ?? <span className="text-hot-red/70">No lead assigned</span>}
                </span>
              </div>
            </div>

            {assigningId === lh.id ? (
              <div className="flex gap-2">
                <SelectField
                  placeholder="Remove lead"
                  value={assignValue}
                  onChange={e => setAssignValue(e.target.value)}
                  options={leads.map(l => ({ value: l.id, label: l.full_name }))}
                  className="flex-1 text-xs py-1.5"
                />
                <Button size="sm" onClick={() => assignLead(lh.id)}>Save</Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => { setAssigningId(null); setAssignValue(''); }}
                >
                  ✕
                </Button>
              </div>
            ) : (
              <button
                onClick={() => { setAssigningId(lh.id); setAssignValue(lh.lead_user_id ?? ''); }}
                className="flex items-center gap-1.5 text-xs text-pink-swirl/40 hover:text-waxy-corn transition-colors font-general"
              >
                <ChevronDown size={13} />
                {lh.profiles ? 'Change lead' : 'Assign lead'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifehouseManager;
