<?php
require_once "funciones.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$equipoId = $_POST['equipoId'];
    $usuarioId = $_POST['usuarioId'];
    $operacion = $_POST['operacion'];

    if($operacion == "insertar"){
        $res = insertarEquipoFav($usuarioId , $equipoId);
        if($res){
            echo "TRUE";
        }else{
            echo "FALSE";
        }
    }else if($operacion == "eliminar"){
        $res = borrarEquipoFav($usuarioId, $equipoId);
        if($res){
            echo "TRUE";
        }else{
            echo "FALSE";
        }
    }
}