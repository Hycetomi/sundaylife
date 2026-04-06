import { motion } from 'framer-motion';

const AboutUs = () => {
  const timelineItems = [
    { year: "The Beginning", title: "A Spark of Faith", text: "It started in a living room. A few friends gathering not just to talk about faith, but to live it out in radical, accessible ways." },
    { year: "The Movement", title: "Breaking the Walls", text: "We realized that church isn't a building; it's a people. We stepped out of the traditional four walls to meet the youth where they are." },
    { year: "Today", title: "Living Joyfully", text: "Today, Sunday Life is a thriving community. We believe in authenticity, worship that moves the soul, and faith that impacts our daily lives." }
  ];

  return (
    <section id="about" className="py-24 bg-pink-swirl text-bitter-liquorice relative">
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.div 
          className="text-center mb-20"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-cabinet font-bold mb-6">THE STORY</h2>
          <p className="font-luxurious text-4xl md:text-5xl text-hot-red">
            "Serve your creator in the days of your youth" - Ecc 12:1
          </p>
        </motion.div>

        <div className="relative border-l-2 border-bitter-liquorice/20 ml-4 md:ml-1/2 left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-auto">
          {timelineItems.map((item, index) => (
            <motion.div 
              key={index}
              className="mb-16 relative pl-8 md:pl-0 w-full md:w-[50vw] max-w-lg md:even:ml-auto md:odd:mr-auto md:odd:text-right"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            >
              <div className="absolute top-0 md:top-2 left-[-5px] md:left-auto md:right-[-9px] md:odd:right-[-9px] md:even:left-[-9px] w-4 h-4 rounded-full bg-hot-red" />
              <div className="md:px-12 pt-1 md:pt-0">
                <span className="text-astral-blue font-cabinet font-bold tracking-widest uppercase text-sm">{item.year}</span>
                <h3 className="text-3xl font-cabinet font-bold mt-2 mb-4 text-night-blue">{item.title}</h3>
                <p className="font-general text-lg leading-relaxed text-bitter-liquorice/80">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
