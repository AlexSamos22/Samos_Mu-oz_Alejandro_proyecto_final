if (localStorage.getItem('sesion-iniciada')) {
    document.getElementById('log-in').classList.add('hidden');
    document.getElementById('log-out').classList.remove('hidden');
    
}

document.getElementById('log-out').addEventListener('click', function() {
    alert('Sesión cerrada');
    localStorage.removeItem('sesion-iniciada');
    window.location.reload();
})