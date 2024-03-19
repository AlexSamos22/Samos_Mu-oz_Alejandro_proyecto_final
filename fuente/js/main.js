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
let pokemons = []; // Array global para almacenar los Pokémon


async function obtenerTodosLosPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Comienza con los primeros 100 Pokémon
    let contador = 1;

    while (url && contador <= 1025) {
        const response = await fetch(url);
        const data = await response.json();
        const pokemonsConNumeros = data.results.slice(0, 1025 - pokemons.length).map(pokemon => ({
            ...pokemon,
            numero: contador++
        }));

        pokemons = pokemons.concat(pokemonsConNumeros);
        url = data.next; // La URL para la siguiente página de resultados
    }

}

function crearTarjetaPokemon(pokemonData) {
    if (pokemonData.sprites.other['official-artwork'].front_default === null) {
        return;
    }
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

async function obtenerPokemons(order = 'n-asc') {

    if (order === 'asc') {
        pokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
    } else if (order === 'desc') {
        pokemons = pokemons.sort((a, b) => b.name.localeCompare(a.name));
    } else if (order === 'n-asc') {
        pokemons = pokemons.sort((a, b) => a.numero - b.numero);
    } else if (order === 'n-desc') {
        pokemons = pokemons.sort((a, b) => b.numero - a.numero);
    }

    let pokemonDataArray = pokemons.slice(offset, offset + limit);

    document.querySelector('#pokemon').innerHTML = ''; // Clear the current cards
    const pokemonPromises = pokemonDataArray.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    const pokemonDataArrayComplete = await Promise.all(pokemonPromises);

    for (const pokemonData of pokemonDataArrayComplete) {
        crearTarjetaPokemon(pokemonData);
    }
}

async function obtenerPokemonsPorTipo(type, order = 'n-asc') {
    const url = `https://pokeapi.co/api/v2/type/${type}`;
    const response = await fetch(url);
    const data = await response.json();

    pokemonsPorTipo = data.pokemon.map(({ pokemon }, index) => ({
        ...pokemon,
        numero: index + 1
    })).slice(0, -18);

        if (order === 'asc') {
            pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => a.name.localeCompare(b.name));
        } else if (order === 'desc') {
            pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => b.name.localeCompare(a.name));
        } else if (order === 'n-asc') {
            pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => a.numero - b.numero);
        } else if (order === 'n-desc') {
            pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => b.numero - a.numero);
        }
    console.log(pokemonsPorTipo);
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
        obtenerPokemonsPorTipo(tipoActual, ordenActual).catch(console.error);
    });
});

document.querySelector('#siguiente').addEventListener('click', () => {
    applyTransition = true; // Set the flag
    if (tipoActual) {
        if (paginaActual < Math.round(pokemonsPorTipo.length / limit)) {
            paginaActual = Math.min(pokemonsPorTipo.length / limit, paginaActual + 1);
            mostrarPokemonsPorTipo();
        }
    } else {
        if (paginaActual < Math.round(pokemons.length / limit)) {
            offset += limit;
            obtenerPokemons(ordenActual).catch(console.error);
        }
    }
});

document.querySelector('#anterior').addEventListener('click', () => {
    applyTransition = true; // Set the flag
    if (tipoActual) {
        if (paginaActual > 0) {
            paginaActual = Math.max(0, paginaActual - 1);
            mostrarPokemonsPorTipo();
        }
    } else {
        if (paginaActual > 0) {
            offset = Math.max(0, offset - limit);
            obtenerPokemons(ordenActual).catch(console.error);
        }
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
        paginaActual = 0;
        obtenerPokemonsPorTipo(tipoActual, ordenActual).catch(console.error);
    } else {
        offset = 0;
        obtenerPokemons(ordenActual).catch(console.error);
    }
});

obtenerTodosLosPokemons()
    .then(() => {
        obtenerPokemons().catch(console.error);
    })
    .catch(console.error);
