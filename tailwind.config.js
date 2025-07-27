/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'rgb(31 41 55)', // gray-800 for dark theme
      },
    },
  },
  plugins: [],
};