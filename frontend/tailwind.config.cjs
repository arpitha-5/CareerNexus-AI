/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1', // indigo-500
        accent: '#f97316',  // orange-500
      },
    },
  },
  plugins: [],
};