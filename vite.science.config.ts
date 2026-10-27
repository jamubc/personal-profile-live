import { defineConfig } from 'vite'
import { resolve } from 'node:path'

// Science MPA — separate build graph from the profile SPA.
// Output: dist/science/ after profile has already written dist/.
// NEVER reverse build order (profile emptyOutDir wipes dist/).
export default defineConfig({
  base: '/science/',
  // Keep config at repo root; HTML entries under science/
  root: resolve(__dirname, 'science'),
  publicDir: false,
  build: {
    outDir: resolve(__dirname, 'dist/science'),
    emptyOutDir: true,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'science/index.html'),
        stub: resolve(__dirname, 'science/stub/index.html'),
        linalg: resolve(__dirname, 'science/linalg/index.html'),
      },
    },
  },
  server: {
    port: 5174,
    strictPort: true,
  },
  preview: {
    port: 4174,
    strictPort: true,
  },
})
