import { forwardRef } from 'react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

export const Container = forwardRef(({ 
  className, 
  children, 
  size = 'lg', // sm, md, lg, xl, full
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cx(
        "app-container",
        `size-${size}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';
