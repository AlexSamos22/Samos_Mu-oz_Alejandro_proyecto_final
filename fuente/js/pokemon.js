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
    const description = speciesData.flavor_text_entries.find(entry => entry.language.name === 'en' && entry.version.name === 'x').flavor_text 
    || speciesData.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;
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

    // Crea una estructura HTML con los datos del Pokémon
    const pokemonHTML = `
        <h1 class="text-4xl font-bold text-blue-600">${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)} #${pokemonId}</h1>
        <div class="grid grid-cols-2 place-items-center ">
            <img class="w-2/5 h-auto rounded-md" src="${pokemonData.sprites.other['official-artwork'].front_default}" alt="${pokemonData.name}">
            <div class="flex flex-col text-black rounded-lg items-center w-11/12">
                <p class="m-2">${description}</p>
                <div class="grid grid-cols-2  bg-bg-info-pokemon rounded-lg min-h-36 w-full">
                    <p class="p-5"><span class="text-white">Height:</span> <span>${pokemonData.height} m</span></p>
                    <p class="p-5"><span class="text-white">Weight:</span> <span>${pokemonData.weight} kg</span></p>
                    <p class="p-5"><span class="text-white">Capture Rate:</span> <span>${captureRate}</span></p>
                    <p class="p-5"><span class="text-white">Base Experience:</span> <span>${baseExperience}</span></p>
                    <p class="p-5 col-span-2"><span class="text-white">Abilities:</span> <span>${abilities}</span></p>
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
        <div class="mb-4">
            <span class="text-lg font-semibold text-gray-700">Type</span>
            <div class="mt-2 flex flex-wrap">
                ${types.split(', ').map(type => `
                    <span class="text-sm text-white rounded-full px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4">
            <span class="text-lg font-semibold text-gray-700">Weaknesses</span>
            <div class="mt-2 flex flex-wrap">
                ${weaknesses.split(', ').map(type => `
                    <span class="text-sm text-white rounded-full px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
        <div class="mb-4">
            <span class="text-lg font-semibold text-gray-700">Strengths</span>
            <div class="mt-2 flex flex-wrap">
                ${strengths.split(', ').map(type => `
                    <span class="text-sm text-white rounded-full px-3 py-1 m-1" style="background-color: ${typeColors[type]};">${type}</span>
                `).join('')}
            </div>
        </div>
    </div>
`;

document.getElementById('stats-tipos').innerHTML += typeHTML;
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
