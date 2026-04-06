import { motion } from 'framer-motion';

const BlogPulse = () => {
  const articles = [
    { id: 1, category: "Update", title: "Summer Camp '26 Registrations Open", span: "md:col-span-2 md:row-span-2", bg: "bg-night-blue", text: "text-pink-swirl" },
    { id: 2, category: "Devotion", title: "Finding Peace in Chaos", span: "md:col-span-1 md:row-span-1", bg: "bg-white", text: "text-bitter-liquorice" },
    { id: 3, category: "Culture", title: "Why We Worship Loud", span: "md:col-span-1 md:row-span-1", bg: "bg-pink-swirl", text: "text-bitter-liquorice" },
    { id: 4, category: "Story", title: "Sarah's Journey to Faith", span: "md:col-span-1 md:row-span-2", bg: "bg-bitter-liquorice", text: "text-pink-swirl" },
    { id: 5, category: "Events", title: "Night of Worship: March", span: "md:col-span-1 md:row-span-1", bg: "bg-astral-blue", text: "text-pink-swirl" },
  ];

  return (
    <section id="blog-pulse" className="py-24 bg-white text-bitter-liquorice">
      <div className="max-w-7xl mx-auto px-6">
        
        <motion.div 
          className="mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-5xl border-b-4 border-waxy-corn inline-block pb-2 font-cabinet font-black uppercase text-night-blue">The Pulse</h2>
          <p className="font-general text-xl mt-4 max-w-2xl text-bitter-liquorice/70">
            Stay plugged into the life of our church. Stories, devotions, and updates from Sunday Life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[200px]">
          {articles.map((article, index) => (
            <motion.div 
              key={article.id}
              className={`relative rounded-3xl p-8 flex flex-col justify-end overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 ${article.span} ${article.bg} ${article.text}`}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.1 }}
            >
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-fluorescence text-bitter-liquorice font-cabinet font-bold text-xs uppercase tracking-wider py-1 px-3 rounded-full">
                  {article.category}
                </span>
              </div>
              <motion.div 
                className="relative z-10"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <h3 className="font-cabinet font-bold text-2xl md:text-3xl leading-tight group-hover:text-waxy-corn transition-colors duration-300">
                  {article.title}
                </h3>
                <div className="w-12 h-1 bg-waxy-corn mt-4 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </motion.div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default BlogPulse;
