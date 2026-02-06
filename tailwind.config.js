/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ffffff',
        secondary: '#00f7ff',
        accent: '#ef522e',
        dark: '#010208',
        card: 'rgba(8, 10, 24, 0.7)',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 25px 120px rgba(183, 148, 255, 0.35)',
        soft: '0 25px 45px rgba(2, 6, 23, 0.65)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
