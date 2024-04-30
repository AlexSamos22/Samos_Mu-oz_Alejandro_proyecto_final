<?php
require_once "funciones.php";
$arr = [];
if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$usuario = $_POST['usuario'];
    $clave = $_POST['contrasena'];
	$usu = comprobar_usuario($usuario, $clave);
	if($usu == false){
		echo json_encode($arr);
    } else {
        echo json_encode($usu);
    }
}else{
    echo json_encode($arr);
}