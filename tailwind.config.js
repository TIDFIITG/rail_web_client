/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        railway: {
          blue: "#0B4F8C",
          navy: "#173F6B",
          red: "#D32F2F",
          success: "#2E7D32",
          warning: "#F9A825",
          bg: "#F4F6F9",
          border: "#D9E2EC",
          text: "#1F2937",
        },
      },
      fontFamily: {
        funky1: ['"Comic Sans MS"', 'cursive'],
        funky2: ['"Papyrus"', 'fantasy'],
        funky3: ['"Courier New"', 'monospace'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        flicker: {
          '0%': { backgroundColor: 'rgb(255, 0, 0)' },
          '25%': { backgroundColor: 'rgb(0, 255, 0)' },
          '50%': { backgroundColor: 'rgb(0, 0, 255)' },
          '75%': { backgroundColor: 'rgb(255, 255, 0)' },
          '100%': { backgroundColor: 'rgb(255, 0, 255)' },
        },
        fontCycle: {
          '0%': { fontFamily: '"Comic Sans MS", cursive' },
          '33%': { fontFamily: '"Papyrus", fantasy' },
          '66%': { fontFamily: '"Courier New", monospace' },
          '100%': { fontFamily: '"Comic Sans MS", cursive' },
        },
      },
      animation: {
        float: 'float 4s ease-in-out infinite',
        flicker: 'flicker 1.5s infinite',
        fontCycle: 'fontCycle 0.5s infinite',
      },
    },
  },
  plugins: [],
};
