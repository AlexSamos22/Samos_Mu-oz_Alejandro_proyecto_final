const typeColors = {
    rojo: '#FF0000',
};

async function obtenerEquipos() {
    const response = await fetch('../php/equipos.php');
    const data = await response.json();

    const campeones = [];
    const noCampeones = [];

    data.forEach((arrayDeCampos) => {
        arrayDeCampos.forEach((campo) => {
            if (campo.Posicion === 'Champion') {
                campeones.push(campo);
            } else {
                noCampeones.push(campo);
            }
        });
    });

    // Crea las tarjetas de campeones
    const tarjetasCampeones = crearTarjeta(campeones);
    document.getElementById('equipos-finalistas').innerHTML = tarjetasCampeones;

    // Crea las tarjetas de no campeones
    const tarjetasNoCampeones = crearTarjeta(noCampeones);
    document.getElementById('resto-equipos').innerHTML = tarjetasNoCampeones;

    document.querySelectorAll('.boton-fav').forEach(function(button) {
        button.addEventListener('click', function() {
            if (this.classList.contains('text-black')) {
                this.classList.remove("text-black");
                this.classList.add('text-red-500');
            }else{
                this.classList.remove("text-red-500");
                this.classList.add('text-black');
            }
            
        });
    });
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
                    <button id=fav-${campo.ID} class="boton-fav text-black p-2 rounded"><i class="fas fa-heart fa-lg"></i></button>
                </div>
            </div>
        `;
    });

    return tarjetasHtml;
}

obtenerEquipos();

