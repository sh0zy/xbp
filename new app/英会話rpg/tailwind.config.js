/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#081a2f",
        night: "#0d2338",
        mint: "#64f2c4",
        amber: "#ffce73",
        coral: "#ff756f",
        skyglass: "#a8dcff",
      },
      fontFamily: {
        sans: ["Manrope", "Noto Sans JP", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(100, 242, 196, 0.36)",
        panel: "0 18px 60px rgba(0, 0, 0, 0.32)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-7px)" },
          "40%": { transform: "translateX(7px)" },
          "60%": { transform: "translateX(-5px)" },
          "80%": { transform: "translateX(5px)" },
        },
      },
      animation: {
        float: "float 3.2s ease-in-out infinite",
        shake: "shake 0.36s ease-in-out",
      },
    },
  },
  plugins: [],
};
