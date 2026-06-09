import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, ExternalLink, Users, Download } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import { toSlug } from '@/lib/utils';
import { CATEGORY_CONFIG, CATEGORIES } from '@/components/blogpulse/config';
import MediaUploader from '@/components/blogpulse/MediaUploader';
import { Button, Input, Textarea, SelectField, Modal, ConfirmDialog, useToast } from '@/components/ui';
import type { BlogPost, BlogCategory, EventRegistration } from '@/types';

// ── Form schema ───────────────────────────────────────────────────────────────

const schema = z.object({
  title:           z.string().min(2, 'Title is required'),
  slug:            z.string().min(2, 'Slug is required'),
  excerpt:         z.string().optional(),
  body:            z.string().optional(),
  category:        z.enum(['Update', 'Devotion', 'Story', 'Events', 'Culture']),
  author_name:     z.string().min(1, 'Author is required'),
  cover_image_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  youtube_url:     z.string().url('Must be a valid YouTube URL').or(z.literal('')).optional(),
  event_date:      z.string().optional(),
  capacity:        z.string().optional(),
  is_featured:     z.boolean().optional(),
  registration_open: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

// ── Form modal ────────────────────────────────────────────────────────────────

const PostFormModal = ({
  post,
  onClose,
  onSaved,
}: {
  post: BlogPost | null;
  onClose: () => void;
  onSaved: () => void;
}) => {
  const toast = useToast();
  const isEdit = !!post;

  const [uploadedMedia, setUploadedMedia] = useState<{ url: string; type: 'upload' } | null>(
    post?.video_type === 'upload' ? { url: post.video_url!, type: 'upload' } : null
  );

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title:             post?.title ?? '',
      slug:              post?.slug ?? '',
      excerpt:           post?.excerpt ?? '',
      body:              post?.body ?? '',
      category:          post?.category ?? 'Update',
      author_name:       post?.author_name ?? 'SundayLife',
      cover_image_url:   post?.cover_image_url ?? '',
      youtube_url:       post?.video_type === 'youtube' ? (post.video_url ?? '') : '',
      event_date:        post?.event_date ?? '',
      capacity:          post?.capacity != null ? String(post.capacity) : '',
      is_featured:       post?.is_featured ?? false,
      registration_open: post?.registration_open ?? false,
    },
  });

  const category = watch('category') as BlogCategory;
  const registrationOpen = watch('registration_open');
  const onSubmit = async (data: FormValues) => {
    const videoUrl = uploadedMedia?.url || (data.youtube_url?.trim() || null);
    const videoType = uploadedMedia ? 'upload' : (data.youtube_url?.trim() ? 'youtube' : null);

    const payload = {
      title:             data.title,
      slug:              data.slug,
      excerpt:           data.excerpt?.trim() || null,
      body:              data.body?.trim() || null,
      category:          data.category,
      author_name:       data.author_name,
      cover_image_url:   data.cover_image_url?.trim() || null,
      video_url:         videoUrl,
      video_type:        videoType,
      is_featured:       data.is_featured ?? false,
      event_date:        data.event_date || null,
      registration_open: data.registration_open ?? false,
      capacity:          (() => { const n = parseInt(data.capacity ?? '', 10); return data.capacity && !Number.isNaN(n) ? n : null; })(),
    };

    const { error } = isEdit
      ? await supabase.from('blog_posts').update(payload).eq('id', post!.id)
      : await supabase.from('blog_posts').insert([payload]);

    if (error) {
      toast.error(isEdit ? 'Failed to update post' : 'Failed to create post', error.message);
      return;
    }
    toast.success(isEdit ? 'Post updated' : 'Post created');
    onSaved();
    onClose();
  };

  const showEventFields = category === 'Update' || category === 'Events';

  return (
    <Modal
      open
      onClose={onClose}
      title={isEdit ? 'Edit Post' : 'New Post'}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
            {isEdit ? 'Save changes' : 'Publish post'}
          </Button>
        </div>
      }
    >
      <form className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Title"
            required
            error={errors.title?.message}
            {...register('title')}
            onBlur={(e) => {
              if (!isEdit && !watch('slug')) {
                setValue('slug', toSlug(e.target.value));
              }
            }}
          />
          <Input
            label="Slug"
            required
            error={errors.slug?.message}
            placeholder="auto-generated"
            {...register('slug')}
            onBlur={(e) => setValue('slug', toSlug(e.currentTarget.value))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SelectField
            label="Category"
            required
            options={CATEGORIES.map(c => ({ value: c, label: c }))}
            {...register('category')}
          />
          <Input
            label="Author"
            required
            error={errors.author_name?.message}
            {...register('author_name')}
          />
        </div>

        <Textarea label="Excerpt" rows={2} placeholder="Short summary shown on cards…" {...register('excerpt')} />
        <Textarea label="Body" rows={8} placeholder="Full article content…" {...register('body')} />

        <Input
          label="Cover image URL (optional)"
          placeholder="https://…"
          error={errors.cover_image_url?.message}
          {...register('cover_image_url')}
        />

        <div className="space-y-3">
          <p className="font-general text-sm font-medium text-pink-swirl/70">Video (optional)</p>
          <Input
            label="YouTube URL"
            placeholder="https://youtube.com/watch?v=…"
            error={errors.youtube_url?.message}
            disabled={!!uploadedMedia}
            {...register('youtube_url')}
          />
          <p className="font-general text-xs text-pink-swirl/40 text-center">— or upload a file —</p>
          <MediaUploader
            currentUrl={uploadedMedia?.url}
            onUploaded={(url, type) => setUploadedMedia({ url, type })}
            onClear={() => setUploadedMedia(null)}
          />
        </div>

        {showEventFields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Event date" type="date" {...register('event_date')} />
            {registrationOpen && (
              <Input label="Capacity (optional)" type="number" placeholder="e.g. 400" {...register('capacity')} />
            )}
          </div>
        )}

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="rounded accent-waxy-corn" {...register('is_featured')} />
            <span className="font-general text-sm text-pink-swirl/70">Featured post</span>
          </label>
          {showEventFields && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded accent-waxy-corn" {...register('registration_open')} />
              <span className="font-general text-sm text-pink-swirl/70">Registration open</span>
            </label>
          )}
        </div>
      </form>
    </Modal>
  );
};

