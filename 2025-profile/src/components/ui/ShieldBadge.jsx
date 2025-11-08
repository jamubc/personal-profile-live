import { motion } from 'framer-motion';

export const ShieldBadge = ({
  href,
  src,
  alt,
  className = '',
}) => {
  const img = (
    <motion.img
      src={src}
      alt={alt}
      className={`inline-block h-6 rounded ${className}`}
      loading="lazy"
      decoding="async"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        scale: 1.1,
        y: -2,
        filter: 'brightness(1.05)',
      }}
      whileTap={{
        scale: 0.95,
      }}
    />
  );

  if (href) {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary rounded"
        whileHover={{
          x: 2,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 25,
        }}
      >
        {/* Subtle glow on hover */}
        <motion.span
          className="absolute -inset-1 bg-primary/10 blur-sm -z-10 rounded"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        {img}
      </motion.a>
    );
  }

  return img;
};

