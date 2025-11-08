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
    <header className="bg-bg-primary/95 backdrop-blur-md border-b-border-primary/30 border-b-2 h-nav sticky top-0 z-50 shadow-sm">
      <div className="page-gutter h-full flex items-center justify-between">
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
                  text-body font-bold relative rounded-sm px-1
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
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
        <motion.button
          className="md:hidden text-text-primary p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 17,
          }}
        >
          <motion.div
            animate={mobileMenuOpen ? 'open' : 'closed'}
            initial={false}
          >
            {mobileMenuOpen ? (
              <motion.svg
                className="w-8 h-8"
                fill="none"
                strokeWidth="3"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M6 18L18 6M6 6l12 12"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </motion.svg>
            ) : (
              <motion.svg
                className="w-8 h-8"
                fill="none"
                strokeWidth="3"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.path
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  d="M4 6h16M4 12h16M4 18h16"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </motion.svg>
            )}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden fixed inset-0 top-nav bg-bg-overlay/95 backdrop-blur-lg z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.nav
            className="flex flex-col items-start page-gutter py-12 gap-6 w-full"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.08,
                  delayChildren: 0.1,
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
                    text-h3 font-bold pl-4 border-l-[3px] relative
                    ${isActive
                      ? 'text-text-primary border-l-border-primary'
                      : 'text-text-secondary border-l-border-secondary'}
                  `}
                  onClick={(e) => scrollToSection(e, item.href)}
                  variants={{
                    hidden: { opacity: 0, x: -30, scale: 0.9 },
                    visible: {
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: {
                        type: 'spring',
                        stiffness: 300,
                        damping: 24,
                      },
                    },
                  }}
                  whileHover={{
                    x: 4,
                    borderLeftWidth: '6px',
                    paddingLeft: '14px',
                    color: 'var(--color-text-primary)',
                    transition: {
                      type: 'spring',
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                >
                  {/* Hover background effect */}
                  <motion.span
                    className="absolute -left-1 -right-4 -top-2 -bottom-2 bg-bg-card-inline rounded-md -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
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
