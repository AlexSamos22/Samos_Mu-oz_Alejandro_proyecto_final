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

// Recoge la ID del Pokémon de la URL
const urlParams = new URLSearchParams(window.location.search);
const pokemonId = urlParams.get('id');


async function mostrarDetallesPokemon(pokemonId) {
    // Obtiene los datos del Pokémon de la API
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const pokemonData = await response.json();

    // Obtiene los datos de la especie del Pokémon para la descripción
    const speciesResponse = await fetch(pokemonData.species.url);
    const speciesData = await speciesResponse.json();

    // Encuentra la descripción en inglés
    const description = (speciesData.flavor_text_entries.find(entry => entry.language.name === 'en' && entry.version.name === 'x')
    || speciesData.flavor_text_entries.find(entry => entry.language.name === 'en')).flavor_text;
    console.log(description);
    // Obtiene los tipos del Pokémon
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name).join(', ');

    // Obtiene las habilidades del Pokémon
    const abilities = pokemonData.abilities.map(abilityInfo => {
        return abilityInfo.is_hidden ? `${abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1)} (hidden)` : abilityInfo.ability.name.charAt(0).toUpperCase() + abilityInfo.ability.name.slice(1);
    }).join(' / ');

    // Obtiene la experiencia base, el ratio de captura y la felicidad base
    const baseExperience = pokemonData.base_experience;
    const captureRate = speciesData.capture_rate;

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
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${currentEvolution.species.name}`);
        const pokemonData = await pokemonResponse.json();
    
        evolutionChain.push({
            species_name: currentEvolution.species.name.charAt(0).toUpperCase() + currentEvolution.species.name.slice(1),
            sprite: pokemonData.sprites.other['official-artwork'].front_default,
            types: pokemonData.types.map(typeInfo => typeInfo.type.name),
        });
    
        currentEvolution = currentEvolution.evolves_to[0];
    } while (!!currentEvolution && currentEvolution.hasOwnProperty('evolves_to'));
    

    // Crea una estructura HTML con los datos del Pokémon
    const pokemonHTML = `
        <h1 class="text-4xl font-bold text-blue-600 mb-5">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} #${pokemonId}</h1>
        <div class="grid grid-cols-2 place-items-center ">
            <div class="w-1/2 h-auto rounded-md">
                <img id="normalImage" class="w-full h-auto rounded-md" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
                <img id="shinyImage" class="w-full h-auto rounded-md hidden" src="${pokemonData.sprites.other['official-artwork'].front_shiny}" alt="${pokemonData.name}">
                <div class="flex justify-center space-x-4">
                    <button onclick="document.getElementById('normalImage').classList.remove('hidden'); document.getElementById('shinyImage').classList.add('hidden');" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Normal</button>
                    <button onclick="document.getElementById('shinyImage').classList.remove('hidden'); document.getElementById('normalImage').classList.add('hidden');" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Shiny</button>
                </div>
            </div>
            <div class="flex flex-col text-black rounded-lg items-center w-11/12">
                <p class="m-2">${description}</p>
                <div class="grid grid-cols-2 border-2 border-gray-300 rounded-lg shadow-lg p-4 min-h-36 w-full">
                    <p class="p-5"><span class="text-black font-bold">Height:</span> <span>${pokemonData.height} m</span></p>
                    <p class="p-5"><span class="text-black font-bold">Weight:</span> <span>${pokemonData.weight} kg</span></p>
                    <p class="p-5"><span class="text-black font-bold">Capture Rate:</span> <span>${captureRate}</span></p>
                    <p class="p-5"><span class="text-black font-bold">Base Experience:</span> <span>${baseExperience}</span></p>
                    <p class="p-5 col-span-2"><span class="text-black font-bold">Abilities:</span> <span>${abilities}</span></p>
                </div>
            </div>
        </div>
    `;

    // Añade la estructura HTML al contenedor
    document.getElementById('info-principal').innerHTML = pokemonHTML;

    // Añadir contenedor de estadísticas base del Pokémon
    const statsHTML = `
    <div class="w-full flex flex-col items-center self-start">
    <h2 class="text-xl font-bold mb-4">Base Stats</h2>
    ${stats.map(stat => `
        <div class="flex items-center justify-center mb-2 w-full">
            <div class="w-3/4 flex justify-start items-center">
                <div class="flex w-1/5 justify-between">
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
document.getElementById('stats-tipos').innerHTML += statsHTML;

    // Añadir contenedor de tipos, debilidades, fortalezas del Pokémon
    const typeHTML = `
    <div class=" w-11/12">
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Type</span>
            <div class="mt-2 flex flex-wrap">
                ${types.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Weaknesses</span>
            <div class="mt-2 flex flex-wrap">
                ${weaknesses.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4 flex flex-col items-center justify-center">
            <span class="text-lg font-bold text-black">Strengths</span>
            <div class="mt-2 flex flex-wrap">
                ${strengths.split(', ').map(type => `
                    <span class="text-sm text-white font-semibold rounded px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
    </div>
    `;

    document.getElementById('stats-tipos').innerHTML += typeHTML;

    // Genera el HTML para la cadena de evolución
    const evolutionHTML = evolutionChain.map((evolution, index) => `
        <div class="flex flex-col items-center m-4">
            <div class="flex justify-center items-center">
                <img class="${evolutionChain.length === 3 ? 'w-1/2' : 'w-1/3'}" src="${evolution.sprite}" alt="${evolution.species_name}">
            </div>
            <h2 class="mt-2">${evolution.species_name}</h2>
            <div class="flex flex-wrap justify-center">
                ${evolution.types.map(type => `
                    <span class="text-sm text-white font-semibold rounded px-2 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        ${index < evolutionChain.length - 1 ? `
        <i class="fas fa-arrow-right fa-2x flex items-center justify-center mx-8"></i>` : ''}
    `).join('');

    // Establece el HTML del elemento de la cadena de evolución
    document.getElementById("evo").innerHTML = evolutionHTML;
}

async function getLevelUpMoves(pokemonId) {
    // Haz una solicitud a la API de Pokémon para obtener los datos del Pokémon
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
        // Encuentra los detalles del movimiento que corresponden al método de aprendizaje por nivel
        const levelUpDetail = move.version_group_details.find(detail => detail.move_learn_method.name === 'level-up');

        // Haz una solicitud a la API de Pokémon para obtener los datos del movimiento
        const moveResponse = await fetch(move.move.url);
        const moveData = await moveResponse.json();

        // Devuelve el HTML para el movimiento
        return `
            <tr class="border-b border-gray-200">
                <td class="p-3 text-center">${moveData.name.charAt(0).toUpperCase() + moveData.name.slice(1)}</td>
                <td class="p-3 text-center">${levelUpDetail.level_learned_at}</td>
                <td class="p-3 text-center text-white flex justify-center"> <p class=" w-full font-semibold rounded px-2 py-1 m-1" style="background-color: ${typeColors[moveData.type.name]};" >${moveData.type.name}</p></td>
                <td class="p-3 text-center">${moveData.pp}</td>
                <td class="p-3 text-center">${moveData.accuracy || 0}</td>
                <td class="p-3 text-center">${moveData.power || 0}</td>
            </tr>
        `;
    }));

    // Devuelve el HTML de los movimientos
    const tableHTML = `
        <table class="w-full text-left table-auto">
            <thead class="bg-gray-800 text-white">
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

mostrarDetallesPokemon(pokemonId);
getLevelUpMoves(pokemonId);
