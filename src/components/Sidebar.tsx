import { useState } from 'react';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Projects', href: '#projects' },
  { label: 'Creative', href: '#engineering' },
  { label: 'Works', href: '/works' },
  { label: 'Contact', href: '#contact' },
];

export const Sidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const closeMobile = () => setIsMobileOpen(false);

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Identity Block */}
      <div className="px-6 pt-8 pb-6 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tight uppercase leading-tight">
          Andrew
        </div>
        <p className="text-[11px] text-white/70 uppercase tracking-[0.2em] mt-2 leading-relaxed">
          Electrical Engineering<br />Student
        </p>
      </div>

      {/* Decorative Technical Lines */}
      <div className="px-6 py-6 border-b border-white/10 flex items-center justify-center">
        <svg className="w-full max-w-[140px] aspect-square opacity-30" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 2" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6">
        {/* CTA */}
        <div className="px-6 pb-8">
          <a
            href="#contact"
            onClick={closeMobile}
            className="block w-full text-center px-4 py-3 border border-white/20 text-[11px] uppercase tracking-[0.2em] text-white hover:bg-white hover:text-black transition-all bg-black/20"
          >
            Hire Me
          </a>
        </div>
        <ul className="space-y-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                onClick={closeMobile}
                onMouseEnter={() => setHoveredLink(link.label)}
                onMouseLeave={() => setHoveredLink(null)}
                className="group flex items-center gap-3 px-3 py-3 text-xs uppercase tracking-[0.2em] text-white/70 hover:text-white transition-colors relative"
              >
                <span
                  className={`h-px transition-all duration-300 ${hoveredLink === link.label
                      ? 'w-6 bg-white'
                      : 'w-3 bg-white/30'
                    }`}
                />
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Social Links — arch layout */}
      <div className="mt-auto pb-8 flex justify-center">
        <div className="flex items-end gap-5">
          <a href="https://github.com/jamubc" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors mb-3">
            <Github className="w-[18px] h-[18px]" />
          </a>
          <a href="https://www.linkedin.com/in/jandrewmanson/" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors mb-0">
            <Linkedin className="w-[18px] h-[18px]" />
          </a>
          <a href="mailto:andrew@jandrewmanson.engineer" className="text-white/40 hover:text-white transition-colors mb-3">
            <Mail className="w-[18px] h-[18px]" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — fixed left */}
      <aside className="hidden md:flex fixed top-0 left-0 bottom-0 w-60 z-40 flex-col border-r border-white/10 bg-black/60 backdrop-blur-md font-mono text-white/90">
        {sidebarContent}
      </aside>

      {/* Mobile: hamburger toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 inline-flex items-center justify-center h-10 w-10 border border-white/20 bg-black/80 backdrop-blur-sm text-white"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Mobile Sidebar overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="md:hidden fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
              onClick={closeMobile}
            />

            {/* Panel */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 260 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-64 z-50 flex flex-col border-r border-white/10 bg-black/95 backdrop-blur-xl font-mono text-white/90"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
