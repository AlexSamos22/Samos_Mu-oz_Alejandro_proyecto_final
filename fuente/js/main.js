const typeColors = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC',
};

let applyTransition = false;
let offset = 0;
const limit = 12;
let tipoActual = null;

function crearTarjetaPokemon(pokemonData) {
    const pokemonHTML = `
    <div class="pokemon-card bg-gray-400 shadow-md rounded-lg overflow-hidden flex flex-col items-center mx-auto">
            <img class="w-2/4 h-auto" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="p-4 text-center">
                <h2 class="text-xl font-bold mb-2">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                <p class="mb-2">Nº: ${pokemonData.id}</p>
                ${pokemonData.types.map(typeInfo => `<span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2" style="background-color: ${typeColors[typeInfo.type.name.toLowerCase()]};">${typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}</span>`).join('')}
            </div>
        </div>
    `;
    document.querySelector('#pokemon').innerHTML += pokemonHTML;
}

async function obtenerPokemons() {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();

    const pokemonPromises = data.results.map(async pokemon => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    });

    const pokemonDataArray = await Promise.all(pokemonPromises);

    document.querySelector('#pokemon').innerHTML = ''; // Clear the current cards
    pokemonDataArray.forEach(pokemonData => {
        crearTarjetaPokemon(pokemonData);
    });

    if (applyTransition) {
        setTimeout(() => {
            document.querySelectorAll('.pokemon-card.oculto').forEach(card => {
                card.classList.remove('oculto');
            });
        }, 100); // Adjust delay as needed
        applyTransition = false; // Reset the flag
    }


    document.querySelector('#anterior').disabled = offset === 0; // Disable the button if there is no previous page
}

async function obtenerPokemonsPorTipo(type) {
    const url = `https://pokeapi.co/api/v2/type/${type}`;
    const response = await fetch(url);
    const data = await response.json();

    const pokemonPromises = data.pokemon.slice(0, 12).map(async ({ pokemon }) => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    });

    const pokemonDataArray = await Promise.all(pokemonPromises);

    document.querySelector('#pokemon').innerHTML = ''; // Clear the current cards
    pokemonDataArray.forEach(pokemonData => {
        crearTarjetaPokemon(pokemonData);
    });
}

document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        tipoActual = tag.id; // Set the current type when a tag is clicked
        obtenerPokemonsPorTipo(tipoActual).catch(console.error);
    });
});

document.querySelector('#siguiente').addEventListener('click', () => {
    offset += limit;
    applyTransition = true; // Set the flag
    if (tipoActual) {
        obtenerPokemonsPorTipo(tipoActual).catch(console.error);
    } else {
        obtenerPokemons().catch(console.error);
    }
});

document.querySelector('#anterior').addEventListener('click', () => {
    offset = Math.max(0, offset - limit);
    applyTransition = true; // Set the flag
    if (tipoActual) {
        obtenerPokemonsPorTipo(tipoActual).catch(console.error);
    } else {
        obtenerPokemons().catch(console.error);
    }
});

obtenerPokemons().catch(error => console.error('Error:', error));