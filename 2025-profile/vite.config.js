import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import glsl from 'vite-plugin-glsl'

// Custom plugin to inject security headers as meta tags
function securityHeadersPlugin() {
  return {
    name: 'security-headers',
    transformIndexHtml(html) {
      const securityHeaders = `
    <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https://img.shields.io data: blob:; connect-src 'self'; frame-ancestors 'none';">
    <meta http-equiv="X-Frame-Options" content="DENY">
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
