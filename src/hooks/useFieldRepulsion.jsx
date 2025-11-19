import { createContext, useContext, useEffect, useState, useCallback, useMemo, useId } from 'react';

export const FieldRepulsionContext = createContext(null);

export function FieldRepulsionProvider({ children }) {
  const [elements, setElements] = useState([]);

  const registerElement = useCallback((id, metadata) => {
    setElements(prev => {
      const existing = prev.find(el => el.id === id);
      if (existing && 
          existing.x === metadata.x && 
          existing.y === metadata.y && 
          existing.width === metadata.width && 
          existing.height === metadata.height) {
        return prev;
      }
      return [...prev.filter(el => el.id !== id), { id, ...metadata }];
    });
  }, []);

  const unregisterElement = useCallback((id) => {
    setElements(prev => prev.filter(el => el.id !== id));
  }, []);

  const value = useMemo(() => ({
    elements,
    registerElement,
    unregisterElement
  }), [elements, registerElement, unregisterElement]);

  return (
    <FieldRepulsionContext.Provider value={value}>
      {children}
    </FieldRepulsionContext.Provider>
  );
}

export function useFieldRepulsion(elementRef, options = {}) {
  const context = useContext(FieldRepulsionContext);
  const registerElement = context?.registerElement;
  const unregisterElement = context?.unregisterElement;

  const id = useId();

  useEffect(() => {
    if (!registerElement || !unregisterElement || !elementRef.current) return;

    const el = elementRef.current;

    const updatePosition = () => {
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const scrollY = window.scrollY;
      const invW = 1.0 / window.innerWidth;
      const invH = 1.0 / window.innerHeight;

      // Calculate absolute center position normalized to viewport
      // We use absolute position + scroll so the shader handles the scrolling logic
      const docTop = rect.top + scrollY;
      const docCenterY = docTop + rect.height * 0.5;
      const centerX = (rect.left + rect.width * 0.5);

      const metadata = {
        x: centerX * invW,
        y: docCenterY * invH,
        width: rect.width * invW,
        height: rect.height * invH,
        ...options // Include custom options like hasGlass
      };

      registerElement(id, metadata);
    };

    // Initial update
    updatePosition();

    // Only update on resize, not scroll (since we store absolute position)
    const observer = new ResizeObserver(updatePosition);
    observer.observe(el);
    window.addEventListener('resize', updatePosition, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updatePosition);
      unregisterElement(id);
    };
  }, [registerElement, unregisterElement, elementRef, id]);
}
