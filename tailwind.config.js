/** Tailwind build config — run `npm run build:css` after changing classes in HTML or JS. */
module.exports = {
  content: ['./index.html', './privacy-policy.html', './terms-and-conditions.html', './assets/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#020817', 900: '#061230', 850: '#081838', 800: '#0B1F45', 700: '#10295C', 600: '#173576' },
        gold: { 200: '#F8E7B5', 300: '#F1D58A', 400: '#E5BF66', 500: '#D4A84B', 600: '#B8862F', 700: '#8F6620' },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        gold: '0 10px 40px -10px rgba(212,168,75,.55)',
        card: '0 20px 60px -20px rgba(2,8,23,.65)',
      },
    },
  },
};
