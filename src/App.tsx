import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutUs from './components/AboutUs';
import BlogPulse from './components/BlogPulse';
import SupportUs from './components/SupportUs';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen font-general bg-pink-swirl text-bitter-liquorice overflow-x-hidden selection:bg-waxy-corn selection:text-bitter-liquorice">
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <BlogPulse />
        <SupportUs />
      </main>
      <Footer />
    </div>
  );
}

export default App;
