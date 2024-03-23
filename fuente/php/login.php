<?php
require_once "funciones.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$usuario = $_POST['usuario'];
    $clave = $_POST['contrasena'];
	$usu = comprobar_usuario($usuario, $clave);
	if($usu){
		echo "TRUE";
    } else {
        echo "FALSE";
    }
}else{
    echo "FALSE";
}