import { motion } from 'framer-motion';

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary text-text-inverse border-border-dark shadow-brutal-md',
    secondary: 'bg-secondary text-text-primary border-border-primary shadow-brutal-light-md',
  };

  return (
    <motion.button
      className={`
        px-8 py-4
        font-bold
        border-default
        rounded-none
        ${variants[variant]}
        ${className}
      `}
      whileHover={{
        scale: 1.02,
        boxShadow: variant === 'primary'
          ? '2px 2px 0px 0px var(--color-border-dark)'
          : '2px 2px 0px 0px var(--color-border-primary)',
      }}
      whileTap={{
        scale: 0.98,
        boxShadow: 'none',
      }}
      transition={{
        duration: 0.15,
        ease: [0.2, 0.8, 0.2, 1],
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};
