import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TRANSITION_EASE } from '../../utils/motion';

export const CyclingText = ({ phrases, interval = 3000, className = '' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, interval);
    return () => clearInterval(timer);
  }, [phrases.length, interval]);

  return (
    <span className={`inline-block ${className}`} style={{ minHeight: '1.2em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          exit={{ opacity: 0, y: -20, rotateX: 90 }}
          transition={{
            duration: 0.5,
            ease: TRANSITION_EASE,
          }}
          className="inline-block"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};
