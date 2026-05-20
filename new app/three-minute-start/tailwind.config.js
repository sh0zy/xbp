/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9eaff",
          200: "#b6d6ff",
          300: "#86b9ff",
          400: "#5092ff",
          500: "#2b6df6",
          600: "#1a52d4",
          700: "#1842a8",
          800: "#173984",
          900: "#16306a",
        },
        ink: {
          50: "#f7f8fa",
          100: "#eef0f4",
          200: "#dde1e9",
          300: "#bcc2d0",
          400: "#8e95a6",
          500: "#646b7d",
          600: "#474d5b",
          700: "#333845",
          800: "#1f232c",
          900: "#11141a",
        },
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Hiragino Sans",
          "Noto Sans JP",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgba(20, 28, 56, 0.18)",
      },
    },
  },
  plugins: [],
};
