//Objeto con los colores de los tipos de Pokémon
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


document.getElementsByTagName('body')[0].classList.add("overflow-hidden");
  

// Recoge la ID y el nombre del Pokémon de la URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');
const pokemonName = urlParams.get('name');

// Muestra los detalles del Pokémon
async function mostrarDetallesPokemon(pokemonId) {
    // Obtiene los datos del Pokémon de la API
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = await response.json();

    // Obtiene los datos de la especie del Pokémon para la descripción
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    // Encuentra la descripción en inglés
    const description = (speciesData.flavor_text_entries.find(entry => entry.language?.name === 'en' && entry.version?.name === 'x')
    || speciesData.flavor_text_entries.find(entry => entry.language?.name === 'en'))?.flavor_text || '';

    // Obtiene los tipos del Pokémon
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');

    // Obtiene las habilidades del Pokémon
    const abilities = pokemonData.abilities && pokemonData.abilities.length > 0 ? pokemonData.abilities.map(abilityInfo => { return abilityInfo.is_hidden ? `${abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)} (hidden)` : abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1);
    }).join(' / ') : '';

    // Obtiene la experiencia base, el ratio de captura y la felicidad base
    const baseExperience = pokemonData.base_experience || 0;
    const captureRate = speciesData.capture_rate || 0;

    // Obtiene las estadísticas base del Pokémon
    const stats = pokemonData.stats;

    // Calcula las debilidades del Pokémon
    const weaknesses = calculateWeaknesses(types.split(', ')).join(', ');

    // Calcula los tipos contra los que el Pokémon es eficaz
    const strengths = calculateStrengths(types.split(', ')).join(', ');

    // Obtiene los datos de la cadena de evolución
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();

     // Procesa la cadena de evolución
     let currentEvolution = evolutionData.chain;
     const evolutionChain = [];

     
 
     do {
        // Obtiene los datos del Pokémon para esta evolución
        let pokemonResponse = "";

        try {
            pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentEvolution.species.name}`);
            if (!pokemonResponse.ok) {
                throw new Error(`HTTP error! status: ${pokemonResponse.status}`);
            }
        } catch (error) {
            try {
                pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                if (!pokemonResponse.ok) {
                    throw new Error(`HTTP error! status: ${pokemonResponse.status}`);
                }
            } catch (error) {
               
            }
        }
        
        
        
        const pokemonData = await pokemonResponse.json();
 
        // Añade los datos del Pokémon a la cadena de evolución
        evolutionChain.push({
            species_name: currentEvolution.species.name.charAt(0).toUpperCase() + currentEvolution.species.name.slice(1),
            sprite: pokemonData.sprites.other['official-artwork'].front_default,
            types: pokemonData.types.map(typeInfo => typeInfo.type.name),
            id: pokemonData.id
        });


    
        currentEvolution = currentEvolution.evolves_to[0];
    } while (!!currentEvolution && currentEvolution.hasOwnProperty('evolves_to'));

    const height = pokemonData.height || 0;
    const weight = pokemonData.weight || 0;
    

    // Crea una estructura HTML con los datos del Pokémon
    const pokemonHTML = `
        <h1 class="text-4xl font-bold text-titulos-subtitulos mb-5 block mediano-g:hidden text-center">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} #${pokemonId}</h1>
        <div class="grid grid-cols-1 gap-3 mediano-g:grid-cols-2 mediano-g:gap-0 place-items-center w-full">
            <div class=" w-3/4 pequeño-s:w-1/2 h-auto rounded-md flex flex-col items-center justify-center">
                <img id="normalImage" class="w-full h-auto rounded-md" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                <img id="shinyImage" class="w-full h-auto rounded-md hidden" src="${pokemonData.sprites.other['official-artwork'].front_shiny}" alt="${pokemonData.name}">
                <div class="flex justify-between gap-4">
                    <button onclick="document.getElementById('normalImage').classList.remove('hidden'); document.getElementById('shinyImage').classList.add('hidden');" class="bg-bg-botones hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Normal</button>
                    ${pokemonData.sprites.other['official-artwork'].front_shiny ? `<button onclick="document.getElementById('shinyImage').classList.remove('hidden'); document.getElementById('normalImage').classList.add('hidden');" class="bg-bg-botones hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Shiny</button>` : ''}
                    <button id="${pokemonId}" class="boton-fav bg-bg-botones hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"><i class="fas fa-heart fa-lg"></i></button>

                </div>
            </div>
            <div class="flex flex-col text-black rounded-lg items-center w-11/12">
            <h1 class="text-4xl font-bold text-blue-600 mb-5 hidden mediano-g:block">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} #${pokemonId}</h1>
                <p class="m-2 text-center">${description}</p>
                <div class="hidden grid-cols-1 pequeño:grid  border-2 border-gray-300 rounded-lg shadow-lg p-2 grande:p-3 min-h-36 w-full">
                    <p class=" p-1 grande-sm:p-5"><span class="text-black font-bold">Height:</span> <span>${height} m</span></p>
                    <p class="p-1 grande-sm:p-5"><span class="text-black font-bold">Weight:</span> <span>${weight} kg</span></p>
                    <p class="p-1 grande-sm:p-5"><span class="text-black font-bold">Capture Rate:</span> <span>${captureRate}</span></p>
                    <p class="p-1 grande-sm:p-5"><span class="text-black font-bold">Base Experience:</span> <span>${baseExperience}</span></p>
                    <p class="p-1 grande-sm:p-5 col-span-2"><span class="text-black font-bold">Abilities:</span> <span>${abilities}</span></p>
                </div>
                <div class=" block pequeño:hidden border-2 border-gray-300 rounded-lg shadow-lg p-2 grande:p-4 min-h-36 w-full">
                    <p class="flex flex-col justify-center items-center w-full mb-3"><span class="text-black font-bold">Height</span> <span>${weight} m</span></p>
                    <p class="flex flex-col justify-center items-center w-full mb-3"><span class="text-black font-bold">Weight</span> <span>${weight} kg</span></p>
                    <p class="flex flex-col justify-center items-center w-full mb-3"><span class="text-black font-bold">Capture Rate</span> <span>${captureRate}</span></p>
                    <p class="flex flex-col justify-center items-center w-full mb-3"><span class="text-black font-bold">Base Experience</span> <span>${baseExperience}</span></p>
                    <p class="flex flex-col justify-center items-center w-full"><span class="text-black font-bold">Abilities</span> <span class="block text-center mx-auto">${abilities}</span></p>
                </div>
            </div>
        </div>
    `;

    // Añade la estructura HTML al contenedor
    document.getElementById('info-principal').innerHTML = pokemonHTML;

    // Añade el contenedor de estadísticas base del Pokémon
    const statsHTML = `
    <div class="w-full flex flex-col items-center self-start">
    <h2 class="text-xl font-bold mb-4">Base Stats</h2>
    ${stats.map(stat => `
        <div class="flex items-center justify-center mb-2 w-full">
            <div class="w-3/4 flex justify-start items-center gap-6 mediano-s:gap-0">
                <div class="flex w-1/5 justify-between ">
                    <span class="mr-3">${getStatLabel(stat.stat.name)}</span>
                    <span class="mr-2">${stat.base_stat}</span>
                </div>  
                
                <div class="h-4 rounded-md flex-1 flex justify-start">
                    <div class="h-full rounded-md" style="width: ${stat.base_stat}%; background-color: ${getBarColor(stat.base_stat)};"></div>
                </div>
            </div>
        </div>
    `).join('')}
    </div>

    `;
document.getElementById('i').innerHTML += statsHTML;

    // Añadir contenedor de tipos, debilidades, fortalezas del Pokémon
    const typeHTML = `
    <div class=" w-11/12 flex flex-col items-center">
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Type</span>
            <div class="mt-2 flex flex-wrap justify-center">
                ${types.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Weaknesses</span>
            <div class="mt-2 flex flex-wrap justify-center">
                ${weaknesses.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Strengths</span>
            <div class="mt-2 flex flex-wrap justify-center">
            ${
                strengths.trim() === '' 
                ? '<p>Este Pokémon no es fuerte contra ningun tipo</p>' 
                : strengths.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')
            }
            </div>
        </div>
    </div>
    `;

    document.getElementById('i').innerHTML += typeHTML;

    // Genera el HTML para la cadena de evolución
    const evolutionHTML = evolutionChain.map((evolution, index) => `
        <div class="flex flex-col items-center m-4">
            <div id="${evolution.id}" class="flex justify-center items-center cursor-pointer" onclick="changePokemon(this.id)">
                <img class="${evolutionChain.length === 3 ? 'w-2/5 mediano-g:w-1/2' : ' w-2/5 pequeño:w-1/3'}" src="${evolution.sprite}" alt="${evolution.species_name}">
            </div>
            <h2 class="mt-2">${evolution.species_name}</h2>
            <div class="flex flex-wrap justify-center">
                ${evolution.types.map(type => `
                    <span class="text-sm text-white font-semibold rounded px-2 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        ${index < evolutionChain.length - 1 ? `
        <div class="mediano-g:flex hidden items-center justify-center"><i class=" fas fa-arrow-right fa-2x mx-8"></i></div>  <div class="mediano-g:hidden flex items-center justify-center"><i class="mediano-g:hidden flex fas fa-arrow-down fa-2x  items-center justify-center mx-8"></i></div>` : ''}
    `).join('');

    // Establece el HTML del elemento de la cadena de evolución
    document.getElementById("evo").innerHTML = evolutionHTML;

    // Añade el evento de clic a los botones de favoritos
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
            button.classList.remove("bg-blue-500");
            button.classList.remove('hover:bg-blue-700');
            button.classList.add('bg-red-500');
            button.classList.add('hover:bg-red-700');
        }
        // Añade el evento de clic a los botones de favoritos
        button.addEventListener('click', async function(e) {
            e.stopPropagation();
            const pokemonId = parseInt(this.id);

            localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));
        
            // Comprueba si el botón está en favoritos
            if (this.classList.contains('bg-bg-botones')) {
                this.classList.remove("bg-bg-botones");
                this.classList.remove('hover:bg-blue-700');
                this.classList.add('bg-red-500');
                this.classList.add('hover:bg-red-700');
    
                // Almacena el ID del botón en el localStorage cuando se hace clic en él
                localStorageData[2].push({pokemonID: pokemonId});
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));
    
                // Llama a la función PHP para insertar el Pokémon en favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
                formData.append('operacion', 'insertar');
                try {
                    let response = await fetch('../php/gestionarPokemonFavs.php', {
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
                this.classList.add("bg-bg-botones");
                this.classList.add('hover:bg-blue-700');
                this.classList.remove('bg-red-500');
                this.classList.remove('hover:bg-red-700');
    
                // Elimina el ID del botón del localStorage cuando se hace clic de nuevo
                localStorageData[2] = localStorageData[2].filter(pokemon => pokemon.pokemonID != pokemonId);
                localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));

                // Llama a la función PHP para eliminar el Pokémon de favoritos
                let formData = new URLSearchParams();
                formData.append('usuarioId', usuarioId);
                formData.append('pokemonId', pokemonId);
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
            }
        });
    });
    // Quita la pantalla de carga a los 3 segundos
    setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
        document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
    }, 3000);
}
// Obtiene los movimientos que el Pokémon aprende por nivel
async function getLevelUpMoves(pokemonId) {
    //Solicitud a la API de Pokémon para obtener los datos del Pokémon
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = await response.json();

    // Filtra los movimientos para obtener solo los que el Pokémon aprende por nivel
    const levelUpMoves = pokemonData.moves.filter(move => move.version_group_details.some(detail => detail.move_learn_method.name === 'level-up'));

    // Ordena los movimientos por nivel de aprendizaje
    levelUpMoves.sort((a, b) => {
        const aLevel = a.version_group_details.find(detail => detail.move_learn_method.name === 'level-up').level_learned_at;
        const bLevel = b.version_group_details.find(detail => detail.move_learn_method.name === 'level-up').level_learned_at;
        return aLevel - bLevel;
    });

    // Mapea los movimientos a un formato más legible
    const movesHTML = await Promise.all(levelUpMoves.map(async move => {
        try {
            // Encuentra los detalles del movimiento que corresponden al método de aprendizaje por nivel
            const levelUpDetail = move.version_group_details.find(detail => detail.move_learn_method.name === 'level-up');
    
            //Solicitud a la API de Pokémon para obtener los datos del movimiento
            const moveResponse = await fetch(move.move.url);
            const moveData = await moveResponse.json();
    
            // Devuelve el HTML para el movimiento
            return `
                <tr class="border-b border-gray-300 hover:bg-gray-200 transition-colors duration-200">
                    <td class="p-3 text-center">${moveData.name.charAt(0).toUpperCase() + moveData.name.slice(1)}</td>
                    <td class="p-3 text-center">${levelUpDetail.level_learned_at}</td>
                    <td class="p-3 text-center text-white flex justify-center"> <p class=" w-full font-semibold rounded px-2 py-1 m-1" style="background-color: ${typeColors[moveData.type.name]};" >${moveData.type.name}</p></td>
                    <td class="p-3 text-center">${moveData.pp}</td>
                    <td class="p-3 text-center">${moveData.accuracy || 0}</td>
                    <td class="p-3 text-center">${moveData.power || 0}</td>
                </tr>
            `;
        } catch (error) {
            //Si el movimiento no se puede obtener, devuelve una cadena vacía
            console.error(`Error fetching move data for ${move.move.url}:`, error);
            return '';  
        }
    }));
    
    // Devuelve el HTML de los movimientos
    const tableHTML = `
        <table class="w-full text-left table-auto shadow-lg">
            <thead class="bg-blue-800 text-white">
                <tr>
                    <th class="p-3 text-center">Name</th>
                    <th class="p-3 text-center">Level</th>
                    <th class="p-3 text-center">Type</th>
                    <th class="p-3 text-center">PP</th>
                    <th class="p-3 text-center">Accuracy</th>
                    <th class="p-3 text-center">Power</th>
                </tr>
            </thead>
            <tbody>
                ${movesHTML.join('')}
            </tbody>
        </table>
    `;
    
    // Establece el HTML de la lista de movimientos
    document.getElementById('ataques').innerHTML += tableHTML;
}
// Calcula las debilidades del Pokémon
function calculateWeaknesses(types) {
    var weaknesses = [];
    var weaknessChart = {
        "normal": ["fighting"],
        "fire": ["water", "rock", "ground"],
        "water": ["electric", "grass"],
        "electric": ["ground"],
        "grass": ["fire", "ice", "poison", "flying", "bug"],
        "ice": ["fire", "fighting", "rock", "steel"],
        "fighting": ["flying", "psychic", "fairy"],
        "poison": ["ground", "psychic"],
        "ground": ["water", "grass", "ice"],
        "flying": ["electric", "ice", "rock"],
        "psychic": ["bug", "ghost", "dark"],
        "bug": ["fire", "flying", "rock"],
        "rock": ["water", "grass", "fighting", "ground", "steel"],
        "ghost": ["ghost", "dark"],
        "dragon": ["ice", "dragon", "fairy"],
        "dark": ["fighting", "bug", "fairy"],
        "steel": ["fire", "fighting", "ground"],
        "fairy": ["poison", "steel"]
    };
    
    types.forEach(function(type){
        if (weaknessChart[type]) {
            weaknesses = weaknesses.concat(weaknessChart[type]);
        }
    });
    
    // Eliminar tipos duplicados
    weaknesses = [...new Set(weaknesses)];
    
    return weaknesses;
}
// Calcula las fortalezas del Pokémon
function calculateStrengths(types) {
    var strengths = [];
    var strengthChart = {
        "normal": [],
        "fire": ["grass", "ice", "bug", "steel"],
        "water": ["fire", "ground", "rock"],
        "electric": ["water", "flying"],
        "grass": ["water", "ground", "rock"],
        "ice": ["grass", "ground", "flying", "dragon"],
        "fighting": ["normal", "ice", "rock", "dark", "steel"],
        "poison": ["grass", "fairy"],
        "ground": ["fire", "electric", "poison", "rock", "steel"],
        "flying": ["grass", "fighting", "bug"],
        "psychic": ["fighting", "poison"],
        "bug": ["grass", "psychic", "dark"],
        "rock": ["fire", "ice", "flying", "bug"],
        "ghost": ["psychic", "ghost"],
        "dragon": ["dragon"],
        "dark": ["psychic", "ghost"],
        "steel": ["ice", "rock", "fairy"],
        "fairy": ["fighting", "dragon", "dark"]
    };
    
    types.forEach(function(type){
        if (strengthChart[type]) {
            strengths = strengths.concat(strengthChart[type]);
        }
    });
    
    // Eliminar tipos duplicados
    strengths = [...new Set(strengths)];
    
    return strengths;
}
// Devuelve la etiqueta de la estadística
function getStatLabel(statName) {
    switch (statName) {
        case 'hp':
            return 'Hp';
        case 'attack':
            return 'Atk';
        case 'defense':
            return 'Def';
        case 'special-attack':
            return 'SpA';
        case 'special-defense':
            return 'SpD';
        case 'speed':
            return 'Spd';
        default:
            return statName;
    }
}
// Devuelve el color de la barra de estadísticas
function getBarColor(value) {
    if (value <= 25) {
        return '#FF6347'; // Rojo para valores bajos
    } else if (value <= 50) {
        return '#FFA500'; // Naranja para valores medio-bajos
    } else if (value <= 75) {
        return '#9ACD32'; // Verde claro para valores medio-altos
    } else {
        return '#32CD32'; // Verde puro para valores altos
    }
}
// Cambia a la página de detalles del Pokémon
function changePokemon(id, name=pokemonName) {
    window.location.href = `../html/pokemon.html?id=${id}&name=${name}`;
}
// Muestra los detalles del Pokémon
mostrarDetallesPokemon(pokemonId);
// Obtiene los movimientos que el Pokémon aprende por nivel
getLevelUpMoves(pokemonId);
