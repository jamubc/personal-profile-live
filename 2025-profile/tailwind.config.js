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
        'text-secondary': '#D4D4D4',
        'text-tertiary': '#999999',
        'text-inverse': '#000000',
        // Border tokens
        'border-primary': '#FFFFFF',
        'border-secondary': '#525252',
        'border-subtle': '#2A2A2A',
        'border-dark': '#000000',
        // Background tokens
        'bg-primary': '#000000',
        'background-primary': '#000000',
        'bg-card': '#1A1A1A',
        'bg-card-featured': '#0A0A0A',
        'bg-card-inline': '#2A2A2A',
        'bg-overlay': '#000000',

        // Nested semantic groups (generate classes like text-text-primary)
        text: {
          primary: '#FFFFFF',
          secondary: '#D4D4D4',
          tertiary: '#999999',
          inverse: '#000000',
        },
        border: {
          primary: '#FFFFFF',
          secondary: '#525252',
          subtle: '#2A2A2A',
          dark: '#000000',
        },
        bg: {
          primary: '#000000',
          card: '#1A1A1A',
          'card-featured': '#0A0A0A',
          'card-inline': '#2A2A2A',
          overlay: '#000000',
        },
        // Accent colors
        'accent-primary': 'hsl(286, 88%, 60%)',
        'accent-purple': 'hsl(286, 88%, 60%)',
        'accent-cyan': 'hsl(190, 92%, 56%)',
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        cyan: {
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
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
        // Display scale (Extra Large, Large, Medium, Small)
        'display-xl': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-lg': ['60px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-md': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['40px', { lineHeight: '1.2', fontWeight: '700' }],

        // Semantic heading scale (H1-H6 for proper HTML structure)
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        'h4': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        'h5': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'h6': ['16px', { lineHeight: '1.4', fontWeight: '700' }],

        // Body text scale (Semantic sizing)
        'body-lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],

        // Legacy caption (aliased to body-xs for consistency)
        'caption': ['12px', { lineHeight: '1.5', fontWeight: '400' }],

        // Standard Tailwind size scale (xs - 9xl for utility compatibility)
        'xs': ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'base': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'lg': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
        'xl': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        '2xl': ['24px', { lineHeight: '1.3', fontWeight: '700' }],
        '3xl': ['28px', { lineHeight: '1.3', fontWeight: '700' }],
        '4xl': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        '5xl': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        '6xl': ['60px', { lineHeight: '1.2', fontWeight: '700' }],
        '7xl': ['72px', { lineHeight: '1.2', fontWeight: '700' }],
        '8xl': ['80px', { lineHeight: '1.1', fontWeight: '700' }],
        '9xl': ['96px', { lineHeight: '1.1', fontWeight: '700' }],
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
        'accent-primary': '0 0 24px 0 hsla(286, 88%, 60%, 0.4), 0 0 12px 0 hsla(286, 88%, 60%, 0.2)',
        'none': 'none',
      },

      height: {
        'nav': '80px',
      },

      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.6' },
        },
      },

      animation: {
        shimmer: 'shimmer 2s infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
