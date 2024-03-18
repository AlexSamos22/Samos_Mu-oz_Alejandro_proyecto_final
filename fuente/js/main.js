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
let ordenActual = null;
let pokemonsPorTipo = []; // Almacena todos los Pokémon de un tipo específico
let paginaActual = 0; // Almacena la página actual

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

async function obtenerPokemons(order) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    const data = await response.json();

    const pokemonPromises = data.results.map(async pokemon => {
        const pokemonResponse = await fetch(pokemon.url);
        return pokemonResponse.json();
    });

    let pokemonDataArray = await Promise.all(pokemonPromises);

    if (order === 'asc') {
        pokemonDataArray = pokemonDataArray.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
        pokemonDataArray = pokemonDataArray.sort((a, b) => b.name.localeCompare(a.name));
    } else if (order === 'n-asc') {
        pokemonDataArray = pokemonDataArray.sort((a, b) => a.id - b.id);
    } else if (order === 'n-desc') {
        pokemonDataArray = pokemonDataArray.sort((a, b) => b.id - a.id);
    }

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

    pokemonsPorTipo = data.pokemon.map(({ pokemon }) => pokemon);

    mostrarPokemonsPorTipo();
}

async function mostrarPokemonsPorTipo() {
    const inicio = paginaActual * limit;
    const fin = inicio + limit;
    const pokemonsParaMostrar = pokemonsPorTipo.slice(inicio, fin);

    const pokemonPromises = pokemonsParaMostrar.map(async (pokemon) => {
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
    applyTransition = true; // Set the flag
    if (tipoActual) {
        paginaActual = Math.min(pokemonsPorTipo.length / limit, paginaActual + 1);
        mostrarPokemonsPorTipo();
    } else {
        offset += limit;
        obtenerPokemons(ordenActual).catch(console.error);
    }
});

document.querySelector('#anterior').addEventListener('click', () => {
    applyTransition = true; // Set the flag
    if (tipoActual) {
        paginaActual = Math.max(0, paginaActual - 1);
        mostrarPokemonsPorTipo();
    } else {
        offset = Math.max(0, offset - limit);
        obtenerPokemons(ordenActual).catch(console.error);
    }
});

document.querySelector('#toggle-filtro').addEventListener('click', () => {
    const filtro = document.querySelector('#filtro');
    if (filtro.classList.contains('left-0')) {
        filtro.classList.remove('left-0');
        filtro.classList.add('right-full');
    } else {
        filtro.classList.remove('right-full');
        filtro.classList.add('left-0');
    }
});

document.getElementById('orden').addEventListener('change', function(event) {
    ordenActual = event.target.value;
    if (tipoActual) {
        obtenerPokemonsPorTipo(tipoActual).catch(console.error);
    } else {
        obtenerPokemons(ordenActual).catch(console.error);
    }
});

obtenerPokemons().catch(error => console.error('Error:', error));