/** @type {import('tailwindcss').Config} */
// Tokens are solid colours behind CSS variables (see src/index.css). Do not use opacity modifiers
// such as text-ink/60: every tint on the site is a named token.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}', './harness/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '480px', md: '768px', lg: '1100px', xl: '1360px' },
    borderRadius: { none: '0', DEFAULT: '0' },
    boxShadow: { none: 'none' },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      paper: { DEFAULT: 'var(--paper)', 2: 'var(--paper-2)', 3: 'var(--paper-3)' },
      plate: 'var(--plate-light)',
      ink: { DEFAULT: 'var(--ink)', 2: 'var(--ink-2)', 3: 'var(--ink-3)', 4: 'var(--ink-4)' },
      rule: { DEFAULT: 'var(--rule)', strong: 'var(--rule-strong)', ui: 'var(--rule-ui)' },
      pen: { DEFAULT: 'var(--pen)', hover: 'var(--pen-hover)' },
      ch1: 'var(--ch1)',
      redline: 'var(--redline)',
    },
    fontFamily: {
      mono: ['var(--font-mono)'],
      sans: ['var(--font-sans)'],
      serif: ['var(--font-serif)'],
    },
    extend: {
      maxWidth: { measure: '680px', post: '660px', sheet: '1056px' },
      zIndex: { sticky: '10', chrome: '20', skip: '100' },
    },
  },
  plugins: [],
};
