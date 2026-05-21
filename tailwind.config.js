/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uasd-blue': '#0033A0',
        'uasd-red': '#D31145',
      }
    },
  },
  plugins: [],
}
