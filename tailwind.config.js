/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./fuente/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      scale: ['active'],
      colors:{
        'bg-normal': '#A8A878',
        'bg-fire': '#F08030',
        'bg-water': '#6890F0',
        'bg-grass': '#78C850', 
        'bg-electric': '#F8D030', 
        'bg-ice': '#98D8D8',
        'bg-fighting':'#C03028', 
        'bg-poison': '#A040A0', 
        'bg-ground': '#E0C068', 
        'bg-flying': '#A890F0', 
        'bg-psychic': '#F85888', 
        'bg-bug': '#A8B820', 
        'bg-rock': '#B8A038', 
        'bg-ghost': '#705898', 
        'bg-dragon': '#7038F8', 
        'bg-dark': '#705848', 
        'bg-steel': '#B8B8D0', 
        'bg-fairy': '#EE99AC',
        'fondo-menu-footer': '#00579F',
        'fondo-menu-footer-hover': '#004275',
        'rojo-hover': '#FF0000',
        'bg-ghost-dark': '#50406A', 
        'bg-dragon-dark': '#5028A8', 
        'bg-dark-dark': '#504030', 
      },

      width: {
        'modificado-13': '13%',
      },
      spacing: {
        'modificado2': '8%',
        'modificado3': '50%',
        'modificado4': '100%',
      },
      screens: {
        'm-grande': '1200px',
        'grande': '1100px',
        'mediano': '730px',
        'pequeño': '470px',
      },
      flexGrow: {
        'g': '1',
        'p': '0',
      },
      scrollbar: (theme) => ({
        thin: {
          width: '10px',
          backgroundColor: theme('colors.gray.200'),
          thumbColor: theme('colors.gray.500'),
        },
      }),
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

