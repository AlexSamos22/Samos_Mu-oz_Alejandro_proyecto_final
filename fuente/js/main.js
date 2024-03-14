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

function getFirstTenPokemon() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=12')
        .then(response => response.json())
        .then(data => {
            const pokemonPromises = data.results.map(pokemon => {
                return fetch(pokemon.url)
                    .then(response => response.json());
            });

            Promise.all(pokemonPromises)
                .then(pokemonDataArray => {
                    pokemonDataArray.forEach(pokemonData => {
                        const pokemonHTML = `
                            <div class="pokemon-card bg-white shadow-md rounded-lg overflow-hidden flex flex-col items-center mx-auto transform transition duration-500 ease-in-out hover:-translate-y-2 cursor-pointer">
                                <img class="w-2/4 h-auto" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                                <div class="p-4 text-center">
                                    <h2 class="text-xl font-bold mb-2">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}</h2>
                                    <p class="mb-2">Nº: ${pokemonData.id}</p>
                                    ${pokemonData.types.map(typeInfo => `<span class="inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2" style="background-color: ${typeColors[typeInfo.type.name.toLowerCase()]};">${typeInfo.type.name}</span>`).join('')}
                                </div>
                            </div>
                        `;
                        document.querySelector('#pokemon').innerHTML += pokemonHTML;
                    });
                    const navigationHTML = `
                        <div class="flex justify-between w-1/3 mt-4 mb-4">
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Anterior</button>
                            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Siguiente</button>
                        </div>
                    `;
                    document.querySelector('#navegacion').innerHTML += navigationHTML;
                })
                .catch(error => console.error('Error:', error));
        })
        .catch(error => console.error('Error:', error));
}

getFirstTenPokemon();
