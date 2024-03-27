async function obtenerEquipos() {
    const response = await fetch('../php/equipos.php');
    const data = await response.json();

    // Crea la tabla y el encabezado
    const tabla = document.createElement('table');
    tabla.className = 'table-auto border-collapse border border-green-800 m-3'; // Clases de Tailwind para la tabla
    const encabezado = document.createElement('thead');
    const filaEncabezado = document.createElement('tr');
    const titulos = ['Pais', 'Creado por', 'Resultado', 'Equipo', 'Exportar'];

    titulos.forEach(titulo => {
        const celdaEncabezado = document.createElement('th');
        celdaEncabezado.textContent = titulo;
        filaEncabezado.appendChild(celdaEncabezado);
    });

    encabezado.appendChild(filaEncabezado);
    tabla.appendChild(encabezado);

    // Crea el cuerpo de la tabla
    const cuerpo = document.createElement('tbody');

    // Crea una cadena de HTML para las filas
    let filasHtml = '';
    data.forEach((arrayDeCampos) => {
        arrayDeCampos.forEach((campo) => {
            // Crea la cadena de HTML para las imágenes de los Pokémon
            let imagenesPokemonHtml = '';
            for (let i = 1; i <= 6; i++) {
                imagenesPokemonHtml += `<img src="${campo[`P${i}`]}" class="w-6 h-6 mr-2">`;
            }

            // Añade la fila a la cadena de HTML
            filasHtml += `
                <tr>
                    <td class="border border-green-600 p-2"><img src="${campo.Pais}" class="w-6 h-6"></td>
                    <td class="border border-green-600 p-2">${campo.Autor}</td>
                    <td class="border border-green-600 p-2">${campo.Torneo}\n${campo.Posicion}\n${campo.Fecha}</td>
                    <td class="border border-green-600 p-2 flex">${imagenesPokemonHtml}</td>
                    <td class="border border-green-600 p-2"><i class="fas fa-file-export text-green-600"></i></td>
                </tr>
            `;
        });
    });

    // Añade todas las filas al cuerpo de la tabla de una sola vez
    cuerpo.innerHTML = filasHtml;
    tabla.appendChild(cuerpo);

    // Agrega la tabla al body del documento
    document.getElementById('equipos-finalistas').appendChild(tabla);

    setTimeout(() => {
        document.getElementById('pantalla-carga').classList.remove('flex');
        document.getElementById('pantalla-carga').classList.add('hidden');
    }, 2000);
}
    
obtenerEquipos();