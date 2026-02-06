import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Smooth transform: buttons rise from below and fade in based on scroll
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 1]);

  const links = [
    { href: 'mailto:hello@2025.dev', label: 'Email', external: false },
    { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
    { href: 'https://github.com', label: 'GitHub', external: true },
  ];

  return (
    <section ref={sectionRef} id="contact" className="relative font-mono py-24 sm:py-32">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="flex justify-center items-center gap-4 sm:gap-6"
          style={{ y, opacity }}
        >
          {links.map((link) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="px-10 py-5 border border-white/20 hover:border-white/50 text-white/70 hover:text-white text-xl tracking-wide transition-all duration-300"
              whileHover={{ y: -4 }}
            >
              {link.label}
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
