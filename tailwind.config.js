/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        'baut-color-red-100': '#8B0000',
        'baut-color-red-200': '#C70000',
        'baut-color-red-300': '#E63434',
        'baut-color-red-400': '#371f29',
      }
    },
  },
  // plugins: [
  // require('@tailwindcss/forms'),
  // require('@tailwindcss/aspect-ratio'),
  // ],

  plugins: [
    // ...
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
}

