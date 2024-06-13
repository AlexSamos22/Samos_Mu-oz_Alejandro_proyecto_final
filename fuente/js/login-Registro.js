let usuario_registro = document.getElementById("r-usuario");
let correo_registro = document.getElementById("correo");
let nombre_registro = document.getElementById("nombre");
let apellido_registro = document.getElementById("apellido");
let cont_registro = document.getElementById("r-contrasena");
let btn_registro = document.getElementById("btn_registro");

//Poner todos los campos del registro como disabled al inicio menos el campo del nombre de usuario porque es el primero que se llena
correo_registro.disabled = true;
usuario_registro.disabled = true;
apellido_registro.disabled = true;
cont_registro.disabled = true;
btn_registro.disabled = true;

//Oculta el registro y muestra el inicio de sesion
document.querySelector('#r-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#inicio-sesion').classList.remove('hidden');
});

//Oculta el inicio de sesion y muestra el registro
document.querySelector('#r-registro').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.add('hidden');
    document.querySelector('#registro').classList.remove('hidden');
});

//Oculta el inicio de sesion y muestra el borrar cuenta
document.getElementById("borrar-cuenta").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.add('hidden');
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#del-cuenta').classList.remove('hidden');
});

//Oculta el borrar cuenta y muestra el inicio de sesion
document.getElementById("to-login").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.remove('hidden');
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#del-cuenta').classList.add('hidden');
});

//Se le añade un evento a los formularios para que se envien los datos a la base de datos
document.getElementById("form-login").addEventListener("submit", login);

document.getElementById("form-registro").addEventListener("submit", registrarse);

document.getElementById("form-borrar-cuenta").addEventListener("submit", borrarCuenta);

