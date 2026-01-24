/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0a0e17',
        primary: {
          light: '#22d3ee', // cyan-400
          DEFAULT: '#06b6d4', // cyan-500
          dark: '#0891b2', // cyan-600
        },
        secondary: {
          light: '#34d399', // emerald-400
          DEFAULT: '#10b981', // emerald-500
          dark: '#059669', // emerald-600
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
