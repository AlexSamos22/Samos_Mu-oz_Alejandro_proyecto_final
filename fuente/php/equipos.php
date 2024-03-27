<?php
require_once "funciones.php";

$array = [];

$array[] = equipos();

echo json_encode($array);