import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FolderOpen, Trash2, FileText, FileImage, FileVideo, FileSpreadsheet, File } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { ConfirmDialog, useToast } from '@/components/ui';
import type { Space } from '@/types';

const DEPT_COLORS = [
  'bg-astral-blue/20 text-sky-300',
  'bg-night-blue/30 text-blue-300',
  'bg-waxy-corn/15 text-waxy-corn',
  'bg-hot-red/15 text-red-300',
  'bg-fluorescence/15 text-fluorescence',
];

const FILE_ICONS: Record<string, React.ElementType> = {
  pdf: FileText, doc: FileText, docx: FileText,
  xls: FileSpreadsheet, xlsx: FileSpreadsheet, csv: FileSpreadsheet,
  ppt: FileText, pptx: FileText,
  png: FileImage, jpg: FileImage, jpeg: FileImage, gif: FileImage,
  mp4: FileVideo,
};

const getFileIcon = (path: string): React.ElementType => {
  const ext = path.split('.').pop()?.toLowerCase() ?? '';
  return FILE_ICONS[ext] ?? File;
};

const getFileName = (path: string) =>
  path.split('/').pop()?.replace(/^\d+-/, '') ?? path;

interface Props {
  onDeleted?: () => void;
}

type SpaceRow = Space & { departments?: { name: string } | null };

const SpacesGrid = ({ onDeleted }: Props) => {
  const { profile } = useAuth();
  const toast = useToast();
  const [spaces, setSpaces] = useState<SpaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmSpace, setConfirmSpace] = useState<SpaceRow | null>(null);

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
      setSpaces((data as SpaceRow[]) ?? []);
      setLoading(false);
    });
  }, [profile]);

  const handleDelete = async () => {
    if (!confirmSpace) return;

    if (confirmSpace.file_path) {
      await supabase.storage.from('knowledge-base').remove([confirmSpace.file_path]);
    }

    const { error } = await supabase.from('spaces').delete().eq('id', confirmSpace.id);

    if (error) {
      toast.error('Failed to delete resource', 'Check your permissions and try again.');
    } else {
      setSpaces(prev => prev.filter(s => s.id !== confirmSpace.id));
      toast.success('Resource deleted');
      onDeleted?.();
    }
    setConfirmSpace(null);
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {spaces.map((space, i) => {
          const colorClass = DEPT_COLORS[i % DEPT_COLORS.length];
          const isFile     = !!space.file_path;
          const href       = isFile
            ? supabase.storage.from('knowledge-base').getPublicUrl(space.file_path!).data.publicUrl
            : space.external_link ?? '#';
          const BottomIcon = isFile ? getFileIcon(space.file_path!) : ExternalLink;
          const bottomText = isFile
            ? getFileName(space.file_path!)
            : (space.external_link ?? '');

          return (
            <motion.a
              key={space.id}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200 min-h-[120px]"
            >
              {canManage && (
                <button
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setConfirmSpace(space); }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-pink-swirl/0 group-hover:text-pink-swirl/30 hover:!text-hot-red hover:bg-hot-red/10 transition-all"
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
                {isFile && (
                  <span className="inline-block px-2 py-0.5 rounded-full font-cabinet font-bold text-[10px] uppercase tracking-wider mb-3 ml-1.5 bg-white/10 text-pink-swirl/50">
                    File
                  </span>
                )}
                <p className="font-cabinet font-bold text-base text-pink-swirl group-hover:text-waxy-corn transition-colors leading-snug pr-6">
                  {space.title}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-pink-swirl/30 group-hover:text-waxy-corn/60 transition-colors">
                <BottomIcon size={13} className="flex-shrink-0" />
                <span className="font-general text-xs truncate">{bottomText}</span>
              </div>
            </motion.a>
          );
        })}
      </div>

      <ConfirmDialog
        open={!!confirmSpace}
        onClose={() => setConfirmSpace(null)}
        onConfirm={handleDelete}
        title="Delete this resource?"
        description={confirmSpace ? `"${confirmSpace.title}" will be permanently removed.` : undefined}
        confirmLabel="Delete"
        variant="danger"
      />
    </>
  );
};

export default SpacesGrid;
