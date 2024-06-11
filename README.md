Para poder probar el proyecto en local se deben seguir los siguientes pasos:
-Primero necesitas tener instalado XAMPP o un programa similar.
-Clona el proyecto en tu equipo, junto con los archivos abra un fichero .sql, deberas crear en PHPMYADMIN de XAMPP la base de datos con nombre pokecrew e importar el fichero sql.
-Muevete hasta la carpeta donde has clonado el proyecto y haz un npm install para instalar todas las dependencias, despues mueve esta carpeta a la carpeta htdocs de XAMPP, esto se puede hacer asi o clonando el proyecto directamente en htdocs.
-Una vez dento de htdoc abre en XAMPP el servicor APACHE Y MYSQL y entra desde tu navegador con la rura localhost/nombre de la carpeta/index.html.
-Hay que tener en cuenta que XAMPP no detecta los ficheros generados por parcel por lo que deberas abrir fuente, no podras abrir ni la carpeta de producion ni desarrollo generados por parcel.
