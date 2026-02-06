import { Menu, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);
  const mobileMenuOpenRef = useRef(isMobileMenuOpen);

  const closeMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    mobileMenuOpenRef.current = isMobileMenuOpen;
  }, [isMobileMenuOpen]);

  useEffect(() => {
    let frame = 0;

    const updateScrollState = () => {
      frame = 0;
      const next = window.scrollY > 20;

      setIsScrolled((prev) => (prev === next ? prev : next));

      if (mobileMenuOpenRef.current) {
        closeMenu();
      }
    };

    const handleScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollState);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!navRef.current) return;
      if (!navRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'Projects', href: '#projects' },
    { label: 'Skills', href: '#skills' },
  ];

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 font-mono pointer-events-none"
    >
      <div className="w-full max-w-5xl mx-auto px-4">
        <div
          style={{ willChange: 'transform, background, border-color, box-shadow, backdrop-filter' }}
          className={`
            pointer-events-auto
            flex items-center justify-between
            border-x border-white/10
            border-b
            transform-gpu
            transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
            motion-reduce:transition-none
            ${isScrolled
              ? 'bg-black/90 backdrop-blur-md py-3 sm:py-2 border-white/20 border-b-white/20 shadow-[0_18px_45px_rgba(1,2,8,0.75)] translate-y-0'
              : 'bg-black/20 backdrop-blur-xs py-5 sm:py-6 border-white/10 border-b-transparent shadow-none translate-y-1 sm:translate-y-2'
            }
          `}
        >
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group pl-6">

            </a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="text-xs uppercase tracking-widest text-white/60 hover:text-white transition-colors relative"
                >
                  {link.label}
                  {hoveredLink === link.label && (
                    <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary" />
                  )}
                </a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center pr-6">
            <a
              href="#contact"
              className="px-4 py-2 border border-white/20 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all bg-black/20 backdrop-blur-sm"
            >
              Hire Me
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden inline-flex items-center justify-center h-9 w-9 border border-white/20 text-white active:bg-white/10 mr-4 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="w-full max-w-5xl mx-auto px-4 pointer-events-auto">
           <div className="border-x border-b border-white/20 bg-black/95 backdrop-blur-xl text-center">
            <div className="py-4 space-y-4">
              {navLinks.map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="block py-2 text-sm uppercase tracking-widest text-white/70 hover:text-white hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 pb-2">
                 <a
                   href="#contact"
                   onClick={closeMenu}
                   className="inline-block px-6 py-2 border border-white/20 text-xs uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
                 >
                   Hire Me
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
