import { motion } from 'framer-motion';
import { Link } from '../ui/Link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { label: 'GitHub', href: 'https://github.com/jamubc' },
    { label: 'LinkedIn', href: 'https://linkedin.com/in/yourusername' },
    { label: 'Email', href: 'mailto:your.email@example.com' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24,
      },
    },
  };

  return (
    <footer className="bg-bg-primary/95 backdrop-blur-md border-t-border-primary/30 border-t-2 py-12 mt-24 shadow-sm">
      <div className="page-gutter">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {/* Social Links */}
          <motion.div className="flex flex-wrap gap-6" variants={itemVariants}>
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.1,
                  type: 'spring',
                  stiffness: 300,
                  damping: 24,
                }}
              >
                <Link href={link.href} external>
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Copyright */}
          <motion.div
            className="text-body-sm text-text-secondary"
            variants={itemVariants}
          >
            © {currentYear} jamubc. All rights reserved.
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};
