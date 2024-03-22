document.querySelector('#r-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#registro').classList.add('ocultar-l-r');
    document.querySelector('#inicio-sesion').classList.remove('ocultar-l-r');
});

document.querySelector('#r-registro').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector('#inicio-sesion').classList.add('ocultar-l-r');
    document.querySelector('#registro').classList.remove('ocultar-l-r');
});