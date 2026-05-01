/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617',
        card: 'rgba(30, 41, 59, 0.5)',
        accent: '#38bdf8',
      },
      backdropBlur: {
        glass: '12px',
      }
    },
  },
  plugins: [],
}
