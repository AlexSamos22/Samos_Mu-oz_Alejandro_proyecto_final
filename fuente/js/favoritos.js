//Objeto que contiene los colores de los tipos de pokémon
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
// Hace que no se pueda hacer scroll en la página mientras se carga
document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
let tarjetasPokemon = '';

// Obtener los datos del localStorage
let data = JSON.parse(localStorage.getItem('sesion-iniciada'));

// Extrae el array de pokemons
let pokemons = data[2];

// Extrae el array de equipos
let equipos = data[1];

// Obtiene los datos de los pokemons y crea las tarjetas
async function obtenerPokemonsYCrearTarjetas(pokemons) {
    // Crea un array de promesas para las peticiones a la API
    let promises = pokemons.map(pokemon => fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.pokemonID}`).then(response => response.json()));

    // Espera a que todas las peticiones se completen
    let pokemonDatas = await Promise.all(promises);

    // Crea las tarjetas de pokemon y las añáde al DOM
    document.getElementById('pokemon').innerHTML = pokemonDatas.map(pokemonData => crearTarjetaPokemon(pokemonData)).join('');

    // Actualiza los estilos de los pokemons
    actualizarEstilosPokemons(pokemons.length); 

    // Hace que se muestre la página después de 2 segundos
    setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
        document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
    }, 2000);

    // Añade un evento de clic a cada tarjeta de Pokémon para tener mas info del pokemon
    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', function() {
            // Obtiene el ID del Pokémon de la tarjeta haciendo referencia al ID del elemento HTML
            const pokemonId = this.id;
            
            // Obtiene la clase con el nombre del Pokémon
            const pokemonClass = this.classList[0]; 

            // Redirige al usuario a la página pokemon.html con el ID del Pokémon como parámetro de consulta
            window.location.href = `../html/pokemon.html?id=${pokemonId}&name=${pokemonClass}`;
        });
    });

    // Añade un evento de clic a cada botón de eliminar Pokémon
    document.querySelectorAll('.boton-del-poke').forEach(boton => {
        boton.addEventListener('click', async function(event) {
            event.stopPropagation(); // Evita que el evento de clic se propague a la tarjeta de Pokémon

            // Obtiene el ID del Pokémon a eliminar
            const pokemonId = this.id;

            // Elimina el Pokémon del array de pokemons
            pokemons = pokemons.filter(pokemon => pokemon.pokemonID != pokemonId);
            
            // Actualiza el localStorage
            data[2] = pokemons;
            localStorage.setItem('sesion-iniciada', JSON.stringify(data));

            // Elimina la tarjeta de Pokémon del DOM
            this.parentElement.remove();

            // Actualiza los estilos de los pokemons
            actualizarEstilosPokemons(pokemons.length);

            // Eliminar el pokemon de la base de datos
            let formData = new URLSearchParams();
            formData.append('pokemonId', pokemonId);
            formData.append('usuarioId', data[0]);
            formData.append('operacion', 'eliminar');
            try {
                const response = await fetch('../php/gestionarPokemonFavs.php', {
                    method: 'POST',
                    body: formData
                });
                const text = await response.text();
                if (text === "TRUE") {
                    console.log("Hecho");
                } else {
                    console.log("No hecho");
                }
            } catch (error) {
                console.error('Error:', error);
            }
            

        });
    });
}

// Llama a la función obtenerPokemonsYCrearTarjetas con el array de pokemons
obtenerPokemonsYCrearTarjetas(pokemons);

// Obtiene los datos de los equipos y crea las tarjetas
function crearTarjetaPokemon(pokemonData) {
    return  `
    <div id="${pokemonData.id}" class=" ${pokemonData.forms[0].name} pokemon-card bg-white border-2 border-gray-300 p-4 relative flex flex-col items-center mx-auto cursor-pointer transform transition duration-500 ease-in-out hover:-translate-y-1">
            <img class="w-2/4 h-auto" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="p-4 text-center">
                <h2 class="text-xl font-bold mb-2">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                <p class="mb-2">Nº: ${pokemonData.id}</p>
                ${pokemonData.types.map(typeInfo => `<span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2" style="background-color: ${typeColors[typeInfo.type.name.toLowerCase()]};">${typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}</span>`).join('')}
            </div>
            <button id="${pokemonData.id}" class="boton-del-poke text-black p-2 rounded absolute bottom-2 right-2"><i class="fas fa-trash fa-lg"></i></button>
    </div>
    `;
}

// Obtiene los datos de los equipos y crea las tarjetas
async function obtenerEquiposYCrearTarjetas() {
    // Crea un array de promesas para las peticiones a la API
    let promises = equipos.map(async equipo => {
        let formData = new URLSearchParams();
        formData.append('equipoId', equipo.equipoID);

        //Coge de la base de datos los datos los equipos del usuario por ID
        try {
            let response = await fetch('../php/equipoPorID.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            let respuesta = await response.json();

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

    // Crea las tarjetas de equipo y la añáde al DOM
    document.getElementById('equiposFav').innerHTML = equiposData.map(equipoData => crearTarjeta(equipoData)).join('');

    // Actualiza los estilos de los equipos
    actualizarEstilosEquipos(equipos.length);

    // Añade un evento de clic a cada botón de eliminar equipo
    document.querySelectorAll('.boton-del-equipo').forEach(boton => {
        boton.addEventListener('click', async function(event) {
            event.stopPropagation(); // Evita que el evento de clic se propague a la tarjeta de equipo

            // Obtiene el ID del equipo a eliminar
            const equipoId = this.id;

            // Elimina el equipo del array de equipos
            equipos = equipos.filter(equipo => equipo.equipoID != equipoId);
            
            // Actualiza el localStorage
            data[1] = equipos;
            localStorage.setItem('sesion-iniciada', JSON.stringify(data));

            // Elimina la tarjeta de equipo del DOM
            let parentElement = this.parentElement;
            let grandParentElement = parentElement.parentElement;
            grandParentElement.remove();

            // Actualiza los estilos de los equipos
            actualizarEstilosEquipos(equipos.length);

            // Eliminar el equipo de la base de datos
            let formData = new URLSearchParams();
            formData.append('equipoId', equipoId);
            formData.append('usuarioId', data[0]);
            formData.append('operacion', 'eliminar');
            try {
                const response = await fetch('../php/gestionarEquiposFavs.php', {
                    method: 'POST',
                    body: formData
                });
                const text = await response.text();
                if (text === "TRUE") {
                    console.log("Hecho");
                } else {
                    console.log("No hecho");
                }
            } catch (error) {
                console.error('Error:', error);
            }

            document.querySelectorAll('.tarjetaEquipo').forEach(tarjeta => {
                if (equipos.length === 1) {
                    tarjeta.classList.add('mediano:w-3/5', 'grande:w-1/2');
                }
            });
            
        });
    });
}

// Crea las tarjetas de los equipos
function crearTarjeta(datos) {
    let tarjetasHtml = '';

    datos.forEach(campo => {
        // Crea la cadena de HTML para las imágenes de los Pokémon
        let imagenesPokemonHtml = '<div class="grid grid-cols-3  w-full justify-items-center items ">';
        for (let i = 1; i <= 6; i++) {
            imagenesPokemonHtml += `<img src="${campo[`P${i}`]}" class=" ${equipos.length === 1 ? 'w-3/4 pequeño:w-1/2' : 'w-3/4 pequeño:w-1/2 mediano:w-3/4 grande:w-2/5 h-auto'}">`;
        }
        imagenesPokemonHtml += '</div>';

        // Añade la tarjeta a la cadena de HTML
        tarjetasHtml += `
            <div class=" tarjetaEquipo p-4 rounded-lg shadow-md mb-4 flex flex-col justify-center items-center bg-white border border-gray-200 space-y-2 ${equipos.length === 1 ? 'mediano:w-3/5 grande:w-1/2' : 'w-full'}">
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
                    <button id="${campo.ID}" class="boton-del-equipo text-black p-2 rounded"><i class="fas fa-trash fa-lg"></i></button>
                </div>
            </div>
        `;
    });

    return tarjetasHtml;
}

//Obtiene los divs de equipos y pokemon
let divPokemon = document.getElementById("pokemon");
let divEquipos = document.getElementById("equiposFav");

//Actualiza los estilos de los pokemons segun el numero de pokemon favoritos del usuario
function actualizarEstilosPokemons(numeroPokemons) {
    if (numeroPokemons == 0) {
        divPokemon.className = "";
        divPokemon.classList.add("flex", "items-center", "flex-col", "justify-center","w-10/12", "mb-5", "gap-4");
        divPokemon.innerHTML = '<img id="vacio" src="../img/pokeball-abierta.jpg" alt="pokeball-abierta" class=" grande-s:w-1/6 h-auto mediano-sm:w-1/4 w-1/3">';
        divPokemon.innerHTML += '<p id="vacio1" class="text-2xl font-bold text-center mediano-sm:text-start">Oops, it seems you dont have favorite Pokémon</p>';
    }else if (numeroPokemons == 1) {
        divPokemon.className = "";
        divPokemon.classList.add("grid", "grid-cols-1", "w-10/12" , "place-items-center", "mb-5");
    }else if (numeroPokemons == 2) {
        divPokemon.className = "";
        divPokemon.classList.add("grid", "grid-cols-1", "mediano:grid-cols-2", "gap-4", "mt-4", "mb-4", "w-10/12" , "mb-5");
    }else if (numeroPokemons == 3) {
        divPokemon.className = "";
        divPokemon.classList.add("grid", "grid-cols-1", "mediano-sm:grid-cols-2", "grande:grid-cols-3", "gap-3", "w-10/12" , "mb-5");
    }else if (numeroPokemons >= 4) {
        divPokemon.className = "";
        divPokemon.classList.add("grid", "grid-cols-1", "mediano-sm:grid-cols-2", "mediano-xl:grid-cols-3", "m-grande:grid-cols-4", "gap-4", "mt-4", "mb-5", "w-10/12");
    }

}

//Actualiza los estilos de los equipos segun el numero de equipos favoritos del usuario
function actualizarEstilosEquipos(numeroEquipos) {
    if (numeroEquipos == 0) {
        divEquipos.className = "";
        divEquipos.classList.add("flex", "items-center", "flex-col", "justify-center","w-10/12", "mb-5", "gap-4");
        divEquipos.innerHTML = '<img id="vacio1" src="../img/pokeball-abierta.jpg" alt="pokeball-abierta" class=" grande-s:w-1/6 h-auto mediano-sm:w-1/4 w-1/3">';
        divEquipos.innerHTML += '<p id="vacio1.1" class="text-2xl font-bold text-center mediano-sm:text-start">Oops, it seems you dont have favorite teams</p>';
    }else if (numeroEquipos == 1) {
        divEquipos.className = "";
        divEquipos.classList.add("grid", "grid-cols-1", "w-10/12" , "place-items-center");
    }else if (numeroEquipos >= 2) {
        divEquipos.className = "";
        divEquipos.classList.add("grid", "grid-cols-1", "mediano:grid-cols-2", "gap-3", "w-10/12");
    }
}

// Llama a la función obtenerPokemonsYCrearTarjetas con el array de pokemons
obtenerPokemonsYCrearTarjetas(pokemons);

// Llama a la función obtenerEquiposYCrearTarjetas
obtenerEquiposYCrearTarjetas();

