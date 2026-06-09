import { useState } from 'react';
import { motion } from 'framer-motion';
import DecorativeSVG from '@/components/ui/DecorativeSVG';

const timelineItems = [
  {
    year:  'The Beginning',
    title: 'A Spark of Faith',
    text:  'It started in a living room. A few friends gathering not just to talk about faith, but to live it out in radical, accessible ways.',
  },
  {
    year:  'The Movement',
    title: 'Breaking the Walls',
    text:  "We realized that church isn't a building; it's a people. We stepped out of the traditional four walls to meet the youth where they are.",
  },
  {
    year:  'Today',
    title: 'Living Joyfully',
    text:  'Today, Sunday Life is a thriving community. We believe in authenticity, worship that moves the soul, and faith that impacts our daily lives.',
  },
];

const AboutUs = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="about"
      className="bg-pink-swirl text-bitter-liquorice relative overflow-hidden z-10"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Denser decorative pattern — low opacity on pink bg */}
      <DecorativeSVG hovered={hovered} src="/Cross.svg"         size={64} top="4%"    right="3%"   opacity={0.07} rotate={18}   floatDuration={5.5} scrollFactor={0.05} />
      <DecorativeSVG hovered={hovered} src="/star.svg"           size={44} top="18%"   right="1%"   opacity={0.06} rotate={-8}   floatDuration={3.8} scrollFactor={0.09} />
      <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"  size={56} top="38%"   right="5%"   opacity={0.07} rotate={12}   floatDuration={4.5} scrollFactor={0.07} />
      <DecorativeSVG hovered={hovered} src="/8-sided_star.svg"  size={40} bottom="20%"right="2%"   opacity={0.06} rotate={30}   floatDuration={4.0} scrollFactor={0.10} />
      <DecorativeSVG hovered={hovered} src="/Clove.svg"          size={52} bottom="6%" right="6%"   opacity={0.07} rotate={-15}  floatDuration={3.5} scrollFactor={0.06} />
      <DecorativeSVG hovered={hovered} src="/Cross.svg"          size={36} top="55%"   left="2%"    opacity={0.05} rotate={-22}  floatDuration={4.8} scrollFactor={0.12} />
      <DecorativeSVG hovered={hovered} src="/star.svg"           size={48} bottom="30%"left="4%"    opacity={0.06} rotate={45}   floatDuration={5.0} scrollFactor={0.08} />
      <DecorativeSVG hovered={hovered} src="/Blunt%20star.svg"  size={44} bottom="8%" left="1%"    opacity={0.07} rotate={-5}   floatDuration={4.2} scrollFactor={0.11} />

      {/* Section label */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pt-24 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <h2 className="font-cabinet font-black text-sm uppercase text-bitter-liquorice/50 tracking-[0.22em] mb-2">
            The Story
          </h2>
          <div className="h-0.5 w-7 bg-waxy-corn" />
        </motion.div>
      </div>

      {/* Timeline items */}
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        {timelineItems.map((item, i) => (
          <div key={i}>
            {i > 0 && <div className="h-px bg-bitter-liquorice/10" />}

            <motion.div
              className="relative py-16 md:py-20 overflow-hidden"
              initial={{ opacity: 0, y: 36, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.72, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Ghost number */}
              <span
                aria-hidden
                className="absolute right-0 top-1/2 -translate-y-1/2 font-cabinet font-black leading-none pointer-events-none select-none text-bitter-liquorice/[0.04]"
                style={{ fontSize: 'clamp(140px, 20vw, 280px)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <span className="font-cabinet font-bold text-[11px] tracking-[0.22em] uppercase text-astral-blue flex-shrink-0">
                    {item.year}
                  </span>
                  <div className="flex-1 h-px bg-bitter-liquorice/15 max-w-[80px]" />
                </div>
                <h3
                  className="font-cabinet font-bold mb-6 text-night-blue leading-tight"
                  style={{ fontSize: 'clamp(2.6rem, 5.5vw, 4.8rem)' }}
                >
                  {item.title}
                </h3>
                <p className="font-general text-lg md:text-xl leading-relaxed text-bitter-liquorice/65 max-w-xl">
                  {item.text}
                </p>
              </div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Bottom quote */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 pb-24 pt-8">
        <div className="h-px bg-bitter-liquorice/10 mb-8" />
        <motion.div
          className="text-right"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className="font-luxurious text-2xl md:text-3xl text-hot-red/55 leading-snug">
            "Serve your creator in the days of your youth"
          </p>
          <p className="font-general text-xs text-bitter-liquorice/30 mt-2 tracking-widest uppercase">
            Ecc 12:1
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
