import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeAll, vi } from 'vitest'

// Mock Framer Motion to prevent context errors in tests
vi.mock('framer-motion', async () => {
  const React = await import('react')
  return {
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          const Component = React.forwardRef((props, ref) => {
            // eslint-disable-next-line no-unused-vars
            const { whileHover, whileInView, initial, animate, transition, viewport, ...domProps } = props
            return React.createElement(prop, { ...domProps, ref })
          })
          Component.displayName = `motion.${String(prop)}`
          return Component
        },
      }
    ),
    AnimatePresence: ({ children }) => children,
    MotionGlobalConfig: { skipAnimations: true },
  }
})

// Mock Three.js dependencies for testing
beforeAll(() => {
  // Mock requestAnimationFrame (if not already present)
  if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 16)
  }
  if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = (id) => clearTimeout(id)
  }

  // Mock ResizeObserver
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock IntersectionObserver
  globalThis.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }
})

// Cleanup after each test to prevent state leakage
afterEach(() => {
  cleanup()
})