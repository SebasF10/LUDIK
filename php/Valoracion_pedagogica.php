<?php
// valoracion_pedagogica_api.php - API unificada para el CRUD de valoraciones pedagógicas
session_start();
header('Content-Type: application/json');

// Verificar que el usuario esté logueado y tenga rol autorizado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol']) || 
    !in_array($_SESSION['rol'], ['docente', 'admin', 'docente_apoyo'])) {
    echo json_encode(['success' => false, 'message' => 'No autorizado']);
    exit;
}

require_once 'conexion.php';

$rol = $_SESSION['rol'];
$accion = $_REQUEST['accion'] ?? '';

try {
    switch ($accion) {
        case 'listar_valoraciones':
            listarValoraciones($conexion, $rol);
            break;
        case 'obtener_grupos':
            obtenerGrupos($conexion, $rol);
            break;
        case 'obtener_asignaturas':
            obtenerAsignaturas($conexion, $rol);
            break;
        case 'obtener_estudiantes':
            obtenerEstudiantes($conexion, $rol);
            break;
        case 'crear_valoracion':
            crearValoracion($conexion, $rol);
            break;
        case 'obtener_valoracion':
            obtenerValoracion($conexion, $rol);
            break;
        case 'actualizar_valoracion':
            actualizarValoracion($conexion, $rol);
            break;
        case 'eliminar_valoracion':
            eliminarValoracion($conexion, $rol);
            break;
        case 'estadisticas':
            obtenerEstadisticas($conexion, $rol);
            break;
        default:
            echo json_encode(['success' => false, 'message' => 'Acción no válida']);
    }
} catch (Exception $e) {
    error_log("Error en valoracion_pedagogica_api.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => 'Error interno del servidor']);
}

mysqli_close($conexion);

// ===== FUNCIONES =====

function listarValoraciones($conexion, $rol) {
    $filtros = [];
    $params = [];
    $types = '';
    
    // Construir filtros
    if (!empty($_GET['anio'])) {
        $filtros[] = "vp.anio = ?";
        $params[] = intval($_GET['anio']);
        $types .= 'i';
    }
    
    if (!empty($_GET['periodo'])) {
        $filtros[] = "vp.periodo = ?";
        $params[] = $_GET['periodo'];
        $types .= 's';
    }
    
    if (!empty($_GET['id_grupo'])) {
        $filtros[] = "ge.id_grupo = ?";
        $params[] = intval($_GET['id_grupo']);
        $types .= 'i';
    }
    
    $whereClause = '';
    if (!empty($filtros)) {
        $whereClause = 'AND ' . implode(' AND ', $filtros);
    }
    
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        // Admin y docente_apoyo pueden ver todas las valoraciones
        $query = "
            SELECT DISTINCT
                vp.id_valoracion_pedagogica,
                vp.periodo,
                vp.anio,
                vp.objetivo,
                vp.barrera,
                vp.tipo_ajuste,
                vp.apoyo_requerido,
                vp.seguimiento,
                e.nombre as estudiante_nombre,
                e.apellidos as estudiante_apellidos,
                e.no_documento,
                a.nombre_asig,
                g.grupo,
                gr.grado,
                CONCAT(e.nombre, ' ', e.apellidos) as estudiante_completo
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            WHERE 1=1 $whereClause
            ORDER BY e.apellidos, e.nombre
        ";
    } else {
        // Docente normal: solo sus valoraciones
        $id_docente = $_SESSION['usuario']['id_docente'];
        $params = array_merge([$id_docente], $params);
        $types = 'i' . $types;
        
        $query = "
            SELECT DISTINCT
                vp.id_valoracion_pedagogica,
                vp.periodo,
                vp.anio,
                vp.objetivo,
                vp.barrera,
                vp.tipo_ajuste,
                vp.apoyo_requerido,
                vp.seguimiento,
                e.nombre as estudiante_nombre,
                e.apellidos as estudiante_apellidos,
                e.no_documento,
                a.nombre_asig,
                g.grupo,
                gr.grado,
                CONCAT(e.nombre, ' ', e.apellidos) as estudiante_completo
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
                AND ge.id_grupo = adg.id_grupo
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            WHERE adg.id_docente = ? $whereClause
            ORDER BY e.apellidos, e.nombre
        ";
    }
    
    $stmt = mysqli_prepare($conexion, $query);
    
    if (!empty($params)) {
        mysqli_stmt_bind_param($stmt, $types, ...$params);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $valoraciones = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $valoraciones[] = [
            'id_valoracion_pedagogica' => $row['id_valoracion_pedagogica'],
            'periodo' => $row['periodo'],
            'anio' => $row['anio'],
            'objetivo' => $row['objetivo'],
            'barrera' => $row['barrera'],
            'tipo_ajuste' => $row['tipo_ajuste'],
            'apoyo_requerido' => $row['apoyo_requerido'],
            'seguimiento' => $row['seguimiento'],
            'estudiante_nombre' => $row['estudiante_nombre'],
            'estudiante_apellidos' => $row['estudiante_apellidos'],
            'estudiante_completo' => $row['estudiante_completo'],
            'no_documento' => $row['no_documento'],
            'nombre_asig' => $row['nombre_asig'],
            'grupo' => $row['grupo'],
            'grado' => $row['grado']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'valoraciones' => $valoraciones
    ]);
}

