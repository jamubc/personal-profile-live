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
    observe() { }
    unobserve() { }
    disconnect() { }
  }

  // Mock IntersectionObserver
  global.IntersectionObserver = class IntersectionObserver {
    constructor() { }
    observe() { }
    unobserve() { }
    disconnect() { }
  }
})