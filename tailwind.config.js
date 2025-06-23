/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kebab-red': '#E63946',
        'kebab-green': '#2A9D8F',
        'kebab-yellow': '#E9C46A',
        'kebab-brown': '#6D4C41',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        accent: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
