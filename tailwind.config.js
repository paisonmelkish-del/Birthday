// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      keyframes: {
        petalFall: {
          "0%": { transform: "translateY(-20vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(120vh) rotate(360deg)", opacity: "0.95" },
        },
        floatA: {
          "0%": { transform: "translateY(0px) rotate(-3deg)" },
          "50%": { transform: "translateY(12px) rotate(4deg)" },
          "100%": { transform: "translateY(0px) rotate(-3deg)" },
        },
        floatB: {
          "0%": { transform: "translateY(-6px)" },
          "50%": { transform: "translateY(10px)" },
          "100%": { transform: "translateY(-6px)" },
        },
        bob: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
          "100%": { transform: "translateY(0px)" },
        },
      },
      animation: {
        petalFall: "petalFall 8s linear infinite",
        floatA: "floatA 6s ease-in-out infinite",
        floatB: "floatB 7s ease-in-out infinite",
        bob: "bob 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
