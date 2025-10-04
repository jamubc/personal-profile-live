import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
    <header className="bg-bg-primary border-b-border-primary border-b-thick h-nav sticky top-0 z-50">
      <div className="container mx-auto page-gutter h-full flex items-center justify-between">
        {/* Logo/Name */}
        <a
          href="#"
          className="text-h4 font-bold text-text-primary"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Header Text Here
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <motion.a
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  text-body font-bold relative
                  ${isActive ? 'text-text-primary' : 'text-text-secondary'}
                `}
                onClick={(e) => scrollToSection(e, item.href)}
                whileHover={{ color: 'var(--color-text-primary)' }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
                <motion.span
                  className="absolute left-0 right-0 bottom-[-6px] h-[3px] bg-border-primary"
                  initial={false}
                  animate={{
                    scaleX: isActive ? 1 : 0,
                    originX: 0,
                  }}
                  transition={{
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              </motion.a>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-8 h-8"
              fill="none"
              strokeWidth="3"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              fill="none"
              strokeWidth="3"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-nav bg-bg-overlay opacity-95 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.95 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.nav
            className="flex flex-col items-start p-8 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.1,
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
                    text-h3 font-bold pl-4 border-l-[3px]
                    ${isActive
                      ? 'text-text-primary border-l-border-primary'
                      : 'text-text-secondary border-l-border-secondary'}
                  `}
                  onClick={(e) => scrollToSection(e, item.href)}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  whileHover={{
                    borderLeftWidth: '6px',
                    paddingLeft: '14px',
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
