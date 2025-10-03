/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors (flat keys to ensure v4 generates utilities)
        primary: '#FFFFFF',
        secondary: '#1A1A1A',
        accent: '#0A0A0A',
        // Text tokens
        'text-primary': '#FFFFFF',
        'text-secondary': '#CCCCCC',
        'text-inverse': '#000000',
        // Border tokens
        'border-primary': '#FFFFFF',
        'border-secondary': '#4A5568',
        'border-dark': '#000000',
        // Background tokens
        'bg-primary': '#000000',
        'bg-card': '#1A1A1A',
        'bg-card-featured': '#0A0A0A',
        'bg-card-inline': '#2A2A2A',
        'bg-overlay': '#000000',

        // Nested semantic groups (generate classes like text-text-primary)
        text: {
          primary: '#FFFFFF',
          secondary: '#CCCCCC',
          inverse: '#000000',
        },
        border: {
          primary: '#FFFFFF',
          secondary: '#4A5568',
          dark: '#000000',
        },
        bg: {
          primary: '#000000',
          card: '#1A1A1A',
          'card-featured': '#0A0A0A',
          'card-inline': '#2A2A2A',
          overlay: '#000000',
        },
      },

      spacing: {
        // Navigation height token for inset utilities (e.g., top-nav)
        'nav': '80px',
        // Card spacing
        'card-sm': '16px',
        'card-md': '24px',
        'card-lg': '32px',

        // Shadow offsets (reference for consistency)
        'shadow-sm': '4px',
        'shadow-md': '6px',
        'shadow-lg': '8px',
        'shadow-xl': '12px',
      },

      borderWidth: {
        'default': '3px',
        'thick': '4px',
        'thin': '2px',
      },

      borderRadius: {
        // Neobrutalism = no border radius, but defined for consistency
        'none': '0px',
      },

      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"IBM Plex Sans"', 'Inter', 'sans-serif'],
      },

      fontSize: {
        // Exaggerated scale
        'display-xl': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['60px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
      },

      boxShadow: {
        // Reference CSS variables
        'brutal-sm': 'var(--shadow-brutal-sm)',
        'brutal-md': 'var(--shadow-brutal-md)',
        'brutal-lg': 'var(--shadow-brutal-lg)',
        'brutal-xl': 'var(--shadow-brutal-xl)',
        'brutal-pressed-sm': 'var(--shadow-brutal-pressed-sm)',
        'brutal-pressed-md': 'var(--shadow-brutal-pressed-md)',
        'brutal-light-md': 'var(--shadow-brutal-light-md)',
        'none': 'none',
      },

      height: {
        'nav': '80px',
      },
    },
  },
  plugins: [],
}
