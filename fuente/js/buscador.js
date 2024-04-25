// Asegúrate de tener una lista de pokemons disponible
let pokemons = []; 

// Función para obtener todos los pokemons
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

// Llama a la función para obtener todos los pokemons
obtenerTodosLosPokemons().catch(console.error);

const buscador = document.getElementsByClassName('search-navbar');

Array.from(buscador).forEach(buscador => {
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

        let resultadosBusqueda = pokemons.filter(pokemon => pokemon.name.startsWith(buscador.value.toLowerCase())).slice(0, 10);

        resultadosBusqueda.forEach(pokemon => {
            let li = document.createElement("li");
            li.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
            li.classList.add("px-4", "py-2", "cursor-pointer", "hover:bg-gray-200");
            li.addEventListener("click", () => {
                buscador.value = pokemon.name;
                sugerencias.innerHTML = "";
                sugerencias.classList.add("hidden");

                const pokemonSeleccionado = pokemons.find(pokemon => pokemon.name === buscador.value.toLowerCase());
                if (pokemonSeleccionado) {
                    window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}`;
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
            const pokemonSeleccionado = pokemons.find(pokemon => pokemon.name === buscador.value.toLowerCase());
            if (pokemonSeleccionado) {
                window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}`;
            }
        }
    });

    buscador.addEventListener('search', (e) => {
        e.preventDefault();
        const pokemonSeleccionado = pokemons.find(pokemon => pokemon.name === buscador.value.toLowerCase());
        if (pokemonSeleccionado) {
            window.location.href = `../html/pokemon.html?id=${pokemonSeleccionado.numero}`;
        }
    });

});