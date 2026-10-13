import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Build stamp for the title block: short commit SHA (Vercel provides it; local falls back to git) and date.
const buildSha = (): string => {
  const fromEnv = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromEnv) return fromEnv.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'dev';
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
    __BUILD_SHA__: JSON.stringify(buildSha()),
  },
  build: {
    // Modern browsers only: skip polyfills.
    target: 'es2020',
    rollupOptions: {
      output: {
        // Long-lived, cacheable vendor chunk. Each Markdown write-up stays its own lazy chunk.
        manualChunks: { 'vendor-react': ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  // Prerender bundle: process these so their CSS imports and ESM entry points resolve.
  ssr: { noExternal: [/^@fontsource\//, 'react-router-dom'] },
});
