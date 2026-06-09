import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, X, Heart, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import DecorativeSVG from '@/components/ui/DecorativeSVG';

// ── Donate modal ──────────────────────────────────────────────────────────────

const MOMO_CODE = '*182*8*1*1154052*amount#';

const DonateModal = ({ onClose }: { onClose: () => void }) => {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(MOMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
      />
      <motion.div
        key="panel"
        initial={{ opacity: 0, scale: 0.94, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
      >
        <div
          onClick={e => e.stopPropagation()}
          className="relative w-full max-w-md bg-bitter-liquorice rounded-3xl p-8 shadow-2xl pointer-events-auto"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-pink-swirl/30 hover:text-pink-swirl transition-colors"
          >
            <X size={18} />
          </button>

          <div className="w-14 h-14 rounded-full bg-waxy-corn/10 border border-waxy-corn/20 flex items-center justify-center mx-auto mb-6">
            <Heart size={24} className="text-waxy-corn" strokeWidth={1.5} />
          </div>

          <h2 className="font-cabinet font-black text-2xl uppercase text-pink-swirl text-center mb-2">
            Thank You for Giving
          </h2>
          <p className="font-general text-pink-swirl/55 text-sm text-center leading-relaxed mb-8">
            Your generosity keeps the mission alive. Every contribution — no matter the size —
            goes directly towards community, worship, and outreach.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-5">
            <p className="font-cabinet font-bold text-xs uppercase tracking-widest text-pink-swirl/40 mb-3">
              How to give via MoMo
            </p>
            <ol className="font-general text-sm text-pink-swirl/70 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Open your phone dialler</li>
              <li>Dial the code below, replacing <span className="font-bold text-waxy-corn">amount</span> with how much you'd like to give</li>
              <li>Follow the prompts to confirm your payment</li>
            </ol>
          </div>

          <div className="flex items-center gap-3 bg-waxy-corn/8 border border-waxy-corn/20 rounded-2xl px-5 py-4">
            <code className="flex-1 font-cabinet font-bold text-lg tracking-wide text-waxy-corn">
              {MOMO_CODE}
            </code>
            <button
              onClick={copy}
              className="flex-shrink-0 flex items-center gap-1.5 font-general text-xs text-pink-swirl/50 hover:text-waxy-corn transition-colors"
            >
              {copied
                ? <><Check size={14} className="text-fluorescence" /><span className="text-fluorescence">Copied</span></>
                : <><Copy size={14} />Copy</>
              }
            </button>
          </div>

          <p className="font-general text-xs text-pink-swirl/30 text-center mt-5 leading-relaxed">
            Payments are processed directly via Mobile Money.<br />
            Please keep your transaction confirmation for your records.
          </p>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
};

// ── Section ───────────────────────────────────────────────────────────────────

const ITEMS = [
  {
    num:   '01',
    label: 'Donate',
    desc:  'Partner financially to keep the mission alive and growing. Every gift counts.',
    cta:   'Give Now',
    action: 'donate' as const,
  },
  {
    num:   '02',
    label: 'Volunteer',
    desc:  'Give your time and skills. Apply to join a SundayLife team — we review every application personally.',
    cta:   'Join the Team',
    action: '/volunteer' as const,
  },
  {
    num:   '03',
    label: 'Partner',
    desc:  'Become a brand partner or ambassador for our events.',
    cta:   'Get in Touch',
    action: '#' as const,
  },
];

const SupportUs = () => {
  const navigate      = useNavigate();
  const [donateOpen, setDonateOpen] = useState(false);
  const [hovered, setHovered]       = useState(false);

  const handleCTA = (action: typeof ITEMS[number]['action']) => {
    if (action === 'donate') { setDonateOpen(true); return; }
    if (action.startsWith('/')) navigate(action);
  };

  return (
    <>
      <section
        id="support-us"
        className="py-28 text-pink-swirl relative overflow-hidden"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Denser pattern — higher opacity on dark bg */}
        <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"  size={80}  top="4%"    left="3%"    opacity={0.14} rotate={-8}  floatDuration={5.5} scrollFactor={0.09} />
        <DecorativeSVG hovered={hovered} src="/star.svg"           size={56}  top="4%"    right="3%"   opacity={0.13} rotate={22}  floatDuration={4.8} scrollFactor={0.07} />
        <DecorativeSVG hovered={hovered} src="/Cross.svg"          size={52}  top="35%"   left="1%"    opacity={0.12} rotate={-14} floatDuration={4.0} scrollFactor={0.11} />
        <DecorativeSVG hovered={hovered} src="/8-sided_star.svg"   size={44}  top="40%"   right="1%"   opacity={0.12} rotate={5}   floatDuration={3.5} scrollFactor={0.10} />
        <DecorativeSVG hovered={hovered} src="/Clove.svg"          size={48}  bottom="22%"left="4%"    opacity={0.11} rotate={30}  floatDuration={5.0} scrollFactor={0.08} />
        <DecorativeSVG hovered={hovered} src="/Cross.svg"          size={60}  bottom="6%" right="4%"   opacity={0.13} rotate={20}  floatDuration={4.2} scrollFactor={0.13} />
        <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"   size={36}  bottom="30%"right="7%"   opacity={0.10} rotate={-30} floatDuration={3.8} scrollFactor={0.12} />

        <div className="max-w-6xl mx-auto px-6 md:px-10">

          {/* Section header */}
          <motion.div
            className="mb-20 md:mb-28"
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="font-cabinet font-black text-5xl md:text-7xl xl:text-8xl uppercase text-pink-swirl leading-none mb-5">
              Build With Us
            </h2>
            <p className="font-general text-pink-swirl/50 text-lg md:text-xl max-w-xl leading-relaxed">
              It takes a village. Whether through prayer, time, or finances — you are a part of the movement.
            </p>
          </motion.div>

          {/* Items */}
          <div>
            {ITEMS.map((item, i) => (
              <div key={item.num}>
                {i > 0 && <div className="h-px bg-pink-swirl/8" />}

                <motion.div
                  className="relative py-14 md:py-20 overflow-hidden"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.08 }}
                >
                  {/* Ghost number — atmospheric depth */}
                  <span
                    aria-hidden
                    className="absolute right-0 top-1/2 -translate-y-1/2 font-cabinet font-black leading-none pointer-events-none select-none text-pink-swirl/[0.03]"
                    style={{ fontSize: 'clamp(120px, 18vw, 240px)' }}
                  >
                    {item.num}
                  </span>

                  {/* Counter + rule + label row */}
                  <div className="flex items-center gap-4 md:gap-6 mb-6">
                    <span className="font-cabinet font-bold text-[11px] tracking-[0.22em] uppercase text-pink-swirl/25 flex-shrink-0">
                      {item.num}
                    </span>
                    <div className="flex-1 h-px bg-pink-swirl/10" />
                    <h3 className="font-cabinet font-black uppercase text-pink-swirl flex-shrink-0 leading-none"
                      style={{ fontSize: 'clamp(2.2rem, 6vw, 5.5rem)' }}
                    >
                      {item.label}
                    </h3>
                  </div>

                  {/* Description + CTA */}
                  <div className="max-w-lg md:ml-[calc(1.75rem+1.5rem)]">
                    <p className="font-general text-pink-swirl/48 text-base md:text-lg leading-relaxed mb-6">
                      {item.desc}
                    </p>
                    <motion.button
                      onClick={() => handleCTA(item.action)}
                      className="group inline-flex items-center gap-2.5 font-cabinet font-bold text-waxy-corn text-sm tracking-wide"
                      whileHover="hover"
                    >
                      {item.cta}
                      <motion.span
                        variants={{ hover: { x: 6 } }}
                        transition={{ type: 'spring', damping: 18, stiffness: 260 }}
                      >
                        <ArrowRight size={15} />
                      </motion.span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {donateOpen && <DonateModal onClose={() => setDonateOpen(false)} />}
    </>
  );
};

export default SupportUs;
