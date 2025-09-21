<?php
session_start();
include("conexion.php");

// Verificar sesión
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(["error" => "No hay sesión activa"]);
    exit;
}

$usuario = $_SESSION['usuario'];
$rol = $_SESSION['rol'];
$email = $usuario['email'];

// Función para ejecutar consultas de forma segura con MySQLi
function ejecutarConsulta($conexion, $query, $params = []) {
    try {
        if (!empty($params)) {
            $stmt = $conexion->prepare($query);
            if (!$stmt) {
                error_log("Error preparando consulta: " . $conexion->error);
                return [];
            }
            
            // Crear tipos para bind_param
            $types = str_repeat('s', count($params)); // Asumiendo strings por simplicidad
            $stmt->bind_param($types, ...$params);
            $stmt->execute();
            
            $result = $stmt->get_result();
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            $stmt->close();
            return $data;
        } else {
            $result = $conexion->query($query);
            if (!$result) {
                error_log("Error en consulta: " . $conexion->error);
                return [];
            }
            
            $data = [];
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
            return $data;
        }
    } catch (Exception $e) {
        error_log("Error en consulta: " . $e->getMessage());
        return [];
    }
}

// Obtener datos básicos del usuario según el rol
function obtenerDatosBasicos($conexion, $rol, $email) {
    $tabla = "";
    $campo_nombre = "nombre";
    $foto = "img/default-avatar.png";
    
    switch ($rol) {
        case "admin":
            $tabla = "admin";
            $campo_nombre = "nombre";
            $foto = "img/logoadmin.png";
            break;
        case "docente":
            $tabla = "docente";
            $campo_nombre = "nombre_completo";
            $foto = "img/logoprofe.png";
            break;
        case "docente_apoyo":
            $tabla = "docente_apoyo";
            $campo_nombre = "nombre";
            $foto = "img/logoProfeapoyo.png";
            break;
        case "directivo":
            $tabla = "directivo";
            $campo_nombre = "nombre";
            $foto = "img/logodirectivo.webp";
            break;
        case "acudiente":
            $tabla = "acudiente";
            $campo_nombre = "nombre_completo";
            $foto = "img/logoacudiente.webp";
            break;
        case "madre":
            $tabla = "madre";
            $campo_nombre = "nombre_completo";
            $foto = "img/Logomadre.webp";
            break;
        case "padre":
            $tabla = "padre";
            $campo_nombre = "nombre_completo";
            $foto = "img/logopadre.png";
            break;
        case "estudiante":
            $tabla = "estudiante";
            $campo_nombre = "nombre";
            $foto = "img/logoestudiante.png";
            break;
        default:
            return null;
    }
    
    $query = "SELECT * FROM $tabla WHERE email = ? LIMIT 1";
    $resultado = ejecutarConsulta($conexion, $query, [$email]);
    
    if (!empty($resultado)) {
        $datos = $resultado[0];
        return [
            'datos' => $datos,
            'nombre' => $datos[$campo_nombre] ?? ($datos['nombre'] ?? 'Sin nombre'),
            'email' => $datos['email'] ?? 'Sin email',
            'celular' => $datos['telefono'] ?? ($datos['celular'] ?? 'No registrado'),
            'rol' => ucfirst($rol),
            'foto' => $foto,
            'tabla' => $tabla
        ];
    }
    
    return null;
}

