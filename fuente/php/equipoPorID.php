<?php
require_once "funciones.php";
$arr = [];
if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$equipoId = $_POST['equipoId'];

    $res = obtenerEquipoPorId($equipoId);

    if($res){
        echo json_encode($res);
    }else{
        echo json_encode($arr);
    }
}