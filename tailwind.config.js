/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{twig,js}", './node_modules/preline/dist/*.js'],
  theme: {
    extend: {},
  },
  plugins: [require('preline/plugin'),],
  
}