function obtenerGrupos($conexion, $rol) {
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query = "
            SELECT DISTINCT 
                g.id_grupo,
                g.grupo,
                gr.grado,
                COUNT(DISTINCT adg.id_asignatura) as total_asignaturas,
                (SELECT COUNT(*) FROM grupo_estudiante ge WHERE ge.id_grupo = g.id_grupo AND ge.anio = YEAR(CURDATE())) as total_estudiantes
            FROM grupo g
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            LEFT JOIN asignatura_docente_grupo adg ON g.id_grupo = adg.id_grupo
            GROUP BY g.id_grupo, g.grupo, gr.grado
            ORDER BY gr.id_grado, g.grupo
        ";
        $stmt = mysqli_prepare($conexion, $query);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query = "
            SELECT DISTINCT 
                g.id_grupo,
                g.grupo,
                gr.grado,
                COUNT(DISTINCT adg.id_asignatura) as total_asignaturas,
                (SELECT COUNT(*) FROM grupo_estudiante ge WHERE ge.id_grupo = g.id_grupo AND ge.anio = YEAR(CURDATE())) as total_estudiantes
            FROM grupo g
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            INNER JOIN asignatura_docente_grupo adg ON g.id_grupo = adg.id_grupo
            WHERE adg.id_docente = ?
            GROUP BY g.id_grupo, g.grupo, gr.grado
            ORDER BY gr.id_grado, g.grupo
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_docente);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $grupos = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $grupos[] = [
            'id' => $row['id_grupo'],
            'grupo' => $row['grupo'],
            'grado' => $row['grado'],
            'total_asignaturas' => $row['total_asignaturas'],
            'total_estudiantes' => $row['total_estudiantes']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'grupos' => $grupos
    ]);
}

function obtenerAsignaturas($conexion, $rol) {
    if (!isset($_GET['id_grupo'])) {
        echo json_encode(['success' => false, 'message' => 'ID de grupo requerido']);
        return;
    }
    
    $id_grupo = intval($_GET['id_grupo']);
    
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query = "
            SELECT DISTINCT 
                a.id_asignatura,
                a.nombre_asig
            FROM asignatura a
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            WHERE adg.id_grupo = ?
            ORDER BY a.nombre_asig
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_grupo);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query = "
            SELECT DISTINCT 
                a.id_asignatura,
                a.nombre_asig
            FROM asignatura a
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            WHERE adg.id_docente = ? AND adg.id_grupo = ?
            ORDER BY a.nombre_asig
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "ii", $id_docente, $id_grupo);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $asignaturas = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $asignaturas[] = [
            'id_asignatura' => $row['id_asignatura'],
            'nombre_asig' => $row['nombre_asig']
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'asignaturas' => $asignaturas
    ]);
}