// Obtener datos específicos para Admin
function obtenerDatosAdmin($conexion) {
    $estadisticas = [];
    
    // Total estudiantes
    $query = "SELECT COUNT(*) as total FROM estudiante";
    $resultado = ejecutarConsulta($conexion, $query);
    $estadisticas['total_estudiantes'] = $resultado[0]['total'] ?? 0;
    
    // Total docentes
    $query = "SELECT COUNT(*) as total FROM docente";
    $resultado = ejecutarConsulta($conexion, $query);
    $estadisticas['total_docentes'] = $resultado[0]['total'] ?? 0;
    
    // Total directivos
    $query = "SELECT COUNT(*) as total FROM directivo";
    $resultado = ejecutarConsulta($conexion, $query);
    $estadisticas['total_directivos'] = $resultado[0]['total'] ?? 0;
    
    // Total grupos
    $query = "SELECT COUNT(*) as total FROM grupo";
    $resultado = ejecutarConsulta($conexion, $query);
    $estadisticas['total_grupos'] = $resultado[0]['total'] ?? 0;
    
    // Total asignaturas
    $query = "SELECT COUNT(*) as total FROM asignatura";
    $resultado = ejecutarConsulta($conexion, $query);
    $estadisticas['total_asignaturas'] = $resultado[0]['total'] ?? 0;
    
    // PIARs activos
    $query = "SELECT e.nombre, e.apellidos, p.fecha 
              FROM piar p 
              JOIN estudiante e ON p.id_estudiante = e.id_estudiante 
              ORDER BY p.fecha DESC LIMIT 10";
    $piars_activos = ejecutarConsulta($conexion, $query);
    $piars_formateados = [];
    foreach ($piars_activos as $piar) {
        $piars_formateados[] = [
            'estudiante' => $piar['nombre'] . ' ' . $piar['apellidos'],
            'fecha' => date('d/m/Y', strtotime($piar['fecha']))
        ];
    }
    
    // Actividad reciente (simulada - puedes personalizar según tus necesidades)
    $actividad_reciente = [
        ['descripcion' => 'Nuevo estudiante registrado'],
        ['descripcion' => 'PIAR actualizado'],
        ['descripción' => 'Docente asignado a grupo'],
        ['descripcion' => 'Valoración pedagógica completada']
    ];
    
    return [
        'estadisticas' => $estadisticas,
        'piars_activos' => $piars_formateados,
        'actividad_reciente' => $actividad_reciente
    ];
}

// Obtener datos específicos para Docente
function obtenerDatosDocente($conexion, $id_docente) {
    $datos = [];
    
    // Grupos asignados con estudiantes
    $query = "SELECT DISTINCT gr.grupo, gd.grado, COUNT(ge.id_estudiante) as total_estudiantes
              FROM docente_grupo dg
              JOIN grupo gr ON dg.id_grupo = gr.id_grupo
              JOIN grado gd ON gr.id_grado = gd.id_grado
              LEFT JOIN grupo_estudiante ge ON gr.id_grupo = ge.id_grupo
              WHERE dg.id_docente = ? AND (dg.anio = YEAR(CURDATE()) OR dg.anio IS NULL)
              GROUP BY gr.id_grupo, gr.grupo, gd.grado";
    $grupos = ejecutarConsulta($conexion, $query, [$id_docente]);
    $datos['grupos_asignados'] = $grupos;
    
    // Asignaturas que dicta
    $query = "SELECT DISTINCT a.nombre_asig
              FROM asignatura_docente_grupo adg
              JOIN asignatura a ON adg.id_asignatura = a.id_asignatura
              WHERE adg.id_docente = ? AND (adg.anio = YEAR(CURDATE()) OR adg.anio IS NULL)";
    $asignaturas = ejecutarConsulta($conexion, $query, [$id_docente]);
    $datos['asignaturas'] = $asignaturas;
    
    // Estudiantes con PIAR en sus grupos
    $query = "SELECT DISTINCT e.nombre, e.apellidos, CONCAT(gd.grado, ' ', gr.grupo) as grupo
              FROM estudiante e
              JOIN piar p ON e.id_estudiante = p.id_estudiante
              JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
              JOIN grupo gr ON ge.id_grupo = gr.id_grupo
              JOIN grado gd ON gr.id_grado = gd.id_grado
              JOIN docente_grupo dg ON gr.id_grupo = dg.id_grupo
              WHERE dg.id_docente = ? AND (dg.anio = YEAR(CURDATE()) OR dg.anio IS NULL)";
    $estudiantes_piar = ejecutarConsulta($conexion, $query, [$id_docente]);
    $datos['estudiantes_piar'] = $estudiantes_piar;
    
    // Verificar si es director de grupo
    $query = "SELECT es_director FROM docente WHERE id_docente = ?";
    $director = ejecutarConsulta($conexion, $query, [$id_docente]);
    if (!empty($director) && $director[0]['es_director']) {
        $datos['es_director_grupo'] = true;
        
        // Información del grupo que dirige
        $query = "SELECT CONCAT(gd.grado, ' ', gr.grupo) as nombre,
                         COUNT(ge.id_estudiante) as total_estudiantes,
                         COUNT(p.id_piar) as estudiantes_piar
                  FROM docente_grupo dg
                  JOIN grupo gr ON dg.id_grupo = gr.id_grupo
                  JOIN grado gd ON gr.id_grado = gd.id_grado
                  LEFT JOIN grupo_estudiante ge ON gr.id_grupo = ge.id_grupo
                  LEFT JOIN estudiante e ON ge.id_estudiante = e.id_estudiante
                  LEFT JOIN piar p ON e.id_estudiante = p.id_estudiante
                  WHERE dg.id_docente = ? AND (dg.anio = YEAR(CURDATE()) OR dg.anio IS NULL)
                  GROUP BY gr.id_grupo LIMIT 1";
        $grupo_dirigido = ejecutarConsulta($conexion, $query, [$id_docente]);
        $datos['grupo_dirigido'] = $grupo_dirigido[0] ?? null;
    }
    
    return $datos;
}

