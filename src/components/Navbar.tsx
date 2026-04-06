import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-bitter-liquorice/90 backdrop-blur-md text-pink-swirl border-b border-white/10">
      <div className="text-2xl font-cabinet font-bold tracking-wider uppercase">
        <a href="#home">Sunday Life</a>
      </div>
      <ul className="flex items-center space-x-8 font-general text-sm font-medium">
        {['About', 'Blog Pulse', 'Support Us'].map((item) => (
          <motion.li key={item} whileHover={{ scale: 1.05 }} className="relative group overflow-hidden">
            <a href={`#${item.toLowerCase().replace(' ', '-')}`} className="relative z-10 transition-colors duration-300 hover:text-waxy-corn">
              {item}
            </a>
          </motion.li>
        ))}
      </ul>
      <div>
        <a href="#support-us">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            className="px-6 py-2 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold rounded-full transition-shadow hover:shadow-[0_0_15px_rgba(247,181,0,0.5)]"
          >
            Join Us
          </motion.button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
