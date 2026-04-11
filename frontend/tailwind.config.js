/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      colors: {
        nature: {
          50: '#f2f9f4',
          100: '#e0f1e4',
          200: '#c3e1cb',
          300: '#97cba8',
          400: '#64ac7d',
          500: '#428f5c',
          600: '#327248',
          700: '#2a5b3b',
          800: '#234830',
          900: '#1d3c29',
        }
      }
    },
  },
  plugins: [],
}
