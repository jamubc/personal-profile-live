import { motion } from 'framer-motion';
import { useState } from 'react';

export const Button = ({
  variant = 'primary',
  className = '',
  children,
  disabled = false,
  loading = false,
  ...props
}) => {
  const [ripples, setRipples] = useState([]);

  const variants = {
    primary: 'bg-primary text-text-inverse border-border-dark shadow-brutal-md transition-colors hover:bg-text-inverse hover:text-primary',
    secondary: 'bg-secondary text-text-primary border-border-primary shadow-brutal-light-md',
    ghost: 'bg-transparent text-text-primary border-2 border-border-primary transition-all hover:bg-border-primary hover:text-text-inverse',
    gradient: 'bg-gradient-to-r from-purple-500 to-cyan-500 text-text-inverse border-border-dark shadow-brutal-md transition-all hover:shadow-lg',
    icon: 'bg-primary text-text-inverse border-border-dark shadow-brutal-md rounded-full aspect-square p-0 w-12 h-12 transition-colors hover:bg-text-inverse hover:text-primary flex items-center justify-center',
  };

  const isDisabled = disabled || loading;

  const createRipple = (event) => {
    if (isDisabled) return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <motion.button
      className={`
        ${variant === 'icon' ? '' : 'px-8 py-4'}
        font-bold
        border-default
        ${variant !== 'icon' ? 'rounded-lg' : ''}
        relative
        overflow-hidden
        ${variants[variant]}
        ${className}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      whileHover={!isDisabled ? {
        scale: 1.02,
        y: -2,
        boxShadow: variant === 'primary'
          ? '0 0 20px rgba(10, 10, 10, 0.3), 4px 4px 0px 0px var(--color-border-dark)'
          : '0 0 20px rgba(115, 115, 115, 0.2), 4px 4px 0px 0px var(--color-border-primary)',
      } : {}}
      whileTap={!isDisabled ? {
        scale: 0.98,
        y: 0,
        boxShadow: 'none',
      } : {}}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      onClick={createRipple}
      disabled={isDisabled}
      {...props}
    >
      {/* Subtle gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-lg" />

      {/* Ripple effect */}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}

      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading && (
          <motion.span
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        )}
        {children}
      </span>
    </motion.button>
  );
};
