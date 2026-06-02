import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square, Send, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Lifehouse, Member } from '@/types';

interface Props {
  lifehouse: Lifehouse;
}

const AttendanceRegister = ({ lifehouse }: Props) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    supabase
      .from('members')
      .select('*')
      .eq('lifehouse_id', lifehouse.id)
      .order('full_name')
      .then(({ data }) => {
        setMembers(data ?? []);
        setLoading(false);
      });
  }, [lifehouse.id]);

  const toggle = (id: string) =>
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () =>
    setChecked(checked.size === members.length ? new Set() : new Set(members.map(m => m.id)));

  const handleSubmit = async () => {
    if (checked.size === 0) return;
    setSaving(true);
    const rows = [...checked].map(member_id => ({
      member_id,
      lifehouse_id: lifehouse.id,
      meeting_date: today,
    }));
    // upsert ignores duplicates via UNIQUE(member_id, meeting_date)
    await supabase.from('attendance_logs').upsert(rows, { onConflict: 'member_id,meeting_date' });
    setSaved(true);
    setSaving(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-cabinet font-bold text-lg text-pink-swirl">Attendance Register</h2>
          <p className="font-general text-xs text-pink-swirl/40 mt-0.5">
            {lifehouse.name} · {new Date(today).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleAll}
            className="font-general text-xs text-pink-swirl/50 hover:text-pink-swirl transition-colors"
          >
            {checked.size === members.length ? 'Deselect all' : 'Select all'}
          </button>
          <motion.button
            onClick={handleSubmit}
            disabled={checked.size === 0 || saving}
            whileHover={{ scale: checked.size > 0 ? 1.02 : 1 }}
            className="flex items-center gap-2 px-4 py-2 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-sm rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[0_0_14px_rgba(247,181,0,0.35)] transition-all"
          >
            <Send size={14} />
            {saving ? 'Saving…' : saved ? 'Saved ✓' : `Log ${checked.size > 0 ? `(${checked.size})` : ''}`}
          </motion.button>
        </div>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && members.length === 0 && (
        <div className="flex flex-col items-center py-10 text-pink-swirl/30">
          <Users size={32} strokeWidth={1} className="mb-2" />
          <p className="font-general text-sm">No members assigned to this Lifehouse yet.</p>
        </div>
      )}

      {!loading && members.length > 0 && (
        <div className="space-y-2">
          {members.map((member, i) => {
            const isChecked = checked.has(member.id);
            return (
              <motion.button
                key={member.id}
                onClick={() => toggle(member.id)}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.03 }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  isChecked ? 'bg-fluorescence/10 border border-fluorescence/20' : 'bg-white/5 border border-transparent hover:bg-white/10'
                }`}
              >
                {isChecked
                  ? <CheckSquare size={18} className="text-fluorescence flex-shrink-0" />
                  : <Square size={18} className="text-pink-swirl/30 flex-shrink-0" />
                }
                <span className={`font-general text-sm ${isChecked ? 'text-pink-swirl' : 'text-pink-swirl/70'}`}>
                  {member.full_name}
                </span>
                {member.phone && (
                  <span className="ml-auto font-general text-xs text-pink-swirl/30">{member.phone}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AttendanceRegister;
