<?php
require_once "funciones.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$usuario = $_POST['usuario'];
	$usu = borrarUsuario($usuario);
	if($usu){
		echo "TRUE";
    } else {
        echo "FALSE";
    }
}else{
    echo "FALSE";
}