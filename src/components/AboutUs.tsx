import { motion } from 'framer-motion';

const timelineItems = [
  {
    year: 'The Beginning',
    title: 'A Spark of Faith',
    text: 'It started in a living room. A few friends gathering not just to talk about faith, but to live it out in radical, accessible ways.',
  },
  {
    year: 'The Movement',
    title: 'Breaking the Walls',
    text: "We realized that church isn't a building; it's a people. We stepped out of the traditional four walls to meet the youth where they are.",
  },
  {
    year: 'Today',
    title: 'Living Joyfully',
    text: 'Today, Sunday Life is a thriving community. We believe in authenticity, worship that moves the soul, and faith that impacts our daily lives.',
  },
];

const AboutUs = () => {
  return (
    <section id="about" className="py-24 bg-pink-swirl text-bitter-liquorice relative">
      <div className="max-w-6xl mx-auto px-6">

        <motion.div
          className="text-center mb-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <h2 className="text-5xl md:text-7xl font-cabinet font-bold mb-6">THE STORY</h2>
          <p className="font-luxurious text-4xl md:text-5xl text-hot-red">
            "Serve your creator in the days of your youth" — Ecc 12:1
          </p>
        </motion.div>

        {/* Timeline — mobile: single column, md+: centered alternating grid */}
        <div className="relative">

          {/* Center spine (desktop only) */}
          <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-bitter-liquorice/20" />

          <div className="flex flex-col gap-16">
            {timelineItems.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  className="relative flex flex-col md:flex-row items-start md:items-center"
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: 'easeOut', delay: index * 0.1 }}
                >
                  {/* Mobile: left accent bar */}
                  <div className="md:hidden absolute top-2 left-0 bottom-0 w-px bg-bitter-liquorice/20" />
                  <div className="md:hidden absolute top-2 left-[-5px] w-3 h-3 rounded-full bg-hot-red" />

                  {/* Desktop left slot */}
                  <div className={`hidden md:block w-1/2 ${isLeft ? 'pr-16 text-right' : 'pr-16 opacity-0 pointer-events-none'}`}>
                    {isLeft && <ItemContent item={item} />}
                  </div>

                  {/* Desktop center dot */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-hot-red border-2 border-pink-swirl z-10" />

                  {/* Desktop right slot */}
                  <div className={`hidden md:block w-1/2 ${!isLeft ? 'pl-16' : 'pl-16 opacity-0 pointer-events-none'}`}>
                    {!isLeft && <ItemContent item={item} />}
                  </div>

                  {/* Mobile content */}
                  <div className="md:hidden pl-8 pt-1">
                    <ItemContent item={item} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

const ItemContent = ({ item }: { item: typeof timelineItems[0] }) => (
  <div>
    <span className="text-astral-blue font-cabinet font-bold tracking-widest uppercase text-sm">
      {item.year}
    </span>
    <h3 className="text-3xl font-cabinet font-bold mt-2 mb-4 text-night-blue">{item.title}</h3>
    <p className="font-general text-lg leading-relaxed text-bitter-liquorice/80">{item.text}</p>
  </div>
);

export default AboutUs;
