/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        nest: {
          bg: '#0B1020',
          surface: '#131a2e',
          card: '#1a2240',
          border: '#26305a',
          text: '#E8ECF8',
          sub: '#9AA5C7',
          morning: '#F6B65B',
          morningSoft: '#FFD79A',
          night: '#6F7BFF',
          nightSoft: '#A7AEFF',
          accent: '#7FE3C4',
          danger: '#FF6B6B',
        },
      },
      fontFamily: {
        sans: ['"Inter"', '"Hiragino Sans"', '"Yu Gothic UI"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 24px rgba(8, 12, 32, 0.35)',
      },
    },
  },
  plugins: [],
};
