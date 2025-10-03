import { motion } from 'framer-motion';

export const Link = ({
  href,
  external = false,
  children,
  className = '',
  ...props
}) => {
  const externalProps = external
    ? {
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : {};

  return (
    <motion.a
      href={href}
      className={`
        text-text-primary
        underline-offset-2
        decoration-border-primary
        decoration-[3px]
        inline-block
        ${className}
      `}
      initial={{ textDecoration: 'none' }}
      whileHover={{
        textDecoration: 'underline',
        x: 2,
      }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      {...externalProps}
      {...props}
    >
      {children}
    </motion.a>
  );
};
