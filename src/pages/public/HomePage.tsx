import HomepageBackground from '@/components/HomepageBackground';
import Hero from '@/components/Hero';
import AboutUs from '@/components/AboutUs';
import BlogPulse from '@/components/BlogPulse';
import SupportUs from '@/components/SupportUs';

const HomePage = () => (
  <>
    {/* Fixed dark base + rays — z-0, visible wherever sections are transparent */}
    <HomepageBackground />
    {/* z-10 lifts sections above the fixed z-0 layer; transparent sections show through */}
    <main className="relative z-10">
      <Hero />
      <AboutUs />
      <BlogPulse />
      <SupportUs />
    </main>
  </>
);

export default HomePage;
