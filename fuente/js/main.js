
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
let pokemonHTML = '';
let applyTransition = false;
let offset = 0;
const limit = 12;
let tipoActual = null;
let ordenActual = null;
let pokemonsPorTipo = []; // Almacena todos los Pokémon de un tipo específico
let paginaActual = 0; // Almacena la página actual
let pokemons = []; // Array global para almacenar los Pokémon
let ordenar = false;

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

    
     // Oculta la pantalla de carga
     setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
    }, 2000);
    
     
}

function crearTarjetaPokemon(pokemonData) {
    return  `
    <div class="pokemon-card bg-white border-2 border-gray-300 p-4 relative flex flex-col items-center mx-auto cursor-pointer transform transition duration-500 ease-in-out hover:-translate-y-1 ${applyTransition ? 'animate-fadeIn' : ''}">
            <img class="w-2/4 h-auto" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="p-4 text-center">
                <h2 class="text-xl font-bold mb-2">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                <p class="mb-2">Nº: ${pokemonData.id}</p>
                ${pokemonData.types.map(typeInfo => `<span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2" style="background-color: ${typeColors[typeInfo.type.name.toLowerCase()]};">${typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}</span>`).join('')}
            </div>
        </div>
    `;
}

async function obtenerPokemons(order = 'n-asc') {
    console.log(ordenar);
    if (ordenar) {
        document.getElementById('pantalla-cambio').classList.add('flex');
        document.getElementById('pantalla-cambio').classList.remove('hidden');
        document.getElementById('pokemon').classList.remove("grid");
        document.getElementById('pokemon').classList.add("hidden");
        document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
        if (order === 'asc') {
            pokemons = pokemons.sort((a, b) => a.name.localeCompare(b.name));
        } else if (order === 'desc') {
            pokemons = pokemons.sort((a, b) => b.name.localeCompare(a.name));
        } else if (order === 'n-asc') {
            pokemons = pokemons.sort((a, b) => a.numero - b.numero);
        } else if (order === 'n-desc') {
            pokemons = pokemons.sort((a, b) => b.numero - a.numero);
        }
        
        setTimeout(() => {
            document.getElementById('pantalla-cambio').classList.remove('flex');
            document.getElementById('pantalla-cambio').classList.add('hidden');
            document.getElementById('pokemon').classList.remove("hidden");
            document.getElementById('pokemon').classList.add("grid");
            document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
            
        }, 2000);
        
    }

    ordenar = false;
    console.log(ordenar);

    let pokemonDataArray = pokemons.slice(offset, offset + limit);

    const pokemonPromises = pokemonDataArray.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    const pokemonDataArrayComplete = await Promise.all(pokemonPromises);

    for (const pokemonData of pokemonDataArrayComplete) {
        pokemonHTML += crearTarjetaPokemon(pokemonData);
    }

    document.querySelector('#pokemon').innerHTML = pokemonHTML;
}

async function obtenerPokemonsPorTipo(type, order = 'n-asc') {

    if (type == "todos") {
        document.getElementById('pantalla-cambio').classList.add('flex');
        document.getElementById('pantalla-cambio').classList.remove('hidden');
        document.getElementById('pokemon').classList.remove("grid");
        document.getElementById('pokemon').classList.add("hidden");
        document.getElementsByTagName('body')[0].classList.add("overflow-hidden");

        obtenerPokemons(ordenActual).catch(console.error);

        setTimeout(() => {
            document.getElementById('pantalla-cambio').classList.remove('flex');
            document.getElementById('pantalla-cambio').classList.add('hidden');
            document.getElementById('pokemon').classList.remove("hidden");
            document.getElementById('pokemon').classList.add("grid");
            document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
        }, 2000);

    }else{

        document.getElementById('pantalla-cambio').classList.add('flex');
        document.getElementById('pantalla-cambio').classList.remove('hidden');
        document.getElementById('pokemon').classList.remove("grid");
        document.getElementById('pokemon').classList.add("hidden");
        document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
        
        const url = `https://pokeapi.co/api/v2/type/${type}`;
        const response = await fetch(url);
        const data = await response.json();

        pokemonsPorTipo = data.pokemon.map(({ pokemon }, index) => ({
            ...pokemon,
            numero: index + 1
        })).slice(0, -18);

        if (ordenar) {
            if (order === 'asc') {
                pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => a.name.localeCompare(b.name));
            } else if (order === 'desc') {
                pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => b.name.localeCompare(a.name));
            } else if (order === 'n-asc') {
                pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => a.numero - b.numero);
            } else if (order === 'n-desc') {
                pokemonsPorTipo = pokemonsPorTipo.sort((a, b) => b.numero - a.numero);
            }
        }
        ordenar = false;

        mostrarPokemonsPorTipo();

        setTimeout(() => {
            document.getElementById('pantalla-cambio').classList.remove('flex');
            document.getElementById('pantalla-cambio').classList.add('hidden');
            document.getElementById('pokemon').classList.remove("hidden");
            document.getElementById('pokemon').classList.add("grid");
            document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
        }, 2000);

    }
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

    pokemonDataArray.forEach(pokemonData => {
        pokemonHTML += crearTarjetaPokemon(pokemonData);
    });

    document.querySelector('#pokemon').innerHTML = pokemonHTML;
}