function obtenerEstudiantes($conexion, $rol) {
    if (!isset($_GET['id_grupo'])) {
        echo json_encode(['success' => false, 'message' => 'ID de grupo requerido']);
        return;
    }
    
    $id_grupo = intval($_GET['id_grupo']);
    
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query = "
            SELECT 
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.correo,
                e.telefono,
                e.url_foto,
                CASE 
                    WHEN p.id_piar IS NOT NULL THEN 1 
                    ELSE 0 
                END as tiene_piar,
                p.id_piar
            FROM estudiante e
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
            LEFT JOIN piar p ON e.id_estudiante = p.id_estudiante
            WHERE ge.id_grupo = ? AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            ORDER BY e.apellidos, e.nombre
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_grupo);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        
        // Verificar acceso del docente al grupo
        $query_verificacion = "
            SELECT COUNT(*) as count 
            FROM asignatura_docente_grupo adg 
            WHERE adg.id_docente = ? AND adg.id_grupo = ?
        ";
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "ii", $id_docente, $id_grupo);
        mysqli_stmt_execute($stmt_verificacion);
        $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
        $row_verificacion = mysqli_fetch_assoc($result_verificacion);
        
        if ($row_verificacion['count'] == 0) {
            echo json_encode(['success' => false, 'message' => 'No tienes acceso a este grupo']);
            return;
        }
        
        mysqli_stmt_close($stmt_verificacion);
        
        $query = "
            SELECT 
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.correo,
                e.telefono,
                e.url_foto,
                CASE 
                    WHEN p.id_piar IS NOT NULL THEN 1 
                    ELSE 0 
                END as tiene_piar,
                p.id_piar
            FROM estudiante e
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
            LEFT JOIN piar p ON e.id_estudiante = p.id_estudiante
            WHERE ge.id_grupo = ? AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            ORDER BY e.apellidos, e.nombre
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_grupo);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    $estudiantes = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $estudiantes[] = [
            'id_estudiante' => $row['id_estudiante'],
            'nombre' => $row['nombre'],
            'apellidos' => $row['apellidos'],
            'tipo_documento' => $row['tipo_documento'],
            'no_documento' => $row['no_documento'],
            'correo' => $row['correo'] ?: 'No registrado',
            'telefono' => $row['telefono'] ?: 'No registrado',
            'tiene_piar' => (bool)$row['tiene_piar'],
            'id_piar' => $row['id_piar'],
            'url_foto' => $row['url_foto'] ?: 'No disponible'
        ];
    }
    
    mysqli_stmt_close($stmt);
    
    echo json_encode([
        'success' => true,
        'estudiantes' => $estudiantes
    ]);
}

