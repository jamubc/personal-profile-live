import { Zap, Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', closeMenu);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', closeMenu);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50" ref={navRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-center justify-between rounded-full border border-white/10 bg-dark/80 px-5 py-3 backdrop-blur-2xl shadow-soft">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 border border-white/10 group-hover:border-primary/60 transition-colors">
              <Zap className="w-6 h-6 text-primary group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-gray-500">Portfolio</p>
              <span className="text-lg font-semibold bg-gradient-to-r from-white via-primary to-secondary bg-clip-text text-transparent">
                Andrew
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`group text-sm font-medium text-gray-300 hover:text-white transition-all flex items-center gap-2 ${
                  hoveredLink && hoveredLink !== link.label ? 'blur-sm opacity-50' : ''
                }`}
              >
                <span className="hidden lg:inline-flex h-1.5 w-1.5 rounded-full bg-white/10 group-hover:bg-primary" />
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onMouseEnter={() => setHoveredLink('hire-me')}
              onMouseLeave={() => setHoveredLink(null)}
              className={`px-5 py-2 rounded-full bg-gradient-to-r from-primary/80 to-secondary/70 text-dark font-semibold shadow-glow transition-all hover:-translate-y-0.5 ${
                hoveredLink && hoveredLink !== 'hire-me' ? 'blur-sm opacity-50' : ''
              }`}
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/5 border border-white/10 text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-3">
          <div className="rounded-3xl border border-white/10 bg-dark/80 backdrop-blur-2xl shadow-soft overflow-hidden">
            <div className="px-6 pt-4 pb-6 space-y-2">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className={`block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-2xl border border-transparent hover:border-white/10 transition-all ${
                    hoveredLink && hoveredLink !== link.label ? 'blur-sm opacity-50' : ''
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={closeMenu}
                onMouseEnter={() => setHoveredLink('hire-me')}
                onMouseLeave={() => setHoveredLink(null)}
                className={`block w-full text-center rounded-full bg-gradient-to-r from-primary/80 to-secondary/70 text-dark font-semibold py-3 shadow-glow mt-3 transition-all ${
                  hoveredLink && hoveredLink !== 'hire-me' ? 'blur-sm opacity-50' : ''
                }`}
              >
                Hire Me
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
