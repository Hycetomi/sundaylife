import { motion } from 'framer-motion';

const SupportUs = () => {
  const cards = [
    { title: "Donate", desc: "Partner financially to keep the mission alive and growing.", icon: "💰" },
    { title: "Volunteer", desc: "Give your time and skills. Join a Sunday Life team today.", icon: "🙌" },
    { title: "Partner", desc: "Become a brand partner or ambassador for our events.", icon: "🤝" }
  ];

  return (
    <section id="support-us" className="py-32 bg-bitter-liquorice text-pink-swirl relative overflow-hidden">
      
      {/* Decorative background circle */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-night-blue rounded-full blur-[120px] opacity-50" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-astral-blue rounded-full blur-[100px] opacity-40" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        <motion.div 
          className="text-center mb-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-cabinet font-black uppercase mb-6 text-pink-swirl">Build With Us</h2>
          <p className="font-general text-xl text-pink-swirl/70 max-w-2xl mx-auto">
            It takes a village. Whether through prayer, time, or finances, we invite you to be a part of the movement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <motion.div 
              key={index}
              className="bg-pink-swirl text-bitter-liquorice rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl relative group"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.15 }}
            >
              <div className="text-6xl mb-6">{card.icon}</div>
              <h3 className="font-cabinet font-bold text-3xl mb-4 uppercase">{card.title}</h3>
              <p className="font-general text-lg mb-8 text-bitter-liquorice/80">
                {card.desc}
              </p>
              
              <div className="mt-auto">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  className="px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-all hover:shadow-[0_0_20px_rgba(247,181,0,0.5)] w-full block"
                >
                  Start Now
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SupportUs;