function crearValoracion($conexion, $rol) {
    // Verificar que sea una petición POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }

    // Obtener y validar datos del formulario
    $id_grupo = intval($_POST['id_grupo'] ?? 0);
    $id_asignatura = intval($_POST['id_asignatura'] ?? 0);
    $id_estudiante = intval($_POST['id_estudiante'] ?? 0);
    $id_piar = intval($_POST['id_piar'] ?? 0);
    $periodo = mysqli_real_escape_string($conexion, $_POST['periodo'] ?? '');
    $anio = intval($_POST['anio'] ?? 0);
    $objetivo = mysqli_real_escape_string($conexion, trim($_POST['objetivo'] ?? ''));
    $barrera = mysqli_real_escape_string($conexion, trim($_POST['barrera'] ?? ''));
    $tipo_ajuste = mysqli_real_escape_string($conexion, trim($_POST['tipo_ajuste'] ?? ''));
    $apoyo_requerido = mysqli_real_escape_string($conexion, trim($_POST['apoyo_requerido'] ?? ''));
    $seguimiento = mysqli_real_escape_string($conexion, trim($_POST['seguimiento'] ?? ''));
    
    // ⭐ NUEVO: CAPTURAR FECHA ACTUAL AUTOMÁTICAMENTE
    $fecha_actual = date('Y-m-d');
    
    // Validar campos requeridos
    if (empty($id_grupo) || empty($id_asignatura) || empty($id_estudiante) || 
        empty($periodo) || empty($anio) || empty($objetivo) || empty($barrera) || 
        empty($tipo_ajuste) || empty($apoyo_requerido) || empty($seguimiento)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        return;
    }
    
    // Verificar permisos según el rol
    if ($rol === 'docente') {
        $id_docente = $_SESSION['usuario']['id_docente'];
        
        $query_verificacion = "
            SELECT COUNT(*) as count 
            FROM asignatura_docente_grupo adg 
            WHERE adg.id_docente = ? AND adg.id_grupo = ? AND adg.id_asignatura = ?
        ";
        
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "iii", $id_docente, $id_grupo, $id_asignatura);
        mysqli_stmt_execute($stmt_verificacion);
        $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
        $row_verificacion = mysqli_fetch_assoc($result_verificacion);
        
        if ($row_verificacion['count'] == 0) {
            echo json_encode(['success' => false, 'message' => 'No tienes acceso a esta asignatura en este grupo']);
            return;
        }
        
        mysqli_stmt_close($stmt_verificacion);
    }
    
    // Iniciar transacción
    mysqli_autocommit($conexion, false);
    
    try {
        // Si el estudiante no tiene PIAR, crear uno
        if (empty($id_piar)) {
            $query_piar = "
                INSERT INTO piar (id_estudiante, fecha, ajuste, apoyo, barrera) 
                VALUES (?, ?, 'Ajuste inicial generado automáticamente', 'Apoyo inicial', 'Barrera inicial identificada')
            ";
            
            $stmt_piar = mysqli_prepare($conexion, $query_piar);
            mysqli_stmt_bind_param($stmt_piar, "is", $id_estudiante, $fecha_actual);
            
            if (!mysqli_stmt_execute($stmt_piar)) {
                throw new Exception('Error al crear PIAR: ' . mysqli_error($conexion));
            }
            
            $id_piar = mysqli_insert_id($conexion);
            mysqli_stmt_close($stmt_piar);
        }
        
        // Verificar si ya existe una valoración para este estudiante, asignatura y período
        $query_existente = "
            SELECT id_valoracion_pedagogica 
            FROM valoracion_pedagogica 
            WHERE id_piar = ? AND id_asignatura = ? AND periodo = ? AND anio = ?
        ";
        
        $stmt_existente = mysqli_prepare($conexion, $query_existente);
        mysqli_stmt_bind_param($stmt_existente, "issi", $id_piar, $id_asignatura, $periodo, $anio);
        mysqli_stmt_execute($stmt_existente);
        $result_existente = mysqli_stmt_get_result($stmt_existente);
        
        if (mysqli_num_rows($result_existente) > 0) {
            throw new Exception('Ya existe una valoración pedagógica para este estudiante en esta asignatura y período');
        }
        
        mysqli_stmt_close($stmt_existente);
        
        // ⭐ MODIFICADO: Insertar la valoración pedagógica CON FECHA AUTOMÁTICA
        $query_valoracion = "
            INSERT INTO valoracion_pedagogica (
                id_piar, 
                id_asignatura, 
                periodo, 
                anio, 
                fecha,
                objetivo, 
                barrera, 
                tipo_ajuste, 
                apoyo_requerido, 
                seguimiento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ";
        
        $stmt_valoracion = mysqli_prepare($conexion, $query_valoracion);
        mysqli_stmt_bind_param(
            $stmt_valoracion, 
            "isisssssss", 
            $id_piar, 
            $id_asignatura, 
            $periodo, 
            $anio,
            $fecha_actual,
            $objetivo, 
            $barrera, 
            $tipo_ajuste, 
            $apoyo_requerido, 
            $seguimiento
        );
        
        if (!mysqli_stmt_execute($stmt_valoracion)) {
            throw new Exception('Error al registrar la valoración pedagógica: ' . mysqli_error($conexion));
        }
        
        $id_valoracion = mysqli_insert_id($conexion);
        mysqli_stmt_close($stmt_valoracion);
        
        // Confirmar transacción
        mysqli_commit($conexion);
        mysqli_autocommit($conexion, true);
        
        echo json_encode([
            'success' => true,
            'message' => 'Valoración pedagógica registrada exitosamente',
            'id_valoracion' => $id_valoracion,
            'fecha_registro' => $fecha_actual
        ]);
        
    } catch (Exception $e) {
        // Revertir transacción en caso de error
        mysqli_rollback($conexion);
        mysqli_autocommit($conexion, true);
        
        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
}

function obtenerValoracion($conexion, $rol) {
    if (!isset($_GET['id_valoracion'])) {
        echo json_encode(['success' => false, 'message' => 'ID de valoración requerido']);
        return;
    }
    
    $id_valoracion = intval($_GET['id_valoracion']);
    
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query = "
            SELECT 
                vp.*,
                e.id_estudiante,
                e.nombre as estudiante_nombre,
                e.apellidos as estudiante_apellidos,
                e.no_documento,
                e.url_foto,
                a.nombre_asig,
                g.id_grupo,
                g.grupo,
                gr.grado,
                p.id_piar,
                d.nombre_completo as docente_nombre,
                d.email as docente_email
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura 
                AND g.id_grupo = adg.id_grupo
            INNER JOIN docente d ON adg.id_docente = d.id_docente
            WHERE vp.id_valoracion_pedagogica = ?
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "i", $id_valoracion);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query = "
            SELECT 
                vp.*,
                e.id_estudiante,
                e.nombre as estudiante_nombre,
                e.apellidos as estudiante_apellidos,
                e.no_documento,
                e.url_foto,
                a.nombre_asig,
                g.id_grupo,
                g.grupo,
                gr.grado,
                p.id_piar,
                d.nombre_completo as docente_nombre,
                d.email as docente_email
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
                AND ge.id_grupo = adg.id_grupo
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
            INNER JOIN grado gr ON g.id_grado = gr.id_grado
            INNER JOIN docente d ON adg.id_docente = d.id_docente
            WHERE vp.id_valoracion_pedagogica = ? AND adg.id_docente = ?
        ";
        $stmt = mysqli_prepare($conexion, $query);
        mysqli_stmt_bind_param($stmt, "ii", $id_valoracion, $id_docente);
    }
    
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    
    if ($row = mysqli_fetch_assoc($result)) {
        // Procesar la foto antes de enviar
        $row['foto_url'] = getPhotoUrl($row['url_foto'], $row['id_estudiante']);
        
        echo json_encode([
            'success' => true,
            'valoracion' => $row
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Valoración no encontrada o sin acceso']);
    }
    
    mysqli_stmt_close($stmt);
}

function actualizarValoracion($conexion, $rol) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'message' => 'Método no permitido']);
        return;
    }
    
    $id_valoracion = intval($_POST['id_valoracion'] ?? 0);
    $periodo = mysqli_real_escape_string($conexion, $_POST['periodo'] ?? '');
    $anio = intval($_POST['anio'] ?? 0);
    $objetivo = mysqli_real_escape_string($conexion, trim($_POST['objetivo'] ?? ''));
    $barrera = mysqli_real_escape_string($conexion, trim($_POST['barrera'] ?? ''));
    $tipo_ajuste = mysqli_real_escape_string($conexion, trim($_POST['tipo_ajuste'] ?? ''));
    $apoyo_requerido = mysqli_real_escape_string($conexion, trim($_POST['apoyo_requerido'] ?? ''));
    $seguimiento = mysqli_real_escape_string($conexion, trim($_POST['seguimiento'] ?? ''));
    
    // ⭐ NUEVO: CAPTURAR FECHA ACTUAL AUTOMÁTICAMENTE
    $fecha_actual = date('Y-m-d');
    
    if (empty($id_valoracion) || empty($periodo) || empty($anio) || empty($objetivo) || 
        empty($barrera) || empty($tipo_ajuste) || empty($apoyo_requerido) || empty($seguimiento)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        return;
    }
    
    // Verificar permisos y obtener datos actuales
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query_verificacion = "
            SELECT id_piar, id_asignatura 
            FROM valoracion_pedagogica 
            WHERE id_valoracion_pedagogica = ?
        ";
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "i", $id_valoracion);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query_verificacion = "
            SELECT vp.id_piar, vp.id_asignatura 
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
                AND ge.id_grupo = adg.id_grupo
            WHERE vp.id_valoracion_pedagogica = ? AND adg.id_docente = ?
        ";
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "ii", $id_valoracion, $id_docente);
    }
    
    mysqli_stmt_execute($stmt_verificacion);
    $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
    
    if (!$row_verificacion = mysqli_fetch_assoc($result_verificacion)) {
        echo json_encode(['success' => false, 'message' => 'Valoración no encontrada o sin acceso']);
        return;
    }
    
    mysqli_stmt_close($stmt_verificacion);
    
    // Verificar si existe otra valoración con los mismos datos (excepto la actual)
    $query_duplicado = "
        SELECT id_valoracion_pedagogica 
        FROM valoracion_pedagogica 
        WHERE id_piar = ? AND id_asignatura = ? AND periodo = ? AND anio = ? 
        AND id_valoracion_pedagogica != ?
    ";
    
    $stmt_duplicado = mysqli_prepare($conexion, $query_duplicado);
    mysqli_stmt_bind_param($stmt_duplicado, "issii", 
        $row_verificacion['id_piar'], 
        $row_verificacion['id_asignatura'], 
        $periodo, 
        $anio, 
        $id_valoracion
    );
    mysqli_stmt_execute($stmt_duplicado);
    $result_duplicado = mysqli_stmt_get_result($stmt_duplicado);
    
    if (mysqli_num_rows($result_duplicado) > 0) {
        echo json_encode(['success' => false, 'message' => 'Ya existe otra valoración pedagógica para este estudiante en esta asignatura y período']);
        return;
    }
    
    mysqli_stmt_close($stmt_duplicado);
    
    // ⭐ MODIFICADO: Actualizar la valoración CON FECHA AUTOMÁTICA
    $query_update = "
        UPDATE valoracion_pedagogica 
        SET periodo = ?, anio = ?, fecha = ?, objetivo = ?, barrera = ?, tipo_ajuste = ?, 
            apoyo_requerido = ?, seguimiento = ?
        WHERE id_valoracion_pedagogica = ?
    ";
    
    $stmt_update = mysqli_prepare($conexion, $query_update);
    mysqli_stmt_bind_param($stmt_update, "sissssssi", 
        $periodo, $anio, $fecha_actual, $objetivo, $barrera, $tipo_ajuste, 
        $apoyo_requerido, $seguimiento, $id_valoracion
    );
    
    if (mysqli_stmt_execute($stmt_update)) {
        echo json_encode([
            'success' => true,
            'message' => 'Valoración pedagógica actualizada exitosamente',
            'fecha_actualizacion' => $fecha_actual
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al actualizar la valoración pedagógica'
        ]);
    }
    
    mysqli_stmt_close($stmt_update);
}
function eliminarValoracion($conexion, $rol) {
    if (!isset($_POST['id_valoracion'])) {
        echo json_encode(['success' => false, 'message' => 'ID de valoración requerido']);
        return;
    }
    
    $id_valoracion = intval($_POST['id_valoracion']);
    
    // Verificar permisos
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query_verificacion = "
            SELECT id_valoracion_pedagogica 
            FROM valoracion_pedagogica 
            WHERE id_valoracion_pedagogica = ?
        ";
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "i", $id_valoracion);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query_verificacion = "
            SELECT vp.id_valoracion_pedagogica 
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
                AND ge.id_grupo = adg.id_grupo
            WHERE vp.id_valoracion_pedagogica = ? AND adg.id_docente = ?
        ";
        $stmt_verificacion = mysqli_prepare($conexion, $query_verificacion);
        mysqli_stmt_bind_param($stmt_verificacion, "ii", $id_valoracion, $id_docente);
    }
    
    mysqli_stmt_execute($stmt_verificacion);
    $result_verificacion = mysqli_stmt_get_result($stmt_verificacion);
    
    if (mysqli_num_rows($result_verificacion) == 0) {
        echo json_encode(['success' => false, 'message' => 'Valoración no encontrada o sin acceso']);
        return;
    }
    
    mysqli_stmt_close($stmt_verificacion);
    
    // Eliminar la valoración
    $query_delete = "DELETE FROM valoracion_pedagogica WHERE id_valoracion_pedagogica = ?";
    $stmt_delete = mysqli_prepare($conexion, $query_delete);
    mysqli_stmt_bind_param($stmt_delete, "i", $id_valoracion);
    
    if (mysqli_stmt_execute($stmt_delete)) {
        echo json_encode([
            'success' => true,
            'message' => 'Valoración pedagógica eliminada exitosamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al eliminar la valoración pedagógica'
        ]);
    }
    
    mysqli_stmt_close($stmt_delete);
}

