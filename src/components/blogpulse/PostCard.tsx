import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, ArrowRight, CalendarDays } from 'lucide-react';
import { CATEGORY_CONFIG } from './config';
import type { BlogPost } from '@/types';

// ── Fallback gradient when no cover image ─────────────────────────────────────

const FallbackCover = ({ post }: { post: BlogPost }) => {
  const cfg = CATEGORY_CONFIG[post.category];
  const Icon = cfg.Icon;
  return (
    <div
      className="w-full h-full flex items-end p-5"
      style={{ background: `linear-gradient(135deg, ${cfg.fallbackFrom}, ${cfg.fallbackTo})` }}
    >
      <Icon size={28} className="text-white/20" />
    </div>
  );
};

// ── Standard card ─────────────────────────────────────────────────────────────

const PostCard = ({ post }: { post: BlogPost }) => {
  const navigate = useNavigate();
  const cfg = CATEGORY_CONFIG[post.category];
  const Icon = cfg.Icon;

  const readMin = post.body
    ? `${Math.max(1, Math.ceil(post.body.split(' ').length / 200))} min read`
    : '2 min read';

  const pubDate = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    .format(new Date(post.published_at));

  const eventDate = post.event_date
    ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(new Date(post.event_date))
    : null;

  return (
    <motion.article
      onClick={() => navigate(`/blog-pulse/${post.slug}`)}
      className="group bg-white rounded-2xl border border-bitter-liquorice/8 overflow-hidden cursor-pointer flex flex-col shadow-sm"
      whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
    >
      {/* ── Image / fallback ── */}
      <div className="relative h-52 flex-shrink-0 overflow-hidden bg-bitter-liquorice/5">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <FallbackCover post={post} />
        )}

        {/* Category badge — bottom-left of image */}
        <span className={`absolute bottom-3 left-3 inline-flex items-center gap-1 text-[10px] font-cabinet font-bold uppercase tracking-widest ${cfg.onWhiteText} bg-white/90 backdrop-blur-sm px-2 py-1 rounded`}>
          <Icon size={9} />
          {post.category}
        </span>

        {/* Video badge — top-right */}
        {post.video_url && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-cabinet font-bold bg-black/55 text-white backdrop-blur-sm">
            <Play size={8} fill="currentColor" />
            Video
          </span>
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-cabinet font-bold text-[1.05rem] leading-snug text-bitter-liquorice mb-2 line-clamp-2 group-hover:opacity-70 transition-opacity">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="font-general text-sm text-bitter-liquorice/50 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* ── Meta row ── */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-bitter-liquorice/35 font-general text-xs">
            {post.author_name !== 'SundayLife' && (
              <>
                <span>{post.author_name}</span>
                <span>·</span>
              </>
            )}
            <span>{pubDate}</span>
            <span>·</span>
            <span>{readMin}</span>
          </div>
          <ArrowRight
            size={15}
            className="text-bitter-liquorice/25 group-hover:text-[#CC2D2D] group-hover:translate-x-0.5 transition-all duration-200 flex-shrink-0"
          />
        </div>

        {/* Event pill */}
        {eventDate && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-bitter-liquorice/6">
            <CalendarDays size={11} className="text-bitter-liquorice/35" />
            <span className="font-general text-xs text-bitter-liquorice/40">{eventDate}</span>
            {post.registration_open && (
              <span className="ml-auto text-[10px] font-cabinet font-bold text-[#CC2D2D] uppercase tracking-wide">
                Registration open
              </span>
            )}
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default PostCard;
