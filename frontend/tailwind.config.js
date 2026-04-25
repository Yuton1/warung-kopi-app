/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coffee-dark': '#2C1B0E',
        'coffee-medium': '#4B3621',
        'coffee-light': '#A67B5B',
        'coffee-cream': '#ECB176',
      }
    },
  },
  plugins: [],
}