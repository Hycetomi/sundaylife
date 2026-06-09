import { motion } from 'framer-motion';

// No background here — HomepageBackground (fixed z-0) provides the dark
// base + rays; this section is transparent so they show through.
const Hero = () => (
  <section
    id="home"
    className="relative z-10 w-full h-screen flex items-center justify-center overflow-hidden"
  >
    <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-cabinet font-black text-pink-swirl tracking-tighter leading-none mb-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        A CHURCH <br />
        <span className="text-waxy-corn">WITHOUT WALLS</span>
      </motion.h1>

      <motion.p
        className="text-xl md:text-2xl text-pink-swirl/80 font-general max-w-2xl mt-6"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        Faith that is living, joyful, and accessible to the youth of today.
      </motion.p>

      <motion.div
        className="mt-12"
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      >
        <a href="#about">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-shadow hover:shadow-[0_0_24px_rgba(247,181,0,0.45)]"
          >
            Discover Our Story
          </motion.button>
        </a>
      </motion.div>
    </div>
  </section>
);

export default Hero;
