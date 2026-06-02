import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '/#about' },
  { label: 'Blog Pulse', href: '/#blog-pulse' },
  { label: 'Support Us', href: '/#support-us' },
  { label: 'Join a Lifehouse', href: '/join-a-lifehouse' },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 py-5 bg-bitter-liquorice/90 backdrop-blur-md text-pink-swirl border-b border-white/10">
      {/* Logo */}
      <div className="text-2xl font-cabinet font-bold tracking-wider uppercase z-10">
        <Link to="/">SundayLife</Link>
      </div>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center space-x-8 font-general text-sm font-medium">
        {NAV_LINKS.map((item) => (
          <motion.li key={item.label} whileHover={{ scale: 1.05 }} className="relative">
            <Link
              to={item.href}
              className="transition-colors duration-300 hover:text-waxy-corn"
            >
              {item.label}
            </Link>
          </motion.li>
        ))}
      </ul>

      {/* Desktop CTA + Staff auth links */}
      <div className="hidden md:flex items-center gap-4">
        <Link
          to="/register"
          className="font-general text-sm text-pink-swirl/50 hover:text-pink-swirl transition-colors"
        >
          Register
        </Link>
        <Link
          to="/login"
          className="font-general text-sm text-pink-swirl/50 hover:text-pink-swirl transition-colors"
        >
          Staff Login
        </Link>
        <Link to="/#support-us">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="px-6 py-2 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold rounded-full transition-shadow hover:shadow-[0_0_15px_rgba(247,181,0,0.5)]"
          >
            Join Us
          </motion.button>
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden z-10 text-pink-swirl p-1"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={drawerRef}
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 w-72 bg-bitter-liquorice border-l border-white/10 flex flex-col pt-24 px-8 pb-10 gap-6 md:hidden"
          >
            {NAV_LINKS.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="font-cabinet font-bold text-xl text-pink-swirl hover:text-waxy-corn transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link to="/#support-us" className="mt-4">
              <button className="w-full px-6 py-3 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold rounded-full">
                Join Us
              </button>
            </Link>
            <div className="flex gap-6 justify-center">
              <Link to="/register" className="font-general text-sm text-pink-swirl/40 hover:text-pink-swirl/70 transition-colors">
                Register
              </Link>
              <Link to="/login" className="font-general text-sm text-pink-swirl/40 hover:text-pink-swirl/70 transition-colors">
                Staff Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
