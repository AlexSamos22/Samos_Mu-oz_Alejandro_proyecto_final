<?php
require_once "funciones.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$usuario = $_POST['usuario'];
    $clave = $_POST['contrasena'];
	$usu = comprobar_usuario($usuario, $clave);
	if(count($usu) > 0){
		echo json_encode($usu);
    } else {
        echo json_encode("FALSE");
    }
}else{
    echo json_encode("FALSE");
}