import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';
import { preloadRoute } from '../lib/route-cache';

/** In-site link: a react-router Link that preloads the destination chunk and data on hover and focus. */
export const AppLink = forwardRef<HTMLAnchorElement, LinkProps>(function AppLink({ to, onPointerEnter, onFocus, ...rest }, ref) {
  const path = typeof to === 'string' ? to : (to.pathname ?? '');
  return (
    <Link
      ref={ref}
      to={to}
      onPointerEnter={(e) => {
        void preloadRoute(path);
        onPointerEnter?.(e);
      }}
      onFocus={(e) => {
        void preloadRoute(path);
        onFocus?.(e);
      }}
      {...rest}
    />
  );
});
