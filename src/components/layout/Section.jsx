import { Container } from './Container';

// Simple class joiner
const cx = (...classes) => classes.filter(Boolean).join(' ');

export const Section = ({
  id,
  className,
  children,
  noDivider = false,
  fullWidth = false, // If true, passes size="full" to Container
  centered = false, // If true, applies flex-center to Container content
  variant = 'transparent', // transparent | primary | secondary
}) => {
  const variants = {
    transparent: 'bg-transparent',
    primary: 'bg-bg-primary',
    secondary: 'bg-bg-secondary',
  };

  return (
    <section
      id={id}
      className={cx(
        "app-section", 
        variants[variant] || variants.transparent,
        !noDivider && "section-divider",
        className
      )}
    >
      {/* Background/Decorations could go here */}
      
      <Container 
        size={fullWidth ? 'full' : 'lg'}
        className={cx(
          "relative z-10",
          centered && "text-center-flex"
        )}
      >
        {children}
      </Container>
    </section>
  );
};
