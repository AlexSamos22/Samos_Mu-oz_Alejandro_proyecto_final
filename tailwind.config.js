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
        'modificado-10': '10%',
        'modificado-13': '13%',
        'modificado-5': '5%',
        'modificado-45': '45%',
        'modificado-95': '95%',
      },
      spacing: {
        'modificado2': '8%',
        'modificado-20': '20%',
        'modificado-25': '25%',
        'modificado-30': '30%',
        'modificado-40': '40%',
        'modificado3': '50%',
        'modificado5': '60%',
        'modificado4': '100%',
      },
      screens: {
        'gigante': '1300px',
        'm-grande': '1200px',
        'grande-m': '1140px',
        'grande': '1100px',
        'grande-s': '850px',
        'mediano': '730px',
        'mediano-s': '540px',
        'pequeño': '470px',
        'pequeño-s': '450px',
        'pequeño-xs': '430px',
        'pequeño-xxs': '405px',
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