// Obtener datos específicos para Docente de Apoyo
function obtenerDatosDocenteApoyo($conexion) {
    // Todos los estudiantes con PIAR (asumiendo que el docente de apoyo trabaja con todos)
    $query = "SELECT e.nombre, e.apellidos, CONCAT(gd.grado, ' ', gr.grupo) as grado
              FROM estudiante e
              JOIN piar p ON e.id_estudiante = p.id_estudiante
              JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
              JOIN grupo gr ON ge.id_grupo = gr.id_grupo
              JOIN grado gd ON gr.id_grado = gd.id_grado
              ORDER BY e.nombre";
    $estudiantes_apoyo = ejecutarConsulta($conexion, $query);
    
    // Estadísticas de PIARs
    $query_total = "SELECT COUNT(*) as total FROM piar";
    $total_piars = ejecutarConsulta($conexion, $query_total);
    
    $query_recientes = "SELECT COUNT(*) as recientes FROM piar WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())";
    $piars_recientes = ejecutarConsulta($conexion, $query_recientes);
    
    return [
        'estudiantes_apoyo' => $estudiantes_apoyo,
        'piars_activos' => [
            'total' => $total_piars[0]['total'] ?? 0,
            'recientes' => $piars_recientes[0]['recientes'] ?? 0,
            'pendientes' => rand(1, 5) // Simulado - personalizar según necesidades
        ]
    ];
}

// Obtener datos específicos para Directivo
function obtenerDatosDirectivo($conexion, $datos_usuario) {
    $estadisticas = [];
    
    // Estadísticas generales (similar a admin pero más resumido)
    $queries = [
        'total_estudiantes' => "SELECT COUNT(*) as total FROM estudiante",
        'total_docentes' => "SELECT COUNT(*) as total FROM docente",
        'total_grupos' => "SELECT COUNT(*) as total FROM grupo",
        'total_piars' => "SELECT COUNT(*) as total FROM piar"
    ];
    
    foreach ($queries as $key => $query) {
        $resultado = ejecutarConsulta($conexion, $query);
        $estadisticas[$key] = $resultado[0]['total'] ?? 0;
    }
    
    return [
        'estadisticas' => $estadisticas,
        'cargo' => $datos_usuario['datos']['cargo'] ?? 'Directivo',
        'sede' => 'Sede A', // Personalizar según corresponda
        'experiencia' => 'N/A'
    ];
}

