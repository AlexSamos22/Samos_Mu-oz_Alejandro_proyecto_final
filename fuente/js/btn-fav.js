let btn_fav = document.getElementById('favorites');

if (localStorage.getItem('sesion-iniciada')) {
    
    btn_fav.classList.remove("hidden");
 
}