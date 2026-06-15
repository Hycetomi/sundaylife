import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X } from 'lucide-react';

// ── Logo ──────────────────────────────────────────────────────────────────────

const NavLogo = ({ className = 'h-8 w-8' }: { className?: string }) => {
  const [err, setErr] = useState(false);
  return err ? (
    <span className="font-cabinet font-black text-base uppercase tracking-tight text-pink-swirl">SL</span>
  ) : (
    <img
      src="/Logo-icon.svg"
      alt="SundayLife"
      className={`${className} object-contain`}
      onError={() => setErr(true)}
    />
  );
};

// ── Nav links (no Volunteer — that lives behind Join Us) ──────────────────────

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Blog Pulse', href: '/blog-pulse' },
  { label: 'Support Us', href: '/#support-us' },
  { label: 'Join a Lifehouse', href: '/join-a-lifehouse' },
];

// ── Page label for the indicator ──────────────────────────────────────────────

const PAGE_LABEL: Record<string, string> = {
  '/blog-pulse': 'Blog Pulse',
  '/join-a-lifehouse': 'Join a Lifehouse',
  '/volunteer': 'Volunteer',
  '/login': 'Staff Login',
  '/register': 'Register',
};

function getPageLabel(pathname: string): string {
  if (pathname.startsWith('/blog-pulse/')) return 'Blog Pulse';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  return PAGE_LABEL[pathname] ?? '';
}

// ── Shared glass styles ───────────────────────────────────────────────────────

const PILL_GLASS: React.CSSProperties = {
  background: 'rgba(8, 20, 12, 0.90)',
  backdropFilter: 'blur(28px) saturate(200%)',
  WebkitBackdropFilter: 'blur(28px) saturate(200%)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  boxShadow: '0 8px 36px rgba(0,0,0,0.55), inset 0 1.5px 0 rgba(255,255,255,0.12)',
};

const INDICATOR_GLASS: React.CSSProperties = {
  background: 'rgba(8, 20, 12, 0.65)',
  backdropFilter: 'blur(16px) saturate(180%)',
  WebkitBackdropFilter: 'blur(16px) saturate(180%)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
};

// ── Divider ───────────────────────────────────────────────────────────────────

const Divider = () => (
  <div className="w-px h-3.5 bg-white/20 flex-shrink-0" />
);

