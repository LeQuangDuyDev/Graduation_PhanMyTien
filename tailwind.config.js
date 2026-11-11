export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      screens: { ls: { raw: '(orientation: landscape) and (min-width: 560px)' } }, // màn hình ngang (tablet / laptop / điện thoại xoay ngang)
      colors: { brand: '#001a67', deep: '#000d3d', azure: '#2b5cff', sky: '#9ec5ff', ice: '#e6ecff', sun: '#ffc94d' },
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        script: ['Pacifico', 'cursive'],
        body: ['"Be Vietnam Pro"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
