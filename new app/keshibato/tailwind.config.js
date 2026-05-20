/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        board: '#2a2f3a',
        boardEdge: '#1a1e26',
        p1: '#4ea9ff',
        p2: '#ff6b6b',
        accent: '#ffd166',
        ink: '#f5f5f7',
        chalk: '#e8e8ea',
      },
      fontFamily: {
        display: ['"Rounded Mplus 1c"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(255, 209, 102, 0.6)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.08)', opacity: '1' },
          '100%': { transform: 'scale(1)' },
        },
        slide: {
          '0%': { transform: 'translateY(-30%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        pop: 'pop .35s ease-out',
        slide: 'slide .35s ease-out',
      },
    },
  },
  plugins: [],
};