// ── Navbar ────────────────────────────────────────────────────────────────────

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const pageLabel = getPageLabel(location.pathname);
  const { scrollY } = useScroll();

  // Non-home pages always show pill; home page switches at 85 vh
  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
    } else {
      setScrolled(window.scrollY > window.innerHeight * 0.85);
    }
  }, [isHome]);

  useMotionValueEvent(scrollY, 'change', (latest) => {
    if (isHome) setScrolled(latest > window.innerHeight * 0.85);
  });

  // Close on route change
  useEffect(() => { setOpen(false); }, [location]);

  // Close on outside click (for both pill and banner)
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (open) {
        const isOutsidePill = pillRef.current && !pillRef.current.contains(e.target as Node);
        const isOutsideBanner = bannerRef.current && !bannerRef.current.contains(e.target as Node);
        if (isOutsidePill && isOutsideBanner) {
          setOpen(false);
        }
      }
    };
    if (open) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <>
      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <AnimatePresence initial={false}>

        {/* Banner — homepage only, before scroll threshold */}
        {isHome && !scrolled && (
          <motion.nav
            key="banner"
            ref={bannerRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-bitter-liquorice/90 backdrop-blur-md text-pink-swirl border-b border-white/10"
          >
            <div className="flex items-center justify-between px-6 md:px-8 py-4">
              <Link to="/" className="flex-shrink-0">
                <NavLogo className="h-10 w-10" />
              </Link>

              <ul className="hidden md:flex items-center space-x-8 font-general text-sm font-medium">
                {NAV_LINKS.map((item) => (
                  <motion.li key={item.label} whileHover={{ scale: 1.05 }}>
                    <Link to={item.href} className="transition-colors duration-300 hover:text-waxy-corn">
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>

              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="font-general text-sm text-pink-swirl/50 hover:text-pink-swirl transition-colors">
                  Staff Login
                </Link>
                <Link to="/volunteer">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="px-6 py-2 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold rounded-full transition-shadow hover:shadow-[0_0_15px_rgba(247,181,0,0.5)]"
                  >
                    Join Us
                  </motion.button>
                </Link>
              </div>

              <button
                className="md:hidden z-10 text-pink-swirl p-1"
                onClick={() => setOpen((v) => !v)}
                aria-label={open ? 'Close menu' : 'Open menu'}
              >
                <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  {open ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </button>
            </div>

            {/* Banner Mobile Menu Expansion */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="flex flex-col px-6 pb-6 pt-2 gap-4 border-t border-white/10">
                    {NAV_LINKS.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="font-cabinet font-bold text-lg text-pink-swirl/80 hover:text-waxy-corn transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="flex flex-col gap-4 mt-2">
                      <Link to="/volunteer" onClick={() => setOpen(false)}>
                        <button className="w-full px-6 py-3 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold rounded-full hover:shadow-[0_0_15px_rgba(247,181,0,0.4)] transition-shadow">
                          Join Us
                        </button>
                      </Link>
                      <Link
                        to="/login"
                        className="font-general text-sm text-center text-pink-swirl/50 hover:text-pink-swirl transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        Staff Login
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        )}

        {/* Pill — always on non-home; appears after scroll on home */}
        {scrolled && (
          <motion.div
            key="pill-container"
            initial={{ opacity: 0, y: -20, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.94 }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="fixed top-4 inset-x-0 z-50 pointer-events-none flex flex-col items-center gap-1.5"
          >
            {/* Main pill with layout animation for dynamic island effect */}
            <motion.div
              layout
              ref={pillRef}
              className="flex flex-col text-pink-swirl pointer-events-auto overflow-hidden"
              style={{
                ...PILL_GLASS,
                borderRadius: open ? '1.5rem' : '9999px',
              }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Top row (always visible) */}
              <motion.div layout className="flex items-center justify-between gap-4 px-5 py-3.5">
                {/* Logo */}
                <Link to="/" aria-label="Home" className="flex-shrink-0" onClick={() => setOpen(false)}>
                  <NavLogo className="h-7 w-7" />
                </Link>

                <Divider />

                {/* MENU + hamburger */}
                <button
                  className="flex items-center gap-1.5 text-pink-swirl/70 hover:text-pink-swirl transition-colors duration-200 flex-shrink-0"
                  onClick={() => setOpen((v) => !v)}
                  aria-label={open ? 'Close menu' : 'Open menu'}
                >
                  <motion.span
                    animate={{ rotate: open ? 90 : 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                    className="block"
                  >
                    {open ? <X size={16} /> : <Menu size={16} />}
                  </motion.span>
                  <span className="font-cabinet font-bold text-xs uppercase tracking-[0.18em]">
                    Menu
                  </span>
                </button>

                <Divider />

                {/* Join Us → Volunteer */}
                <Link to="/volunteer" className="flex-shrink-0" onClick={() => setOpen(false)}>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    className="px-5 py-2 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-xs uppercase tracking-[0.14em] rounded-full transition-shadow hover:shadow-[0_0_14px_rgba(247,181,0,0.55)]"
                  >
                    Join Us
                  </motion.button>
                </Link>
              </motion.div>

              {/* Dynamic Island Expanded Content */}
              <AnimatePresence>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="w-full flex flex-col items-center px-6 pb-5 pt-1 gap-4"
                  >
                    <div className="w-full h-px bg-white/10 mb-1" />
                    {NAV_LINKS.map((item) => (
                      <Link
                        key={item.label}
                        to={item.href}
                        onClick={() => setOpen(false)}
                        className="font-cabinet font-medium text-base text-pink-swirl/80 hover:text-waxy-corn transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Detached Staff Login Button */}
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut', delay: 0.05 }}
                  className="pointer-events-auto mt-1"
                >
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center px-6 py-2.5 rounded-full bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-xs uppercase tracking-[0.15em] transition-all hover:shadow-[0_0_14px_rgba(247,181,0,0.55)] hover:scale-[1.02]"
                  >
                    Staff Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Page indicator — shown only on non-home pages (hidden when pill is open for cleaner look) */}
            <AnimatePresence>
              {pageLabel && !open && (
                <motion.div
                  key={pageLabel}
                  initial={{ opacity: 0, y: -6, scale: 0.88 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.92 }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full pointer-events-auto"
                  style={INDICATOR_GLASS}
                >
                  <span className="w-1 h-1 rounded-full bg-waxy-corn/70 flex-shrink-0" />
                  <span className="font-general text-[10px] text-pink-swirl/50 tracking-wide">
                    {pageLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
