/**
 * Standardized Motion Variants
 * Consolidated animation patterns for consistent, reusable Framer Motion animations
 * across the application.
 *
 * Usage:
 * import { container, item, scale, glow } from '@/utils/motionVariants';
 *
 * <motion.div variants={container.default} initial="hidden" animate="visible">
 *   <motion.div variants={item.fadeSlide} />
 * </motion.div>
 */

// Easing curves for consistent motion
export const easing = {
  smooth: [0.22, 1, 0.36, 1],
  snappy: [0.16, 1, 0.3, 1],
  spring: { type: 'spring', stiffness: 300, damping: 20 },
  gentle: [0.25, 0.46, 0.45, 0.94],
};

// Container variants for staggered child animations
export const container = {
  // Standard stagger with 0.1s delay between children
  default: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  },

  // Loose stagger with 0.15s delay between children
  loose: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },

  // Tight stagger for rapid sequential animations
  tight: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0,
      },
    },
  },

  // Scale variant - containers that scale in with stagger
  scale: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easing.snappy,
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  },
};

// Individual item variants
export const item = {
  // Basic fade and slide up animation
  fadeSlide: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easing.smooth,
      },
    },
  },

  // Fade and slide up with more distance
  fadeSlideUp: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: easing.smooth,
      },
    },
  },

  // Fade and slide from left
  fadeSlideLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easing.smooth,
      },
    },
  },

  // Fade and slide from right
  fadeSlideRight: {
    hidden: { opacity: 0, x: 40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: easing.smooth,
      },
    },
  },

  // Spring-based entrance animation
  spring: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        mass: 1,
      },
    },
  },

  // Stiff spring for snappier feel
  springStiff: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      },
    },
  },

  // Gentle bounce entrance
  bounce: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  },

  // Simple fade only
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeInOut',
      },
    },
  },
};

// Scale variants for emphasis and size changes
export const scale = {
  // Default scale animation (0.95 to 1)
  default: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easing.snappy,
      },
    },
  },

  // Larger scale entrance (0.9 to 1)
  large: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: easing.smooth,
      },
    },
  },

  // Minimal scale entrance (0.98 to 1)
  minimal: {
    hidden: { opacity: 0, scale: 0.98 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: easing.snappy,
      },
    },
  },

  // Spring-based scale for more dynamic feel
  spring: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 250,
        damping: 20,
      },
    },
  },
};

// Glow and emphasis variants
export const glow = {
  // Pulse glow effect
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },

  // Soft glow entrance
  entrance: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: easing.smooth,
      },
    },
  },

  // Brightness glow on hover
  hover: {
    whileHover: {
      scale: 1.05,
      boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)',
    },
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },

  // Rotating glow effect
  rotate: {
    animate: {
      rotate: [0, 360],
    },
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: 'linear',
    },
  },

  // Shimmer/shine effect
  shimmer: {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Preset combinations for common use cases
export const presets = {
  // Hero section entrance
  heroEntrance: {
    container: {
      hidden: { opacity: 0, scale: 0.98 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 1,
          ease: easing.snappy,
          staggerChildren: 0.18,
          delayChildren: 0.1,
        },
      },
    },
    item: item.fadeSlideUp,
  },

  // Card entrance
  cardEntrance: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: easing.smooth,
        scale: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
        },
      },
    },
  },

  // List item stagger
  listStagger: {
    container: container.default,
    item: item.fadeSlide,
  },

  // Feature cards stagger
  featureCards: {
    container: container.loose,
    item: item.spring,
  },

  // Smooth entrance for modals
  modalEntrance: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: easing.snappy,
      },
    },
  },
};

// Viewport animation config for scroll-triggered animations
export const viewportConfig = {
  once: true,
  margin: '-100px',
  amount: 0.3,
};

// Convenience hook configuration
export const defaultTransition = {
  duration: 0.6,
  ease: easing.smooth,
};

export default {
  container,
  item,
  scale,
  glow,
  easing,
  presets,
  viewportConfig,
  defaultTransition,
};
