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
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $bd = new PDO($res[0], $res[1], $res[2]);

        $user = "SELECT ID, usuario, clave FROM usuarios";
    
        $resul = $bd->query($user);

        foreach ($resul as $fila) {
            if($fila['usuario'] === $usuario and password_verify($cont, $fila['clave'])) {
            $encontrado = true;
            }
        }

        if ($encontrado) {
            return true;
        }else{
            return false;
        }
    }

    function registro($usuario, $clave, $correo, $nombre, $apellidos){
        $res = configuracionBaseDatos(dirname(__FILE__)."/configuracion.xml", dirname(__FILE__)."/configuracion.xsd");
        $db = new PDO($res[0], $res[1], $res[2]);
        $contrasenaCifrada = password_hash($clave, PASSWORD_DEFAULT);

        $ins = "INSERT INTO usuarios(usuario, clave, correo ,nombre, apellido) values('$usuario', '$contrasenaCifrada', '$correo', '$nombre', '$apellidos')";

        $result = $db->query($ins);

        if ($result) {
            return true;
        }else{
            return false;
        }
    }
?>