
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

let pokemonsBuscador = [];
let cache = {}; 

// Función para obtener todos los pokemons
async function obtenerTodosLosPokemonsBuscador() {
    if (cache['pokemonsBuscador']) {
        return cache['pokemonsBuscador'];
    }

    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Comienza con los primeros 100 Pokémon

    while (url) {
        const response = await fetch(url);
        const data = await response.json();

        const pokemonPromises = data.results.map(pokemon => fetch(pokemon.url));
        const pokemonResponses = await Promise.all(pokemonPromises);

        const pokemonDatas = await Promise.all(pokemonResponses.map(response => response.json()));

        let pokemonsConNumeros = pokemonDatas.map((pokemonData, index) => ({
            ...data.results[index],
            numero: pokemonData.id,
            imagen: pokemonData.sprites.front_default
        }));

        pokemonsConNumeros = pokemonsConNumeros.filter(pokemon => !/-gmax$/.test(pokemon.name));

        pokemonsBuscador = pokemonsBuscador.concat(pokemonsConNumeros.filter(pokemon => pokemon.imagen));
        url = data.next; // La URL para la siguiente página de resultados
    }

    console.log(pokemonsBuscador);

    // Guarda los datos en el caché
    cache['pokemonsBuscador'] = pokemonsBuscador;

}

// Llama a la función para obtener todos los pokemons
obtenerTodosLosPokemonsBuscador().catch(console.error);


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
        document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
    }, 1000);
}

