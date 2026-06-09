import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { CATEGORY_CONFIG, CATEGORIES } from '@/components/blogpulse/config';
import CategorySidebar from '@/components/blogpulse/CategorySidebar';
import PostCard from '@/components/blogpulse/PostCard';
import DecorativeSVG from '@/components/ui/DecorativeSVG';
import type { BlogPost, BlogCategory } from '@/types';

// ── Fallback posts (shown when DB has no content yet) ─────────────────────────

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'fb-1', slug: 'summer-camp-26-registrations-open', category: 'Update',
    title: "Summer Camp '26 Registrations Open",
    excerpt: 'Registration is live for our biggest youth gathering of the year. Secure your spot before spaces fill.',
    body: null, author_name: 'SundayLife', cover_image_url: null,
    video_url: null, video_type: null, is_featured: true,
    event_date: null, registration_open: false, capacity: null,
    published_at: '2026-06-01T00:00:00Z', created_at: '2026-06-01T00:00:00Z',
  },
  {
    id: 'fb-2', slug: 'finding-peace-in-chaos', category: 'Devotion',
    title: 'Finding Peace in Chaos', excerpt: 'A reflection on finding stillness when life is loud.',
    body: null, author_name: 'SundayLife', cover_image_url: null,
    video_url: null, video_type: null, is_featured: false,
    event_date: null, registration_open: false, capacity: null,
    published_at: '2026-05-18T00:00:00Z', created_at: '2026-05-18T00:00:00Z',
  },
  {
    id: 'fb-3', slug: 'why-we-worship-loud', category: 'Culture',
    title: 'Why We Worship Loud', excerpt: 'The theology and joy behind expressive worship.',
    body: null, author_name: 'SundayLife', cover_image_url: null,
    video_url: null, video_type: null, is_featured: false,
    event_date: null, registration_open: false, capacity: null,
    published_at: '2026-05-10T00:00:00Z', created_at: '2026-05-10T00:00:00Z',
  },
  {
    id: 'fb-4', slug: 'sarahs-journey-to-faith', category: 'Story',
    title: "Sarah's Journey to Faith", excerpt: 'One woman\'s story of doubt, perseverance, and breakthrough.',
    body: null, author_name: 'SundayLife', cover_image_url: null,
    video_url: null, video_type: null, is_featured: false,
    event_date: null, registration_open: false, capacity: null,
    published_at: '2026-04-28T00:00:00Z', created_at: '2026-04-28T00:00:00Z',
  },
  {
    id: 'fb-5', slug: 'night-of-worship-march', category: 'Events',
    title: 'Night of Worship: March', excerpt: 'Highlights and moments from our last night of corporate worship.',
    body: null, author_name: 'SundayLife', cover_image_url: null,
    video_url: null, video_type: null, is_featured: false,
    event_date: null, registration_open: false, capacity: null,
    published_at: '2026-04-12T00:00:00Z', created_at: '2026-04-12T00:00:00Z',
  },
];

// ── Featured hero card ────────────────────────────────────────────────────────

const FeaturedCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const cfg = CATEGORY_CONFIG[post.category];
  const Icon = cfg.Icon;

  const readMin = post.body
    ? `${Math.max(1, Math.ceil(post.body.split(' ').length / 200))} min read`
    : '2 min read';
  const pubDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(post.published_at));

  return (
    <motion.div
      onClick={() => navigate(`/blog-pulse/${post.slug}`)}
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer mb-10 h-[420px] md:h-[480px] shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.005, transition: { duration: 0.25 } }}
    >
      {/* Background */}
      {post.cover_image_url ? (
        <img
          src={post.cover_image_url}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${cfg.fallbackFrom}, ${cfg.fallbackTo})` }}
        />
      )}

      {/* Gradient overlay — bottom-heavy for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

      {/* FEATURED pill — top-left */}
      {post.is_featured && (
        <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-[11px] font-cabinet font-bold uppercase tracking-widest text-white border border-white/30 bg-white/10 backdrop-blur-sm">
          Featured
        </span>
      )}

      {/* Video badge — top-right */}
      {post.video_url && (
        <span className="absolute top-5 right-5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-cabinet font-bold bg-black/50 text-white backdrop-blur-sm border border-white/15">
          <Play size={9} fill="currentColor" /> Video
        </span>
      )}

      {/* Content — bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-7 md:p-10 flex items-end justify-between gap-6">
        <div className="flex-1 min-w-0">
          {/* Category */}
          <span className={`inline-flex items-center gap-1.5 text-[11px] font-cabinet font-bold uppercase tracking-widest mb-3 ${cfg.onWhiteText} bg-white/90 px-2.5 py-1 rounded`}>
            <Icon size={9} />
            {post.category}
          </span>
          {/* Title */}
          <h2 className="font-cabinet font-black text-white text-2xl md:text-[2.1rem] leading-tight mb-3 line-clamp-2">
            {post.title}
          </h2>
          {/* Excerpt */}
          {post.excerpt && (
            <p className="font-general text-white/65 text-sm leading-relaxed line-clamp-2 max-w-xl">
              {post.excerpt}
            </p>
          )}
          {/* Meta */}
          <p className="font-general text-white/40 text-xs mt-3">
            {post.author_name !== 'SundayLife' && `${post.author_name} · `}{pubDate} · {readMin}
          </p>
        </div>

        {/* CTA */}
        <button className="flex-shrink-0 hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-bitter-liquorice font-cabinet font-bold text-sm hover:bg-white/90 transition-colors">
          Read article
          <ArrowRight size={14} />
        </button>
      </div>
    </motion.div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────

const HeroSkeleton = () => (
  <div className="w-full rounded-2xl h-[420px] md:h-[480px] bg-bitter-liquorice/8 animate-pulse mb-10" />
);

const CardSkeleton = () => (
  <div className="rounded-2xl border border-bitter-liquorice/8 overflow-hidden animate-pulse">
    <div className="h-52 bg-bitter-liquorice/8" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-bitter-liquorice/8 rounded-full w-3/4" />
      <div className="h-3 bg-bitter-liquorice/8 rounded-full w-full" />
      <div className="h-3 bg-bitter-liquorice/8 rounded-full w-1/2" />
    </div>
  </div>
);

// ── Mobile category tab bar ───────────────────────────────────────────────────

const CategoryTabBar = ({
  active,
  posts,
  onChange,
}: {
  active: BlogCategory | 'All';
  posts: BlogPost[];
  onChange: (cat: BlogCategory | 'All') => void;
}) => {
  const allItems: { id: BlogCategory | 'All'; label: string; Icon?: React.ElementType; onWhiteText: string }[] = [
    { id: 'All', label: 'All', onWhiteText: 'text-bitter-liquorice' },
    ...CATEGORIES.map(cat => ({
      id: cat,
      label: cat,
      Icon: CATEGORY_CONFIG[cat].Icon,
      onWhiteText: CATEGORY_CONFIG[cat].onWhiteText,
    })),
  ];

  return (
    <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-6 px-6 mb-8 scrollbar-none">
      {allItems.map(({ id, label, Icon, onWhiteText }) => {
        const isActive = active === id;
        const count = id === 'All' ? posts.length : posts.filter(p => p.category === id).length;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full border font-general text-sm transition-all ${
              isActive
                ? `${onWhiteText} border-current bg-current/6 font-medium`
                : 'border-bitter-liquorice/15 text-bitter-liquorice/50 hover:border-bitter-liquorice/30'
            }`}
          >
            {Icon && id !== 'All' && <Icon size={13} />}
            {label}
            <span className="text-[11px] font-cabinet font-bold opacity-55">{count}</span>
          </button>
        );
      })}
    </div>
  );
};

