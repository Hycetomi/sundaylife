import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Link2, Upload, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button, Input, SelectField, useToast } from '@/components/ui';
import SpacesGrid from '@/components/dashboard/SpacesGrid';
import type { Department } from '@/types';

type Mode = 'link' | 'file';

const linkSchema = z.object({
  title:         z.string().min(2, 'Title is required'),
  external_link: z.string().url('Must be a valid URL (include https://)'),
  department_id: z.string().optional(),
});
type LinkForm = z.infer<typeof linkSchema>;

const fileSchema = z.object({
  title:         z.string().min(2, 'Title is required'),
  department_id: z.string().optional(),
});
type FileForm = z.infer<typeof fileSchema>;

const SpacesPage = () => {
  const { user, profile } = useAuth();
  const toast = useToast();
  const [showForm, setShowForm]       = useState(false);
  const [mode, setMode]               = useState<Mode>('link');
  const [departments, setDepartments] = useState<Department[]>([]);
  const [refreshKey, setRefreshKey]   = useState(0);
  const [file, setFile]               = useState<File | null>(null);
  const [uploading, setUploading]     = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const canManage = profile?.role === 'Admin' || profile?.role === 'Lead';

  useEffect(() => {
    supabase.from('departments').select('*').order('name')
      .then(({ data }) => setDepartments((data as Department[]) ?? []));
  }, []);

  const {
    register: regLink, handleSubmit: handleLink, reset: resetLink,
    formState: { errors: linkErrors, isSubmitting: linkSubmitting },
  } = useForm<LinkForm>({ resolver: zodResolver(linkSchema) });

  const {
    register: regFile, handleSubmit: handleFile, reset: resetFile,
    formState: { errors: fileErrors },
  } = useForm<FileForm>({ resolver: zodResolver(fileSchema) });

  const deptId = (val?: string) => val || profile?.department_id || null;

  const closeForm = () => {
    setShowForm(false);
    setFile(null);
    setUploadProgress(0);
    resetLink();
    resetFile();
    if (fileRef.current) fileRef.current.value = '';
  };

  const onLinkSubmit = async (data: LinkForm) => {
    const { error } = await supabase.from('spaces').insert([{
      title:         data.title,
      external_link: data.external_link,
      department_id: deptId(data.department_id),
    }]);
    if (error) {
      toast.error('Failed to add resource', 'Check your permissions and try again.');
    } else {
      toast.success('Resource added');
      closeForm();
      setRefreshKey(k => k + 1);
    }
  };

  const onFileSubmit = async (data: FileForm) => {
    if (!file || !user) return;
    setUploading(true);
    setUploadProgress(20);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const path     = `${user.id}/${Date.now()}-${safeName}`;

    const { error: uploadErr } = await supabase.storage
      .from('knowledge-base')
      .upload(path, file, { cacheControl: '3600', upsert: false });

    if (uploadErr) {
      toast.error('Upload failed', 'Check the file size (max 50 MB) and try again.');
      setUploading(false);
      setUploadProgress(0);
      return;
    }

    setUploadProgress(80);

    const { error: insertErr } = await supabase.from('spaces').insert([{
      title:         data.title,
      file_path:     path,
      department_id: deptId(data.department_id),
    }]);

    if (insertErr) {
      toast.error('File uploaded but failed to save', 'Contact an Admin.');
      setUploading(false);
      return;
    }

    setUploadProgress(100);
    setUploading(false);
    toast.success('File uploaded and saved');
    closeForm();
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="font-general text-sm text-pink-swirl/50">
          SOPs, brand guidelines, and operational documents for your team.
        </p>
        {canManage && (
          <Button
            icon={<span className="text-base leading-none">+</span>}
            onClick={() => setShowForm(v => !v)}
          >
            Add Resource
          </Button>
        )}
      </div>

      {/* Form panel */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-5">

              {/* Mode toggle */}
              <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 w-fit">
                {(['link', 'file'] as Mode[]).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setFile(null); }}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cabinet font-bold text-xs transition-all',
                      mode === m
                        ? 'bg-waxy-corn text-bitter-liquorice'
                        : 'text-pink-swirl/50 hover:text-pink-swirl'
                    )}
                  >
                    {m === 'link' ? <Link2 size={12} /> : <Upload size={12} />}
                    {m === 'link' ? 'Paste Link' : 'Upload File'}
                  </button>
                ))}
              </div>

              {/* ── Link form ── */}
              {mode === 'link' && (
                <form onSubmit={handleLink(onLinkSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      required
                      type="text"
                      placeholder="e.g. Brand Guidelines 2026"
                      error={linkErrors.title?.message}
                      {...regLink('title')}
                    />

                    <Input
                      label="Link"
                      required
                      type="url"
                      placeholder="https://docs.google.com/…"
                      error={linkErrors.external_link?.message}
                      {...regLink('external_link')}
                    />

                    {profile?.role === 'Admin' && (
                      <SelectField
                        label="Department"
                        placeholder="All departments"
                        options={departments.map(d => ({ value: d.id, label: d.name }))}
                        {...regLink('department_id')}
                      />
                    )}

                    <div className="sm:col-span-2 flex gap-3">
                      <Button variant="secondary" className="flex-1" type="button" onClick={closeForm}>
                        Cancel
                      </Button>
                      <Button className="flex-1" type="submit" loading={linkSubmitting}>
                        Add Resource
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* ── File upload form ── */}
              {mode === 'file' && (
                <form onSubmit={handleFile(onFileSubmit)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Title"
                      required
                      type="text"
                      placeholder="e.g. Sunday Service Runsheet"
                      error={fileErrors.title?.message}
                      {...regFile('title')}
                    />

                    {/* File picker */}
                    <div className="flex flex-col gap-1.5">
                      <label className="font-cabinet font-bold text-xs uppercase tracking-wider text-pink-swirl/50">
                        File <span className="text-hot-red">*</span>
                      </label>
                      <input
                        ref={fileRef}
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.mp4,.zip,.csv"
                        onChange={e => setFile(e.target.files?.[0] ?? null)}
                      />
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className={cn(
                          'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5',
                          'text-pink-swirl font-general text-sm outline-none focus:border-waxy-corn/50 transition-colors',
                          'flex items-center gap-2 text-left cursor-pointer',
                          !file && 'text-pink-swirl/20',
                        )}
                      >
                        <Upload size={14} className="flex-shrink-0 text-pink-swirl/40" />
                        <span className="truncate flex-1">{file ? file.name : 'Choose a file…'}</span>
                        {file && (
                          <X
                            size={13}
                            className="flex-shrink-0 text-pink-swirl/40 hover:text-hot-red"
                            onClick={e => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = ''; }}
                          />
                        )}
                      </button>
                      {file && (
                        <p className="font-general text-xs text-pink-swirl/30">
                          {(file.size / 1024 / 1024).toFixed(2)} MB · max 50 MB
                        </p>
                      )}
                    </div>

                    {profile?.role === 'Admin' && (
                      <SelectField
                        label="Department"
                        placeholder="All departments"
                        options={departments.map(d => ({ value: d.id, label: d.name }))}
                        {...regFile('department_id')}
                      />
                    )}

                    {/* Upload progress */}
                    {uploading && (
                      <div className="sm:col-span-2 space-y-1">
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-waxy-corn rounded-full"
                            animate={{ width: `${uploadProgress}%` }}
                            transition={{ duration: 0.4 }}
                          />
                        </div>
                        <p className="font-general text-xs text-pink-swirl/30">Uploading…</p>
                      </div>
                    )}

                    <div className="sm:col-span-2 flex gap-3">
                      <Button variant="secondary" className="flex-1" type="button" onClick={closeForm}>
                        Cancel
                      </Button>
                      <Button
                        className="flex-1"
                        type="submit"
                        loading={uploading}
                        disabled={!file}
                      >
                        Upload &amp; Save
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SpacesGrid key={refreshKey} onDeleted={() => setRefreshKey(k => k + 1)} />
    </div>
  );
};

export default SpacesPage;
