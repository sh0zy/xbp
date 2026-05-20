/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: {
          base: "#0a0b14",
          surface: "#11132080",
          card: "#161827",
          elevated: "#1c1f33",
        },
        accent: {
          DEFAULT: "#7c6cff",
          soft: "#5b4bd6",
          deep: "#3d2fc4",
        },
        ink: {
          base: "#e9eaf3",
          mute: "#a4a8c1",
          dim: "#6b7090",
        },
        line: "#262a44",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 8px 30px -10px rgba(124,108,255,0.25)",
        card: "0 4px 24px -8px rgba(0,0,0,0.6)",
      },
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Helvetica Neue",
          "Hiragino Kaku Gothic ProN",
          "Yu Gothic",
          "Meiryo",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
