import { motion, useMotionValue, useTransform } from 'framer-motion';

export const Card = ({
  variant = 'standard',
  className = '',
  children
}) => {
  const variants = {
    standard: 'bg-bg-card/95 backdrop-blur-sm border-border-primary/30 border shadow-brutal-lg p-card-md',
    featured: 'bg-bg-card-featured/95 backdrop-blur-md border-border-primary/40 border-2 shadow-brutal-xl p-card-lg',
  };

  const y = useMotionValue(0);
  const shadowY = useTransform(y, [-8, 0], [8, 4]);

  return (
    <motion.div
      className={`
        ${variants[variant]}
        ${className}
        rounded-xl
        relative
        overflow-hidden
        transition-shadow
        duration-300
        group
      `}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        scale: {
          type: 'spring',
          stiffness: 200,
          damping: 20,
        },
      }}
      whileHover={{
        y: -8,
        scale: 1.02,
        boxShadow: variant === 'featured'
          ? '0 0 30px rgba(10, 10, 10, 0.15), 12px 12px 0px 0px var(--color-border-primary)'
          : '0 0 20px rgba(10, 10, 10, 0.1), 8px 8px 0px 0px var(--color-border-primary)',
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 20,
        },
      }}
      style={{ y }}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl" />

      {/* Subtle noise texture for depth (very light) */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none rounded-xl" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }} />

      {/* Glow effect on hover */}
      <div className="absolute -inset-[1px] bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none rounded-xl -z-10" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
