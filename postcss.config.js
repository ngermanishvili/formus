// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      remove: false,
      replace: {
        'color-adjust': 'print-color-adjust'
      }
    }
  }
}