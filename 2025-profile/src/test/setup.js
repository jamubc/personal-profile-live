import '@testing-library/jest-dom'
import { beforeAll } from 'vitest'
import React from 'react'

// Mock Three.js for testing
beforeAll(() => {
  // Mock requestAnimationFrame
  global.requestAnimationFrame = (cb) => setTimeout(cb, 16)
  global.cancelAnimationFrame = (id) => clearTimeout(id)

  // Mock ResizeObserver
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  // Create a basic document mock
  global.document = {
    getElementById: vi.fn(),
    body: {
      dataset: {},
      setAttribute: vi.fn(),
      removeAttribute: vi.fn()
    },
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    createElement: vi.fn(() => ({
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }),
      getContext: vi.fn()
    }))
  }

  // Mock window
  global.window = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    requestAnimationFrame: global.requestAnimationFrame,
    cancelAnimationFrame: global.cancelAnimationFrame
  }
})