/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    // Ensure proper React context isolation between tests
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
    // Ensure single React instance
    deps: {
      inline: ['react', 'react-dom'],
    },
  },
})