// Obtener datos específicos para Estudiante
function obtenerDatosEstudiante($conexion, $id_estudiante) {
    $datos = [];
    
    // Información académica actual
    $query = "SELECT gd.grado, gr.grupo, d.nombre_completo as director_grupo, ge.anio
              FROM grupo_estudiante ge
              JOIN grupo gr ON ge.id_grupo = gr.id_grupo
              JOIN grado gd ON gr.id_grado = gd.id_grado
              LEFT JOIN docente_grupo dg ON gr.id_grupo = dg.id_grupo AND dg.anio = ge.anio
              LEFT JOIN docente d ON dg.id_docente = d.id_docente AND d.es_director = 1
              WHERE ge.id_estudiante = ?
              ORDER BY ge.anio DESC LIMIT 1";
    $info_academica = ejecutarConsulta($conexion, $query, [$id_estudiante]);
    $datos['info_academica'] = $info_academica[0] ?? null;
    
    // Información familiar
    $query = "SELECT m.nombre_completo as madre, p.nombre_completo as padre, 
                     a.nombre_completo as acudiente, e.con_quien_vive
              FROM estudiante e
              LEFT JOIN madre m ON e.id_madre = m.id_madre
              LEFT JOIN padre p ON e.id_padre = p.id_padre
              LEFT JOIN acudiente a ON e.id_cuidador = a.id_acudiente
              WHERE e.id_estudiante = ?";
    $info_familiar = ejecutarConsulta($conexion, $query, [$id_estudiante]);
    $datos['info_familiar'] = $info_familiar[0] ?? null;
    
    // PIAR (si existe)
    $query = "SELECT p.fecha, dm.DX as diagnostico, COUNT(vp.id_valoracion_pedagogica) as total_apoyos
              FROM piar p
              LEFT JOIN diagnostico_medico dm ON p.id_piar = dm.id_piar
              LEFT JOIN valoracion_pedagogica vp ON p.id_piar = vp.id_piar
              WHERE p.id_estudiante = ?
              GROUP BY p.id_piar
              ORDER BY p.fecha DESC LIMIT 1";
    $piar = ejecutarConsulta($conexion, $query, [$id_estudiante]);
    if (!empty($piar)) {
        $datos['piar'] = [
            'fecha' => date('d/m/Y', strtotime($piar[0]['fecha'])),
            'diagnostico' => $piar[0]['diagnostico'] ?? 'Sin diagnóstico específico',
            'total_apoyos' => $piar[0]['total_apoyos']
        ];
    }
    
    // Asignaturas y docentes actuales
    $query = "SELECT a.nombre_asig as asignatura, d.nombre_completo as docente
              FROM asignatura_docente_grupo adg
              JOIN asignatura a ON adg.id_asignatura = a.id_asignatura
              JOIN docente d ON adg.id_docente = d.id_docente
              JOIN grupo_estudiante ge ON adg.id_grupo = ge.id_grupo
              WHERE ge.id_estudiante = ? AND (adg.anio = YEAR(CURDATE()) OR adg.anio IS NULL)
              ORDER BY a.nombre_asig";
    $asignaturas_docentes = ejecutarConsulta($conexion, $query, [$id_estudiante]);
    $datos['asignaturas_docentes'] = $asignaturas_docentes;
    
    return $datos;
}

