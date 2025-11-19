import { createContext, useContext, useEffect } from 'react';

export const FieldRepulsionContext = createContext(null);

export function useFieldRepulsion(elementRef) {
  const context = useContext(FieldRepulsionContext);

  useEffect(() => {
    if (!context || !elementRef.current) return;

    const updatePosition = () => {
      const rect = elementRef.current.getBoundingClientRect();
      const normalizedRect = {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
        width: rect.width / window.innerWidth,
        height: rect.height / window.innerHeight
      };
      context.registerElement(elementRef.current, normalizedRect);
    };

    updatePosition();

    const currentElement = elementRef.current;
    const observer = new ResizeObserver(updatePosition);
    observer.observe(currentElement);

    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
      context.unregisterElement(currentElement);
    };
  }, [context, elementRef]);
}