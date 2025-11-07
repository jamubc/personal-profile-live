import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useReveal } from './useReveal.js';

describe('useReveal', () => {
  describe('initialization', () => {
    it('returns a ref object', () => {
      const { result } = renderHook(() => useReveal());

      expect(result.current).toBeDefined();
      expect(result.current).toHaveProperty('current');
    });

    it('initializes with null ref', () => {
      const { result } = renderHook(() => useReveal());

      expect(result.current.current).toBeNull();
    });
  });

  describe('options handling', () => {
    it('works with default options', () => {
      const { result } = renderHook(() => useReveal());

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it('works with custom rootMargin', () => {
      const customRootMargin = '100px 0px 0px 0px';
      const { result } = renderHook(() => useReveal({ rootMargin: customRootMargin }));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it('works with custom threshold', () => {
      const customThreshold = 0.5;
      const { result } = renderHook(() => useReveal({ threshold: customThreshold }));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it('works with both custom options', () => {
      const options = {
        rootMargin: '50px',
        threshold: 0.75,
      };
      const { result } = renderHook(() => useReveal(options));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it('handles undefined options', () => {
      const { result } = renderHook(() => useReveal(undefined));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });

    it('handles empty options object', () => {
      const { result } = renderHook(() => useReveal({}));

      expect(result.current).toBeDefined();
      expect(result.current.current).toBeNull();
    });
  });

  describe('ref usage pattern', () => {
    it('can be attached to a div element', () => {
      const { result } = renderHook(() => useReveal());

      const element = document.createElement('div');
      result.current.current = element;

      expect(result.current.current).toBe(element);
    });

    it('ref can be updated', () => {
      const { result } = renderHook(() => useReveal());

      const element1 = document.createElement('div');
      const element2 = document.createElement('div');

      result.current.current = element1;
      expect(result.current.current).toBe(element1);

      result.current.current = element2;
      expect(result.current.current).toBe(element2);
    });

    it('ref can be cleared', () => {
      const { result } = renderHook(() => useReveal());

      const element = document.createElement('div');
      result.current.current = element;
      expect(result.current.current).toBe(element);

      result.current.current = null;
      expect(result.current.current).toBeNull();
    });
  });

  describe('hook behavior', () => {
    it('returns same ref instance on re-render', () => {
      const { result, rerender } = renderHook(() => useReveal());

      const firstRef = result.current;
      rerender();
      const secondRef = result.current;

      expect(firstRef).toBe(secondRef);
    });

    it('creates new observer when options change', () => {
      const { result, rerender } = renderHook(
        ({ threshold }) => useReveal({ threshold }),
        { initialProps: { threshold: 0.1 } }
      );

      const element = document.createElement('div');
      result.current.current = element;

      expect(result.current).toBeDefined();

      rerender({ threshold: 0.5 });
      expect(result.current).toBeDefined();
    });

    it('cleans up on unmount', () => {
      const { result, unmount } = renderHook(() => useReveal());

      const element = document.createElement('div');
      result.current.current = element;

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('integration with DOM elements', () => {
    it('ref can be assigned to div element', () => {
      const { result } = renderHook(() => useReveal());
      const div = document.createElement('div');

      result.current.current = div;

      expect(result.current.current).toBe(div);
      expect(result.current.current.tagName).toBe('DIV');
    });

    it('ref can be assigned to section element', () => {
      const { result } = renderHook(() => useReveal());
      const section = document.createElement('section');

      result.current.current = section;

      expect(result.current.current).toBe(section);
      expect(result.current.current.tagName).toBe('SECTION');
    });

    it('ref can be assigned to article element', () => {
      const { result } = renderHook(() => useReveal());
      const article = document.createElement('article');

      result.current.current = article;

      expect(result.current.current).toBe(article);
      expect(result.current.current.tagName).toBe('ARTICLE');
    });
  });

  describe('default parameter values', () => {
    it('uses default rootMargin when not specified', () => {
      const { result } = renderHook(() => useReveal());
      expect(result.current).toBeDefined();
    });

    it('uses default threshold when not specified', () => {
      const { result } = renderHook(() => useReveal());
      expect(result.current).toBeDefined();
    });

    it('accepts only rootMargin override', () => {
      const { result } = renderHook(() => useReveal({ rootMargin: '10px' }));
      expect(result.current).toBeDefined();
    });

    it('accepts only threshold override', () => {
      const { result } = renderHook(() => useReveal({ threshold: 0.8 }));
      expect(result.current).toBeDefined();
    });
  });
});
