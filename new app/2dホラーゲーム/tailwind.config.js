/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          deep: '#05050F',
          surface: '#0C0C1A',
          overlay: '#12121F',
          primary: '#E8E6DF',
          secondary: '#9A98A0',
          muted: '#55535C',
          blue: '#2D4A6B',
          glow: '#3A5F8A',
          danger: '#6B1F1F',
          bright: '#C0392B',
          border: '#1E1E2E',
          paper: '#0F0F1C',
          ink: '#B8B4A8',
        },
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
        serif: ['"Noto Serif JP"', 'serif'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
          '70%': { opacity: '0.8' },
        },
        glitch: {
          '0%,100%': { transform: 'translate(0,0)' },
          '20%': { transform: 'translate(-1px,1px)' },
          '40%': { transform: 'translate(1px,-1px)' },
          '60%': { transform: 'translate(-2px,0)' },
          '80%': { transform: 'translate(2px,1px)' },
        },
        breath: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.04)' },
        },
        sway: {
          '0%,100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(2px)' },
        },
      },
      animation: {
        flicker: 'flicker 2.4s infinite',
        glitch: 'glitch 0.3s infinite',
        breath: 'breath 3s ease-in-out infinite',
        sway: 'sway 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
