import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// Custom plugin to inject security headers as meta tags
// Note: In production, use server-side headers (netlify.toml/vercel.json) for full CSP support
function securityHeadersPlugin() {
  return {
    name: 'security-headers',
    transformIndexHtml(html) {
      const isDev = process.env.NODE_ENV !== 'production'

      // Development: Relaxed CSP to allow Vite HMR and inline scripts
      // Production: Strict CSP (but prefer server-side headers for frame-ancestors support)
      const cspContent = isDev
        ? "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://img.shields.io data: blob:; connect-src 'self' ws: wss:;"
        : "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://img.shields.io data: blob:; connect-src 'self';"

      const securityHeaders = `
    <meta http-equiv="Content-Security-Policy" content="${cspContent}">
    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta name="referrer" content="strict-origin-when-cross-origin">`

      return html.replace('<head>', '<head>' + securityHeaders)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), glsl(), securityHeadersPlugin()],
  build: {
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
})
