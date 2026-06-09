import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DecorativeSVG from '@/components/ui/DecorativeSVG';

// ── Article data ──────────────────────────────────────────────────────────────

const ARTICLES = [
  {
    id:       1,
    slug:     'summer-camp-26-registrations-open',
    category: 'Update',
    title:    "Summer Camp '26 Registrations Open",
    excerpt:  'Registration is live for our biggest youth gathering of the year. Secure your spot before spaces fill.',
    read:     '3 min',
    date:     'Jun 2026',
    span:     'md:col-span-2 md:row-span-2',
    bg:       'bg-bitter-liquorice',
    text:     'text-pink-swirl',
    badge:    'bg-sky-400/20 text-sky-300 border border-sky-400/25',
    isHero:   true,
  },
  {
    id:       2,
    slug:     'finding-peace-in-chaos',
    category: 'Devotion',
    title:    'Finding Peace in Chaos',
    read:     '5 min',
    date:     'May 2026',
    span:     'md:col-span-1 md:row-span-1',
    bg:       'bg-pink-swirl',
    text:     'text-bitter-liquorice',
    badge:    'bg-amber-200/70 text-amber-800 border border-amber-300/50',
  },
  {
    id:       3,
    slug:     'why-we-worship-loud',
    category: 'Culture',
    title:    'Why We Worship Loud',
    read:     '4 min',
    date:     'May 2026',
    span:     'md:col-span-1 md:row-span-1',
    bg:       'bg-night-blue',
    text:     'text-pink-swirl',
    badge:    'bg-pink-swirl/15 text-pink-swirl/75 border border-pink-swirl/20',
  },
  {
    id:       4,
    slug:     'sarahs-journey-to-faith',
    category: 'Story',
    title:    "Sarah's Journey to Faith",
    read:     '8 min',
    date:     'Apr 2026',
    span:     'md:col-span-1 md:row-span-1',
    bg:       'bg-[#f0ece5]',
    text:     'text-bitter-liquorice',
    badge:    'bg-bitter-liquorice/10 text-bitter-liquorice/60 border border-bitter-liquorice/15',
  },
  {
    id:       5,
    slug:     'night-of-worship-march',
    category: 'Events',
    title:    'Night of Worship: March',
    read:     '2 min',
    date:     'Apr 2026',
    span:     'md:col-span-2 md:row-span-1',
    bg:       'bg-waxy-corn',
    text:     'text-bitter-liquorice',
    badge:    'bg-bitter-liquorice/15 text-bitter-liquorice/75 border border-bitter-liquorice/20',
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

const BlogPulse = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
  <section
    id="blog-pulse"
    className="py-24 bg-white text-bitter-liquorice relative overflow-hidden z-10"
    onMouseEnter={() => setHovered(true)}
    onMouseLeave={() => setHovered(false)}
  >
    <DecorativeSVG hovered={hovered} src="/8-sided_star.svg" size={56} top="4%"    right="2%"  opacity={0.07} rotate={5}   floatDuration={5}   scrollFactor={0.06} />
    <DecorativeSVG hovered={hovered} src="/Cross.svg"         size={44} top="16%"   right="5%"  opacity={0.06} rotate={22}  floatDuration={4.6} scrollFactor={0.09} />
    <DecorativeSVG hovered={hovered} src="/star.svg"           size={36} top="42%"   right="1%"  opacity={0.06} rotate={30}  floatDuration={3.5} scrollFactor={0.08} />
    <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"  size={48} bottom="20%"right="3%"  opacity={0.07} rotate={-12} floatDuration={5.2} scrollFactor={0.07} />
    <DecorativeSVG hovered={hovered} src="/Clove.svg"          size={52} bottom="6%" left="1%"   opacity={0.07} rotate={-15} floatDuration={4.2} scrollFactor={0.12} />
    <DecorativeSVG hovered={hovered} src="/star.svg"           size={40} bottom="28%"left="3%"   opacity={0.06} rotate={-30} floatDuration={4.8} scrollFactor={0.10} />
    <DecorativeSVG hovered={hovered} src="/8-sided_star.svg"  size={32} top="60%"   left="0%"   opacity={0.05} rotate={15}  floatDuration={3.8} scrollFactor={0.11} />
    <div className="max-w-7xl mx-auto px-6">

      {/* ── Section header ── */}
      <motion.div
        className="flex items-end justify-between mb-12"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div>
          <h2 className="font-cabinet font-black text-5xl md:text-6xl uppercase text-bitter-liquorice leading-none mb-2">
            The Pulse
          </h2>
          <div className="h-1 w-14 bg-waxy-corn rounded-full mb-4" />
          <p className="font-general text-lg text-bitter-liquorice/55 max-w-lg leading-relaxed">
            Stories, devotions, and updates from the SundayLife community.
          </p>
        </div>

        <Link
          to="/blog-pulse"
          className="hidden md:flex items-center gap-1.5 font-cabinet font-bold text-sm text-bitter-liquorice/40 hover:text-bitter-liquorice transition-colors duration-200 group flex-shrink-0 mb-1"
        >
          View All
          <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </motion.div>

      {/* ── Bento grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[230px]">
        {ARTICLES.map((article, i) => (
          <motion.article
            key={article.id}
            onClick={() => navigate(`/blog-pulse/${article.slug}`)}
            className={`relative rounded-2xl overflow-hidden cursor-pointer group shadow-sm ${article.span} ${article.bg} ${article.text}`}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: i * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: 'easeOut' } }}
          >
            {/* Subtle gradient depth on hero */}
            {article.isHero && (
              <div className="absolute inset-0 bg-gradient-to-br from-astral-blue/15 via-transparent to-transparent pointer-events-none" />
            )}

            {/* Content layout — flex column filling full height */}
            <div className={`
              relative h-full p-6 flex flex-col justify-between
              ${article.isHero ? 'min-h-[300px] md:min-h-0' : 'min-h-[180px] md:min-h-0'}
            `}>
              {/* Top: category badge */}
              <div>
                <span className={`inline-block px-3 py-1 rounded-full font-cabinet font-bold text-[11px] uppercase tracking-wider border ${article.badge}`}>
                  {article.category}
                </span>
              </div>

              {/* Bottom: excerpt (hero only) + title + meta */}
              <div>
                {article.isHero && (
                  <p className="font-general text-sm leading-relaxed opacity-55 mb-3 max-w-xs">
                    {article.excerpt}
                  </p>
                )}
                <h3 className={`font-cabinet font-bold leading-tight transition-opacity duration-200 group-hover:opacity-75 ${
                  article.isHero ? 'text-3xl md:text-[2.1rem]' : 'text-[1.15rem]'
                }`}>
                  {article.title}
                </h3>
                <div className="flex items-center gap-2 mt-2.5 opacity-40">
                  <span className="font-general text-xs">{article.read} read</span>
                  <span className="w-1 h-1 rounded-full bg-current" />
                  <span className="font-general text-xs">{article.date}</span>
                </div>
              </div>
            </div>

            {/* Hover ring overlay */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-inset ring-transparent group-hover:ring-black/8 transition-all duration-300 pointer-events-none" />
          </motion.article>
        ))}
      </div>

      {/* Mobile-only "View All" CTA */}
      <div className="md:hidden mt-8 flex justify-center">
        <Link
          to="/blog-pulse"
          className="flex items-center gap-2 font-cabinet font-bold text-sm text-bitter-liquorice/50 hover:text-bitter-liquorice transition-colors"
        >
          View All Articles <ArrowRight size={15} />
        </Link>
      </div>

    </div>
  </section>
  );
};

export default BlogPulse;
