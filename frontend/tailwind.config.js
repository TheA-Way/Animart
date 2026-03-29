export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'anime-red': '#E63946',
        'anime-dark': '#0D0D0D',
        'anime-gray': '#1A1A2E',
        'anime-blue': '#16213E',
        'anime-accent': '#E94560',
        'anime-gold': '#FFD700',
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'cursive'],
        'body': ['"Nunito"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}