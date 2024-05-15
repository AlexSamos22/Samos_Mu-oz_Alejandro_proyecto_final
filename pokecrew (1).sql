-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-05-2024 a las 10:37:00
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `pokecrew`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equiposfavoritos`
--

CREATE TABLE `equiposfavoritos` (
  `usuarioID` int(255) NOT NULL,
  `equipoID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `equiposfinalistas`
--

CREATE TABLE `equiposfinalistas` (
  `ID` int(255) NOT NULL,
  `Autor` varchar(255) NOT NULL,
  `Pais` varchar(255) NOT NULL,
  `Torneo` varchar(255) NOT NULL,
  `Posicion` varchar(255) NOT NULL,
  `Fecha` date NOT NULL,
  `P1` varchar(255) NOT NULL,
  `P2` varchar(255) NOT NULL,
  `P3` varchar(255) NOT NULL,
  `P4` varchar(255) NOT NULL,
  `P5` varchar(255) NOT NULL,
  `P6` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `equiposfinalistas`
--

INSERT INTO `equiposfinalistas` (`ID`, `Autor`, `Pais`, `Torneo`, `Posicion`, `Fecha`, `P1`, `P2`, `P3`, `P4`, `P5`, `P6`) VALUES
(1, 'Nikhil Reddy', 'https://victoryroad.es/wp-content/uploads/flags/IND-flag.png', 'Utrecht Special Event', 'Champion', '2024-03-02', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10230.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10104.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/144.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(2, 'Toler Webb', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Knoxville Regional', 'Champion', '2024-02-03', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/641.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(3, 'Wolfe Glick', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Charlotte Regional', 'Champion', '2024-01-20', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/987.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/981.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/812.png'),
(4, 'Alex Underhill', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Portland Regional', 'Champion', '2024-01-06', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/987.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/149.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1002.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(5, 'Daniel Oakes', 'https://victoryroad.es/wp-content/uploads/flags/GBR-flag.png', 'Global Challenge II', 'Top 9', '2024-03-01', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1018.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/591.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/641.png'),
(6, 'Teku', 'https://victoryroad.es/wp-content/uploads/flags/JPN-flag.png', 'Dortmund Regional', 'Top 9', '2024-02-10', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/591.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/488.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/901.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(7, 'FuiYnb', 'https://victoryroad.es/wp-content/uploads/flags/JPN-flag.png', 'Dortmund Regional', 'Top 17', '2024-03-10', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/324.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/591.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/244.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/488.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/145.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1009.png'),
(8, 'Nikolaj Høj ', 'https://victoryroad.es/wp-content/uploads/flags/DNK-flag.png', 'Dortmund Regional', 'Top 16', '2024-02-10', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/992.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/981.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/641.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10272.png'),
(9, 'Sergio Sánchez', 'https://victoryroad.es/wp-content/uploads/flags/ESP-flag.png', 'Liverpool Regional', 'Top 32', '2024-01-27', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10167.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1000.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10230.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1005.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(10, 'Luka Trejgut', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Charlotte Regional', 'Top 4', '2024-01-20', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/987.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1020.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/983.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1002.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/812.png'),
(11, 'Navjit Joshi', 'https://victoryroad.es/wp-content/uploads/flags/CAN-flag.png', 'Portland Regional', 'Top 16', '2024-01-06', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1017.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/987.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/727.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/376.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/645.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1021.png'),
(12, 'Eli Knowlton', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Portland Regional', 'Top 16', '2024-01-06', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/591.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/987.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/279.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/892.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/998.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1018.png'),
(13, 'Michael Zhang', 'https://victoryroad.es/wp-content/uploads/flags/USA-flag.png', 'Portland Regional', 'Top 32', '2024-01-06', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/730.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/784.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/126.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/812.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/248.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/381.png'),
(14, 'Alex Soto', 'https://victoryroad.es/wp-content/uploads/flags/ESP-flag.png', 'Knoxville Regional', 'Top 4', '2024-02-03', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/979.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/752.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10186.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/936.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/199.png', 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10249.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pokemonfavoritos`
--

CREATE TABLE `pokemonfavoritos` (
  `usuarioID` int(255) NOT NULL,
  `pokemonID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pokemonfavoritos`
--

INSERT INTO `pokemonfavoritos` (`usuarioID`, `pokemonID`) VALUES
(6, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `ID` int(255) NOT NULL,
  `Usuario` varchar(255) NOT NULL,
  `Clave` varchar(255) NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Nombre` text NOT NULL,
  `Apellido` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`ID`, `Usuario`, `Clave`, `Correo`, `Nombre`, `Apellido`) VALUES
(5, 'vestrollal', '$2y$10$aKljeKYWtfiLAEXlSr/YreznTc0SttVBzKF.2k3qIgXmGD71dFAly', 'alex@gmail.com', 'Alex', 'Samos'),
(6, 'Maria', '$2y$10$r5cxC0c6Qa1qIfEQVK9Vaedo/HWIHwlpA6MzJNeigWlxgg8i9Wkh.', 'maria@gmail.com', 'Maria', 'Caraballo'),
(8, 'Antonio', '$2y$10$1foYMq3uoi1IcCQom0QSzuZFinwsuILA4n06qIwPbZllJcPJqqrzm', 'antonio@gmail.com', 'Antonio', 'Lopez'),
(9, 'Jhon', '$2y$10$MWjJSoKUJBonm2VA6NAsiuqxUD64MqdSfmGe1ffnLUlV/c5IHF9CC', 'paco@gmail.com', 'johnd', 'Caraballo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `equiposfavoritos`
--
ALTER TABLE `equiposfavoritos`
  ADD PRIMARY KEY (`usuarioID`,`equipoID`),
  ADD KEY `equipoID` (`equipoID`);

--
-- Indices de la tabla `equiposfinalistas`
--
ALTER TABLE `equiposfinalistas`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `pokemonfavoritos`
--
ALTER TABLE `pokemonfavoritos`
  ADD PRIMARY KEY (`usuarioID`,`pokemonID`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `equiposfinalistas`
--
ALTER TABLE `equiposfinalistas`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `equiposfavoritos`
--
ALTER TABLE `equiposfavoritos`
  ADD CONSTRAINT `equiposfavoritos_ibfk_1` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `equiposfavoritos_ibfk_2` FOREIGN KEY (`equipoID`) REFERENCES `equiposfinalistas` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `pokemonfavoritos`
--
ALTER TABLE `pokemonfavoritos`
  ADD CONSTRAINT `pokemonfavoritos_ibfk_1` FOREIGN KEY (`usuarioID`) REFERENCES `usuarios` (`ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
