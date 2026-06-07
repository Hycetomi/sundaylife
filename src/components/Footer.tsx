import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// ── Social icon SVGs ──────────────────────────────────────────────────────────

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="2" y="2" width="20" height="20" rx="5.5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);

const YouTubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M21.8 8s-.2-1.4-.8-2c-.8-.8-1.7-.8-2.1-.9C16.3 5 12 5 12 5s-4.3 0-6.9.1c-.4.1-1.3.1-2.1.9-.6.6-.8 2-.8 2S2 9.6 2 11.1v1.4c0 1.5.2 3.1.2 3.1s.2 1.4.8 2c.8.8 1.8.8 2.3.9 1.6.2 6.7.2 6.7.2s4.3 0 6.9-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2 .8-2s.2-1.6.2-3.1v-1.4C22 9.6 21.8 8 21.8 8zM9.7 14.5V9l5.7 2.8-5.7 2.7z" />
  </svg>
);

const SpotifyIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.6 14.4c-.2.3-.6.4-.9.2-2.5-1.5-5.6-1.9-9.3-1-.4.1-.7-.2-.8-.5-.1-.4.2-.7.5-.8 4-.9 7.5-.5 10.3 1.1.4.2.5.7.2 1zm1.2-2.7c-.2.4-.7.5-1.1.3-2.8-1.7-7.1-2.2-10.4-1.2-.4.1-.9-.1-1-.5-.1-.4.1-.9.5-1 3.8-1.1 8.5-.6 11.7 1.4.5.3.6.9.3 1zm.1-2.8C14.4 9.2 8.8 9 5.5 9.9c-.5.1-1.1-.2-1.2-.7-.1-.5.2-1.1.7-1.2C8.5 7 14.6 7.2 18.4 9.4c.5.3.7.9.4 1.4-.3.5-.9.7-1.4.4l-.1-.3z" />
  </svg>
);

// ── Logo (small, primary; text fallback) ─────────────────────────────────────

const Logo = () => {
  const [err, setErr] = useState(false);
  return err ? (
    <span className="font-cabinet font-black text-xl uppercase tracking-tight text-pink-swirl">
      SundayLife
    </span>
  ) : (
    <img
      src="/logo.png"
      alt="SundayLife"
      className="h-10 w-auto object-contain"
      onError={() => setErr(true)}
    />
  );
};

// ── Data ──────────────────────────────────────────────────────────────────────

const MINISTRY_LINKS = [
  { label: 'Events',           href: '#' },
  { label: 'Join a Lifehouse', href: '/join-a-lifehouse' },
  { label: 'Volunteer',        href: '#support-us' },
  { label: 'Donate',           href: '#support-us' },
];

const SOCIAL_LINKS = [
  { label: 'Instagram', href: '#', Icon: InstagramIcon },
  { label: 'YouTube',   href: '#', Icon: YouTubeIcon },
  { label: 'Spotify',   href: '#', Icon: SpotifyIcon },
];

// Each tag has its own distinct brand color
const TAGS = [
  {
    label:  'Hosts Events',
    dot:    'bg-waxy-corn',
    border: 'border-waxy-corn/35',
    text:   'text-waxy-corn',
    bg:     'bg-waxy-corn/6',
  },
  {
    label:  'Lifehouse Fellowship',
    dot:    'bg-sky-400',
    border: 'border-sky-400/30',
    text:   'text-sky-400',
    bg:     'bg-sky-400/6',
  },
  {
    label:  'Church Without Walls',
    dot:    'bg-fluorescence',
    border: 'border-fluorescence/30',
    text:   'text-fluorescence',
    bg:     'bg-fluorescence/6',
  },
];

// ── Decorative pattern ────────────────────────────────────────────────────────

const FooterPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">

    {/* Dot grid — gold */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(247,181,0,0.07) 1px, transparent 1px)',
        backgroundSize: '30px 30px',
      }}
    />

    {/* Diagonal line sweep — complementary rose/pink, top-right quadrant */}
    <svg
      className="absolute top-0 right-0 w-[55%] h-full opacity-100"
      preserveAspectRatio="xMaxYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="diag-lines" x="0" y="0" width="56" height="56"
          patternUnits="userSpaceOnUse" patternTransform="rotate(-38)">
          <line x1="0" y1="0" x2="0" y2="56"
            stroke="rgba(244,114,182,0.07)" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#diag-lines)" />
    </svg>

    {/* Corner accent: stacked rings — bottom left */}
    <svg
      className="absolute -bottom-20 -left-20 w-72 h-72 opacity-100"
      viewBox="0 0 288 288"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[40, 72, 104, 136].map((r, i) => (
        <circle
          key={r}
          cx="144" cy="144" r={r}
          stroke="rgba(247,181,0,0.06)"
          strokeWidth="1"
          strokeDasharray={i % 2 === 0 ? '4 8' : 'none'}
        />
      ))}
    </svg>

    {/* Corner accent: cross-hatch diamonds — top right */}
    <svg
      className="absolute -top-10 -right-10 w-64 h-64 opacity-100"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
          x={128 - (i + 1) * 28} y={128 - (i + 1) * 28}
          width={(i + 1) * 56} height={(i + 1) * 56}
          stroke="rgba(244,114,182,0.07)"
          strokeWidth="1"
          transform="rotate(45 128 128)"
        />
      ))}
    </svg>

  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="relative bg-gradient-to-b from-bitter-liquorice to-[#08150f] text-pink-swirl overflow-hidden">

    {/* Pattern */}
    <FooterPattern />

    {/* Ambient glows — continues from SupportUs */}
    <div className="absolute -top-24 left-0 w-[500px] h-[300px] bg-astral-blue/18 blur-[130px] pointer-events-none" />
    <div className="absolute top-0 right-0 w-[380px] h-[260px] bg-waxy-corn/5 blur-[140px] pointer-events-none" />
    <div className="absolute bottom-0 right-1/3 w-[280px] h-[180px] bg-night-blue/18 blur-[100px] pointer-events-none" />

    {/* Hairline separator */}
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-waxy-corn/20 to-transparent" />

    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-10">

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 pb-16">

        {/* Left: Brand — 3 of 5 cols */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {/* Logo (replaces text heading) */}
          <div className="mb-5">
            <Logo />
          </div>

          <p className="font-general text-base text-pink-swirl/55 leading-relaxed max-w-md mb-8">
            A global movement of faith without boundaries — uniting communities
            worldwide through events, Lifehouse fellowships, and the unwavering
            belief that church can happen anywhere.
          </p>

          {/* Tags — all three accented with distinct brand colours */}
          <div className="flex flex-wrap gap-2">
            {TAGS.map(tag => (
              <span
                key={tag.label}
                className={`inline-flex items-center px-3.5 py-1.5 rounded-full font-cabinet font-bold text-[11px] uppercase tracking-wider border ${tag.border} ${tag.text} ${tag.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tag.dot} mr-2 flex-shrink-0`} />
                {tag.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Right: Links — 2 of 5 cols */}
        <motion.div
          className="lg:col-span-2 grid grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.12 }}
        >
          {/* Ministry */}
          <div>
            <p className="font-cabinet font-bold text-[10px] uppercase tracking-[0.18em] text-pink-swirl/25 mb-5">
              Ministry
            </p>
            <ul className="space-y-3.5">
              {MINISTRY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  {href.startsWith('/') ? (
                    <Link
                      to={href}
                      className="font-general text-sm text-pink-swirl/55 hover:text-waxy-corn transition-colors duration-200"
                    >
                      {label}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      className="font-general text-sm text-pink-swirl/55 hover:text-waxy-corn transition-colors duration-200"
                    >
                      {label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <p className="font-cabinet font-bold text-[10px] uppercase tracking-[0.18em] text-pink-swirl/25 mb-5">
              Connect
            </p>
            <ul className="space-y-3.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 font-general text-sm text-pink-swirl/55 hover:text-waxy-corn transition-colors duration-200 group"
                  >
                    <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                      <Icon />
                    </span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="font-general text-xs text-pink-swirl/25 tracking-wide">
          &copy; {new Date().getFullYear()} SundayLife Global &mdash; All rights reserved.
        </p>
        <p className="font-general text-xs text-pink-swirl/15 uppercase tracking-widest">
          Church Without Walls
        </p>
      </div>

    </div>
  </footer>
);

export default Footer;
