import { motion } from 'framer-motion';
import { itemVariants } from '../../utils/motion';

export const Card = ({
  variant = 'standard',
  className = '',
  children,
  ...props
}) => {
  const variants = {
    standard: 'bg-bg-card backdrop-blur-md border border-border-primary shadow-soft-sm hover:shadow-glow-sm hover:border-accent-primary/30 rounded-2xl',
    featured: 'bg-bg-card-featured backdrop-blur-xl border border-border-secondary shadow-soft-md hover:shadow-glow-md rounded-3xl',
    inline: 'bg-bg-card-inline border border-border-muted rounded-lg hover:bg-white/5',
  };

  return (
    <motion.div
      className={`overflow-hidden transition-smooth ${variants[variant]} ${className}`}
      variants={itemVariants}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
      }}
      {...props}
    >
      <div className="p-6 md:p-8 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
};