//Funcion para el inicio de sesion
async function login(e) {
    e.preventDefault();
    //Se obtienen los valores de los campos de usuario y contraseña
    let usuario = document.getElementById("usuario").value;
    let cont = document.getElementById("contrasena").value;

    //Se crea un objeto URLSearchParams para enviar los datos al servidor
    let formData = new URLSearchParams();
    formData.append('usuario', usuario);
    formData.append('contrasena', cont);

    //Se hace una peticion al servidor para verificar si los datos son correctos
    try {
        let response = await fetch("../php/login.php", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let respuesta = await response.json();

        //Si la respuesta no esta vacia, se inicia la sesion y se redirige al index
        if (Object.keys(respuesta).length > 0) {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("sesion-iniciada", JSON.stringify(respuesta));
            window.location.href = "../index.html";
        } else {
            alert("Inicio de sesión fallido");
        }

        
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}

//Funcion para el registro de un nuevo usuario
async function registrarse(e) {
    e.preventDefault();
    //Se obtienen los valores de los campos de usuario, correo, nombre, apellido y contraseña
    let usuario = document.getElementById("r-usuario").value;
    let correo = document.getElementById("correo").value;
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let cont = document.getElementById("r-contrasena").value;

    //Se crea un objeto URLSearchParams para enviar los datos al servidor
    let formData = new URLSearchParams();
    formData.append('r-usuario', usuario);
    formData.append('r-contrasena', cont);
    formData.append('correo', correo);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);

    //Se hace una peticion al servidor para registrar los datos
    try {
        let response = await fetch("../php/registro.php", {
            method: 'POST',
            body: formData
        });

        let respuesta = await response.text();

        if (respuesta == "TRUE") {
            alert("Cuenta creada con exito");
        } else {
            alert("Nombre de usuario ya existente");
            return;
        }

        //Se oculta el registro y se muestra el inicio de sesion en caso de que el registro sea exitoso
        document.getElementById("inicio-sesion").classList.remove("hidden");
        document.getElementById("registro").classList.add("hidden");
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}

//Funcion para borrar una cuenta
async function borrarCuenta(e) {
    e.preventDefault();
    //Se obtiene el valor del campo de usuario
    let usuario = document.getElementById("usuario-del").value;

    //Se crea un objeto URLSearchParams para enviar los datos al servidor
    let formData = new URLSearchParams();
    formData.append('usuario', usuario);

    //Se hace una peticion al servidor para borrar la cuenta
    try {
        let response = await fetch("../php/borrarCuenta.php", {
            method: 'POST',
            body: formData
        });

        let respuesta = await response.text();

        if (respuesta == "TRUE") {
            alert("Cuenta borrada con exito");
        } else {
            alert("Error al borrar la cuenta");
        }

        //Se oculta el borrar cuenta y se muestra el inicio de sesion en caso de que el borrado sea exitoso
        document.getElementById("inicio-sesion").classList.remove("hidden");
        document.getElementById("registro").classList.add("hidden");
        document.getElementById("del-cuenta").classList.add("hidden");
    } catch (error) {
        console.error('Error:', error);
    }
    return false;

}

//Muesta el mensaje de error si algun parametro del campo no coincide
function mostrarMensajeError(campoError, mensaje) {
    let parrafo = document.getElementById(`error_${campoError}`);
    parrafo.classList.remove('hidden');
    parrafo.textContent = mensaje;
}

//Quita el mensaje de error si el campo es correcto
function quitarMensajeError(campoError) {
    let parrafo = document.getElementById(`error_${campoError}`);
    parrafo.classList.add('hidden');
    parrafo.textContent = "";
}

//Evento para la validacion del campo nombre del registro
nombre_registro.addEventListener('input', function () {
    let nombreValor = nombre_registro.value;
    let regexNombre = /^[a-zA-Z]+$/.test(nombreValor);

    if (!regexNombre || nombreValor === "") {
        // Si el nombre no es válido o está vacío, deshabilitar los campos de abajo
        apellido_registro.disabled = true;
        cont_registro.disabled = true;
        usuario_registro.disabled = true;
        cont_registro.disabled = true;
        btn_registro.disabled = true;
        nombre_registro.setCustomValidity('El nombre solo puede contener letras');
        mostrarMensajeError("nombre", "El nombre solo puede contener letras");
    } else {
        // Si el nombre  es válido, habilitar el campo de apellidos
        apellido_registro.disabled = false;
        nombre_registro.setCustomValidity('');
        quitarMensajeError("nombre");
    }
});

//Evento para la validacion del campo apellido del registro
apellido_registro.addEventListener('input', function () {
    let apellidoValor = apellido_registro.value;
    let regexApellido = /^[a-zA-Z]+$/.test(apellidoValor);

    if (!regexApellido || apellidoValor === "") {
        // Si el apellido no es válido o está vacío, deshabilitar los campos de abajo
        correo_registro.disabled = true;
        usuario_registro.disabled = true;
        cont_registro.disabled = true;
        btn_registro.disabled = true;
        apellido_registro.setCustomValidity('El apellido solo puede contener letras');
        mostrarMensajeError("apellido", "El apellido solo puede contener letras");
    } else {
        // Si el apellido es válido, habilitar el campo de correo
        correo_registro.disabled = false;
        apellido_registro.setCustomValidity('');
        quitarMensajeError("apellido");
    }
});

//Evento para la validacion del campo correo del registro
correo_registro.addEventListener('input', function () {
    let correoValor = correo_registro.value;
    let regexCorreo = /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}$/.test(correoValor);

    if (!regexCorreo || correoValor === "") {
        // Si el correo no es válido o está vacío, deshabilitar los campos de abajo
        usuario_registro.disabled = true;
        cont_registro.disabled = true;
        btn_registro.disabled = true;
        correo_registro.setCustomValidity('El correo solo puede contener letras, numeros y - _ .');
        mostrarMensajeError("correo", "El correo solo puede contener letras, numeros y - _ .");
    } else {
        // Si el correo es válido, habilitar el campo de usuario
        usuario_registro.disabled = false;
        correo_registro.setCustomValidity('');
        quitarMensajeError("correo");

    }
});

//Evento para la validacion del campo usuario del registro
usuario_registro.addEventListener('input', function () {
    let usuarioValor = usuario_registro.value;
    let regexUsuario = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*$/.test(usuarioValor);

    if (!regexUsuario || usuarioValor === "") {
        // Si el usuario no es válido o está vacío, deshabilitar los campos de abajo
        cont_registro.disabled = true;
        btn_registro.disabled = true;
        usuario_registro.setCustomValidity('El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
        mostrarMensajeError("usuario", 'El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
    } else {
        // Si el usuario es válido, habilitar el campo de contraseña
        cont_registro.disabled = false;
        usuario_registro.setCustomValidity('');
        quitarMensajeError("usuario");
    }
});

//Evento para la validacion del campo contraseña del registro
cont_registro.addEventListener('input', function () {
    let contValor = cont_registro.value;
    //Se usan las busquedas positivas para asegurar que si o si aparezcan 1 de cada tipo
    let regexCont = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-.@])[A-Za-z\d_\-.@]*/.test(contValor);

    if (!regexCont || contValor === "") {
        // Si la contraseña no es válida o está vacía, deshabilitar el botón de registro
        btn_registro.disabled = true;
        cont_registro.setCustomValidity('La contraseña debe contener al menos una minuscula, una mayuscula, un numero y un _ , - o .');
        mostrarMensajeError("contrasena", 'La contraseña debe contener al menos una minuscula, una mayuscula, un numero y un _ , - o .');
    } else {
        // Si la contraseña es válida, habilitar el botón de registro
        btn_registro.disabled = false;
        cont_registro.setCustomValidity('');
        quitarMensajeError("contrasena");
    }
});