// ── Page ──────────────────────────────────────────────────────────────────────

const BlogPulsePage = () => {
  const [stripHovered, setStripHovered] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const rawCat = searchParams.get('category');
  const active: BlogCategory | 'All' = (CATEGORIES as string[]).includes(rawCat ?? '')
    ? (rawCat as BlogCategory)
    : 'All';

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .then(({ data }) => {
        const fetched = (data as BlogPost[]) ?? [];
        setPosts(fetched.length > 0 ? fetched : FALLBACK_POSTS);
        setLoading(false);
      });
  }, []);

  const setActive = (cat: BlogCategory | 'All') => {
    cat === 'All' ? setSearchParams({}) : setSearchParams({ category: cat });
  };

  const visible = active === 'All' ? posts : posts.filter(p => p.category === active);

  // Split: first (hero) + rest (grid)
  const heroPost = visible[0] ?? null;
  const gridPosts = visible.slice(1);

  const cfg = active !== 'All' ? CATEGORY_CONFIG[active] : null;
  const ActiveIcon = cfg?.Icon;

  return (
    <main className="min-h-screen bg-white text-bitter-liquorice">

      {/* ── Hero strip ── */}
      <div
        className="bg-bitter-liquorice text-pink-swirl pt-20 pb-14 px-6 relative overflow-hidden"
        onMouseEnter={() => setStripHovered(true)}
        onMouseLeave={() => setStripHovered(false)}
      >
        <DecorativeSVG hovered={stripHovered} src="/Cross.svg"         size={56} top="10%"    right="3%"  opacity={0.13} rotate={25}  floatDuration={5}   scrollFactor={0.06} />
        <DecorativeSVG hovered={stripHovered} src="/Blunt%20star.svg"  size={44} bottom="10%" left="2%"   opacity={0.12} rotate={-10} floatDuration={4.2} scrollFactor={0.08} />
        <DecorativeSVG hovered={stripHovered} src="/star.svg"           size={36} top="20%"    left="30%"  opacity={0.08} rotate={15}  floatDuration={3.8} scrollFactor={0.10} />
        <DecorativeSVG hovered={stripHovered} src="/8-sided_star.svg"  size={32} bottom="15%" right="15%" opacity={0.09} rotate={-5}  floatDuration={4.5} scrollFactor={0.07} />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div className="flex items-center gap-3 mb-3">
              {ActiveIcon && <ActiveIcon size={22} className={cfg?.accent} />}
              <h1 className="font-cabinet font-black text-4xl md:text-5xl uppercase leading-none">
                {active === 'All' ? 'The Pulse' : active}
              </h1>
            </div>
            <div className="h-1 w-12 bg-waxy-corn rounded-full mb-4" />
            <p className="font-general text-base text-pink-swirl/55 max-w-lg">
              {active === 'All'
                ? 'Stories, devotions, events and updates from the SundayLife community.'
                : cfg?.desc}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">

          {/* Sidebar */}
          <CategorySidebar active={active} posts={posts} />

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* Mobile tab bar */}
            <CategoryTabBar active={active} posts={posts} onChange={setActive} />

            {/* Loading */}
            {loading && (
              <>
                <HeroSkeleton />
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
                </div>
              </>
            )}

            {/* Empty */}
            {!loading && visible.length === 0 && (
              <div className="flex flex-col items-center py-24 text-bitter-liquorice/30">
                {cfg?.Icon && <cfg.Icon size={48} strokeWidth={1} className="mb-4" />}
                <p className="font-general text-base">Nothing here yet — check back soon.</p>
              </div>
            )}

            {/* Featured hero */}
            {!loading && heroPost && (
              <FeaturedCard post={heroPost} />
            )}

            {/* Grid */}
            {!loading && gridPosts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {gridPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.06 }}
                  >
                    <PostCard post={post} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BlogPulsePage;
