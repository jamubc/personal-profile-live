import { Mail, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

export const Contact = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.12, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  const links = [
    {
      href: 'mailto:hello@2025.dev',
      icon: Mail,
      label: 'Email',
      sub: 'Send me a message',
      external: false,
    },
    {
      href: 'https://linkedin.com',
      icon: Linkedin,
      label: 'LinkedIn',
      sub: 'Connect with me',
      external: true,
    },
    {
      href: 'https://github.com',
      icon: Github,
      label: 'GitHub',
      sub: 'See the code',
      external: true,
    },
  ];

  return (
    <section id="contact" className="relative font-mono">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 w-full pt-16 pb-20">
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          {links.map((link, i) => (
            <motion.a
              key={link.label}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
              className="group flex-1 flex items-center gap-5 p-6 border border-white/10 hover:border-white/30 bg-transparent hover:bg-white/[0.03] transition-all duration-300"
              variants={cardVariants}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <link.icon className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
              <div>
                <span className="text-sm text-white/90 group-hover:text-white transition-colors">{link.label}</span>
                <span className="block text-[11px] text-white/30 mt-0.5">{link.sub}</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
