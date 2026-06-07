import { useRef, useState } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Props {
  onUploaded: (url: string, type: 'upload') => void;
  onClear: () => void;
  currentUrl?: string | null;
}

const MediaUploader = ({ onUploaded, onClear, currentUrl }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      setError('File must be under 100 MB');
      return;
    }
    setError(null);
    setUploading(true);
    setProgress(10);

    const ext = file.name.split('.').pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data, error: uploadError } = await supabase.storage
      .from('blog-media')
      .upload(path, file, { upsert: false });

    setProgress(90);

    if (uploadError || !data) {
      setError(uploadError?.message ?? 'Upload failed');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('blog-media').getPublicUrl(data.path);
    setProgress(100);
    setUploading(false);
    onUploaded(publicUrl, 'upload');
  };

  if (currentUrl) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-fluorescence/10 border border-fluorescence/20">
        <CheckCircle size={16} className="text-fluorescence flex-shrink-0" />
        <span className="font-general text-xs text-bitter-liquorice/70 truncate flex-1">
          {currentUrl.split('/').pop()}
        </span>
        <button onClick={onClear} className="text-bitter-liquorice/40 hover:text-hot-red transition-colors">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="video/*,image/*"
        className="hidden"
        onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full flex flex-col items-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-bitter-liquorice/15 hover:border-bitter-liquorice/30 hover:bg-bitter-liquorice/3 transition-all disabled:opacity-50"
      >
        <Upload size={20} className="text-bitter-liquorice/40" />
        <span className="font-general text-sm text-bitter-liquorice/55">
          {uploading ? `Uploading… ${progress}%` : 'Click to upload video or image'}
        </span>
        <span className="font-general text-xs text-bitter-liquorice/30">Max 100 MB</span>
      </button>
      {uploading && (
        <div className="mt-2 h-1 rounded-full bg-bitter-liquorice/10 overflow-hidden">
          <div
            className="h-full bg-waxy-corn rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="mt-2 font-general text-xs text-hot-red">{error}</p>}
    </div>
  );
};

export default MediaUploader;