document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('click', () => {
        ordenar = true;
        console.log(tag.id);
        tipoActual = tag.id; 
        pokemonHTML = '';
        window.scrollTo(0, 0);
        document.querySelector('#filtro').classList.add("-translate-x-full");
        document.querySelector('#filtro').classList.remove("translate-x-0");
        obtenerPokemonsPorTipo(tipoActual, ordenActual).catch(console.error);
    });
});

document.querySelector('#mas').addEventListener('click', function() {
    applyTransition = true; 
    this.classList.add('animate-click');

   
    setTimeout(() => {
        this.classList.remove('animate-click');
    }, 200);

    if (tipoActual && tipoActual !== 'todos') {
        if (paginaActual < Math.round(pokemonsPorTipo.length / limit)) {
            paginaActual = Math.min(pokemonsPorTipo.length / limit, paginaActual + 1);
            mostrarPokemonsPorTipo();
        }
    } else {
        if (paginaActual < Math.round(pokemons.length / limit)) {
            paginaActual = Math.min(pokemons.length / limit, paginaActual + 1);
            offset += limit;
            obtenerPokemons(ordenActual).catch(console.error);
        }
    }

    document.getElementById('inicio').classList.remove('hidden');
});

document.getElementById('inicio').addEventListener('click', function() {
    window.scrollTo(0, 0);
});

document.querySelector('#toggle-filtro').addEventListener('click', () => {
    const filtro = document.querySelector('#filtro');
    if (filtro.classList.contains('translate-x-0')) {
        filtro.classList.remove('translate-x-0');
        filtro.classList.add('-translate-x-full');
    } else {
        filtro.classList.remove('-translate-x-full');
        filtro.classList.add('translate-x-0');
    }
});

document.getElementById('orden').addEventListener('change', function (event) {
    ordenActual = event.target.value;
    ordenar = true;
    pokemonHTML = '';
    if (tipoActual && tipoActual !== 'todos') {
        paginaActual = 0;
        obtenerPokemonsPorTipo(tipoActual, ordenActual).catch(console.error);
    } else {
        offset = 0;
        obtenerPokemons(ordenActual).catch(console.error);
    }
});

document.querySelector('#toggle-filtro').addEventListener('click', function () {
    this.classList.add('animate-click');
    setTimeout(() => {
        this.classList.remove('animate-click');
    }, 200); 


});

document.querySelector('#cerrar-filtro').addEventListener('click', function (event) {
    event.stopPropagation();
    const filtro = document.querySelector('#filtro');
    filtro.classList.remove('translate-x-0');
    filtro.classList.add('-translate-x-full');
});

if (localStorage.getItem('sesion-iniciada')) {
    document.getElementById('log-in').classList.add('hidden');
    document.getElementById('log-out').classList.remove('hidden');
    
}

document.getElementById('log-out').addEventListener('click', function() {
    alert('Sesión cerrada');
    localStorage.removeItem('sesion-iniciada');
    window.location.reload();
})

obtenerTodosLosPokemons()
    .then(() => {
        obtenerPokemons().catch(console.error);
    })
    .catch(console.error);
