import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'node:child_process';

// Build stamp for the title block: the short SHA and the commit date of the commit being built. Both come
// from git (Vercel also provides the SHA); the date is the commit's, so the client and the prerender
// builds (two processes) stamp the same value even across midnight.
const git = (args: string): string | null => {
  try {
    return execSync(`git ${args}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() || null;
  } catch {
    return null;
  }
};
const buildSha = (): string => process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? git('rev-parse --short HEAD') ?? 'dev';
const buildDate = (): string => git('log -1 --format=%cs') ?? new Date().toISOString().slice(0, 10);

// https://vitejs.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  define: {
    __BUILD_DATE__: JSON.stringify(buildDate()),
    __BUILD_SHA__: JSON.stringify(buildSha()),
  },
  build: {
    // Modern browsers only: skip polyfills.
    target: 'es2020',
    // One stylesheet, linked from the template, so prerendered HTML is fully styled before any route chunk loads.
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Long-lived, cacheable vendor chunk (client only: the prerender bundle keeps React external).
        // Each Markdown write-up stays its own lazy chunk.
        manualChunks: isSsrBuild ? undefined : { 'vendor-react': ['react', 'react-dom', 'react-router-dom'] },
      },
    },
  },
  // Prerender bundle: process these so their CSS imports and ESM entry points resolve.
  ssr: { noExternal: [/^@fontsource\//, 'react-router-dom'] },
}));
