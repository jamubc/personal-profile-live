import { motion } from 'framer-motion';
import { TRANSITION_EASE } from '../../utils/motion';

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
      transition={{ duration: 0.2, ease: TRANSITION_EASE }}
    >
      {children}
    </motion.span>
  );
};
