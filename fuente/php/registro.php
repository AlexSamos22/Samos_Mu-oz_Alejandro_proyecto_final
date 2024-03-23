<?php
require_once "funciones.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    if (isset($_POST['r-usuario']) && isset($_POST['correo']) && isset($_POST['nombre']) && isset($_POST['apellido']) && isset($_POST['r-contrasena'])) {
        $usuario = $_POST['r-usuario'];
        $correo = $_POST['correo'];
        $nombre = $_POST['nombre'];
        $apellidos = $_POST["apellido"];
        $cont = $_POST['r-contrasena'];

        $reg = registro($usuario, $cont, $correo, $nombre, $apellidos);

        if ($reg == true) {
            echo "TRUE";
        }else{
            echo "FALSE";
        }
    }else{
        echo 'FALSE';
    }
    
}

?>