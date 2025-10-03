import { motion } from 'framer-motion';

export const Tag = ({ children, className = '' }) => {
  return (
    <motion.span
      className={`
        inline-block
        px-3 py-1
        text-body-sm
        bg-bg-card-inline
        border-border-secondary
        border-thin
        text-text-secondary
        ${className}
      `}
      whileHover={{
        scale: 1.05,
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-primary)',
      }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
};
