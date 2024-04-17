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

document.getElementById("form-login").addEventListener("submit", login);

document.getElementById("form-registro").addEventListener("submit", registrarse);

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

        let respuesta = await response.text();

        if (respuesta == "TRUE") {
            alert("Inicio de sesión exitoso");
            localStorage.setItem("sesion-iniciada", usuario);
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
            alert("Cuenta no creada");
        }

        document.getElementById("inicio-sesion").classList.remove("ocultar-l-r");
        document.getElementById("registro").classList.add("ocultar-l-r");
    } catch (error) {
        console.error('Error:', error);
    }
    return false;
}