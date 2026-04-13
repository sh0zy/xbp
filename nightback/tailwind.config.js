/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#08090d",
          800: "#0d0f16",
          700: "#151824",
          600: "#1c2030",
          500: "#262b3d",
          400: "#3a4057",
        },
        accent: {
          DEFAULT: "#8b8bff",
          soft: "#6e6eff",
          glow: "#a0a0ff",
        },
        warn: "#ffb47a",
        ok: "#7fe0b0",
      },
      fontFamily: {
        sans: ['"Inter"', '"Noto Sans JP"', "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
