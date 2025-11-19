import { useRef } from 'react';
import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/motion';
import { useFieldRepulsion } from '../../hooks/useFieldRepulsion';

export const Card = ({
  variant = 'standard',
  className = '',
  children,
  withPadding = true,
  useGlassShader = false, // Enable WebGL glass shader effect
  ...props
}) => {
  const cardRef = useRef(null);
  useFieldRepulsion(cardRef, { hasGlass: useGlassShader });

  const variants = {
    standard: 'glass-card-standard',
    featured: 'glass-card-featured',
    inline: 'glass-card-inline',
  };

  // When using glass shader, apply a special variant that works with WebGL
  const variantClass = useGlassShader ? 'glass-card-webgl' : variants[variant];

  return (
    <motion.div
      ref={cardRef}
      className={`transition-smooth ${variantClass} ${className}`}
      variants={itemVariants}
      whileHover={{
        y: -3,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      {...props}
    >
      <div className={`${withPadding ? 'p-6 md:p-8' : ''} h-full flex flex-col relative z-10`}>
        {children}
      </div>
    </motion.div>
  );
};
