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
let tarjetasPokemon = '';

// Obtén los datos del localStorage
let data = JSON.parse(localStorage.getItem('sesion-iniciada'));

// Extrae el array de pokemons
let pokemons = data[2];

// Extrae el array de equipos
let equipos = data[1];

async function obtenerPokemonsYCrearTarjetas(pokemons) {
    // Crea un array de promesas para las peticiones a la API
    let promises = pokemons.map(pokemon => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemonID}`).then(response => response.json()));

    // Espera a que todas las peticiones se completen
    let pokemonDatas = await Promise.all(promises);

    // Crea las tarjetas de pokemon y añádelas al DOM
    document.getElementById('pokemon').innerHTML = pokemonDatas.map(pokemonData => crearTarjetaPokemon(pokemonData)).join('');
}

// Llama a la función obtenerPokemonsYCrearTarjetas con el array de pokemons
obtenerPokemonsYCrearTarjetas(pokemons);

function crearTarjetaPokemon(pokemonData) {
    return  `
    <div id="${pokemonData.id}" class=" ${pokemonData.forms[0].name} pokemon-card bg-white border-2 border-gray-300 p-4 relative flex flex-col items-center mx-auto cursor-pointer transform transition duration-500 ease-in-out hover:-translate-y-1">
            <img class="w-2/4 h-auto" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="p-4 text-center">
                <h2 class="text-xl font-bold mb-2">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                <p class="mb-2">Nº: ${pokemonData.id}</p>
                ${pokemonData.types.map(typeInfo => `<span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2" style="background-color: ${typeColors[typeInfo.type.name.toLowerCase()]};">${typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}</span>`).join('')}
            </div>
            <button id="${pokemonData.id}" class="boton-fav text-black p-2 rounded absolute bottom-2 right-2"><i class="fas fa-heart fa-xl"></i></button>
    </div>
    `;
}

async function obtenerEquiposYCrearTarjetas() {
    // Crea un array de promesas para las peticiones a la API
    let promises = equipos.map(async equipo => {
        let formData = new URLSearchParams();
        formData.append('equipoId', equipo.equipoID);

        try {
            let response = await fetch('../php/equipoPorID.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let respuesta = await response.json();
            console.log(respuesta);

            if (Object.keys(respuesta).length > 0) {
                console.log("Realizado con éxito");
            } else {
                alert("Error al cargar los equipos");
            }

            return respuesta; // Devuelve la respuesta

        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    });

    // Filtra los resultados nulos (en caso de error)
    let equiposData = (await Promise.all(promises)).filter(result => result !== null);
    console.log(equiposData);

    // Crea las tarjetas de equipo y añádelas al DOM
    document.getElementById('equiposFav').innerHTML = equiposData.map(equipoData => crearTarjeta(equipoData)).join('');
}


function crearTarjeta(datos) {
    let tarjetasHtml = '';

    datos.forEach(campo => {
        // Crea la cadena de HTML para las imágenes de los Pokémon
        let imagenesPokemonHtml = '<div class="grid grid-cols-3  w-full justify-items-center items ">';
        for (let i = 1; i <= 6; i++) {
            imagenesPokemonHtml += `<img src="${campo[`P${i}`]}" class=" w-3/4 pequeño:w-1/2 mediano:w-3/4 grande:w-2/5 h-auto">`;
        }
        imagenesPokemonHtml += '</div>';

        // Añade la tarjeta a la cadena de HTML
        tarjetasHtml += `
            <div class="p-4 rounded-lg shadow-md mb-4 flex flex-col justify-center items-center w-full bg-white border border-gray-200 space-y-2">
                <div class="flex items-center justify-center  gap-3">
                    <p class="font-bold text-black mr-2">${campo.Autor}</p>
                    <img src="${campo.Pais}" class=" w-1/12 grande:w-modificado-5 h-auto">
                </div>
            
                <div class=" m-4 flex flex-col justify-center items-center w-full">
                    <p style="color:${typeColors.rojo}">${campo.Torneo}</p>
                    <p>(${campo.Fecha})</p>
                    <p class="font-bold mb">${campo.Posicion}</p>
                </div>
            
                ${imagenesPokemonHtml}
                <div class="flex justify-between items-center w-full mt-4">
                <a href="equipo-${campo.ID}.html" id="equipo-${campo.ID}" class="bg-blue-500 hover:bg-blue-800 text-white p-2 rounded inline-flex items-center">
                <i class="fas fa-file-export mr-1"></i>
                See more
                </a>
                    <button id="${campo.ID}" class="boton-fav text-black p-2 rounded"><i class="fas fa-heart fa-lg"></i></button>
                </div>
            </div>
        `;
    });

    return tarjetasHtml;
}

let divPokemon = document.getElementById("pokemon");
let divEquipos = document.getElementById("equiposFav");


// Llama a la función obtenerPokemonsYCrearTarjetas con el array de pokemons
obtenerPokemonsYCrearTarjetas(pokemons);

// Llama a la función obtenerEquiposYCrearTarjetas
obtenerEquiposYCrearTarjetas();