const Footer = () => {
  return (
    <footer className="bg-bitter-liquorice border-t border-waxy-corn/20 py-12 text-pink-swirl text-center">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
        <h2 className="text-3xl font-cabinet font-bold uppercase tracking-wider mb-4">SUNDAY LIFE</h2>
        <p className="font-general text-sm text-pink-swirl/80 mb-8 max-w-sm">
          Church without walls. Faith that is living, joyful, and accessible.
        </p>
        <div className="flex space-x-6 mb-8 text-pink-swirl/80">
          <a href="#" className="hover:text-waxy-corn transition-colors">Instagram</a>
          <a href="#" className="hover:text-waxy-corn transition-colors">YouTube</a>
          <a href="#" className="hover:text-waxy-corn transition-colors">Spotify</a>
        </div>
        <p className="font-general text-xs text-pink-swirl/70 pt-8 border-t border-waxy-corn/10 w-full">
          &copy; {new Date().getFullYear()} Sunday Life movement. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
