<?php
require_once "funciones.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {     
	$pokemonId = $_POST['pokemonId'];
    $usuarioId = $_POST['usuarioId'];
    $operacion = $_POST['operacion'];

    if($operacion == "insertar"){
        $res = insertarPokemonFav($usuarioId , $pokemonId);
        if($res){
            echo "TRUE";
        }else{
            echo "FALSE";
        }
    }else if($operacion == "eliminar"){
        $res = borrarPokemonFav($usuarioId, $pokemonId);
        if($res){
            echo "TRUE";
        }else{
            echo "FALSE";
        }
    }
}