function crearTarjetaPokemon(pokemonData) {
    return  `
    <div id="${pokemonData.id}" class=" ${pokemonData.forms[0].name} pokemon-card bg-white border-2 border-gray-300 p-4 relative flex flex-col items-center mx-auto cursor-pointer transform transition duration-500 ease-in-out hover:-translate-y-1 ${applyTransition ? 'animate-fadeIn' : ''}">
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

async function obtenerPokemons(order = 'n-asc') {
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

    let pokemonDataArray = pokemons.slice(offset, offset + limit);

    const pokemonPromises = pokemonDataArray.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    const pokemonDataArrayComplete = await Promise.all(pokemonPromises);

    for (const pokemonData of pokemonDataArrayComplete) {
        pokemonHTML += crearTarjetaPokemon(pokemonData);
    }

    document.querySelector('#pokemon').innerHTML = pokemonHTML;

    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', function() {
            // Obtén el ID del Pokémon de la tarjeta haciendo referencia al ID del elemento HTML
            const pokemonId = this.id;
            
            // Obtén la clase con el nombre del Pokémon
            const pokemonClass = this.classList[0]; // La clase está en la posición 1 del array
            console.log(pokemonClass);
            // Redirige al usuario a la página pokemon.html con el ID del Pokémon como parámetro de consulta
            window.location.href = `../fuente/html/pokemon.html?id=${pokemonId}&name=${pokemonClass}`;
        });
    });

    document.querySelectorAll('.boton-fav').forEach(function(button) {
        // Obtiene el array del localStorage
        let localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));

    
        // Comprueba si el localStorage está iniciado
        if (!localStorageData) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                alert('Para añadir pokemon a favoritos debes iniciar sesión');
            });
            return;
        }
    
        const usuarioId = localStorageData[0];

    
        // Comprueba si el ID del botón está en el array
        if (localStorageData && localStorageData[2].some(pokemon => pokemon.pokemonID == parseInt(button.id))) {
            button.classList.remove("text-black");
            button.classList.add('text-red-500');
        }
    
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            const pokemonId = parseInt(this.id);
    
            // Obtiene el elemento li
            const liFavoritos = document.getElementById('favorites');

            localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));
        
    
            if (this.classList.contains('text-black')) {
                this.classList.remove("text-black");
                this.classList.add('text-red-500');
    
                // Almacena el ID del botón en el localStorage cuando se hace clic en él
                localStorageData[2].push({pokemonID: pokemonId});
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));
    
                // Si el array de favoritos no está vacío, quita la clase 'hidden'
                if (localStorageData[2].length > 0 || localStorageData[1].length > 0) {
                    liFavoritos.classList.remove('hidden');
                }
    
                // Llama a la función PHP para insertar el Pokémon en favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
                formData.append('operacion', 'insertar');
                try {
                    let response = await fetch('../fuente/php/gestionarPokemonFavs.php', {
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
            } else {
                this.classList.remove("text-red-500");
                this.classList.add('text-black');
    
                // Elimina el ID del botón del localStorage cuando se hace clic de nuevo
                localStorageData[2] = localStorageData[2].filter(pokemon => pokemon.pokemonID != pokemonId);
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));
    
                // Si el array de favoritos está vacío, añade la clase 'hidden'
                if (localStorageData[2].length == 0 && localStorageData[1].length == 0 ) {
                    liFavoritos.classList.add('hidden');
                }
    
                // Llama a la función PHP para eliminar el Pokémon de favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
                formData.append('operacion', 'eliminar');
                try {
                    const response = await fetch('../fuente/php/gestionarPokemonFavs.php', {
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
            }
        });
    });
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

        // Filtra los Pokémon con un ID inferior a 10000
        pokemonsPorTipo = pokemonsPorTipo.filter(pokemon => parseInt(pokemon.url.split('/')[6]) < 10000);

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

    document.querySelectorAll('.pokemon-card').forEach(card => {
        card.addEventListener('click', function() {
            // Obtén el ID del Pokémon de la tarjeta haciendo referencia al ID del elemento HTML
            const pokemonId = this.id;
            
            // Obtén la clase con el nombre del Pokémon
            const pokemonClass = this.classList[0]; // La clase está en la posición 1 del array
            console.log(pokemonClass);
            // Redirige al usuario a la página pokemon.html con el ID del Pokémon como parámetro de consulta
            window.location.href = `../fuente/html/pokemon.html?id=${pokemonId}&name=${pokemonClass}`;
        });
    });

    // Añade un evento de clic a cada botón de favoritos
    document.querySelectorAll('.boton-fav').forEach(function(button) {
        // Obtiene el array del localStorage
        const localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));

        // Comprueba si el localStorage está iniciado
        if (!localStorageData) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                alert('Para añadir pokemon a favoritos debes iniciar sesión');
            });
            return;
        }

        const usuarioId = localStorageData[0];
        console.log(usuarioId)
    
        // Comprueba si el ID del botón está en el array
        if (localStorageData && localStorageData[2].some(pokemon => pokemon.pokemonID == parseInt(button.id))) {
            button.classList.remove("text-black");
            button.classList.add('text-red-500');
        }
    
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            const pokemonId = parseInt(this.id);
    
            if (this.classList.contains('text-black')) {
                this.classList.remove("text-black");
                this.classList.add('text-red-500');
                // Almacena el ID del botón en el localStorage cuando se hace clic en él
                localStorageData[2].push({pokemonID: pokemonId});
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));
    
                // Llama a la función PHP para insertar el Pokémon en favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
                formData.append('operacion', 'insertar');
                try {
                    let response = await fetch('../fuente/php/gestionarPokemonFavs.php', {
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
            } else {
                this.classList.remove("text-red-500");
                this.classList.add('text-black');
                // Elimina el ID del botón del localStorage cuando se hace clic de nuevo
                localStorageData[2] = localStorageData[2].filter(pokemon => pokemon.pokemonID != pokemonId);
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));
    
                // Llama a la función PHP para eliminar el Pokémon de favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
                formData.append('operacion', 'eliminar');
                try {
                    const response = await fetch('../fuente/php/gestionarPokemonFavs.php', {
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
            }
        });
    });
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
        document.getElementById('inicio').classList.add('hidden');
    });
});

document.querySelector('#mas').addEventListener('click', function() {
    applyTransition = true; 
    this.classList.add('animate-click');

   
    setTimeout(() => {
        this.classList.remove('animate-click');
    }, 200);

    const filtroDiv = document.getElementById('filtro');
    if (filtroDiv.classList.contains('m-grande:bottom-0')) {
        filtroDiv.classList.remove('m-grande:bottom-0');
    }

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
    document.getElementById('inicio').classList.add('hidden');
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

document.getElementsByTagName('body')[0].classList.add("overflow-hidden");

const buscador1 = document.getElementsByClassName('search-navbar');

Array.from(buscador1).forEach(buscador => {
    buscador.setAttribute("autocomplete", "off");
    const sugerencias = document.createElement("ul");
    sugerencias.id = 'sugerencias';
    sugerencias.classList.add("absolute", "w-full", "bg-white", "border", "border-gray-300", "rounded", "z-10", "hidden", "divide-y", "divide-gray-200");
    buscador.parentNode.appendChild(sugerencias);

    buscador.addEventListener('input', () => {
        sugerencias.innerHTML = "";
        console.log(buscador.value);

        if (buscador.value == '') {
            sugerencias.classList.add("hidden");
            sugerencias.classList.remove("block");
            return;
        }

        let resultadosBusqueda = pokemonsBuscador.filter(pokemon => pokemon.name.startsWith(buscador.value.toLowerCase())).slice(0, 10);

        resultadosBusqueda.forEach(pokemon => {
            let li = document.createElement("li");
            li.classList.add("px-4", "py-2", "cursor-pointer", "hover:bg-gray-200", "flex", "items-center", "justufy-between");
            // Crea un elemento de imagen y establece su fuente en la imagen del Pokémon
            let img = document.createElement("img");
            img.src = pokemon.imagen; 
            img.alt = pokemon.name;
            img.classList.add("w-1/6", "mediano-s:w-modificado-13" ,"mediano-xl:w-1/3", "h-auto");
        
            // Añade la imagen y el nombre del Pokémon al elemento de la lista
            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)));
            
            li.addEventListener("click", () => {
                buscador.value = pokemon.name;
                sugerencias.innerHTML = "";
                sugerencias.classList.add("hidden");

                const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
                if (pokemonSeleccionado) {
                    window.location.href = `../fuente/html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;

                }
            });
            sugerencias.appendChild(li);
        });

        if (resultadosBusqueda.length > 0) {
            sugerencias.classList.remove("hidden");
            sugerencias.classList.add("block");
        } else {
            sugerencias.classList.add("hidden");
            sugerencias.classList.remove("block");
        }
    });

    buscador.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
            if (pokemonSeleccionado) {
                window.location.href = `../fuente/html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
            }
        }
    });

    buscador.addEventListener('search', (e) => {
        e.preventDefault();
        const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
        if (pokemonSeleccionado) {
            window.location.href = `../fuente/html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
        }
    });

});


obtenerTodosLosPokemons()
    .then(() => {
        obtenerPokemons().catch(console.error);
    })
    .catch(console.error);