function obtenerEstadisticas($conexion, $rol) {
    if ($rol === 'admin' || $rol === 'docente_apoyo') {
        $query_stats = "
            SELECT 
                COUNT(DISTINCT vp.id_valoracion_pedagogica) as total_valoraciones,
                COUNT(DISTINCT e.id_estudiante) as total_estudiantes,
                COUNT(DISTINCT g.id_grupo) as total_grupos
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
        ";
        $stmt_stats = mysqli_prepare($conexion, $query_stats);
    } else {
        $id_docente = $_SESSION['usuario']['id_docente'];
        $query_stats = "
            SELECT 
                COUNT(DISTINCT vp.id_valoracion_pedagogica) as total_valoraciones,
                COUNT(DISTINCT e.id_estudiante) as total_estudiantes,
                COUNT(DISTINCT g.id_grupo) as total_grupos
            FROM valoracion_pedagogica vp
            INNER JOIN piar p ON vp.id_piar = p.id_piar
            INNER JOIN estudiante e ON p.id_estudiante = e.id_estudiante
            INNER JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
            INNER JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = vp.anio OR ge.anio IS NULL)
                AND ge.id_grupo = adg.id_grupo
            INNER JOIN grupo g ON ge.id_grupo = g.id_grupo
            WHERE adg.id_docente = ?
        ";
        $stmt_stats = mysqli_prepare($conexion, $query_stats);
        mysqli_stmt_bind_param($stmt_stats, "i", $id_docente);
    }
    
    mysqli_stmt_execute($stmt_stats);
    $result_stats = mysqli_stmt_get_result($stmt_stats);
    $stats = mysqli_fetch_assoc($result_stats);
    
    mysqli_stmt_close($stmt_stats);
    
    echo json_encode([
        'success' => true,
        'estadisticas' => [
            'total_valoraciones' => $stats['total_valoraciones'] ?: 0,
            'total_estudiantes' => $stats['total_estudiantes'] ?: 0,
            'total_grupos' => $stats['total_grupos'] ?: 0
        ]
    ]);
}


//Generar URL de foto del estudiante
function getPhotoUrl($urlFoto, $idEstudiante) {
    // Si hay URL en la base de datos
    if (!empty($urlFoto)) {
        // Verificar si el archivo existe
        if (file_exists("../$urlFoto")) {
            return $urlFoto;
        }
    }
    
    // Si no hay URL o el archivo no existe, usar foto por defecto
    return "photos/default.png";
}

?>