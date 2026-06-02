import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MapPin, Clock, User, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
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
    await supabase.from('lifehouses').insert([{
      name:         data.name,
      location:     data.location || null,
      meeting_time: data.meeting_time || null,
      lead_user_id: data.lead_user_id || null,
    }]);
    reset();
    setShowForm(false);
    fetchData();
  };

  const assignLead = async (lifehouseId: string) => {
    await supabase
      .from('lifehouses')
      .update({ lead_user_id: assignValue || null })
      .eq('id', lifehouseId);
    // Also promote the user to Lead role if they're a Volunteer
    if (assignValue) {
      await supabase
        .from('profiles')
        .update({ role: 'Lead' })
        .eq('id', assignValue)
        .eq('role', 'Volunteer');
    }
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
      {/* Create button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-xl hover:shadow-[0_0_14px_rgba(247,181,0,0.35)] transition-all"
        >
          <Plus size={15} />
          New Lifehouse
        </button>
      </div>

      {/* Create form */}
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
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                  Name <span className="text-hot-red">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Westlands Lifehouse"
                  {...register('name')}
                  className={cn(
                    'bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors',
                    errors.name && 'border-hot-red/50'
                  )}
                />
                {errors.name && <p className="font-general text-xs text-hot-red">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">Location</label>
                <input
                  type="text"
                  placeholder="e.g. Westlands, Nairobi"
                  {...register('location')}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">Meeting Time</label>
                <input
                  type="text"
                  placeholder="e.g. Sundays 4:00 PM"
                  {...register('meeting_time')}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 placeholder:text-pink-swirl/20 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">Assign Lead</label>
                <select
                  {...register('lead_user_id')}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors bg-[#1c3828]"
                >
                  <option value="" className="bg-bitter-liquorice">No lead yet</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id} className="bg-bitter-liquorice">{l.full_name}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-pink-swirl/60 font-general text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm disabled:opacity-50 hover:shadow-[0_0_14px_rgba(247,181,0,0.35)] transition-all"
                >
                  {isSubmitting ? 'Creating…' : 'Create Lifehouse'}
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Lifehouse cards */}
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

            {/* Inline lead assignment */}
            {assigningId === lh.id ? (
              <div className="flex gap-2">
                <select
                  value={assignValue}
                  onChange={e => setAssignValue(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-pink-swirl font-general text-xs outline-none focus:border-waxy-corn/50 bg-[#1c3828]"
                >
                  <option value="" className="bg-bitter-liquorice">Remove lead</option>
                  {leads.map(l => (
                    <option key={l.id} value={l.id} className="bg-bitter-liquorice">{l.full_name}</option>
                  ))}
                </select>
                <button
                  onClick={() => assignLead(lh.id)}
                  className="px-3 py-1.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-xs rounded-lg"
                >
                  Save
                </button>
                <button
                  onClick={() => { setAssigningId(null); setAssignValue(''); }}
                  className="px-3 py-1.5 border border-white/10 text-pink-swirl/50 font-general text-xs rounded-lg hover:bg-white/5"
                >
                  ✕
                </button>
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
