import { motion } from 'framer-motion';

export const Avatar = ({ initials = 'A', className = '' }) => {
  return (
    <motion.div
      className={`
        w-28 h-28 md:w-32 md:h-32
        bg-bg-card/95
        backdrop-blur-sm
        border-border-primary/40 border-2
        shadow-lg
        flex items-center justify-center
        text-h2 font-bold text-text-primary
        relative
        overflow-hidden
        rounded-2xl
        ${className}
      `}
      aria-label="Avatar"
      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 15,
        duration: 0.6,
      }}
      whileHover={{
        scale: 1.05,
        rotate: 2,
        boxShadow: '0 0 25px rgba(10, 10, 10, 0.2), 8px 8px 0px 0px var(--color-border-primary)',
      }}
      whileTap={{
        scale: 0.95,
        rotate: -2,
      }}
    >
      {/* Border gradient for premium feel */}
      <motion.div
        className="absolute inset-0 rounded-2xl p-[2px] bg-gradient-to-br from-border-primary/30 via-transparent to-border-primary/20"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMaskComposite: 'xor', maskComposite: 'exclude' }}
      />

      {/* Subtle background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect on hover */}
      <div className="absolute -inset-[2px] bg-gradient-to-br from-primary/10 to-transparent opacity-0 hover:opacity-100 blur-md transition-opacity duration-300 -z-10 rounded-2xl" />

      <span className="relative z-10">{initials}</span>
    </motion.div>
  );
};

