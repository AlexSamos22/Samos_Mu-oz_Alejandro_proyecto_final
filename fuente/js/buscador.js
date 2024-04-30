// Asegúrate de tener una lista de pokemons disponible
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

const buscador = document.getElementsByClassName('search-navbar');

Array.from(buscador).forEach(buscador => {
    buscador.setAttribute("autocomplete", "off");
    const sugerencias = document.createElement("ul");
    sugerencias.id = 'sugerencias';
    sugerencias.classList.add("absolute", "w-full", "bg-white", "border", "border-gray-300", "rounded", "z-10", "hidden", "divide-y", "divide-gray-200");
    buscador.parentNode.appendChild(sugerencias);

    buscador.addEventListener('input', () => {
        sugerencias.innerHTML = "";

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
            img.classList.add("w-modificado-13" ,"mediano-sm:w-1/12", "h-auto", "md:w-1/3");
        
            // Añade la imagen y el nombre del Pokémon al elemento de la lista
            li.appendChild(img);
            li.appendChild(document.createTextNode(pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)));
        
            li.addEventListener("click", () => {
                buscador.value = pokemon.name;
                sugerencias.innerHTML = "";
                sugerencias.classList.add("hidden");
                
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

    buscador.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
            if (pokemonSeleccionado) {
                window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
            }
        }
    });

    buscador.addEventListener('search', (e) => {
        e.preventDefault();
        const pokemonSeleccionado = pokemonsBuscador.find(pokemon => pokemon.name === buscador.value.toLowerCase());
        if (pokemonSeleccionado) {
            window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}&name=${pokemonSeleccionado.name}`;
        }
    });

});