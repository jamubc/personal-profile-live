import { motion } from 'framer-motion';
import { hoverScaleVariants } from '../../utils/motion';

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary text-text-inverse border border-transparent shadow-md hover:shadow-glow-sm hover:bg-opacity-90',
    secondary: 'bg-secondary text-text-primary border border-border-primary shadow-sm hover:border-border-secondary hover:bg-bg-tertiary',
    outline: 'bg-transparent text-text-primary border border-border-primary hover:border-accent-primary hover:text-accent-primary',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-card-inline',
  };

  return (
    <motion.button
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
