import { motion } from 'framer-motion';
import { useState } from 'react';

export const Tag = ({ children, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.span
      className={`
        inline-block
        px-3 py-1.5
        text-body-sm
        bg-bg-card-inline/80
        backdrop-blur-sm
        border-border-secondary/50
        border
        text-text-secondary
        relative
        overflow-hidden
        cursor-default
        rounded-md
        ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.08,
        y: -2,
        backgroundColor: 'var(--color-bg-card)',
        borderColor: 'var(--color-border-primary)',
        color: 'var(--color-text-primary)',
        boxShadow: '0 0 15px rgba(115, 115, 115, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
    >
      {/* Subtle glow effect */}
      <span className="absolute -inset-[1px] bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-200 -z-10 rounded-md" />

      {/* Shine effect on hover */}
      <motion.span
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-md"
        initial={{ x: '-100%' }}
        animate={{
          x: isHovered ? '100%' : '-100%',
        }}
        transition={{
          duration: 0.6,
          ease: 'easeInOut',
        }}
      />
      <span className="relative z-10">{children}</span>
    </motion.span>
  );
};
