/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'waxy-corn': '#f7b500',
        'bitter-liquorice': '#183022',
        'pink-swirl': '#FEEBE7',
        'hot-red': '#CC2D2D',
        'astral-blue': '#33708D',
        'night-blue': '#2F4E8D',
        'fluorescence': '#8BCD74',
      },
      fontFamily: {
        cabinet: ['"Cabinet Grotesk"', 'sans-serif'],
        general: ['"General Sans"', 'sans-serif'],
        luxurious: ['"Luxurious Script"', 'cursive'],
      },
    },
  },
  plugins: [],
}
