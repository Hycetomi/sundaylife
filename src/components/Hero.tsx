import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section id="home" className="relative w-full h-screen bg-bitter-liquorice flex items-center justify-center overflow-hidden">
      {/* Ambient slowly rotating background element */}
      <motion.div 
        className="absolute w-[800px] h-[800px] rounded-full border border-waxy-corn/5 shadow-[0_0_100px_rgba(247,181,0,0.05)] opacity-20 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'radial-gradient(circle, rgba(247,181,0,0.1) 0%, rgba(24,48,34,0) 70%)'
        }}
      />
      <motion.div 
        className="absolute w-[600px] h-[600px] opacity-10 pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'conic-gradient(from 0deg at 50% 50%, rgba(247,181,0,0) 0%, rgba(247,181,0,0.1) 50%, rgba(247,181,0,0) 100%)'
        }}
      />

      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-cabinet font-black text-pink-swirl tracking-tighter leading-none mb-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          CHURCH <br/> <span className="text-waxy-corn">WITHOUT WALLS</span>
        </motion.h1>
        
        <motion.p 
          className="text-xl md:text-2xl text-pink-swirl/80 font-general max-w-2xl mt-6"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        >
          Faith that is living, joyful, and accessible to the youth of today.
        </motion.p>

        <motion.div 
          className="mt-12"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        >
          <a href="#about">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              className="px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-shadow hover:shadow-[0_0_20px_rgba(247,181,0,0.4)]"
            >
              Discover Our Story
            </motion.button>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
