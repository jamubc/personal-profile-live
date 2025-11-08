import { motion } from 'framer-motion';
import { useState } from 'react';

export const Link = ({
  href,
  external = false,
  children,
  className = '',
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <motion.a
      href={href}
      className={`
        text-text-primary
        inline-block
        relative
        font-bold
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
        rounded-sm
        ${className}
      `}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        x: 3,
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
      {...externalProps}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      {/* Animated underline with gradient */}
      <motion.span
        className="absolute left-0 right-0 bottom-0 h-[3px] bg-gradient-to-r from-border-primary to-border-primary/60 rounded-full"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        }}
      />

      {/* Subtle background glow on hover */}
      <motion.span
        className="absolute inset-0 -z-10 bg-bg-card-inline/80 backdrop-blur-sm rounded-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          duration: 0.2,
          ease: 'easeOut',
        }}
        style={{ padding: '2px 6px', margin: '-2px -6px' }}
      />

      {/* Outer glow effect */}
      <motion.span
        className="absolute -inset-x-2 -inset-y-1 bg-primary/5 blur-sm -z-20 rounded"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      />
    </motion.a>
  );
};
