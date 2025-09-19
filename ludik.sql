-- phpMyAdmin SQL Dump
-- version 4.7.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 162.210.70.175
-- Tiempo de generación: 19-09-2025 a las 02:38:10
-- Versión del servidor: 5.7.23-23
-- Versión de PHP: 7.0.33-0ubuntu0.16.04.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `colegdfs_ludik`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `acudiente`
--

CREATE TABLE `acudiente` (
  `id_acudiente` int(10) UNSIGNED NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `nivel_educativo` varchar(100) DEFAULT NULL,
  `parentesco` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `contrasena` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `acudiente`
--

INSERT INTO `acudiente` (`id_acudiente`, `nombre_completo`, `nivel_educativo`, `parentesco`, `email`, `telefono`, `contrasena`) VALUES
(1, 'Gustavo Petro', 'Profesional Universitario', 'Papá de los pollitos', 'cuidador@gmail.com', '3211234567', '12345'),
(2, 'eytngf', 'wrnh', 'enhfg', 'uh,', 'shfnmz', 'szrywnhas'),
(3, '3', '3', '3', '3@gmail.com', '3', '3'),
(4, '3', '3', '3', '3@gmail.com', '3', '3'),
(5, '30', '30', '30', '30@gmial.com', '30', '30'),
(6, 'Fernando', 'Postgrado', 'Tío', 'f@gmail.com', '3145859876', '1234'),
(7, 'Capitán Ámerica', 'Profesional', 'Tío', 'ca@gmail.com', '3336664444', '1234'),
(14, 'Loky', 'Doctorado', 'Tío', 'lk@gmail.com', '3461856454', '1234'),
(15, 'Angela Aguilar', 'Bachillerato', 'Ninguni', 'aa@gmail.com', '3013417332', '1234'),
(16, 'Elias', 'Especialización', 'Tío', 'e@gmail.com', '3023331111', '1234');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id_admin`, `nombre`, `email`, `contrasena`) VALUES
(1, 'adminprueba1', 'admin@gmail.com', '12345'),
(2, 'Nestor Paez', 'npaez@gmail.com.co', '1234'),
(3, 'Admin de prueba en remoto', 'adpr@gmail.com', '1234'),
(4, 'Usuario prueba', 'david123@gmail.com', '123');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `nombre_asig` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignatura`
--

INSERT INTO `asignatura` (`id_asignatura`, `nombre_asig`) VALUES
(1, 'Cálculo'),
(2, 'Educación Artística'),
(3, 'Estadística'),
(4, 'Física'),
(5, 'Química'),
(6, 'Inglés'),
(7, 'Lengua castellana'),
(8, 'Religión'),
(9, 'Educación física'),
(10, 'Filosofía'),
(11, 'Algebra'),
(12, 'Aritmética'),
(13, 'Geometría'),
(14, 'Trigonometría'),
(15, 'Biología'),
(16, 'Tecnología'),
(17, 'Informática'),
(18, 'Dibujo técnico'),
(19, 'Ciencias Sociales'),
(20, 'Cátedra de la paz'),
(21, 'Educación ética y valores humanos'),
(22, 'Especialidad');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura_docente_grupo`
--

CREATE TABLE `asignatura_docente_grupo` (
  `id_asig_doc_grup` int(10) UNSIGNED NOT NULL,
  `id_docente` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `asignatura_docente_grupo`
--

INSERT INTO `asignatura_docente_grupo` (`id_asig_doc_grup`, `id_docente`, `id_grupo`, `id_asignatura`, `anio`) VALUES
(1, 4, 111, 1, NULL),
(2, 4, 113, 1, NULL),
(3, 4, 115, 1, NULL),
(4, 4, 111, 5, NULL),
(5, 4, 113, 5, NULL),
(6, 4, 115, 5, NULL),
(7, 4, 111, 8, NULL),
(8, 4, 113, 8, NULL),
(9, 4, 115, 8, NULL),
(10, 4, 111, 9, NULL),
(11, 4, 113, 9, NULL),
(12, 4, 115, 9, NULL),
(13, 5, 111, 4, NULL),
(14, 5, 112, 4, NULL),
(15, 5, 113, 4, NULL),
(16, 5, 114, 4, NULL),
(17, 5, 115, 4, NULL),
(18, 5, 111, 9, NULL),
(19, 5, 112, 9, NULL),
(20, 5, 113, 9, NULL),
(21, 5, 114, 9, NULL),
(22, 5, 115, 9, NULL),
(23, 6, 111, 7, NULL),
(24, 6, 112, 7, NULL),
(25, 6, 113, 7, NULL),
(26, 6, 114, 7, NULL),
(27, 6, 115, 7, NULL),
(28, 6, 111, 10, NULL),
(29, 6, 112, 10, NULL),
(30, 6, 113, 10, NULL),
(31, 6, 114, 10, NULL),
(32, 6, 115, 10, NULL),
(33, 7, 111, 8, NULL),
(34, 7, 112, 8, NULL),
(35, 7, 113, 8, NULL),
(36, 7, 114, 8, NULL),
(37, 7, 115, 8, NULL),
(58, 10, 112, 1, NULL),
(59, 10, 114, 1, NULL),
(60, 10, 112, 3, NULL),
(61, 10, 114, 3, NULL),
(62, 10, 112, 4, NULL),
(63, 10, 114, 4, NULL),
(64, 10, 112, 5, NULL),
(65, 10, 114, 5, NULL),
(66, 10, 112, 6, NULL),
(67, 10, 114, 6, NULL),
(68, 11, 111, 1, 2025),
(69, 11, 111, 5, 2025),
(70, 11, 113, 1, 2025),
(71, 11, 115, 1, 2025),
(72, 11, 115, 5, 2025),
(73, 12, 111, 1, 2025),
(74, 12, 111, 2, 2025),
(75, 12, 111, 3, 2025),
(76, 12, 112, 1, 2025),
(77, 12, 112, 2, 2025),
(78, 12, 112, 3, 2025),
(79, 12, 113, 4, 2025),
(80, 12, 113, 5, 2025),
(81, 12, 113, 6, 2025),
(82, 12, 114, 4, 2025),
(83, 12, 114, 5, 2025),
(84, 12, 114, 6, 2025),
(85, 12, 115, 1, 2025),
(86, 13, 111, 1, 2025),
(87, 13, 111, 3, 2025),
(88, 13, 113, 1, 2025),
(89, 13, 113, 3, 2025),
(90, 13, 113, 4, 2025),
(91, 13, 113, 5, 2025),
(92, 13, 115, 4, 2025),
(93, 13, 115, 5, 2025);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atencion_medica`
--

CREATE TABLE `atencion_medica` (
  `id_atencion` int(10) UNSIGNED NOT NULL,
  `descripcion` text,
  `frecuencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `atencion_medica`
--

INSERT INTO `atencion_medica` (`id_atencion`, `descripcion`, `frecuencia`) VALUES
(890284, 'CONSULTA DE PRIMERA VEZ POR ESPECIALISTA EN PSIQUIATRIA', 'cada 3 meses'),
(890285, 'ahdfcmvh j', '<eshj'),
(890286, 'ahdfcmvh j', '<eshj'),
(890287, 'ahdfcmvh j', '<eshj'),
(890288, 'ejtyhnew', 'rjhwh'),
(890289, 'syrj', 'jyrs'),
(890290, 'hteabg', 'hgrb'),
(890291, 'qwertyuiop', 'asdfghjklñ'),
(890292, 'ftgyhujiko', 'tfgyhujikol'),
(890293, 'ftgyhujklftgyhuj', 'tgybhnm,'),
(890294, 'rcvtybn', 'crtvybn'),
(890295, 'jyhtgrf', 'jnyhbtgvrfc'),
(890296, 'fghjkl', 'fghjkl');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacidad`
--

CREATE TABLE `capacidad` (
  `id_capacidad` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `capacidad`
--

INSERT INTO `capacidad` (`id_capacidad`, `descripcion`) VALUES
(1, 'Dibujo'),
(2, 'g3ravfartbgaznrag'),
(3, 'qwertyuiop'),
(10, 'qwertyuiop'),
(11, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `descripcion_general`
--

CREATE TABLE `descripcion_general` (
  `id_descripcion_general` int(10) UNSIGNED NOT NULL,
  `id_capacidad` int(10) UNSIGNED DEFAULT NULL,
  `id_gusto_e_interes` int(10) UNSIGNED DEFAULT NULL,
  `id_expectativa` int(10) UNSIGNED DEFAULT NULL,
  `id_expectativa_familia` int(10) UNSIGNED DEFAULT NULL,
  `id_red_apoyo` int(10) UNSIGNED DEFAULT NULL,
  `id_otra_descripcion` int(10) UNSIGNED DEFAULT NULL,
  `id_estudiante` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `descripcion_general`
--

INSERT INTO `descripcion_general` (`id_descripcion_general`, `id_capacidad`, `id_gusto_e_interes`, `id_expectativa`, `id_expectativa_familia`, `id_red_apoyo`, `id_otra_descripcion`, `id_estudiante`) VALUES
(2, 2, 2, 2, 2, 2, 2, 1),
(4, 10, 9, 9, 9, 9, 9, 15),
(5, 11, 10, 10, 10, 10, 10, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_dx_cie10`
--

CREATE TABLE `diagnostico_dx_cie10` (
  `id_diagnostico_dx_cie10` int(11) NOT NULL,
  `id_cie10` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `id_diag_med` int(11) NOT NULL,
  `anio` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `diagnostico_dx_cie10`
--

INSERT INTO `diagnostico_dx_cie10` (`id_diagnostico_dx_cie10`, `id_cie10`, `id_diag_med`, `anio`) VALUES
(0, 'F 840', 2, 2025),
(0, 'G 409', 3, 2025),
(0, 'F 639', 4, 2025),
(0, 'F 708', 4, 2025),
(0, 'F 711', 4, 2025),
(0, 'F 799', 4, 2025),
(0, 'F 708', 5, 2025),
(0, 'F 711', 5, 2025),
(0, 'F 799', 5, 2025);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_medico`
--

CREATE TABLE `diagnostico_medico` (
  `id_diag_med` int(11) NOT NULL,
  `id_piar` int(10) UNSIGNED NOT NULL,
  `DX` text,
  `apoyos_tecnicos` text,
  `url_soporte_dx` varchar(255) DEFAULT NULL,
  `id_entorno_salud` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `diagnostico_medico`
--

INSERT INTO `diagnostico_medico` (`id_diag_med`, `id_piar`, `DX`, `apoyos_tecnicos`, `url_soporte_dx`, `id_entorno_salud`) VALUES
(2, 9, 'vbnm,cvbn', 'cfvgbhnjmk,l', NULL, 9),
(3, 11, 'excrtvybnm', 'xctvybn', NULL, 10),
(4, 12, 'nybtvc', 'u6hyg5tfrd', NULL, 11),
(5, 13, 'dfghjkop', 'tcyvghbjk', NULL, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `directivo`
--

CREATE TABLE `directivo` (
  `id_directivo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `cargo` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `directivo`
--

INSERT INTO `directivo` (`id_directivo`, `nombre`, `email`, `contrasena`, `cargo`, `telefono`) VALUES
(1, 'santiago plata torradinho', 'directivo@gmail.com', '12345', 'coordinador', ''),
(2, 'Liliana Ayala', 'layala@gmail.com', '1234', 'Coordinadora técnica', ''),
(3, 'Directivo de prueba en hosting', 'dcph@gmail.com', '1234', 'Coordinador de prueba', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `id_docente` int(10) UNSIGNED NOT NULL,
  `nombre_completo` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `es_director` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `docente`
--

INSERT INTO `docente` (`id_docente`, `nombre_completo`, `email`, `contrasena`, `telefono`, `es_director`) VALUES
(1, 'Johanna Carolina Martinez Avendaño', 'jmartinez@coelgioguanenta.edu.co', '1234', '3210987654', 1),
(2, 'profe', 'profedirector@gmail.com', '12345', '3004129239', 1),
(3, 'profenormal', 'profe@gmail.com', '12345', '2323232323', 0),
(4, 'Nestor paez', 'npaez@gmail.com', '1234', '3124567890', 0),
(5, 'Nepomuceno Galvis', 'profe3@gmial.com', '1234', '3336667777', 0),
(6, 'María Smith Ramos', 'mramos@gmail.com', '1234', '3133454487', 1),
(7, 'William Chaparro', 'wchaparro@gmail.com', '1234', '3115874987', 1),
(10, 'Metisileno', 'msileno@gmail.com', '1234', '3214567890', 1),
(11, 'Mesitileno Galvis', 'mgalvis@gmail.com', '1234', '1234567890', 1),
(12, 'Dona Rmando', 'dona@gmail.com', '1234', '3216547897', 1),
(13, 'Docente de prueba en hosting', 'dcps@mail.com', '1234', '3124448888', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente_apoyo`
--

CREATE TABLE `docente_apoyo` (
  `id_docente_apoyo` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  `telefono` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `docente_apoyo`
--

INSERT INTO `docente_apoyo` (`id_docente_apoyo`, `nombre`, `email`, `contrasena`, `profesion`, `telefono`) VALUES
(1, 'Rocio', 'profeapoyo@gmail.com', '12345', 'magister', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente_grupo`
--

CREATE TABLE `docente_grupo` (
  `id_docente_grupo` int(10) UNSIGNED NOT NULL,
  `id_docente` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `docente_grupo`
--

INSERT INTO `docente_grupo` (`id_docente_grupo`, `id_docente`, `id_grupo`, `anio`) VALUES
(1, 6, 111, NULL),
(2, 7, 112, 2025),
(5, 10, 113, 2025),
(6, 11, 111, 2025),
(7, 12, 113, 2025),
(8, 13, 113, 2025);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dx_cie10`
--

CREATE TABLE `dx_cie10` (
  `id_cie10` varchar(100) CHARACTER SET utf8mb4 NOT NULL,
  `descripcion` varchar(1000) COLLATE utf8mb4_spanish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `dx_cie10`
--

INSERT INTO `dx_cie10` (`id_cie10`, `descripcion`) VALUES
('F 638', 'OTROS TRASTORNOS DE LOS HÁBITOS Y LOS IMPULSOS '),
('F 639', 'TRASTORNO DE LOS HÁBITOS Y DE LOS IMPULSOS '),
('F 708', 'RETRASO MENTAL LEVE Y OTROS DETERIOROS DEL COMPORTAMIENTO '),
('F 711', 'RETRASO MENTAL MODERADO '),
('F 799', 'RETRASO MENTAL NO ESPECIFICADO'),
('F 808', 'TRASTORNO DEL DESARROLLO DEL HABLA Y DEL LENGUAJE '),
('F 809', 'TRASTORNO DE LA COMUNICACIÓN NO ESPECIFICADO'),
('F 813', 'TRASTORNO MIXTO DE LAS ACTIVIDADES ESCOLARES '),
('F 819', 'TRASTORNO DEL DESARROLLO DE HABILIDADES ESCOLARES'),
('F 840', 'AUTISMO EN LA NIÑEZ'),
('F 841', 'AUTISMO ATÍPICO'),
('F 845', 'SÍNDROME DE ASPERGER'),
('F 849', 'TRASTORNO GENERALIZADO DEL DESARROLLO NO ESPECIFICADO '),
('F 900', 'PERTURBACIÓN DE LA ACTIVIDAD Y LA ATENCIÓN'),
('F 902', 'PRESENTACIÓN COMBINADA '),
('F 913', 'TRASTORNO OPOSITOR DESAFIANTE'),
('F 918', 'TRASTORNO DE CONDUCTA'),
('F 919', 'TRASTORNO DE LA CONDUCTA NO ESPECIFICADO'),
('G 402', 'EPILEPSIA Y SÍNDROMES EPILÉPTICOS'),
('G 408', 'SÍNCOPE'),
('G 409', 'EPILEPSIA'),
('G 800', 'PARÁLISIS CEREBRAL ESPÁSTICA CUADRIPLÉJICA '),
('Q 850', 'NEUROFIBROMATOSIS '),
('R 463', 'HIPERACTIVIDAD'),
('R 480', 'DISLEXIA Y ALEXIA'),
('R 568', 'CONVULSIONES NO ESPECIFICADAS '),
('Z 361', 'PROBLEMAS EN LA RELACIÓN CON PADRES '),
('Z 553', 'PROBLEMAS CON EL BAJO RENDIMIENTO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entorno_educativo`
--

CREATE TABLE `entorno_educativo` (
  `id_entorno_edu` int(10) UNSIGNED NOT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  `ultimo_grado_cursado` varchar(100) DEFAULT NULL,
  `vinculado_otra_inst` varchar(100) DEFAULT NULL,
  `informe_pedagogico` tinyint(1) DEFAULT NULL,
  `modalidad_proveniente` varchar(100) DEFAULT NULL,
  `asiste_programas_complementarios` varchar(100) DEFAULT NULL,
  `observacion` text,
  `id_estudiante` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `entorno_educativo`
--

INSERT INTO `entorno_educativo` (`id_entorno_edu`, `estado`, `ultimo_grado_cursado`, `vinculado_otra_inst`, `informe_pedagogico`, `modalidad_proveniente`, `asiste_programas_complementarios`, `observacion`, `id_estudiante`) VALUES
(2, 0, '10', 'Si - Detalles: Colegio privado', 0, NULL, 'No', 'Hello world', 6),
(3, NULL, NULL, NULL, 0, NULL, NULL, NULL, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entorno_salud`
--

CREATE TABLE `entorno_salud` (
  `id_entorno_salud` int(10) UNSIGNED NOT NULL,
  `id_tratamiento` int(10) UNSIGNED DEFAULT NULL,
  `id_medicamento` int(10) UNSIGNED DEFAULT NULL,
  `id_atencion` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `entorno_salud`
--

INSERT INTO `entorno_salud` (`id_entorno_salud`, `id_tratamiento`, `id_medicamento`, `id_atencion`) VALUES
(1, 3, 4, 890285),
(2, 3, 5, 890286),
(3, 4, 6, 890287),
(4, 5, 7, 890288),
(5, 6, 8, 890289),
(6, 7, 9, 890290),
(7, 8, 10, 890291),
(8, 9, 11, 890292),
(9, 10, 12, 890293),
(10, 11, 13, 890294),
(11, 12, 14, 890295),
(12, 13, 15, 890296);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estudiante`
--

CREATE TABLE `estudiante` (
  `id_estudiante` int(11) UNSIGNED NOT NULL,
  `url_foto` varchar(1000) DEFAULT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `tipo_documento` varchar(20) DEFAULT NULL,
  `no_documento` varchar(20) DEFAULT NULL,
  `lugar_nacimiento` varchar(100) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `sector` varchar(50) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(150) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `victima_conflicto` varchar(100) DEFAULT NULL,
  `registro_victima` varchar(100) DEFAULT NULL,
  `centro_proteccion` varchar(100) DEFAULT NULL,
  `grupo_etnico` varchar(100) DEFAULT NULL,
  `no_hermanos` int(11) DEFAULT NULL,
  `lugar_que_ocupa` varchar(100) DEFAULT NULL,
  `con_quien_vive` varchar(100) DEFAULT NULL,
  `quien_apoya_crianza` varchar(100) DEFAULT NULL,
  `afiliacion_salud` varchar(100) DEFAULT NULL,
  `id_madre` int(10) UNSIGNED DEFAULT NULL,
  `id_padre` int(10) UNSIGNED DEFAULT NULL,
  `id_cuidador` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id_estudiante`, `url_foto`, `nombre`, `apellidos`, `tipo_documento`, `no_documento`, `lugar_nacimiento`, `fecha_nacimiento`, `sector`, `direccion`, `telefono`, `correo`, `contrasena`, `victima_conflicto`, `registro_victima`, `centro_proteccion`, `grupo_etnico`, `no_hermanos`, `lugar_que_ocupa`, `con_quien_vive`, `quien_apoya_crianza`, `afiliacion_salud`, `id_madre`, `id_padre`, `id_cuidador`) VALUES
(1, NULL, 'Max', 'Henriquez Pimiento', 'TI', NULL, 'San Gil, Santander', '2007-06-09', 'Urbano', 'Calle 1 #5-12', '3124567890', 'max@gmail.com', '12345', 'No', NULL, 'No', 'Albino', 1, '1', 'Padre, madre, hermana, gatos.', 'Madre, padre', 'Si', 1, 1, 1),
(2, NULL, 'tysnhrg', 'wrnhsgf', 'TI', '134', ',kfjmgh', '1999-05-14', 'Rural', 'jyhrsgf', '765324312', 'ethsnmj', '12345', 'No', 'No', 'No', 'No', 3, '2', ',rydjmh', 'wnths', 'No', 4, 4, 2),
(4, NULL, '4', '4', 'TI', '4', '4', '2004-04-04', 'Urbano', '4', '4', '4@gmail.com', '4', 'No', 'Si', 'No', 'No', 3, '2', '4', '4', 'Si', 6, 6, 4),
(5, NULL, '6', '6', 'TI', '6', '6', '1999-02-20', 'Urbano', '123456', '1234567890', 'gmail@gmail.com', '123', 'No', 'No', 'No', 'No', 3, '2', 'na', 'na', 'Si', 7, 7, 5),
(6, NULL, 'Sebastian', 'Feo Murillo', 'TI', '11017433478', 'Cosorro', '2009-12-04', 'Urbano', 'Altamira', '3549871245', 'feo@gmail.com', '1234', 'No', 'No', 'No', 'No', 2, '1', 'Familia', 'Familia', 'Si', 8, 8, 6),
(7, NULL, 'Xileno', 'Benzaldehído', 'CE', '5845657891', 'Washington', '2005-04-01', 'Urbano', 'San Camilo', '3407894125', 'xi@gmail.com', '1234', 'No', 'No', 'No', 'No', 3, '2', 'Familia', 'Familia', 'No', 9, 9, 7),
(14, NULL, 'Hela', 'Merlano', 'TI', '11025468645', 'Hospital', '2005-12-04', 'Urbano', 'no se', '345251515451', 'noce@gmail.com', '1234', 'No', 'No', 'No', 'No', 2, '1', 'No c', 'No c', 'Si', 16, 16, 14),
(15, NULL, 'Benzoico', 'Carboxilico', 'PAS', '993498357814', 'Bogota', '2003-03-03', 'Urbano', 'San Camilo', '3115874987', 'benzo@gmail.com', '1234', 'No', 'No', 'No', 'No', 4, '2', 'na', 'Familia', 'Si', 17, 17, 15),
(16, NULL, 'Mario', 'Rodriguez Gonzalez', 'CE', '1877329857', 'Venezuela', '2004-04-04', 'Rural', 'Una finca', '30203048541', 'mrg@gmail.com', '1234', 'No', 'No', 'No', 'No', 3, '1', 'Familia', 'Familia', 'Si', 18, 18, 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expectativa`
--

CREATE TABLE `expectativa` (
  `id_expectativa` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `expectativa`
--

INSERT INTO `expectativa` (`id_expectativa`, `descripcion`) VALUES
(1, 'Estudiar\r\n'),
(2, 'yrjmnhtebgsr'),
(9, 'qwertyuip'),
(10, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expectativa_familia`
--

CREATE TABLE `expectativa_familia` (
  `id_expectativa_familia` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `expectativa_familia`
--

INSERT INTO `expectativa_familia` (`id_expectativa_familia`, `descripcion`) VALUES
(1, 'Que estudie'),
(2, 'hgfl thkutj h'),
(9, 'qwertyuiop'),
(10, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id_grado` int(10) UNSIGNED NOT NULL,
  `grado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grado`
--

INSERT INTO `grado` (`id_grado`, `grado`) VALUES
(1, 'Primero'),
(2, 'Segundo'),
(3, 'Tercero'),
(4, 'Cuarto'),
(5, 'Quinto'),
(6, 'Sexto'),
(7, 'Septimo'),
(8, 'Octavo'),
(9, 'Noveno'),
(10, 'Decimo'),
(11, 'Undecimo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo`
--

CREATE TABLE `grupo` (
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `id_grado` int(10) UNSIGNED NOT NULL,
  `grupo` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `id_grado`, `grupo`) VALUES
(52, 5, '5-2'),
(53, 5, '5-3'),
(54, 5, '5-4'),
(55, 5, '5-5'),
(61, 6, '6-1'),
(62, 6, '6-2'),
(63, 6, '6-3'),
(64, 6, '6-4'),
(65, 6, '6-5'),
(66, 6, '6-6'),
(71, 7, '7-1'),
(72, 7, '7-2'),
(73, 7, '7-3'),
(74, 7, '74'),
(75, 7, '7-5'),
(76, 7, '7-6'),
(81, 8, '8-1'),
(82, 8, '8-2'),
(83, 8, '8-3'),
(84, 8, '8-4'),
(85, 8, '8-5'),
(86, 8, '8-6'),
(91, 9, '9-2'),
(92, 9, '9-2'),
(93, 9, '9-3'),
(94, 9, '9-4'),
(95, 9, '9-5'),
(96, 9, '9-6'),
(101, 10, '10-1'),
(102, 10, '10-2'),
(103, 10, '10-3'),
(104, 10, '10-4'),
(105, 10, '10-5'),
(106, 10, '10-6'),
(107, 10, '10-7'),
(111, 11, '11-1'),
(112, 11, '11-2'),
(113, 11, '11-3'),
(114, 11, '11-4'),
(115, 11, '11-5');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_estudiante`
--

CREATE TABLE `grupo_estudiante` (
  `id_grupo_estudiante` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `grupo_estudiante`
--

INSERT INTO `grupo_estudiante` (`id_grupo_estudiante`, `id_grupo`, `id_estudiante`, `anio`) VALUES
(1, 113, 7, 2025),
(8, 113, 14, 2025),
(9, 111, 15, 2025),
(10, 113, 16, 2025);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_sede`
--

CREATE TABLE `grupo_sede` (
  `id_grupo_sede` int(10) UNSIGNED NOT NULL,
  `id_sede` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gusto_interes`
--

CREATE TABLE `gusto_interes` (
  `id_gusto_e_interes` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `gusto_interes`
--

INSERT INTO `gusto_interes` (`id_gusto_e_interes`, `descripcion`) VALUES
(1, 'Dibujos animados\r\n'),
(2, 'ñoyli.k,ujfmnhdbg svc'),
(9, 'qwertyuiop'),
(10, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `madre`
--

CREATE TABLE `madre` (
  `id_madre` int(10) UNSIGNED NOT NULL,
  `nombre_completo` varchar(150) DEFAULT NULL,
  `nivel_educativo` varchar(100) DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `telefono` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `madre`
--

INSERT INTO `madre` (`id_madre`, `nombre_completo`, `nivel_educativo`, `ocupacion`, `email`, `contrasena`, `telefono`) VALUES
(1, 'Fernanda Cabal', 'Primaria', 'Senadora', 'fcabal@gmail.com', '1234', ''),
(2, 'madreprueba', 'doctora', 'ingeniera', 'madre@gmail.com', '12345', ''),
(3, '111', '1111', '1111', '1111', '1111', ''),
(4, '1554', 'hgfbdvs', 'hnbf', 'fbsvd', 'hfnargw', ''),
(5, '1', '1', '1', '1@gmail.com', '1', ''),
(6, '1', '1', '1', '1@gmail.com', '1', ''),
(7, '10', '10', '10', '10@gmail.com', '12340', ''),
(8, 'Leticia', 'Bachiller', 'ama de casa', 'l@gmail.com', '1234', '3214567890'),
(9, 'Marylin Cote', 'Doctorado', 'Neuropsicologa', 'mcote@gmail.com', '1234', '3214567890'),
(16, 'Catalina', 'Profesional', 'Trabajadora social', 'cata@gmail.com', '1324', '321564668454'),
(17, 'Paquita', 'Profesional', 'Cantante', 'pq@gmail.com', '1234', '3145738738'),
(18, 'María Gonzalez', 'Técnico', 'Abogada', 'mg@gmail.com', '1234', '3014447777');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `id_medicamento` int(10) UNSIGNED NOT NULL,
  `descripcion` text,
  `frecuencia_horario` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`id_medicamento`, `descripcion`, `frecuencia_horario`) VALUES
(1, 'Clorazepam', 'Cada 12 horas'),
(2, 'Paracetamol', 'cada 6 horas'),
(3, 'insulina', 'cada 3 horas'),
(4, 'arwnjetzxyucv', 'wh<rsdfjtgf lhk-j'),
(5, 'arwnjetzxyucv', 'wh<rsdfjtgf lhk-j'),
(6, 'arwnjetzxyucv', 'wh<rsdfjtgf lhk-j'),
(7, 'rgjwryh', 'wjqr'),
(8, 'hetbdgvc', 'the'),
(9, 'qhte', 'qht'),
(10, 'qwertyuiop', 'asdfghjklñ'),
(11, 'ftgyhjkolpñ', 'rftghyujiklpñ'),
(12, 'tvfybunm,.', 'ftgyhujkñ.'),
(13, 'rctvybunm,', 'excrtvybnm'),
(14, 'u7n6bytvgrfc', 'nhbtgvrfce'),
(15, 'fghjkl', 'fghjkl');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otra_descripcion`
--

CREATE TABLE `otra_descripcion` (
  `id_otra_descripcion` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `otra_descripcion`
--

INSERT INTO `otra_descripcion` (`id_otra_descripcion`, `descripcion`) VALUES
(1, 'Burrito'),
(2, 'uetnbgrsvf'),
(9, 'qwertyuiop'),
(10, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `padre`
--

CREATE TABLE `padre` (
  `id_padre` int(10) UNSIGNED NOT NULL,
  `nombre_completo` varchar(150) DEFAULT NULL,
  `nivel_educativo` varchar(100) DEFAULT NULL,
  `ocupacion` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `contrasena` varchar(255) DEFAULT NULL,
  `telefono` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `padre`
--

INSERT INTO `padre` (`id_padre`, `nombre_completo`, `nivel_educativo`, `ocupacion`, `email`, `contrasena`, `telefono`) VALUES
(1, 'Alvaro Uribe', 'Primaria', 'Preso', 'auribe@gmail.com', '1234', ''),
(2, 'padreprueba', 'bachiller', 'mecanico', 'padre@gmail.com', '12345', ''),
(3, '22222', '2222', '2222', '2222', '2222', ''),
(4, 'thrgdv', 'trgm', 'etnrngd', 'tharbsf', 'w5htrbg', ''),
(5, '2', '2', '2', '2@gmail.com', '2', ''),
(6, '2', '2', '2', '2@gmail.com', '2', ''),
(7, '20', '20', '20', '20@gmail.com', '22220', ''),
(8, 'Alberto', 'Tecnologo', 'Analista de redes', 'albert@gmail.com', '1234', '3222555674'),
(9, 'Fenotriol', 'Especialización', 'Químico|', 'feno@gmail.com', '1234', '3114567890'),
(16, 'Hermes', 'Profesional', 'Contador', 'hm@gmail.com', '1234', '32156456445'),
(17, 'Vicente', 'Profesional', 'cantante', 'vf@gmail.com', '1234', '3224672882'),
(18, 'Mario Rodriguez', 'Profesional', 'Locutor', 'mr@gmail.com', '1234', '3003332222');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piar`
--

CREATE TABLE `piar` (
  `id_piar` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `fecha` date DEFAULT NULL,
  `ajuste` text,
  `apoyo` text,
  `barrera` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `piar`
--

INSERT INTO `piar` (`id_piar`, `id_estudiante`, `fecha`, `ajuste`, `apoyo`, `barrera`) VALUES
(4, 6, '2025-09-11', 'bvc', 'iuytgrfvd', 'unytbrgfve'),
(5, 6, '2025-09-11', 'EDNHANR', 'ANGshg', 'qeh'),
(6, 7, '2025-09-11', 'qwertyuiop', 'qwertyuiop', 'qwertyuiop'),
(7, 7, '2025-09-11', 'qawsedfrgthyujik', 'awsedfrgthyuj', 'awsedfrgthyuj\r\n'),
(8, 7, '2025-09-11', 'zfrghjk', 'sedfrgthyujikl', 'dfrgthyujik'),
(9, 7, '2025-09-11', 'zsxcfvgbhjnmk', 'cfvgbhnjmk', 'cvgbnmk,'),
(10, 2, '2025-09-11', 'erfbnm,', 'zwxgtvbhynjmk,', 'ecrvbnm'),
(11, 5, '2025-09-12', 'xdfcgvhbjnkm', 'cvgbhjnmk,l', 'cvbhjnmk'),
(12, 7, '2025-09-11', 'iuybtvcde', 'mjnyhbtgvrfc', 'mjnhbgrvf'),
(13, 15, '2025-09-15', 'qawsedfrgthyujik', 'awsedfrgthyuj', 'awsedfrgthyuj\r\n'),
(14, 16, '2025-09-15', 'asdfghjklñ', 'qwertyuiop', 'zxcvbnm');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `red_apoyo`
--

CREATE TABLE `red_apoyo` (
  `id_red_apoyo` int(10) UNSIGNED NOT NULL,
  `descripcion` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `red_apoyo`
--

INSERT INTO `red_apoyo` (`id_red_apoyo`, `descripcion`) VALUES
(1, 'Familia'),
(2, 'mjryenthbsgrvfec'),
(9, 'qwertyuiop'),
(10, 'qwertyuiop');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sede`
--

CREATE TABLE `sede` (
  `id_sede` int(10) UNSIGNED NOT NULL,
  `sede` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sede`
--

INSERT INTO `sede` (`id_sede`, `sede`) VALUES
(1, 'Sede A (Colegio San José de Guanentá)'),
(2, 'Sede B (Carlos Martinez)'),
(3, 'Sede C (Pablo VI)'),
(4, 'Sede D (Sagrada Familia)'),
(5, 'Sede E (Rodolfo Gonzalez)'),
(6, 'Sede F (Talleres)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tratamiento`
--

CREATE TABLE `tratamiento` (
  `id_tratamiento` int(10) UNSIGNED NOT NULL,
  `descripcion` text,
  `frecuencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tratamiento`
--

INSERT INTO `tratamiento` (`id_tratamiento`, `descripcion`, `frecuencia`) VALUES
(1, 'Terapias de control de temperamento', 'Una vez a la semana'),
(2, 'manejo de ansiedad', 'cada 10 horas'),
(3, 'zsxrdctfvygbuhnijmok', 'cdsvfdbgfnhgmj,k.l'),
(4, 'zsxrdctfvygbuhnijmok', 'cdsvfdbgfnhgmj,k.l'),
(5, 'jryhjwnq4ryjn', 'rjqwjry'),
(6, 'hfngbv', ''),
(7, 'hqt', 'qth'),
(8, 'qwertyuiop', 'asdfghjklñ'),
(9, 'fghyujiklp', 'dfrgthyujikol'),
(10, 'rvbnmrtvybnm', 'xcvbhjnkm,l.'),
(11, 'cvybnm,', 'xcvgbhjnmk'),
(12, 'n6b5gtvf4cd3x', '6nuyb5tv4rc'),
(13, 'qwertyuio', 'sdfgh'),
(14, 'qwertyuiop', '12345');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion_pedagogica`
--

CREATE TABLE `valoracion_pedagogica` (
  `id_valoracion_pedagogica` int(10) UNSIGNED NOT NULL,
  `id_piar` int(10) UNSIGNED NOT NULL,
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `periodo` varchar(20) DEFAULT NULL,
  `anio` year(4) DEFAULT NULL,
  `objetivo` text,
  `barrera` text,
  `tipo_ajuste` text,
  `apoyo_requerido` text,
  `seguimiento` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `valoracion_pedagogica`
--

INSERT INTO `valoracion_pedagogica` (`id_valoracion_pedagogica`, `id_piar`, `id_asignatura`, `periodo`, `anio`, `objetivo`, `barrera`, `tipo_ajuste`, `apoyo_requerido`, `seguimiento`) VALUES
(1, 13, 1, '4', 2025, '1234567890', 'qwertyuiop', 'asdfghjklñ', 'zxcvbnm,.-', 'wawsdfrgthyujik'),
(2, 14, 5, '4', 2025, 'dfghjk', 'cvbnm', 'wertyu', 'cfgvbhnjmk', 'h jbnk');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `acudiente`
--
ALTER TABLE `acudiente`
  ADD PRIMARY KEY (`id_acudiente`);

--
-- Indices de la tabla `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indices de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  ADD PRIMARY KEY (`id_asignatura`);

--
-- Indices de la tabla `asignatura_docente_grupo`
--
ALTER TABLE `asignatura_docente_grupo`
  ADD PRIMARY KEY (`id_asig_doc_grup`),
  ADD KEY `id_docente` (`id_docente`),
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_asignatura` (`id_asignatura`);

--
-- Indices de la tabla `atencion_medica`
--
ALTER TABLE `atencion_medica`
  ADD PRIMARY KEY (`id_atencion`);

--
-- Indices de la tabla `capacidad`
--
ALTER TABLE `capacidad`
  ADD PRIMARY KEY (`id_capacidad`);

--
-- Indices de la tabla `descripcion_general`
--
ALTER TABLE `descripcion_general`
  ADD PRIMARY KEY (`id_descripcion_general`),
  ADD KEY `id_capacidad` (`id_capacidad`),
  ADD KEY `id_gusto_e_interes` (`id_gusto_e_interes`),
  ADD KEY `id_expectativa` (`id_expectativa`),
  ADD KEY `id_expectativa_familia` (`id_expectativa_familia`),
  ADD KEY `id_red_apoyo` (`id_red_apoyo`),
  ADD KEY `id_otra_descripcion` (`id_otra_descripcion`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `diagnostico_dx_cie10`
--
ALTER TABLE `diagnostico_dx_cie10`
  ADD KEY `id_cie10` (`id_cie10`,`id_diag_med`),
  ADD KEY `id_diag_med` (`id_diag_med`);

--
-- Indices de la tabla `diagnostico_medico`
--
ALTER TABLE `diagnostico_medico`
  ADD PRIMARY KEY (`id_diag_med`),
  ADD KEY `id_piar` (`id_piar`),
  ADD KEY `id_entorno_salud` (`id_entorno_salud`);

--
-- Indices de la tabla `directivo`
--
ALTER TABLE `directivo`
  ADD PRIMARY KEY (`id_directivo`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`id_docente`);

--
-- Indices de la tabla `docente_apoyo`
--
ALTER TABLE `docente_apoyo`
  ADD PRIMARY KEY (`id_docente_apoyo`);

--
-- Indices de la tabla `docente_grupo`
--
ALTER TABLE `docente_grupo`
  ADD PRIMARY KEY (`id_docente_grupo`),
  ADD KEY `id_docente` (`id_docente`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- Indices de la tabla `dx_cie10`
--
ALTER TABLE `dx_cie10`
  ADD PRIMARY KEY (`id_cie10`);

--
-- Indices de la tabla `entorno_educativo`
--
ALTER TABLE `entorno_educativo`
  ADD PRIMARY KEY (`id_entorno_edu`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `entorno_salud`
--
ALTER TABLE `entorno_salud`
  ADD PRIMARY KEY (`id_entorno_salud`),
  ADD KEY `id_tratamiento` (`id_tratamiento`),
  ADD KEY `id_medicamento` (`id_medicamento`),
  ADD KEY `id_atencion` (`id_atencion`);

--
-- Indices de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD PRIMARY KEY (`id_estudiante`),
  ADD KEY `id_madre` (`id_madre`),
  ADD KEY `id_padre` (`id_padre`),
  ADD KEY `id_cuidador` (`id_cuidador`);

--
-- Indices de la tabla `expectativa`
--
ALTER TABLE `expectativa`
  ADD PRIMARY KEY (`id_expectativa`);

--
-- Indices de la tabla `expectativa_familia`
--
ALTER TABLE `expectativa_familia`
  ADD PRIMARY KEY (`id_expectativa_familia`);

--
-- Indices de la tabla `grado`
--
ALTER TABLE `grado`
  ADD PRIMARY KEY (`id_grado`);

--
-- Indices de la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD PRIMARY KEY (`id_grupo`),
  ADD KEY `id_grado` (`id_grado`);

--
-- Indices de la tabla `grupo_estudiante`
--
ALTER TABLE `grupo_estudiante`
  ADD PRIMARY KEY (`id_grupo_estudiante`),
  ADD KEY `id_grupo` (`id_grupo`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `grupo_sede`
--
ALTER TABLE `grupo_sede`
  ADD PRIMARY KEY (`id_grupo_sede`),
  ADD KEY `id_sede` (`id_sede`),
  ADD KEY `id_grupo` (`id_grupo`);

--
-- Indices de la tabla `gusto_interes`
--
ALTER TABLE `gusto_interes`
  ADD PRIMARY KEY (`id_gusto_e_interes`);

--
-- Indices de la tabla `madre`
--
ALTER TABLE `madre`
  ADD PRIMARY KEY (`id_madre`);

--
-- Indices de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  ADD PRIMARY KEY (`id_medicamento`);

--
-- Indices de la tabla `otra_descripcion`
--
ALTER TABLE `otra_descripcion`
  ADD PRIMARY KEY (`id_otra_descripcion`);

--
-- Indices de la tabla `padre`
--
ALTER TABLE `padre`
  ADD PRIMARY KEY (`id_padre`);

--
-- Indices de la tabla `piar`
--
ALTER TABLE `piar`
  ADD PRIMARY KEY (`id_piar`),
  ADD KEY `id_estudiante` (`id_estudiante`);

--
-- Indices de la tabla `red_apoyo`
--
ALTER TABLE `red_apoyo`
  ADD PRIMARY KEY (`id_red_apoyo`);

--
-- Indices de la tabla `sede`
--
ALTER TABLE `sede`
  ADD PRIMARY KEY (`id_sede`);

--
-- Indices de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  ADD PRIMARY KEY (`id_tratamiento`);

--
-- Indices de la tabla `valoracion_pedagogica`
--
ALTER TABLE `valoracion_pedagogica`
  ADD PRIMARY KEY (`id_valoracion_pedagogica`),
  ADD KEY `id_piar` (`id_piar`),
  ADD KEY `id_asignatura` (`id_asignatura`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `acudiente`
--
ALTER TABLE `acudiente`
  MODIFY `id_acudiente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  MODIFY `id_asignatura` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;
--
-- AUTO_INCREMENT de la tabla `asignatura_docente_grupo`
--
ALTER TABLE `asignatura_docente_grupo`
  MODIFY `id_asig_doc_grup` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=174;
--
-- AUTO_INCREMENT de la tabla `atencion_medica`
--
ALTER TABLE `atencion_medica`
  MODIFY `id_atencion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=890297;
--
-- AUTO_INCREMENT de la tabla `capacidad`
--
ALTER TABLE `capacidad`
  MODIFY `id_capacidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
--
-- AUTO_INCREMENT de la tabla `descripcion_general`
--
ALTER TABLE `descripcion_general`
  MODIFY `id_descripcion_general` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `diagnostico_medico`
--
ALTER TABLE `diagnostico_medico`
  MODIFY `id_diag_med` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT de la tabla `directivo`
--
ALTER TABLE `directivo`
  MODIFY `id_directivo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `docente`
--
ALTER TABLE `docente`
  MODIFY `id_docente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT de la tabla `docente_apoyo`
--
ALTER TABLE `docente_apoyo`
  MODIFY `id_docente_apoyo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT de la tabla `docente_grupo`
--
ALTER TABLE `docente_grupo`
  MODIFY `id_docente_grupo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT de la tabla `entorno_educativo`
--
ALTER TABLE `entorno_educativo`
  MODIFY `id_entorno_edu` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT de la tabla `entorno_salud`
--
ALTER TABLE `entorno_salud`
  MODIFY `id_entorno_salud` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id_estudiante` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT de la tabla `expectativa`
--
ALTER TABLE `expectativa`
  MODIFY `id_expectativa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `expectativa_familia`
--
ALTER TABLE `expectativa_familia`
  MODIFY `id_expectativa_familia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `grupo_estudiante`
--
ALTER TABLE `grupo_estudiante`
  MODIFY `id_grupo_estudiante` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `grupo_sede`
--
ALTER TABLE `grupo_sede`
  MODIFY `id_grupo_sede` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `gusto_interes`
--
ALTER TABLE `gusto_interes`
  MODIFY `id_gusto_e_interes` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `madre`
--
ALTER TABLE `madre`
  MODIFY `id_madre` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `id_medicamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;
--
-- AUTO_INCREMENT de la tabla `otra_descripcion`
--
ALTER TABLE `otra_descripcion`
  MODIFY `id_otra_descripcion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `padre`
--
ALTER TABLE `padre`
  MODIFY `id_padre` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
--
-- AUTO_INCREMENT de la tabla `piar`
--
ALTER TABLE `piar`
  MODIFY `id_piar` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de la tabla `red_apoyo`
--
ALTER TABLE `red_apoyo`
  MODIFY `id_red_apoyo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT de la tabla `sede`
--
ALTER TABLE `sede`
  MODIFY `id_sede` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  MODIFY `id_tratamiento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
--
-- AUTO_INCREMENT de la tabla `valoracion_pedagogica`
--
ALTER TABLE `valoracion_pedagogica`
  MODIFY `id_valoracion_pedagogica` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asignatura_docente_grupo`
--
ALTER TABLE `asignatura_docente_grupo`
  ADD CONSTRAINT `asignatura_docente_grupo_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  ADD CONSTRAINT `asignatura_docente_grupo_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `asignatura_docente_grupo_ibfk_3` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `descripcion_general`
--
ALTER TABLE `descripcion_general`
  ADD CONSTRAINT `descripcion_general_ibfk_1` FOREIGN KEY (`id_capacidad`) REFERENCES `capacidad` (`id_capacidad`),
  ADD CONSTRAINT `descripcion_general_ibfk_2` FOREIGN KEY (`id_gusto_e_interes`) REFERENCES `gusto_interes` (`id_gusto_e_interes`),
  ADD CONSTRAINT `descripcion_general_ibfk_3` FOREIGN KEY (`id_expectativa`) REFERENCES `expectativa` (`id_expectativa`),
  ADD CONSTRAINT `descripcion_general_ibfk_4` FOREIGN KEY (`id_expectativa_familia`) REFERENCES `expectativa_familia` (`id_expectativa_familia`),
  ADD CONSTRAINT `descripcion_general_ibfk_5` FOREIGN KEY (`id_red_apoyo`) REFERENCES `red_apoyo` (`id_red_apoyo`),
  ADD CONSTRAINT `descripcion_general_ibfk_6` FOREIGN KEY (`id_otra_descripcion`) REFERENCES `otra_descripcion` (`id_otra_descripcion`),
  ADD CONSTRAINT `descripcion_general_ibfk_7` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `diagnostico_dx_cie10`
--
ALTER TABLE `diagnostico_dx_cie10`
  ADD CONSTRAINT `diagnostico_dx_cie10_ibfk_2` FOREIGN KEY (`id_cie10`) REFERENCES `dx_cie10` (`id_cie10`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `diagnostico_dx_cie10_ibfk_3` FOREIGN KEY (`id_diag_med`) REFERENCES `diagnostico_medico` (`id_diag_med`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `diagnostico_medico`
--
ALTER TABLE `diagnostico_medico`
  ADD CONSTRAINT `diagnostico_medico_ibfk_1` FOREIGN KEY (`id_piar`) REFERENCES `piar` (`id_piar`),
  ADD CONSTRAINT `diagnostico_medico_ibfk_2` FOREIGN KEY (`id_entorno_salud`) REFERENCES `entorno_salud` (`id_entorno_salud`);

--
-- Filtros para la tabla `docente_grupo`
--
ALTER TABLE `docente_grupo`
  ADD CONSTRAINT `docente_grupo_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`),
  ADD CONSTRAINT `docente_grupo_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Filtros para la tabla `entorno_educativo`
--
ALTER TABLE `entorno_educativo`
  ADD CONSTRAINT `entorno_educativo_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `entorno_salud`
--
ALTER TABLE `entorno_salud`
  ADD CONSTRAINT `entorno_salud_ibfk_1` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamiento` (`id_tratamiento`),
  ADD CONSTRAINT `entorno_salud_ibfk_2` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamento` (`id_medicamento`),
  ADD CONSTRAINT `entorno_salud_ibfk_3` FOREIGN KEY (`id_atencion`) REFERENCES `atencion_medica` (`id_atencion`);

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_madre`) REFERENCES `madre` (`id_madre`),
  ADD CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_padre`) REFERENCES `padre` (`id_padre`),
  ADD CONSTRAINT `estudiante_ibfk_3` FOREIGN KEY (`id_cuidador`) REFERENCES `acudiente` (`id_acudiente`);

--
-- Filtros para la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `grupo_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`);

--
-- Filtros para la tabla `grupo_estudiante`
--
ALTER TABLE `grupo_estudiante`
  ADD CONSTRAINT `grupo_estudiante_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`),
  ADD CONSTRAINT `grupo_estudiante_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`);

--
-- Filtros para la tabla `grupo_sede`
--
ALTER TABLE `grupo_sede`
  ADD CONSTRAINT `grupo_sede_ibfk_1` FOREIGN KEY (`id_sede`) REFERENCES `sede` (`id_sede`),
  ADD CONSTRAINT `grupo_sede_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`);

--
-- Filtros para la tabla `piar`
--
ALTER TABLE `piar`
  ADD CONSTRAINT `piar_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `valoracion_pedagogica`
--
ALTER TABLE `valoracion_pedagogica`
  ADD CONSTRAINT `valoracion_pedagogica_ibfk_1` FOREIGN KEY (`id_piar`) REFERENCES `piar` (`id_piar`),
  ADD CONSTRAINT `valoracion_pedagogica_ibfk_2` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
