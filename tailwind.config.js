/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./fuente/**/*.{html,js}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
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
        'rojo-pokeball': '#C70000' 
      }

    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}

