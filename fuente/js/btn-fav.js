let btn_fav = document.getElementById('favorites');
//Comprueba si la sesion esta iniciada
if (localStorage.getItem('sesion-iniciada')) {
    //Si la sesion esta iniciada muestra el boton de favoritos
    btn_fav.classList.remove("hidden");
 
}