document.querySelector('#r-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#inicio-sesion').classList.remove('hidden');
});

document.querySelector('#r-registro').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.add('hidden');
    document.querySelector('#registro').classList.remove('hidden');
});

document.getElementById("borrar-cuenta").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.add('hidden');
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#del-cuenta').classList.remove('hidden');
});

document.getElementById("to-login").addEventListener("click", function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.remove('hidden');
    document.querySelector('#registro').classList.add('hidden');
    document.querySelector('#del-cuenta').classList.add('hidden');
});

document.getElementById("form-login").addEventListener("submit", login);

document.getElementById("form-registro").addEventListener("submit", registrarse);

document.getElementById("form-borrar-cuenta").addEventListener("submit", borrarCuenta);

async function login(e) {
    e.preventDefault();
    let usuario = document.getElementById("usuario").value;
    let cont = document.getElementById("contrasena").value;

    let formData = new URLSearchParams();
    formData.append('usuario', usuario);
    formData.append('contrasena', cont);

    try {
        let response = await fetch("../php/login.php", {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let respuesta = await response.json();
        console.log(respuesta);

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

async function registrarse(e) {
    e.preventDefault();
    let usuario = document.getElementById("r-usuario").value;
    let correo = document.getElementById("correo").value;
    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let cont = document.getElementById("r-contrasena").value;

    let formData = new URLSearchParams();
    formData.append('r-usuario', usuario);
    formData.append('r-contrasena', cont);
    formData.append('correo', correo);
    formData.append('nombre', nombre);
    formData.append('apellido', apellido);

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

        document.getElementById("inicio-sesion").classList.remove("hidden");
        document.getElementById("registro").classList.add("hidden");
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}

async function borrarCuenta(e) {
    e.preventDefault();
    let usuario = document.getElementById("usuario-del").value;

    let formData = new URLSearchParams();
    formData.append('usuario', usuario);

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

        document.getElementById("inicio-sesion").classList.remove("hidden");
        document.getElementById("registro").classList.add("hidden");
        document.getElementById("del-cuenta").classList.add("hidden");
    } catch (error) {
        console.error('Error:', error);
    }
    return false;

}