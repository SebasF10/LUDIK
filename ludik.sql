-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2025 a las 23:21:48
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
-- Base de datos: `ludik`
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `acudiente`
--

INSERT INTO `acudiente` (`id_acudiente`, `nombre_completo`, `nivel_educativo`, `parentesco`, `email`, `telefono`, `contrasena`) VALUES
(31, 'Mónica Patricia Angarita', 'Tecnológico', 'Madre', 'motta.angarita@gmail.com', '3126099800', '$2y$10$QA27ENEO55lKiZl3CEC/2OxpleakJjxEIOaPZx5CBzf6NW1F9edQS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `admin`
--

CREATE TABLE `admin` (
  `id_admin` int(10) UNSIGNED NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `contrasena` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `admin`
--

INSERT INTO `admin` (`id_admin`, `nombre`, `email`, `contrasena`) VALUES
(1, 'adminprueba1', 'admin@gmail.com', '$2y$10$KTu49mVzMs.Crq6NDEhghetlkkK3kWAiVQEf/B/.OPTr0/YuGYghG'),
(2, 'Nestor Paez', 'npaez@gmail.com.co', '$2y$10$vRqubaOhHF0iie0ufVC7pORRTKNNxevzixXZmBJcN3M1eVi3qmj2W'),
(3, 'Admin de prueba en remoto', 'adpr@gmail.com', '$2y$10$B3Yie.c9YTLCkWR/oP5wb.mVP/p.OKy42JoqKhRl0CtOOfZh/7j0m'),
(4, 'Usuario prueba', 'david123@gmail.com', '$2y$10$myPcITqp97VN87evJz13iujX0P4ulT5plCi4RyvF8wzbpQ3bfWgNm'),
(5, 'Nestor', 'Nestor@gmail.com', '$2y$10$A.EYbYhLqky4dsiSU5VJpOkpR7aqRqUMrjRoVovR4Dy5EEiKJLk42'),
(6, 'Edwin Santiago Plata Torrado', 'edwinplata@colegioguanenta.edu.co', '$2y$10$/0nIHwWKXLISyfq1tRBlGu9kHSxr/5gVqqi4YwYdrH69BIdi54VTS');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asignatura`
--

CREATE TABLE `asignatura` (
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `nombre_asig` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `asignatura_docente_grupo`
--

INSERT INTO `asignatura_docente_grupo` (`id_asig_doc_grup`, `id_docente`, `id_grupo`, `id_asignatura`, `anio`) VALUES
(174, 17, 64, 15, '2025'),
(175, 17, 65, 15, '2025'),
(176, 17, 66, 15, '2025'),
(177, 17, 84, 15, '2025'),
(178, 17, 85, 15, '2025'),
(179, 17, 86, 15, '2025'),
(180, 18, 61, 16, '2025'),
(182, 18, 62, 16, '2025'),
(183, 18, 62, 17, '2025'),
(184, 18, 63, 16, '2025'),
(185, 18, 63, 17, '2025'),
(186, 18, 64, 16, '2025'),
(187, 18, 64, 17, '2025'),
(188, 18, 65, 16, '2025'),
(189, 18, 65, 17, '2025'),
(190, 18, 66, 16, '2025'),
(191, 18, 66, 17, '2025'),
(192, 19, 111, 3, '2025'),
(193, 19, 112, 3, '2025'),
(194, 19, 113, 3, '2025'),
(195, 19, 114, 3, '2025'),
(196, 19, 115, 3, '2025'),
(197, 20, 111, 22, '2025'),
(198, 20, 112, 22, '2025'),
(199, 20, 113, 22, '2025'),
(200, 20, 114, 22, '2025'),
(201, 20, 115, 22, '2025'),
(202, 21, 101, 22, '2025'),
(203, 21, 102, 22, '2025'),
(204, 21, 103, 22, '2025'),
(205, 21, 104, 22, '2025'),
(206, 21, 105, 22, '2025'),
(207, 21, 106, 22, '2025'),
(208, 21, 107, 22, '2025'),
(209, 21, 111, 22, '2025'),
(210, 21, 112, 22, '2025'),
(211, 21, 113, 22, '2025'),
(212, 21, 114, 22, '2025'),
(213, 21, 115, 22, '2025'),
(214, 22, 61, 7, '2025'),
(215, 22, 62, 7, '2025'),
(216, 22, 63, 7, '2025'),
(217, 22, 64, 7, '2025'),
(218, 23, 55, 3, '2025'),
(219, 23, 55, 6, '2025'),
(220, 23, 55, 7, '2025'),
(221, 23, 55, 8, '2025'),
(222, 23, 55, 9, '2025'),
(223, 23, 55, 12, '2025'),
(224, 23, 55, 15, '2025'),
(225, 23, 55, 17, '2025'),
(226, 23, 55, 19, '2025'),
(227, 23, 55, 20, '2025'),
(228, 23, 55, 21, '2025'),
(229, 24, 61, 15, '2025'),
(230, 24, 62, 15, '2025'),
(231, 24, 63, 15, '2025'),
(232, 24, 64, 15, '2025'),
(233, 25, 75, 6, '2025'),
(234, 25, 76, 6, '2025'),
(235, 25, 95, 6, '2025'),
(236, 25, 96, 6, '2025'),
(237, 26, 71, 17, '2025'),
(238, 26, 72, 17, '2025'),
(239, 26, 73, 17, '2025'),
(240, 26, 74, 17, '2025'),
(241, 26, 75, 17, '2025'),
(242, 26, 76, 17, '2025'),
(243, 26, 91, 17, '2025'),
(244, 26, 92, 17, '2025'),
(245, 26, 93, 17, '2025'),
(246, 26, 94, 17, '2025'),
(247, 26, 95, 17, '2025'),
(248, 26, 96, 17, '2025'),
(249, 27, 52, 6, '2025'),
(250, 27, 52, 7, '2025'),
(251, 27, 52, 8, '2025'),
(252, 27, 52, 9, '2025'),
(253, 27, 52, 12, '2025'),
(254, 27, 52, 13, '2025'),
(255, 27, 52, 15, '2025'),
(256, 27, 52, 16, '2025'),
(257, 27, 52, 17, '2025'),
(258, 27, 52, 19, '2025'),
(259, 27, 52, 20, '2025'),
(260, 27, 52, 21, '2025'),
(261, 28, 53, 2, '2025'),
(262, 28, 53, 6, '2025'),
(263, 28, 53, 7, '2025'),
(264, 28, 53, 8, '2025'),
(265, 28, 53, 9, '2025'),
(266, 28, 53, 12, '2025'),
(267, 28, 53, 13, '2025'),
(268, 28, 53, 15, '2025'),
(269, 28, 53, 16, '2025'),
(270, 28, 53, 17, '2025'),
(271, 28, 53, 19, '2025'),
(272, 28, 53, 20, '2025'),
(273, 28, 53, 21, '2025'),
(314, 19, 61, 12, '2025'),
(315, 32, 61, 17, '2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `atencion_medica`
--

CREATE TABLE `atencion_medica` (
  `id_atencion` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `atencion_medica`
--

INSERT INTO `atencion_medica` (`id_atencion`, `descripcion`, `frecuencia`) VALUES
(890303, 'Psiquiatría', 'Según decisión médica');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacidad`
--

CREATE TABLE `capacidad` (
  `id_capacidad` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `capacidad`
--

INSERT INTO `capacidad` (`id_capacidad`, `descripcion`) VALUES
(17, 'Matemáticas'),
(19, 'prueba');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `descripcion_general`
--

INSERT INTO `descripcion_general` (`id_descripcion_general`, `id_capacidad`, `id_gusto_e_interes`, `id_expectativa`, `id_expectativa_familia`, `id_red_apoyo`, `id_otra_descripcion`, `id_estudiante`) VALUES
(11, 17, 16, 16, 16, 16, 16, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_dx_cie10`
--

CREATE TABLE `diagnostico_dx_cie10` (
  `id_diagnostico_dx_cie10` int(11) NOT NULL,
  `id_cie10` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `id_diag_med` int(11) NOT NULL,
  `anio` year(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `diagnostico_dx_cie10`
--

INSERT INTO `diagnostico_dx_cie10` (`id_diagnostico_dx_cie10`, `id_cie10`, `id_diag_med`, `anio`) VALUES
(0, 'F 813', 12, '2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diagnostico_medico`
--

CREATE TABLE `diagnostico_medico` (
  `id_diag_med` int(11) NOT NULL,
  `id_piar` int(10) UNSIGNED NOT NULL,
  `DX` text DEFAULT NULL,
  `apoyos_tecnicos` text DEFAULT NULL,
  `url_soporte_dx` varchar(255) DEFAULT NULL,
  `id_entorno_salud` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `diagnostico_medico`
--

INSERT INTO `diagnostico_medico` (`id_diag_med`, `id_piar`, `DX`, `apoyos_tecnicos`, `url_soporte_dx`, `id_entorno_salud`) VALUES
(12, 24, 'Trastorno mixto de ansiedad y depresión y baja tolerancia a la frustración.', NULL, NULL, 19);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `directivo`
--

INSERT INTO `directivo` (`id_directivo`, `nombre`, `email`, `contrasena`, `cargo`, `telefono`) VALUES
(1, 'santiago plata torradinho', 'directivo@gmail.com', '$2y$10$iaYaGZ6tm/ErikfcI7mvIeYhRJXXUI8umLt4ohTc9n9sDoe/R4GAy', 'coordinador', ''),
(2, 'Liliana Ayala', 'layala@gmail.com', '$2y$10$c4s3SqY9s4eIUh3i/Bv4FeeHrLg3srVz4HhUzAX.bgqgrYXyiz7se', 'Coordinadora técnica', ''),
(3, 'Directivo de prueba en hosting', 'dcph@gmail.com', '$2y$10$.mzwOYODFvg2P1PN37n9OOu9Z2pUyqNe43aixXHxnVIiR/DelYyuS', 'Coordinador de prueba', ''),
(4, 'directivoss', 'celador@gmail.com', '$2y$10$vYUPzUxbbxKFOvMo4S78Y.OKvtaRE6jXz/kSllTJuoes9Iof5/K1q', 'celador', ''),
(5, 'David Mayorga', 'david123@gmail.com', '$2y$10$uI7keuhFPxBvAm/B7r3eOusmVnc02GUrRjD2hj6WB3Am/nUYfydRW', 'Admin', '');

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
  `es_director` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente`
--

INSERT INTO `docente` (`id_docente`, `nombre_completo`, `email`, `contrasena`, `telefono`, `es_director`) VALUES
(17, 'Gloria Anunciación Medina Uribe', 'gmedina@colegioguanenta.edu.co', '$2y$10$oTrwsoUO4rPHbPDH8UmMLuvMjbGVIdFfw3UlQzT/U9/COfsKdc8FG', '3000000000', 0),
(18, 'Bianny Marcela Florez Ronderos', 'bflorez@colegioguanenta.edu.co', '$2y$10$SNnMdeQmY6MZohB5Yf4IMe4JABCiLq5H7XwppwYuRPsZ21zOEIT7i', '3000000000', 0),
(19, 'German Mauricio Gil Ribero', 'mgil@colegioguanenta.edu.co', '$2y$10$5ajVWm1RgdOg70ka6wTR.uVSJFxj0oaP8lt61EDGsjmQCCTp7fwWe', '3000000000', 0),
(20, 'Julio Cesar Forero Cristancho', 'jforero@colegioguanenta.edu.co', '$2y$10$hM.lOhp0pNmMFeYSFnkr8OOATQzyW19S/GoV2t7X03Qn5KDbkmH0e', '3000000000', 0),
(21, 'Pedro Agustín Díaz Silva', 'pdiaz@colegioguanenta.edu.co', '$2y$10$9xsq5TVTkkg3/6DZ32Ch4.SjfnRysiqS.ZUeyfbtwhwXLHTrptdlW', '3000000000', 0),
(22, 'Lilian Mayerly González Badillo', 'lgonzalez@colegioguanenta.edu.co', '$2y$10$Z2x.zEGMfW1/LF587OzjRObUMp5o/HXOHJvV4osHS0bSROlFb.uXG', '3000000000', 0),
(23, 'Gladys Stella Forero Gutierrez', 'gforero@colegioguanenta.edu.co', '$2y$10$VXKD9mTg/jqn2ct6tbFI0uD070JrdlRhjI93axSVb1UCsDtqWFRhS', '3000000000', 1),
(24, 'Maricela Ballesteros Forero', 'mballesteros@colegioguanenta.edu.co', '$2y$10$9h9VBSCP6zGDRuTZ3Rgno.N8cP0BmUEBswFFxNoKgROZVwqLAzcNe', '3000000000', 0),
(25, 'Luz Angélica Ardila García', 'lardila@colegioguanenta.edu.co', '$2y$10$7MXXOiDhmT9CRJkEPA4BiucHPYoAV1zfxPbdik6wkpHF8.8e1WHFy', '3000000000', 0),
(26, 'Janeth Romero Alonso', 'jromero@colegioguanenta.edu.co', '$2y$10$vK.1lpojiBIJpzfczdSJn.oDYCEMgP2C30Id8GV4sEQAziSwS6pIi', '3000000000', 0),
(27, 'Claudia Juliana Ortega Blanco', 'cortega@colegioguanenta.edu.co', '$2y$10$Hpvmn4GtTXt.3BtjKPBjCuxIKuGdAxOkgMaGwfl58c2LPNcr7RM2q', '3000000000', 0),
(28, 'Rubiela Romero Alonso', 'rromero@colegioguanenta.edu.co', '$2y$10$/tF0iBWSJB5n0E1xLf4u7.Q7PUwO.zTuxEdeL9LguBC3TvB02AO/i', '3000000000', 0),
(32, 'Gilver Ivan Corredor Arguello', 'gcorredor@colegioguanenta.edu.co', '$2y$10$g3Td6xTZMkPwyy4grb6yi.S0aQQ8k3WUrdOLPRNMCNW8JEe18ayg6', '3000000000', 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente_apoyo`
--

INSERT INTO `docente_apoyo` (`id_docente_apoyo`, `nombre`, `email`, `contrasena`, `profesion`, `telefono`) VALUES
(1, 'Rocio', 'profeapoyo@gmail.com', '$2y$10$krJscpxOcSI7iQRRck/gieeN3kf1xA89n06t0kYHndzoChIrGyNO2', 'magister', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente_grupo`
--

CREATE TABLE `docente_grupo` (
  `id_docente_grupo` int(10) UNSIGNED NOT NULL,
  `id_docente` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente_grupo`
--

INSERT INTO `docente_grupo` (`id_docente_grupo`, `id_docente`, `id_grupo`, `anio`) VALUES
(9, 23, 55, '2025'),
(13, 32, 61, '2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documento`
--

CREATE TABLE `documento` (
  `id_doc` int(11) NOT NULL,
  `url_doc` varchar(1000) NOT NULL,
  `tipo_archivo` varchar(50) DEFAULT NULL,
  `tamaño_archivo` int(11) DEFAULT NULL,
  `nombre_doc` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `documento`
--

INSERT INTO `documento` (`id_doc`, `url_doc`, `tipo_archivo`, `tamaño_archivo`, `nombre_doc`) VALUES
(1, 'uploads/68d344bf5dc6d_1758676159.pdf', NULL, NULL, 'estudiante_Sebastian_Feo Murillo_2025-09-23.pdf'),
(2, 'uploads/68d9853c6677b_1759085884.pdf', NULL, NULL, 'Acta_de_Acuerdo[1].pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `dx_cie10`
--

CREATE TABLE `dx_cie10` (
  `id_cie10` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` varchar(1000) NOT NULL
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
  `observacion` text DEFAULT NULL,
  `id_estudiante` int(11) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entorno_educativo`
--

INSERT INTO `entorno_educativo` (`id_entorno_edu`, `estado`, `ultimo_grado_cursado`, `vinculado_otra_inst`, `informe_pedagogico`, `modalidad_proveniente`, `asiste_programas_complementarios`, `observacion`, `id_estudiante`) VALUES
(8, 1, '5°', 'No', 0, 'Presencial', 'No', '', 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `entorno_salud`
--

CREATE TABLE `entorno_salud` (
  `id_entorno_salud` int(10) UNSIGNED NOT NULL,
  `id_tratamiento` int(10) UNSIGNED DEFAULT NULL,
  `id_medicamento` int(10) UNSIGNED DEFAULT NULL,
  `id_atencion` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `entorno_salud`
--

INSERT INTO `entorno_salud` (`id_entorno_salud`, `id_tratamiento`, `id_medicamento`, `id_atencion`) VALUES
(19, 22, NULL, 890303);

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
  `victima_conflicto` varchar(100) DEFAULT NULL,
  `registro_victima` varchar(100) DEFAULT NULL,
  `centro_proteccion` varchar(100) DEFAULT NULL,
  `grupo_etnico` varchar(100) DEFAULT NULL,
  `no_hermanos` int(11) DEFAULT NULL,
  `lugar_que_ocupa` varchar(100) DEFAULT NULL,
  `con_quien_vive` varchar(100) DEFAULT NULL,
  `quien_apoya_crianza` varchar(100) DEFAULT NULL,
  `afiliacion_salud` varchar(100) DEFAULT NULL,
  `regimen_salud` varchar(100) NOT NULL,
  `id_madre` int(10) UNSIGNED DEFAULT NULL,
  `id_padre` int(10) UNSIGNED DEFAULT NULL,
  `id_acudiente` int(10) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `estudiante`
--

INSERT INTO `estudiante` (`id_estudiante`, `url_foto`, `nombre`, `apellidos`, `tipo_documento`, `no_documento`, `lugar_nacimiento`, `fecha_nacimiento`, `sector`, `direccion`, `telefono`, `correo`, `victima_conflicto`, `registro_victima`, `centro_proteccion`, `grupo_etnico`, `no_hermanos`, `lugar_que_ocupa`, `con_quien_vive`, `quien_apoya_crianza`, `afiliacion_salud`, `regimen_salud`, `id_madre`, `id_padre`, `id_acudiente`) VALUES
(24, 'photos/student_24_1761857165.jpg', 'Juan Andrés', 'Mantilla Angarita', 'TI', '1100969563', 'San Gil', '2014-06-14', 'Urbano', 'Calle 18 No. 10-07 apto. 301', '3126099800', 'motta.angarita@gmail.com', 'No', 'No', 'No', 'No', 0, '1', 'Madre y abuela', 'Abuela', 'Si', 'Contributivo', 33, 33, 31);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expectativa`
--

CREATE TABLE `expectativa` (
  `id_expectativa` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `expectativa`
--

INSERT INTO `expectativa` (`id_expectativa`, `descripcion`) VALUES
(16, 'Ser actor, cocinero.'),
(18, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expectativa_familia`
--

CREATE TABLE `expectativa_familia` (
  `id_expectativa_familia` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `expectativa_familia`
--

INSERT INTO `expectativa_familia` (`id_expectativa_familia`, `descripcion`) VALUES
(16, 'Ser buen apoyo para la familia y  la sociedad.'),
(18, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grado`
--

CREATE TABLE `grado` (
  `id_grado` int(10) UNSIGNED NOT NULL,
  `grado` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupo`
--

INSERT INTO `grupo` (`id_grupo`, `id_grado`, `grupo`) VALUES
(31, 3, '3-1'),
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
(115, 11, '11-5'),
(666, 11, 'PRUEBA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_estudiante`
--

CREATE TABLE `grupo_estudiante` (
  `id_grupo_estudiante` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `grupo_estudiante`
--

INSERT INTO `grupo_estudiante` (`id_grupo_estudiante`, `id_grupo`, `id_estudiante`, `anio`) VALUES
(16, 61, 24, '2025');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `grupo_sede`
--

CREATE TABLE `grupo_sede` (
  `id_grupo_sede` int(10) UNSIGNED NOT NULL,
  `id_sede` int(10) UNSIGNED NOT NULL,
  `id_grupo` int(10) UNSIGNED NOT NULL,
  `anio` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gusto_interes`
--

CREATE TABLE `gusto_interes` (
  `id_gusto_e_interes` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `gusto_interes`
--

INSERT INTO `gusto_interes` (`id_gusto_e_interes`, `descripcion`) VALUES
(16, 'Jugar, comer, animales, piscina.'),
(18, 'prueba');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `madre`
--

INSERT INTO `madre` (`id_madre`, `nombre_completo`, `nivel_educativo`, `ocupacion`, `email`, `contrasena`, `telefono`) VALUES
(33, 'Mónica Patricia Angarita', 'Tecnológico', 'Auxiliar administrativo', 'motta.angarita@gmail.com', '$2y$10$eGpSaQKxyJO6.znR7cEhQuMGWB8lBoQDMkUTk6PPimGFetuwoALq2', '3126099800');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medicamento`
--

CREATE TABLE `medicamento` (
  `id_medicamento` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL,
  `frecuencia_horario` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `medicamento`
--

INSERT INTO `medicamento` (`id_medicamento`, `descripcion`, `frecuencia_horario`) VALUES
(22, 'no se', '22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `otra_descripcion`
--

CREATE TABLE `otra_descripcion` (
  `id_otra_descripcion` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `otra_descripcion`
--

INSERT INTO `otra_descripcion` (`id_otra_descripcion`, `descripcion`) VALUES
(16, 'Es un estudiante funcional a pesar de su diagnóstico'),
(17, 'no ninguna'),
(18, 'prueba');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `padre`
--

INSERT INTO `padre` (`id_padre`, `nombre_completo`, `nivel_educativo`, `ocupacion`, `email`, `contrasena`, `telefono`) VALUES
(33, 'Anderson Daniel Mantilla', 'Técnico', 'Cocinero', '', '', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `piar`
--

CREATE TABLE `piar` (
  `id_piar` int(10) UNSIGNED NOT NULL,
  `id_estudiante` int(10) UNSIGNED NOT NULL,
  `fecha` date DEFAULT NULL,
  `ajuste` text DEFAULT NULL,
  `apoyo` text DEFAULT NULL,
  `barrera` text DEFAULT NULL,
  `compromiso` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `piar`
--

INSERT INTO `piar` (`id_piar`, `id_estudiante`, `fecha`, `ajuste`, `apoyo`, `barrera`, `compromiso`) VALUES
(24, 24, '2025-10-30', 'Pendiente', 'Pendiente', 'Pendiente', 'Pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `red_apoyo`
--

CREATE TABLE `red_apoyo` (
  `id_red_apoyo` int(10) UNSIGNED NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `red_apoyo`
--

INSERT INTO `red_apoyo` (`id_red_apoyo`, `descripcion`) VALUES
(16, 'Familia'),
(17, 'madre y padre'),
(18, 'prueba');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sede`
--

CREATE TABLE `sede` (
  `id_sede` int(10) UNSIGNED NOT NULL,
  `sede` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `descripcion` text DEFAULT NULL,
  `frecuencia` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tratamiento`
--

INSERT INTO `tratamiento` (`id_tratamiento`, `descripcion`, `frecuencia`) VALUES
(22, 'Psiquiatría', 'Según decisión médica'),
(23, 'paracetamol, antipendejes y blanqueador de piel', 'todos los dias');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `valoracion_pedagogica`
--

CREATE TABLE `valoracion_pedagogica` (
  `id_valoracion_pedagogica` int(10) UNSIGNED NOT NULL,
  `id_piar` int(10) UNSIGNED NOT NULL,
  `id_asignatura` int(10) UNSIGNED NOT NULL,
  `periodo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `anio` year(4) DEFAULT NULL,
  `objetivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `barrera` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_ajuste` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apoyo_requerido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `seguimiento` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Volcado de datos para la tabla `valoracion_pedagogica`
--

INSERT INTO `valoracion_pedagogica` (`id_valoracion_pedagogica`, `id_piar`, `id_asignatura`, `periodo`, `fecha`, `anio`, `objetivo`, `barrera`, `tipo_ajuste`, `apoyo_requerido`, `seguimiento`) VALUES
(17, 24, 12, '4', '2025-11-11', '2026', '*Identifico innovaciones e inventos trascendentales para la sociedad, ubicando y explicando su contexto histórico. *Analizo el impacto de los productos tecnológicos y reflexiono sobre su aporte en la solución de problemas y satisfacción de necesidades', '*La barrera presentada está en el desarrollo de la actividad, la cual se deberá desarrollar con base en su propio ritmo de trabajo ya que el estudiante muestra un aprendizaje mas lento que el resto de sus compañeros pero trabaja y comprende las explicaciones al igual que ellos.', '*Organizar al estudiante en los primeros puestos de la fila *En caso de hacer dictado, tener en cuenta que el estudiante va a su ritmo, por lo que en caso de que se quede atrasado, se le entregará guía de apoyo para que vaya copiando de acuerdo a su ritmo escritural.', '*La información que se presente en código escrito debe ir acompañada de imágenes (videos, pictogramas).', '*Se revisarán periódicamente las actividades ejecutadas y desarrolladas en su cuaderno y se valorará el desarrollo de las mismas semanalmente.'),
(18, 24, 15, '4', '2025-11-11', '2026', '*Identifico innovaciones e inventos trascendentales para la sociedad, ubicando y explicando su contexto histórico. *Analizo el impacto de los productos tecnológicos y reflexiono sobre su aporte en la solución de problemas y satisfacción de necesidades', '*La barrera presentada está en el desarrollo de la actividad, la cual se deberá desarrollar con base en su propio ritmo de trabajo ya que el estudiante muestra un aprendizaje mas lento que el resto de sus compañeros pero trabaja y comprende las explicaciones al igual que ellos.', '*Organizar al estudiante en los primeros puestos de la fila *En caso de hacer dictado, tener en cuenta que el estudiante va a su ritmo, por lo que en caso de que se quede atrasado, se le entregará guía de apoyo para que vaya copiando de acuerdo a su ritmo escritural.', '*La información que se presente en código escrito debe ir acompañada de imágenes (videos, pictogramas).', '*Se revisarán periódicamente las actividades ejecutadas y desarrolladas en su cuaderno y se valorará el desarrollo de las mismas semanalmente.'),
(22, 24, 17, '4', '2025-11-14', '2025', '*Identifico innovaciones e inventos trascendentales para la sociedad, ubicando y explicando su contexto histórico. *Analizo el impacto de los productos tecnológicos y reflexiono sobre su aporte en la solución de problemas y satisfacción de necesidades', '*La barrera presentada está en el desarrollo de la actividad, la cual se deberá desarrollar con base en su propio ritmo de trabajo ya que  el estudiante muestra un aprendizaje mas lento que el resto de sus compañeros pero trabaja y comprende las explicaciones al igual que ellos.', '*La información que se presente en código escrito debe ir acompañada de imágenes (videos, pictogramas)', '*La información que se presente en código escrito debe ir acompañada de imágenes (videos, pictogramas)', '*Se revisarán periódicamente las actividades ejecutadas y desarrolladas en su cuaderno y se valorará el desarrollo de las mismas semanalmente.');

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
-- Indices de la tabla `documento`
--
ALTER TABLE `documento`
  ADD PRIMARY KEY (`id_doc`);

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
  ADD KEY `id_cuidador` (`id_acudiente`);

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
  MODIFY `id_acudiente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `asignatura`
--
ALTER TABLE `asignatura`
  MODIFY `id_asignatura` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `asignatura_docente_grupo`
--
ALTER TABLE `asignatura_docente_grupo`
  MODIFY `id_asig_doc_grup` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=316;

--
-- AUTO_INCREMENT de la tabla `atencion_medica`
--
ALTER TABLE `atencion_medica`
  MODIFY `id_atencion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=890304;

--
-- AUTO_INCREMENT de la tabla `capacidad`
--
ALTER TABLE `capacidad`
  MODIFY `id_capacidad` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `descripcion_general`
--
ALTER TABLE `descripcion_general`
  MODIFY `id_descripcion_general` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `diagnostico_medico`
--
ALTER TABLE `diagnostico_medico`
  MODIFY `id_diag_med` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `directivo`
--
ALTER TABLE `directivo`
  MODIFY `id_directivo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `docente`
--
ALTER TABLE `docente`
  MODIFY `id_docente` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `docente_apoyo`
--
ALTER TABLE `docente_apoyo`
  MODIFY `id_docente_apoyo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `docente_grupo`
--
ALTER TABLE `docente_grupo`
  MODIFY `id_docente_grupo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `documento`
--
ALTER TABLE `documento`
  MODIFY `id_doc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `entorno_educativo`
--
ALTER TABLE `entorno_educativo`
  MODIFY `id_entorno_edu` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `entorno_salud`
--
ALTER TABLE `entorno_salud`
  MODIFY `id_entorno_salud` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `estudiante`
--
ALTER TABLE `estudiante`
  MODIFY `id_estudiante` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `expectativa`
--
ALTER TABLE `expectativa`
  MODIFY `id_expectativa` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `expectativa_familia`
--
ALTER TABLE `expectativa_familia`
  MODIFY `id_expectativa_familia` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `grupo_estudiante`
--
ALTER TABLE `grupo_estudiante`
  MODIFY `id_grupo_estudiante` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `grupo_sede`
--
ALTER TABLE `grupo_sede`
  MODIFY `id_grupo_sede` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gusto_interes`
--
ALTER TABLE `gusto_interes`
  MODIFY `id_gusto_e_interes` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `madre`
--
ALTER TABLE `madre`
  MODIFY `id_madre` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `medicamento`
--
ALTER TABLE `medicamento`
  MODIFY `id_medicamento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `otra_descripcion`
--
ALTER TABLE `otra_descripcion`
  MODIFY `id_otra_descripcion` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `padre`
--
ALTER TABLE `padre`
  MODIFY `id_padre` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `piar`
--
ALTER TABLE `piar`
  MODIFY `id_piar` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `red_apoyo`
--
ALTER TABLE `red_apoyo`
  MODIFY `id_red_apoyo` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `sede`
--
ALTER TABLE `sede`
  MODIFY `id_sede` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tratamiento`
--
ALTER TABLE `tratamiento`
  MODIFY `id_tratamiento` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `valoracion_pedagogica`
--
ALTER TABLE `valoracion_pedagogica`
  MODIFY `id_valoracion_pedagogica` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

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
  ADD CONSTRAINT `descripcion_general_ibfk_1` FOREIGN KEY (`id_capacidad`) REFERENCES `capacidad` (`id_capacidad`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_10` FOREIGN KEY (`id_red_apoyo`) REFERENCES `red_apoyo` (`id_red_apoyo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_2` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_3` FOREIGN KEY (`id_expectativa`) REFERENCES `expectativa` (`id_expectativa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_4` FOREIGN KEY (`id_expectativa_familia`) REFERENCES `expectativa_familia` (`id_expectativa_familia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_5` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_6` FOREIGN KEY (`id_expectativa`) REFERENCES `expectativa` (`id_expectativa`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_7` FOREIGN KEY (`id_expectativa_familia`) REFERENCES `expectativa_familia` (`id_expectativa_familia`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_8` FOREIGN KEY (`id_gusto_e_interes`) REFERENCES `gusto_interes` (`id_gusto_e_interes`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `descripcion_general_ibfk_9` FOREIGN KEY (`id_otra_descripcion`) REFERENCES `otra_descripcion` (`id_otra_descripcion`) ON DELETE CASCADE ON UPDATE CASCADE;

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
  ADD CONSTRAINT `diagnostico_medico_ibfk_1` FOREIGN KEY (`id_entorno_salud`) REFERENCES `entorno_salud` (`id_entorno_salud`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `diagnostico_medico_ibfk_2` FOREIGN KEY (`id_piar`) REFERENCES `piar` (`id_piar`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `docente_grupo`
--
ALTER TABLE `docente_grupo`
  ADD CONSTRAINT `docente_grupo_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `docente_grupo_ibfk_2` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `entorno_educativo`
--
ALTER TABLE `entorno_educativo`
  ADD CONSTRAINT `entorno_educativo_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `entorno_salud`
--
ALTER TABLE `entorno_salud`
  ADD CONSTRAINT `entorno_salud_ibfk_1` FOREIGN KEY (`id_tratamiento`) REFERENCES `tratamiento` (`id_tratamiento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entorno_salud_ibfk_2` FOREIGN KEY (`id_medicamento`) REFERENCES `medicamento` (`id_medicamento`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `entorno_salud_ibfk_3` FOREIGN KEY (`id_atencion`) REFERENCES `atencion_medica` (`id_atencion`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `estudiante`
--
ALTER TABLE `estudiante`
  ADD CONSTRAINT `estudiante_ibfk_1` FOREIGN KEY (`id_madre`) REFERENCES `madre` (`id_madre`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_2` FOREIGN KEY (`id_padre`) REFERENCES `padre` (`id_padre`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `estudiante_ibfk_3` FOREIGN KEY (`id_acudiente`) REFERENCES `acudiente` (`id_acudiente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `grupo`
--
ALTER TABLE `grupo`
  ADD CONSTRAINT `grupo_ibfk_1` FOREIGN KEY (`id_grado`) REFERENCES `grado` (`id_grado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `grupo_estudiante`
--
ALTER TABLE `grupo_estudiante`
  ADD CONSTRAINT `grupo_estudiante_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `grupo_estudiante_ibfk_2` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `grupo_estudiante_ibfk_3` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `grupo_sede`
--
ALTER TABLE `grupo_sede`
  ADD CONSTRAINT `grupo_sede_ibfk_1` FOREIGN KEY (`id_grupo`) REFERENCES `grupo` (`id_grupo`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `grupo_sede_ibfk_2` FOREIGN KEY (`id_sede`) REFERENCES `sede` (`id_sede`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `piar`
--
ALTER TABLE `piar`
  ADD CONSTRAINT `piar_ibfk_1` FOREIGN KEY (`id_estudiante`) REFERENCES `estudiante` (`id_estudiante`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `valoracion_pedagogica`
--
ALTER TABLE `valoracion_pedagogica`
  ADD CONSTRAINT `valoracion_pedagogica_ibfk_1` FOREIGN KEY (`id_piar`) REFERENCES `piar` (`id_piar`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `valoracion_pedagogica_ibfk_2` FOREIGN KEY (`id_piar`) REFERENCES `piar` (`id_piar`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `valoracion_pedagogica_ibfk_3` FOREIGN KEY (`id_asignatura`) REFERENCES `asignatura` (`id_asignatura`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
