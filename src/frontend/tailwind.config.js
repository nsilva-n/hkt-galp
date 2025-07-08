/** @type {import('tailwindcss').Config} */
const design = require('./app/config/design');

module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Ping LCG"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        primary: design.colors.primary,
        secondary: design.colors.secondary,
        primary_bright_orange: "#ffd6bc",
      },
      borderRadius: {
        'button': design.borderRadius.button,
        'card': design.borderRadius.card,
        'input': design.borderRadius.input,
        'textarea': design.borderRadius.textarea,
        'checkbox': design.borderRadius.checkbox
      }
    }
  },
  plugins: []
};
