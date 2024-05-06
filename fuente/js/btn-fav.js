let btn_fav = document.getElementById('favorites');

if (localStorage.getItem('sesion-iniciada')) {
    let sesion = JSON.parse(localStorage.getItem('sesion-iniciada'));
    let pokeFav = sesion[2];
    let equipoFav = sesion[1];

    if (pokeFav.length > 0 || equipoFav.length > 0) {
        btn_fav.classList.remove("hidden");
    }
    
}