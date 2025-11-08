import { render } from '@testing-library/react'
import { useState } from 'react'

/**
 * Custom hook testing utility for Vitest + React 19
 * Workaround for renderHook compatibility issues
 */
export function renderCustomHook(hook, options = {}) {
  const { initialProps = {} } = options
  const results = { current: null, error: null }

  function TestComponent({ hookProps = initialProps }) {
    try {
      // Store the hook result and preserve it
      const hookResult = hook(hookProps)
      results.current = hookResult
      results.error = null
    } catch (error) {
      results.current = null
      results.error = error
    }
    return null
  }

  const renderResult = render(<TestComponent />)

  return {
    result: results,
    rerender: (newProps) => {
      renderResult.rerender(<TestComponent hookProps={newProps} />)
    },
    unmount: renderResult.unmount,
  }
}

/**
 * Standard render function with any custom providers
 */
export function renderWithProviders(ui, options = {}) {
  return render(ui, {  ...options })
}

export * from '@testing-library/react'
