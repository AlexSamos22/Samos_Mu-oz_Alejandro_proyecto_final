//Si existe la session iniciada, oculta el botón de iniciar sesión y muestra el de cerrar sesión
if (localStorage.getItem('sesion-iniciada')) {
    document.getElementById('log-in').classList.add('hidden');
    document.getElementById('log-out').classList.remove('hidden');
    
}

// Añade un evento de click al botón de cerrar sesión
document.getElementById('log-out').addEventListener('click', function() {
    alert('Sesión cerrada');
    localStorage.removeItem('sesion-iniciada');
    window.location.reload();
})