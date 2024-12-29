module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions', '> 1%'],
      replace: {
        'color-adjust': 'print-color-adjust'
      }
    }
  }
}