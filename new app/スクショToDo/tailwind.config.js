/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05070d",
          900: "#0a0e1a",
          800: "#11172a",
          700: "#1a2238",
          600: "#242d48",
        },
        accent: {
          400: "#8ab4ff",
          500: "#5a8dff",
          600: "#3d6bff",
        },
        gold: {
          400: "#e8d9a8",
          500: "#c9b07a",
        },
      },
      boxShadow: {
        glass: "0 10px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Hiragino Sans",
          "Noto Sans JP",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
