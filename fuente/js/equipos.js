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

    // Crea la tabla de campeones
    const tablaCampeones = crearTabla(campeones);
    document.getElementById('equipos-finalistas').appendChild(tablaCampeones);

    // Crea la tabla de no campeones
    const tablaNoCampeones = crearTabla(noCampeones);
    document.getElementById('resto-equipos').appendChild(tablaNoCampeones);

    /*
    setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
    }, 2000);
    */
}

function crearTabla(datos) {
    // Crea la tabla y el encabezado
    const tabla = document.createElement('table');
    tabla.style.width = '100%';
    tabla.className = 'table-auto border-collapse border border-green-800 m-3'; // Clases de Tailwind para la tabla
    const encabezado = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    const titulos = ['Pais', 'Creado por', 'Resultado', 'Equipo', 'Exportar'];

    titulos.forEach(titulo => {
        const celdaEncabezado = document.createElement('th');
        celdaEncabezado.textContent = titulo;
        celdaEncabezado.className = 'p-2 bg-red-500 text-white';
        filaEncabezado.appendChild(celdaEncabezado);
    });

    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    // Crea el cuerpo de la tabla
    const cuerpo = document.createElement('tbody');

    // Crea una cadena de HTML para las filas
    let filasHtml = '';
    datos.forEach((campo) => {
        // Crea la cadena de HTML para las imágenes de los Pokémon
        // Crea la cadena de HTML para las imágenes de los Pokémon
        let imagenesPokemonHtml = '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">';
        for (let i = 1; i <= 6; i++) {
            imagenesPokemonHtml += `<img src="${campo[`P${i}`]}" class="w-full h-auto">`;
        }
        imagenesPokemonHtml += '</div>';

        // Añade la fila a la cadena de HTML
        filasHtml += `
            <tr class="bg-white even:bg-blue-100">
                <td class="p-2 text-center align-middle w-modificado-5"><img src="${campo.Pais}" class="w-full h-auto"></td>
                <td class="p-2 text-center align-middle"><p class="font-bold text-black">${campo.Autor}</p></td>
                <td class="p-2 text-center align-middle">
                    <div>
                        <p style="color:${typeColors.rojo}">${campo.Torneo}</p>
                        <p class="font-bold ">${campo.Posicion}</p>
                        <p>(${campo.Fecha})</p>
                    </div>
                </td>
                <td class="p-2 text-center align-middle w-2/5">${imagenesPokemonHtml}</td>
                <td class="p-2 text-center align-middle"><i class="fas fa-file-export"></i></td>
            </tr>
        `;
    });

    // Añade todas las filas al cuerpo de la tabla de una sola vez
    cuerpo.innerHTML = filasHtml;
    tabla.appendChild(cuerpo);

    return tabla;
}

obtenerEquipos();