// Obtener datos para familia (madre, padre, acudiente)
function obtenerDatosFamilia($conexion, $id_usuario, $rol) {
    $datos = [];
    $campo_id = "id_" . $rol;
    
    // Buscar estudiante conectado
    $query = "SELECT e.*, CONCAT(gd.grado, ' ', gr.grupo) as grado_actual,
                     CONCAT(gd.grado, ' ', gr.grupo) as grupo_actual,
                     d.nombre_completo as director_grupo
              FROM estudiante e
              LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                  AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
              LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
              LEFT JOIN grado gd ON gr.id_grado = gd.id_grado
              LEFT JOIN docente_grupo dg ON gr.id_grupo = dg.id_grupo 
                  AND (dg.anio = YEAR(CURDATE()) OR dg.anio IS NULL)
              LEFT JOIN docente d ON dg.id_docente = d.id_docente AND d.es_director = 1
              WHERE e.$campo_id = ?
              ORDER BY ge.anio DESC LIMIT 1";
    
    $estudiante = ejecutarConsulta($conexion, $query, [$id_usuario]);
    
    if (!empty($estudiante)) {
        $estudiante_data = $estudiante[0];
        $datos['estudiante_conectado'] = $estudiante_data;
        
        // Asignaturas y docentes del estudiante
        $query = "SELECT a.nombre_asig as asignatura, d.nombre_completo as docente
                  FROM asignatura_docente_grupo adg
                  JOIN asignatura a ON adg.id_asignatura = a.id_asignatura
                  JOIN docente d ON adg.id_docente = d.id_docente
                  JOIN grupo_estudiante ge ON adg.id_grupo = ge.id_grupo
                  WHERE ge.id_estudiante = ? AND (adg.anio = YEAR(CURDATE()) OR adg.anio IS NULL)
                  ORDER BY a.nombre_asig";
        $asignaturas = ejecutarConsulta($conexion, $query, [$estudiante_data['id_estudiante']]);
        $datos['info_academica_estudiante'] = $asignaturas;
        
        // PIAR del estudiante (si existe)
        $query = "SELECT p.fecha, dm.DX as diagnostico, 
                         DATE_ADD(p.fecha, INTERVAL 6 MONTH) as proxima_revision
                  FROM piar p
                  LEFT JOIN diagnostico_medico dm ON p.id_piar = dm.id_piar
                  WHERE p.id_estudiante = ?
                  ORDER BY p.fecha DESC LIMIT 1";
        $piar = ejecutarConsulta($conexion, $query, [$estudiante_data['id_estudiante']]);
        if (!empty($piar)) {
            $datos['estudiante_piar'] = [
                'fecha' => date('d/m/Y', strtotime($piar[0]['fecha'])),
                'diagnostico' => $piar[0]['diagnostico'] ?? 'Sin diagnóstico específico',
                'proxima_revision' => date('d/m/Y', strtotime($piar[0]['proxima_revision']))
            ];
        }
        
        // Información familiar completa
        $query = "SELECT m.nombre_completo as madre, p.nombre_completo as padre, 
                         a.nombre_completo as acudiente, e.no_hermanos as hermanos
                  FROM estudiante e
                  LEFT JOIN madre m ON e.id_madre = m.id_madre
                  LEFT JOIN padre p ON e.id_padre = p.id_padre
                  LEFT JOIN acudiente a ON e.id_cuidador = a.id_acudiente
                  WHERE e.id_estudiante = ?";
        $familia = ejecutarConsulta($conexion, $query, [$estudiante_data['id_estudiante']]);
        if (!empty($familia)) {
            $datos['info_familia_completa'] = $familia[0];
        }
    }
    
    return $datos;
}

// Proceso principal
try {
    $datos_usuario = obtenerDatosBasicos($conexion, $rol, $email);
    
    if (!$datos_usuario) {
        echo json_encode(["error" => "No se encontraron datos del usuario"]);
        exit;
    }
    
    $respuesta = [
        "nombre" => $datos_usuario['nombre'],
        "email" => $datos_usuario['email'],
        "celular" => $datos_usuario['celular'],
        "rol" => $rol,
        "foto" => $datos_usuario['foto']
    ];
    
    // Obtener datos específicos según el rol
    switch ($rol) {
        case "admin":
            $datos_especificos = obtenerDatosAdmin($conexion);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
            
        case "docente":
            $id_docente = $datos_usuario['datos']['id_docente'];
            $datos_especificos = obtenerDatosDocente($conexion, $id_docente);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
            
        case "docente_apoyo":
            $datos_especificos = obtenerDatosDocenteApoyo($conexion);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
            
        case "directivo":
            $datos_especificos = obtenerDatosDirectivo($conexion, $datos_usuario);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
            
        case "estudiante":
            $id_estudiante = $datos_usuario['datos']['id_estudiante'];
            $datos_especificos = obtenerDatosEstudiante($conexion, $id_estudiante);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
            
        case "madre":
        case "padre":  
        case "acudiente":
            $campo_id = ($rol == "acudiente") ? "id_acudiente" : "id_" . $rol;
            $id_usuario = $datos_usuario['datos'][$campo_id];
            $datos_especificos = obtenerDatosFamilia($conexion, $id_usuario, $rol);
            $respuesta = array_merge($respuesta, $datos_especificos);
            break;
    }
    
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    
} catch (Exception $e) {
    error_log("Error general en Perfil.php: " . $e->getMessage());
    echo json_encode(["error" => "Error interno del servidor"]);
}
?>