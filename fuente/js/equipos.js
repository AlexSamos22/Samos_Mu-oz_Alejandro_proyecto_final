const typeColors = {
    rojo: '#FF0000',
};

document.getElementsByTagName('body')[0].classList.add("overflow-hidden");

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

    setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
        document.getElementsByTagName('body')[0].classList.remove("overflow-hidden");
    }, 1000);

        // Añade un evento de clic a cada botón de favoritos
        document.querySelectorAll('.boton-fav').forEach(function(button) {
            // Obtiene el array del localStorage
            let localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));
    
            // Comprueba si el localStorage está iniciado
            if (!localStorageData) {
                button.addEventListener('click', function(e) {
                    e.stopPropagation();
                    alert('Para añadir un equipo a favoritos debes iniciar sesión');
                });
                return;
            }
    
            const usuarioId = localStorageData[0];
        
            // Comprueba si el ID del botón está en el array
            if (localStorageData && localStorageData[1].some(equipo => equipo.equipoID == parseInt(button.id))) {
                button.classList.remove("text-black");
                button.classList.add('text-red-500');
            }
        
            button.addEventListener('click', async function(e) {
                e.stopPropagation();
                const equipoId = parseInt(this.id);

                localStorageData = JSON.parse(localStorage.getItem('sesion-iniciada'));

        
                if (this.classList.contains('text-black')) {
                    this.classList.remove("text-black");
                    this.classList.add('text-red-500');
                    // Almacena el ID del botón en el localStorage cuando se hace clic en él
                    localStorageData[1].push({equipoID: equipoId});
                    localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));

        
                    // Llama a la función PHP para insertar el Pokémon en favoritos
                    let formData = new URLSearchParams();
                    formData.append('usuarioId', usuarioId);
                    formData.append('equipoId', equipoId);
                    formData.append('operacion', 'insertar');
                    try {
                        let response = await fetch('../php/gestionarEquiposFavs.php', {
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
                    localStorageData[1] = localStorageData[1].filter(equipo => equipo.equipoID != equipoId);
                    localStorage.setItem('sesion-iniciada', JSON.stringify(localStorageData));

        
                    // Llama a la función PHP para eliminar el Pokémon de favoritos
                    let formData = new URLSearchParams();
                    formData.append('usuarioId', usuarioId);
                    formData.append('equipoId', equipoId);
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
                    <button id="${campo.ID}" class="boton-fav text-black p-2 rounded"><i class="fas fa-heart fa-lg"></i></button>
                </div>
            </div>
        `;
    });

    return tarjetasHtml;
}

if (localStorage.getItem('sesion-iniciada')) {
    document.getElementById('log-in').classList.add('hidden');
    document.getElementById('log-out').classList.remove('hidden');
    
}

document.getElementById('log-out').addEventListener('click', function() {
    alert('Sesión cerrada');
    localStorage.removeItem('sesion-iniciada');
    window.location.reload();
})

obtenerEquipos();

