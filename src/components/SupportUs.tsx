import { motion } from 'framer-motion';
import { DollarSign, HandHeart, Handshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    title:  'Donate',
    desc:   'Partner financially to keep the mission alive and growing.',
    Icon:   DollarSign,
    cta:    'Give Now',
    href:   '#',
  },
  {
    title:  'Volunteer',
    desc:   'Give your time and skills. Apply to join a SundayLife team — we review every application personally.',
    Icon:   HandHeart,
    cta:    'Join the Team',
    href:   '/volunteer',
  },
  {
    title:  'Partner',
    desc:   'Become a brand partner or ambassador for our events.',
    Icon:   Handshake,
    cta:    'Get in Touch',
    href:   '#',
  },
];

const SupportUs = () => {
  const navigate = useNavigate();

  return (
    <section id="support-us" className="py-32 bg-bitter-liquorice text-pink-swirl relative overflow-hidden">

      <div className="absolute -top-40 -right-40 w-96 h-96 bg-night-blue rounded-full blur-[120px] opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-astral-blue rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          className="text-center mb-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-5xl md:text-7xl font-cabinet font-black uppercase mb-6 text-pink-swirl">
            Build With Us
          </h2>
          <p className="font-general text-xl text-pink-swirl/70 max-w-2xl mx-auto">
            It takes a village. Whether through prayer, time, or finances, we invite you to be a
            part of the movement.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map(({ title, desc, Icon, cta, href }, index) => (
            <motion.div
              key={index}
              className="bg-pink-swirl text-bitter-liquorice rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: index * 0.15 }}
            >
              <div className="w-16 h-16 rounded-full bg-bitter-liquorice flex items-center justify-center mb-6">
                <Icon size={28} className="text-waxy-corn" />
              </div>
              <h3 className="font-cabinet font-bold text-3xl mb-4 uppercase">{title}</h3>
              <p className="font-general text-lg mb-8 text-bitter-liquorice/80">{desc}</p>

              <div className="mt-auto w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => href.startsWith('/') ? navigate(href) : undefined}
                  className="px-8 py-4 bg-waxy-corn text-bitter-liquorice font-cabinet font-bold text-lg rounded-full shadow-lg transition-all hover:shadow-[0_0_20px_rgba(247,181,0,0.5)] w-full block"
                >
                  {cta}
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
