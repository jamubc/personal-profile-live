// Unified Motion Constants
// Design Goal: Modern, fluid, responsive.

// Standard transition timing
export const TRANSITION_EASE = [0.25, 0.1, 0.25, 1]; // Smooth cubic bezier
export const TRANSITION_SPRING = {
  type: "spring",
  stiffness: 400,
  damping: 30
};

// Container Stagger
export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Item Fade In Up
export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: TRANSITION_EASE,
    },
  },
};

// Interactive Elements (Buttons, Cards)
export const hoverScaleVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: TRANSITION_EASE }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1, ease: TRANSITION_EASE }
  }
};

export const cardHoverVariants = {
  rest: { y: 0, boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1)" },
  hover: { 
    y: -4,
    boxShadow: "0px 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)",
    transition: { duration: 0.3, ease: TRANSITION_EASE }
  }
};
