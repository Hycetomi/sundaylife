import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, CalendarDays, Clock, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import VideoPlayer from '@/components/blogpulse/VideoPlayer';
import { CATEGORY_CONFIG } from '@/components/blogpulse/config';
import { Input, Button, useToast } from '@/components/ui';
import type { BlogPost } from '@/types';

// ── Registration form ─────────────────────────────────────────────────────────

const regSchema = z.object({
  full_name: z.string().min(2, 'Enter your full name'),
  email:     z.string().email('Enter a valid email'),
  phone:     z.string().optional(),
});

type RegValues = z.infer<typeof regSchema>;

const RegistrationSection = ({ post, regCount }: { post: BlogPost; regCount: number }) => {
  const toast = useToast();
  const [done, setDone] = useState(false);

  const remaining = post.capacity ? post.capacity - regCount : null;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegValues>({
    resolver: zodResolver(regSchema),
  });

  const onSubmit = async (data: RegValues) => {
    if (post.capacity) {
      const { count } = await supabase
        .from('event_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', post.id);
      if ((count ?? 0) >= post.capacity) {
        toast.warning('Event is full', 'Sorry, this event has reached capacity.');
        return;
      }
    }
    const { error } = await supabase.from('event_registrations').insert([{
      post_id:   post.id,
      full_name: data.full_name,
      email:     data.email,
      phone:     data.phone || null,
    }]);
    if (error) {
      if (error.code === '23505') {
        toast.warning('Already registered', 'This email is already registered for this event.');
      } else {
        toast.error('Registration failed', 'Please try again.');
      }
      return;
    }
    setDone(true);
    toast.success('You\'re registered!');
  };

  if (done) {
    return (
      <div className="mt-12 rounded-2xl bg-bitter-liquorice p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-fluorescence/20 flex items-center justify-center mx-auto mb-4">
          <Users size={22} className="text-fluorescence" />
        </div>
        <h3 className="font-cabinet font-bold text-xl text-pink-swirl mb-2">You're registered!</h3>
        <p className="font-general text-sm text-pink-swirl/55">
          We'll be in touch with more details closer to the event. See you there.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-12 rounded-2xl bg-bitter-liquorice p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="font-cabinet font-bold text-xl text-pink-swirl mb-1">Register for this event</h3>
          {post.event_date && (
            <div className="flex items-center gap-1.5 text-pink-swirl/50">
              <CalendarDays size={13} />
              <span className="font-general text-sm">
                {new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  .format(new Date(post.event_date))}
              </span>
            </div>
          )}
        </div>
        {remaining !== null && (
          <span className={`font-cabinet font-bold text-sm px-3 py-1.5 rounded-full ${
            remaining <= 20
              ? 'bg-hot-red/10 text-hot-red'
              : 'bg-fluorescence/15 text-fluorescence'
          }`}>
            {remaining} {remaining === 1 ? 'spot' : 'spots'} left
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <Input
          label="Phone number (optional)"
          type="tel"
          placeholder="+1 234 567 8900"
          {...register('phone')}
        />
        <div className="pt-2">
          <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
            Secure my spot
          </Button>
        </div>
      </form>
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const ArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [regCount, setRegCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('slug', slug).single();
      if (error || !data) { setNotFound(true); setLoading(false); return; }
      setPost(data as BlogPost);
      const { count } = await supabase
        .from('event_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', data.id);
      setRegCount(count ?? 0);
      setLoading(false);
    };
    load();
  }, [slug]);

  const backHref = post ? `/blog-pulse?category=${post.category}` : '/blog-pulse';

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-20">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-6 animate-pulse">
          <div className="h-4 bg-bitter-liquorice/8 rounded-full w-24" />
          <div className="h-8 bg-bitter-liquorice/8 rounded-full w-3/4" />
          <div className="h-64 bg-bitter-liquorice/8 rounded-2xl" />
          <div className="space-y-3">
            {[100, 90, 95, 80].map((w, i) => (
              <div key={i} className="h-3 bg-bitter-liquorice/8 rounded-full" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (notFound || !post) {
    return (
      <main className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-cabinet font-black text-5xl text-bitter-liquorice mb-4">404</h1>
          <p className="font-general text-bitter-liquorice/50 mb-8">This article doesn't exist.</p>
          <Button onClick={() => navigate('/blog-pulse')}>Back to Pulse</Button>
        </div>
      </main>
    );
  }

  const cfg = CATEGORY_CONFIG[post.category];
  const Icon = cfg.Icon;

  const readMin = post.body
    ? Math.max(1, Math.ceil(post.body.split(' ').length / 200))
    : 2;

  const pubDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    .format(new Date(post.published_at));

  const paragraphs = post.body
    ? post.body.split(/\n\n+/).filter(Boolean)
    : [];

  return (
    <main className="min-h-screen bg-white text-bitter-liquorice">

      {/* Hero strip */}
      <div className="bg-bitter-liquorice pt-20 pb-14 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <button
              onClick={() => navigate(backHref)}
              className="flex items-center gap-2 font-general text-sm text-pink-swirl/50 hover:text-pink-swirl transition-colors mb-8"
            >
              <ArrowLeft size={15} />
              Back to {post.category}
            </button>

            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-cabinet font-bold uppercase tracking-wider ${cfg.badgeBg} ${cfg.badgeText} mb-4`}>
              <Icon size={11} />
              {post.category}
            </span>

            <h1 className="font-cabinet font-black text-3xl md:text-4xl lg:text-5xl text-pink-swirl leading-tight mb-5">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-pink-swirl/40">
              <span className="font-general text-sm">{post.author_name}</span>
              <span className="w-1 h-1 rounded-full bg-current" />
              <div className="flex items-center gap-1.5">
                <Clock size={13} />
                <span className="font-general text-sm">{readMin} min read</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-current" />
              <span className="font-general text-sm">{pubDate}</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {/* Cover image */}
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="w-full rounded-2xl object-cover max-h-[480px] mb-10"
            />
          )}

          {/* Video player */}
          {post.video_url && post.video_type && (
            <div className="mb-10">
              <VideoPlayer url={post.video_url} type={post.video_type} />
            </div>
          )}

          {/* Body */}
          {paragraphs.length > 0 && (
            <div className="space-y-6 font-general text-[1.0625rem] leading-[1.85] text-bitter-liquorice/80">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {/* Registration section */}
          {post.category === 'Update' && post.registration_open && (
            <RegistrationSection post={post} regCount={regCount} />
          )}
        </motion.div>
      </div>
    </main>
  );
};

export default ArticlePage;
