import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FolderOpen, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { Space } from '@/types';

const DEPT_COLORS = [
  'bg-astral-blue/20 text-sky-300',
  'bg-night-blue/30 text-blue-300',
  'bg-waxy-corn/15 text-waxy-corn',
  'bg-hot-red/15 text-red-300',
  'bg-fluorescence/15 text-fluorescence',
];

interface Props {
  onDeleted?: () => void;
}

const SpacesGrid = ({ onDeleted }: Props) => {
  const { profile } = useAuth();
  const [spaces, setSpaces] = useState<(Space & { departments?: { name: string } | null })[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const canManage = profile?.role === 'Admin' || profile?.role === 'Lead';

  useEffect(() => {
    if (!profile) return;
    const query = supabase
      .from('spaces')
      .select('*, departments(name)')
      .order('title');

    if (profile.role !== 'Admin') {
      query.eq('department_id', profile.department_id);
    }

    query.then(({ data }) => {
      setSpaces((data as typeof spaces) ?? []);
      setLoading(false);
    });
  }, [profile]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.preventDefault(); // don't follow the card's <a> link
    e.stopPropagation();
    setDeleting(id);
    await supabase.from('spaces').delete().eq('id', id);
    setSpaces(prev => prev.filter(s => s.id !== id));
    setDeleting(null);
    onDeleted?.();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-32 rounded-2xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  if (spaces.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-pink-swirl/30">
        <FolderOpen size={40} strokeWidth={1} className="mb-3" />
        <p className="font-general text-sm">No resources yet. Add one above.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {spaces.map((space, i) => {
        const colorClass = DEPT_COLORS[i % DEPT_COLORS.length];
        return (
          <motion.a
            key={space.id}
            href={space.external_link}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
            className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 min-h-[120px]"
          >
            {/* Delete button — Lead/Admin only, appears on hover */}
            {canManage && (
              <button
                onClick={e => handleDelete(e, space.id)}
                disabled={deleting === space.id}
                className="absolute top-3 right-3 p-1.5 rounded-lg text-pink-swirl/0 group-hover:text-pink-swirl/30 hover:!text-hot-red hover:bg-hot-red/10 transition-all disabled:opacity-50"
              >
                <Trash2 size={13} />
              </button>
            )}

            <div>
              {space.departments?.name && (
                <span className={`inline-block px-2.5 py-0.5 rounded-full font-cabinet font-bold text-[10px] uppercase tracking-wider mb-3 ${colorClass}`}>
                  {space.departments.name}
                </span>
              )}
              <p className="font-cabinet font-bold text-base text-pink-swirl group-hover:text-waxy-corn transition-colors leading-snug pr-6">
                {space.title}
              </p>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-pink-swirl/30 group-hover:text-waxy-corn/60 transition-colors">
              <ExternalLink size={13} />
              <span className="font-general text-xs truncate">{space.external_link}</span>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
};

export default SpacesGrid;
