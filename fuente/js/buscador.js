//Lista de pokemons
let pokemonsBuscador = [];
// Caché para almacenar los datos de los pokemons
let cache = {};

// Función para obtener todos los pokemons
async function obtenerTodosLosPokemonsBuscador() {
    // Si los datos ya están en el caché, se devuelven
    if (cache['pokemonsBuscador']) {
        return cache['pokemonsBuscador'];
    }

    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100'; // Comienza con los primeros 100 Pokémon

    //Mientras haya una URL seguir haciendo peticiones
    while (url) {
        const response = await fetch(url);
        const data = await response.json();

        const pokemonPromises = data.results.map(pokemon => fetch(pokemon.url));
        const pokemonResponses = await Promise.all(pokemonPromises);

        const pokemonDatas = await Promise.all(pokemonResponses.map(response => response.json()));

        // Mapea los datos de los pokemons para añadirles un número y una imagen
        let pokemonsConNumeros = pokemonDatas.map((pokemonData, index) => ({
            ...data.results[index],
            numero: pokemonData.id,
            imagen: pokemonData.sprites.front_default
        }));

        // Filtra los pokemons que no sean gmax
        pokemonsConNumeros = pokemonsConNumeros.filter(pokemon => !/-gmax$/.test(pokemon.name));

        // Añade los pokemons con imagen al array de pokemons
        pokemonsBuscador = pokemonsBuscador.concat(pokemonsConNumeros.filter(pokemon => pokemon.imagen));
        url = data.next; // La URL para la siguiente página de resultados
    }

    // Guarda los datos en el caché
    cache['pokemonsBuscador'] = pokemonsBuscador;

}

// Llama a la función para obtener todos los pokemons
obtenerTodosLosPokemonsBuscador().catch(console.error);

const buscador = document.getElementsByClassName('search-navbar');

// Itera sobre los elementos de la clase 'search-navbar' y añade un evento de input a cada uno (hay 2 uno para la versión móvil y otro para la versión de escritorio)
Array.from(buscador).forEach(buscador => {
    buscador.setAttribute("autocomplete", "off");
    const sugerencias = document.createElement("ul");
    sugerencias.id = 'sugerencias';
    sugerencias.classList.add("absolute", "w-full", "bg-white", "border", "border-gray-300", "rounded", "z-10", "hidden", "divide-y", "divide-gray-200");
    buscador.parentNode.appendChild(sugerencias);

    // Añade un evento de input al buscador
    buscador.addEventListener('input', () => {
        sugerencias.innerHTML = "";

        // Si el buscador está vacío, oculta las sugerencias
        if (buscador.value == '') {
            sugerencias.classList.add("hidden");
            sugerencias.classList.remove("block");
            return;
        }

        // Filtra los pokemons que empiecen por el texto introducido en el buscador
        let resultadosBusqueda = pokemonsBuscador.filter(pokemon => pokemon.name.startsWith(buscador.value.toLowerCase())).slice(0, 10);

        // Crea un elemento de lista por cada resultado de la búsqueda
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
        
            // Añade un evento de click al elemento de la lista
            li.addEventListener("click", () => {
                buscador.value = pokemon.name;
                sugerencias.innerHTML = "";
                sugerencias.classList.add("hidden");
                
                // Redirige a la página del Pokémon seleccionado
                const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
                if (pokemonSeleccionado) {
                    window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
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

    // Añade un evento de keydown al buscador para que al pulsar Enter se redirija a la página del Pokémon seleccionado
    buscador.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
            if (pokemonSeleccionado) {
                window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
            }
        }
    });

    // Añade un evento de search al buscador para que al pulsar buscar en moviles se redirija a la página del Pokémon seleccionado
    buscador.addEventListener('search', (e) => {
        e.preventDefault();
        const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
        if (pokemonSeleccionado) {
            window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
        }
    });

});