import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui';

type BatchStatus = 'open' | 'full' | 'ongoing';

interface VolunteerBatch {
  id: string;
  label: string;
  status: BatchStatus;
  custom_message: string | null;
  created_at: string;
}

const STATUS_META: Record<BatchStatus, { label: string; color: string; dot: string }> = {
  open:    { label: 'Open',    color: 'text-fluorescence',  dot: 'bg-fluorescence'  },
  full:    { label: 'Full',    color: 'text-hot-red',       dot: 'bg-hot-red'       },
  ongoing: { label: 'Ongoing', color: 'text-waxy-corn',     dot: 'bg-waxy-corn'     },
};

const VolunteerBatchPanel = () => {
  const toast = useToast();
  const [batches, setBatches] = useState<VolunteerBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newLabel, setNewLabel] = useState('');

  useEffect(() => {
    supabase
      .from('volunteer_batches')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setBatches((data as VolunteerBatch[]) ?? []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: BatchStatus) => {
    const prev = batches.find(b => b.id === id)?.status;
    setBatches(bs => bs.map(b => b.id === id ? { ...b, status } : b));
    const { error } = await supabase.from('volunteer_batches').update({ status }).eq('id', id);
    if (error) {
      setBatches(bs => bs.map(b => b.id === id ? { ...b, status: prev! } : b));
      toast.error('Failed to update status');
    } else {
      toast.success('Batch updated');
    }
  };

  const updateMessage = async (id: string, custom_message: string) => {
    const val = custom_message.trim() || null;
    setBatches(bs => bs.map(b => b.id === id ? { ...b, custom_message: val } : b));
    await supabase.from('volunteer_batches').update({ custom_message: val }).eq('id', id);
  };

  const createBatch = async () => {
    if (!newLabel.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from('volunteer_batches')
      .insert([{ label: newLabel.trim(), status: 'open' }])
      .select()
      .single();
    setCreating(false);
    if (error) { toast.error('Failed to create batch'); return; }
    setBatches(bs => [data as VolunteerBatch, ...bs]);
    setNewLabel('');
    toast.success('New batch created and set to open');
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Create new batch */}
      <div className="flex gap-3">
        <input
          value={newLabel}
          onChange={e => setNewLabel(e.target.value)}
          placeholder='e.g. "Batch 2 – Q3 2026"'
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 font-general text-sm text-pink-swirl outline-none focus:border-waxy-corn/50 transition-colors placeholder:text-pink-swirl/20"
          onKeyDown={e => e.key === 'Enter' && createBatch()}
        />
        <motion.button
          onClick={createBatch}
          disabled={creating || !newLabel.trim()}
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-5 py-2.5 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-full transition-shadow hover:shadow-[0_0_14px_rgba(247,181,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Plus size={14} />
          New Batch
        </motion.button>
      </div>

      {/* Batch list */}
      <div className="space-y-3">
        {batches.length === 0 && (
          <p className="font-general text-sm text-pink-swirl/30 py-6 text-center">
            No batches yet. Create one above.
          </p>
        )}
        {batches.map((batch, i) => {
          const meta = STATUS_META[batch.status];
          return (
            <motion.div
              key={batch.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <Circle size={8} className={cn('flex-shrink-0', meta.dot)} fill="currentColor" />
                  <span className="font-cabinet font-bold text-pink-swirl truncate">{batch.label}</span>
                  <span className={cn('font-general text-xs flex-shrink-0', meta.color)}>
                    {meta.label}
                  </span>
                </div>
                <select
                  value={batch.status}
                  onChange={e => updateStatus(batch.id, e.target.value as BatchStatus)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 font-general text-xs text-pink-swirl outline-none focus:border-waxy-corn/50 transition-colors flex-shrink-0"
                >
                  <option value="open"    className="bg-bitter-liquorice">Open</option>
                  <option value="full"    className="bg-bitter-liquorice">Full</option>
                  <option value="ongoing" className="bg-bitter-liquorice">Ongoing</option>
                </select>
              </div>

              {/* Custom message override */}
              <div className="flex flex-col gap-1.5">
                <label className="font-cabinet font-bold text-[10px] uppercase tracking-wider text-pink-swirl/30">
                  Custom message (optional — overrides default)
                </label>
                <input
                  defaultValue={batch.custom_message ?? ''}
                  placeholder="Leave blank to use the default message"
                  onBlur={e => updateMessage(batch.id, e.target.value)}
                  className="bg-white/5 border border-white/8 rounded-lg px-3 py-2 font-general text-xs text-pink-swirl/70 outline-none focus:border-waxy-corn/30 transition-colors placeholder:text-pink-swirl/15"
                />
              </div>
            </motion.div>
          );
        })}
      </div>

    </div>
  );
};

export default VolunteerBatchPanel;
