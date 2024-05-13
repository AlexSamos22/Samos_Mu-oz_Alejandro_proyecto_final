<?php
    function configuracionBaseDatos($nombre, $esquema){
        $config = new DOMDocument();
        $config->load($nombre);
        $res = $config->schemaValidate($esquema);
        if ($res===FALSE){ 
        throw new InvalidArgumentException("Revise fichero de configuración");
        } 		
        $datos = simplexml_load_file($nombre);	
        $ip = $datos->xpath("//ip");
        $nombre = $datos->xpath("//nombre");
        $usu = $datos->xpath("//usuario");
        $clave = $datos->xpath("//clave");	
        $cad = sprintf("mysql:dbname=%s;host=%s", $nombre[0], $ip[0]);
        $resul = [];
        $resul[] = $cad;
        $resul[] = $usu[0];
        $resul[] = $clave[0];
        return $resul;
   }
   function comprobar_usuario($usuario, $cont){
        $encontrado = false;
        $arr = [];
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $bd = new PDO($res[0], $res[1], $res[2]);

        $user = "SELECT ID, usuario, clave FROM usuarios";
    
        $resul = $bd->query($user);

        foreach ($resul as $fila) {
            if($fila['usuario'] === $usuario and password_verify($cont, $fila['clave'])) {
            $encontrado = true;
            array_unshift($arr, $fila['ID'], obtenerEquiposFavs($fila['ID']) , obtenerPokemonFavs($fila['ID']));
            }
        }

        if ($encontrado) {
            return $arr;
        }else{
            return false;
        }
    }

    function registro($usuario, $clave, $correo, $nombre, $apellidos){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);
        $contrasenaCifrada = password_hash($clave, PASSWORD_DEFAULT);
        $usuario_duplicado = false;

        // Comprueba si ya existe un usuario con el mismo nombre
        $check = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
        $checkResult = $db->query($check);
        if ($checkResult->fetchColumn() > 0) {
            $usuario_duplicado = true;
        }

        if ($usuario_duplicado) {
            return false;
        }else{
            $ins = "INSERT INTO usuarios(usuario, clave, correo ,nombre, apellido) values('$usuario', '$contrasenaCifrada', '$correo', '$nombre', '$apellidos')";
    
            $result = $db->query($ins);
        
            if ($result) {
                return true;
            }else{
                return false;
            }
        }
    }

    function borrarUsuario($nombre){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $del = "DELETE FROM usuarios WHERE usuario = '$nombre'";

        $result = $db->query($del);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }

    function equipos(){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);
       
        $equipos = "SELECT * FROM equiposfinalistas";

        $result = $db->query($equipos);

        if ($result) {
            return $result->fetchAll(PDO::FETCH_ASSOC);
        }else{
            return false;
        }
    }

    function obtenerEquipoPorId($id){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $equipo = "SELECT * FROM equiposfinalistas WHERE ID = $id";

        $result = $db->query($equipo);

        if ($result) {
            return $result->fetchAll(PDO::FETCH_ASSOC);
        }else{
            return false;
        }
    }

    function obtenerPokemonFavs($id){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $pokemon = "SELECT pokemonID FROM pokemonfavoritos WHERE usuarioID = $id";

        $result = $db->query($pokemon);

        if ($result) {
            return $result->fetchAll(PDO::FETCH_ASSOC);
        }else{
            return false;
        }
    }

    function obtenerEquiposFavs($id){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $equipos = "SELECT equipoID FROM equiposfavoritos WHERE usuarioID = $id";

        $result = $db->query($equipos);

        if ($result) {
            return $result->fetchAll(PDO::FETCH_ASSOC);
        }else{
            return false;
        }
    }

    function insertarPokemonFav($id, $pokemon){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $ins = "INSERT INTO pokemonfavoritos(usuarioID, pokemonID) values($id, $pokemon)";

        $result = $db->query($ins);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }

    function borrarPokemonFav($id, $pokemon){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $del = "DELETE FROM pokemonfavoritos WHERE UsuarioID = $id AND pokemonID = $pokemon";

        $result = $db->query($del);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }

    function insertarEquipoFav($id, $equipo){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $ins = "INSERT INTO equiposfavoritos(UsuarioID, equipoID) values($id, $equipo)";

        $result = $db->query($ins);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }

    function borrarEquipoFav($id, $equipo){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);

        $del = "DELETE FROM equiposfavoritos WHERE UsuarioID = $id AND equipoID = $equipo";

        $result = $db->query($del);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }
?>