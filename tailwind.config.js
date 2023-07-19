const defaultTheme = require('tailwindcss/defaultTheme')
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{twig,js}", './node_modules/preline/dist/*.js', './assets/js/*.js'],
  theme: {
    extend: {
      fontFamily: {
      'sans': ['montserrat', ...defaultTheme.fontFamily.sans],
      'serif': ['playfair',...defaultTheme.fontFamily.serif],
    },
    },
    
  },
  plugins: [require('preline/plugin'),],
  
}
