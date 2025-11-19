import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

/**
 * SmoothScroll component that initializes Lenis for smooth momentum scrolling.
 * Integrated with GSAP ticker for optimal performance.
 * Handles anchor links for consistent smooth scrolling.
 */
export const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    // Sync Lenis with GSAP Ticker
    const update = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Handle anchor links
    const handleAnchorClick = (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      e.preventDefault();
      
      // Special handling for "Back to Top" or empty hash
      if (href === '#') {
        lenis.scrollTo(0);
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        lenis.scrollTo(target, {
          offset: -100, // Match scroll-padding-top from CSS
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      gsap.ticker.remove(update);
      document.removeEventListener('click', handleAnchorClick);
      lenis.destroy();
    };
  }, []);

  return null;
};
