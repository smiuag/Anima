/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        anima: {
          bg: '#1a1410',
          panel: '#231d17',
          border: '#4a3520',
          gold: '#c9a84c',
          'gold-light': '#e8c87a',
          red: '#8b1a1a',
          text: '#e8d5b0',
          muted: '#8a7560',
        }
      }
    }
  },
  plugins: []
}
