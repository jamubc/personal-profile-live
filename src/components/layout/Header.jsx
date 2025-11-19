import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from './Container';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (e, href) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  // Standard scroll spy implementation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-50% 0px -50% 0px',
        threshold: 0,
      }
    );

    const sections = ['about', 'skills', 'projects', 'contact']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <header className="bg-bg-primary/80 backdrop-blur-md border-b border-b-border-primary h-nav sticky top-0 z-50 transition-all duration-300">
      <Container className="h-full flex items-center justify-between">
        {/* Logo/Name */}
        <a
          href="#"
          className="text-h4 font-bold text-text-primary hover:text-accent-primary transition-colors duration-300"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Developer Portfolio
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <motion.a
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  text-body-sm font-medium relative tracking-wide
                  ${isActive ? 'text-text-primary' : 'text-text-secondary hover:text-text-primary'}
                `}
                onClick={(e) => scrollToSection(e, item.href)}
                transition={{ duration: 0.2 }}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    className="absolute left-0 right-0 -bottom-1 h-[2px] bg-accent-primary shadow-glow-sm"
                    layoutId="navIndicator"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30
                    }}
                  />
                )}
              </motion.a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-primary p-2 hover:bg-bg-card-inline rounded-md transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </Container>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-nav bg-bg-primary/95 backdrop-blur-xl z-40 border-t border-border-primary"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <motion.nav
            className="flex flex-col items-start p-8 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    text-h3 font-bold pl-4 border-l-2
                    ${isActive
                      ? 'text-text-primary border-l-accent-primary'
                      : 'text-text-secondary border-l-transparent hover:text-text-primary hover:border-l-border-secondary'}
                  `}
                  onClick={(e) => scrollToSection(e, item.href)}
                  variants={{
                    hidden: { opacity: 0, x: -10 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.a>
              );
            })}
          </motion.nav>
        </motion.div>
      )}
    </header>
  );
};
