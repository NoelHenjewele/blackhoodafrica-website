/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0d0d0d',
        charcoal: '#161513',
        cream: '#f6f2ea',
        bone: '#efe9dd',
        gold: {
          DEFAULT: '#b8935a',
          light: '#d4b483',
          dark: '#8f6f40',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.28em',
      },
    },
  },
  plugins: [],
}
