import { useRef } from 'react';
import { motion } from 'framer-motion';
import { hoverScaleVariants } from '../../utils/motion';
import { useFieldRepulsion } from '../../hooks/useFieldRepulsion';

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const buttonRef = useRef(null);
  useFieldRepulsion(buttonRef);

  const variantStyles = {
    primary: 'bg-accent-primary text-white border border-transparent shadow-md hover:shadow-glow-sm hover:bg-accent-primary-hover',
    secondary: 'bg-bg-card-featured/80 backdrop-blur-xl text-text-primary border border-border-secondary shadow-sm hover:border-border-primary hover:bg-bg-card-featured',
    outline: 'bg-transparent text-text-primary border border-border-primary hover:border-accent-primary hover:text-accent-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-card-inline',
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`
        relative overflow-hidden
        px-6 py-3
        font-semibold text-body-sm
        rounded-lg
        transition-colors duration-200
        flex items-center justify-center gap-2
        ${variantStyles[variant] || variantStyles.primary}
        ${className}
      `}
      variants={hoverScaleVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    >
      {children}
    </motion.button>
  );
};
