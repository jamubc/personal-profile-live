import { motion } from 'framer-motion';

export const Card = ({
  variant = 'standard',
  className = '',
  children
}) => {
  const variants = {
    standard: 'bg-bg-card border-border-primary border-default shadow-brutal-lg p-card-md',
    featured: 'bg-bg-card-featured border-border-primary border-thick shadow-brutal-xl p-card-lg',
  };

  return (
    <motion.div
      className={`${variants[variant]} ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      {children}
    </motion.div>
  );
};