// ── Registrations modal ───────────────────────────────────────────────────────

const RegistrationsModal = ({
  post,
  onClose,
}: {
  post: BlogPost;
  onClose: () => void;
}) => {
  const [regs, setRegs] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('event_registrations')
      .select('*')
      .eq('post_id', post.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRegs((data as EventRegistration[]) ?? []);
        setLoading(false);
      });
  }, [post.id]);

  const exportCSV = () => {
    const headers = ['Full Name', 'Email', 'Phone', 'Registered At'];
    const rows = regs.map(r => [
      r.full_name,
      r.email,
      r.phone ?? '',
      new Date(r.created_at).toLocaleString('en-GB'),
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${post.slug}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Event Registrations"
      size="lg"
      footer={
        <div className="flex items-center justify-between w-full">
          <span className="font-general text-xs text-pink-swirl/40">
            {loading ? '—' : `${regs.length} ${regs.length === 1 ? 'registration' : 'registrations'}`}
          </span>
          <div className="flex gap-3">
            {!loading && regs.length > 0 && (
              <Button variant="secondary" size="sm" icon={<Download size={13} />} onClick={exportCSV}>
                Export CSV
              </Button>
            )}
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </div>
      }
    >
      <p className="font-cabinet font-bold text-pink-swirl/60 text-sm bg-white/5 rounded-xl px-4 py-3 mb-5 line-clamp-1">
        {post.title}
      </p>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && regs.length === 0 && (
        <div className="flex flex-col items-center py-12 text-pink-swirl/25">
          <Users size={36} strokeWidth={1} className="mb-3" />
          <p className="font-general text-sm">No registrations yet.</p>
        </div>
      )}

      {!loading && regs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Name', 'Email', 'Phone', 'Date'].map(h => (
                  <th key={h} className="pb-3 pr-4 text-left font-general text-xs text-pink-swirl/30 font-normal tracking-wide uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {regs.map(r => (
                <tr key={r.id}>
                  <td className="py-3 pr-4 font-general text-pink-swirl font-medium">{r.full_name}</td>
                  <td className="py-3 pr-4 font-general text-pink-swirl/60">{r.email}</td>
                  <td className="py-3 pr-4 font-general text-pink-swirl/50">{r.phone ?? '—'}</td>
                  <td className="py-3 pr-4 font-general text-pink-swirl/40 text-xs whitespace-nowrap">
                    {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      .format(new Date(r.created_at))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Modal>
  );
};

// ── Manager ───────────────────────────────────────────────────────────────────

const BlogPostsManager = () => {
  const toast = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BlogPost | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<BlogPost | null>(null);
  const [viewingRegs, setViewingRegs] = useState<BlogPost | null>(null);

  const load = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });
    setPosts((data as BlogPost[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    if (!deleting) return;
    const { error } = await supabase.from('blog_posts').delete().eq('id', deleting.id);
    if (error) { toast.error('Failed to delete post'); return; }
    toast.success('Post deleted');
    setDeleting(null);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-general text-sm text-pink-swirl/50">{posts.length} posts</p>
        <Button icon={<Plus size={14} />} size="sm" onClick={() => setEditing(null)}>
          New Post
        </Button>
      </div>

      {loading && (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <div key={i} className="h-14 rounded-xl bg-white/5 animate-pulse" />)}
        </div>
      )}

      {!loading && posts.length === 0 && (
        <p className="text-center py-12 font-general text-sm text-pink-swirl/30">No posts yet.</p>
      )}

      {!loading && posts.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/8">
                {['Title', 'Category', 'Event date', 'Reg', 'Published', ''].map(h => (
                  <th key={h} className="pb-3 pr-4 text-left font-general text-xs text-pink-swirl/30 font-normal tracking-wide uppercase">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map(post => {
                const cfg = CATEGORY_CONFIG[post.category];
                const CatIcon = cfg.Icon;
                return (
                  <tr key={post.id} className="group">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-general text-pink-swirl font-medium line-clamp-1">{post.title}</span>
                        <a href={`/blog-pulse/${post.slug}`} target="_blank" rel="noopener noreferrer"
                          className="opacity-0 group-hover:opacity-100 text-pink-swirl/30 hover:text-waxy-corn transition-all">
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-cabinet font-bold ${cfg.badgeBg} ${cfg.badgeText}`}>
                        <CatIcon size={10} /> {post.category}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-general text-pink-swirl/50 text-xs whitespace-nowrap">
                      {post.event_date
                        ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.event_date))
                        : '—'}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`font-cabinet font-bold text-[11px] ${post.registration_open ? 'text-fluorescence' : 'text-pink-swirl/20'}`}>
                        {post.registration_open ? 'Open' : '—'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 font-general text-pink-swirl/40 text-xs whitespace-nowrap">
                      {new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(post.published_at))}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setViewingRegs(post)}
                          title="View registrations"
                          className="p-1.5 rounded-lg text-pink-swirl/40 hover:text-fluorescence hover:bg-white/5 transition-colors"
                        >
                          <Users size={13} />
                        </button>
                        <button onClick={() => setEditing(post)}
                          className="p-1.5 rounded-lg text-pink-swirl/40 hover:text-waxy-corn hover:bg-white/5 transition-colors">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => setDeleting(post)}
                          className="p-1.5 rounded-lg text-pink-swirl/40 hover:text-hot-red hover:bg-white/5 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Registrations viewer */}
      {viewingRegs && (
        <RegistrationsModal post={viewingRegs} onClose={() => setViewingRegs(null)} />
      )}

      {/* Create / Edit modal */}
      {editing !== undefined && (
        <PostFormModal
          post={editing}
          onClose={() => setEditing(undefined)}
          onSaved={load}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        variant="danger"
        title="Delete post"
        description={`"${deleting?.title}" will be permanently removed.`}
        confirmLabel="Delete"
      />
    </div>
  );
};

export default BlogPostsManager;
