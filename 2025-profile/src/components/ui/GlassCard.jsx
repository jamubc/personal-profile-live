import React from 'react';
import { motion } from 'framer-motion';

/**
 * GlassCard Component - A modern glassmorphism component with multiple variants
 *
 * @component
 * @example
 * // Default variant
 * <GlassCard>
 *   <h2>Card Title</h2>
 *   <p>Card content goes here</p>
 * </GlassCard>
 *
 * @example
 * // With gradient border
 * <GlassCard variant="gradient-border" hoverEffect="lift">
 *   Content here
 * </GlassCard>
 *
 * @example
 * // With glow effect
 * <GlassCard variant="glow" glowColor="purple" hoverEffect="glow">
 *   Glowing card content
 * </GlassCard>
 */

const GlassCard = ({
  variant = 'default',
  className = '',
  children,
  hoverEffect = 'none',
  glowColor = 'blue',
  padding = 'p-6',
}) => {
  // Variant-specific base styles
  const variantStyles = {
    default: 'bg-white/5 border border-white/10',
    'gradient-border': 'bg-white/5 border-2 border-transparent bg-clip-padding',
    accent: 'bg-white/10 border border-white/20',
    glow: 'bg-white/5 border border-white/10',
  };

  // Gradient border styles using CSS backgrounds
  const gradientBorderClasses = {
    default: '',
    'gradient-border':
      'relative overflow-hidden before:absolute before:inset-0 before:rounded-lg before:p-[1px] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:pointer-events-none',
    accent: '',
    glow: '',
  };

  // Glow color variants
  const glowColorStyles = {
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    purple: 'shadow-[0_0_20px_rgba(147,51,234,0.3)]',
    pink: 'shadow-[0_0_20px_rgba(236,72,153,0.3)]',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    cyan: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
  };

  // Hover effect animations
  const hoverVariants = {
    none: { whileHover: {} },
    lift: {
      whileHover: { y: -5 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    scale: {
      whileHover: { scale: 1.02 },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    glow: {
      whileHover: {
        boxShadow:
          variant === 'glow'
            ? `0 0 30px rgba(${getGlowRGB(glowColor)}, 0.5)`
            : undefined,
      },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    brighten: {
      whileHover: { background: 'rgba(255, 255, 255, 0.08)' },
      transition: { duration: 0.3, ease: 'easeOut' },
    },
  };

  // Get RGB values for glow effect
  const getGlowRGB = (color) => {
    const rgbMap = {
      blue: '59, 130, 246',
      purple: '147, 51, 234',
      pink: '236, 72, 153',
      green: '34, 197, 94',
      cyan: '34, 211, 238',
    };
    return rgbMap[color] || rgbMap.blue;
  };

  // Combine all styles
  const baseStyles = 'rounded-lg backdrop-blur-2xl transition-all duration-300';
  const hoverEffectClass =
    hoverEffect !== 'none' ? 'hover:border-white/20 cursor-pointer' : '';
  const glowClass = variant === 'glow' ? glowColorStyles[glowColor] : '';
  const variantClass = variantStyles[variant];
  const gradientClass = gradientBorderClasses[variant];

  const finalClassName = `${baseStyles} ${variantClass} ${glowClass} ${hoverEffectClass} ${gradientClass} ${className}`.trim();

  // Initial animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  // Apply hover effects
  const hoverConfig = hoverVariants[hoverEffect] || hoverVariants.none;

  return (
    <motion.div
      className={finalClassName}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      {...hoverConfig}
      whileTap={{ scale: 0.98 }}
    >
      {/* Inner content wrapper with padding and relative positioning */}
      <div className={`relative z-10 ${padding}`}>
        {children}
      </div>

      {/* Gradient border overlay for gradient-border variant */}
      {variant === 'gradient-border' && (
        <div
          className="absolute inset-0 rounded-lg p-[1px] pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />
      )}

      {/* Glow effect overlay for glow variant */}
      {variant === 'glow' && (
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
          style={{
            boxShadow: `inset 0 0 20px rgba(${getGlowRGB(glowColor)}, 0.2)`,
          }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

// Default props
GlassCard.defaultProps = {
  variant: 'default',
  className: '',
  hoverEffect: 'none',
  glowColor: 'blue',
  padding: 'p-6',
};

export default GlassCard;
