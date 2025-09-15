<?php
// Incluir el archivo de conexión
require_once 'conexion.php';

// Configuración de respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Obtener la acción solicitada
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'getAllStudents':
        getAllStudents();
        break;
    case 'searchStudents':
        searchStudents();
        break;
    case 'getStudentDetails':
        getStudentDetails();
        break;
    case 'getFilters':
        getFilters();
        break;
    default:
        echo json_encode(['success' => false, 'error' => 'Acción no válida']);
        break;
}

/**
 * Obtener todos los estudiantes con información básica
 */
function getAllStudents() {
    global $conexion;
    
    try {
        $sql = "
            SELECT 
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.telefono,
                e.correo,
                g.grado,
                gr.grupo,
                gr.id_grupo,
                g.id_grado
            FROM estudiante e
            LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
            LEFT JOIN grado g ON gr.id_grado = g.id_grado
            ORDER BY e.apellidos, e.nombre
        ";
        
        $result = mysqli_query($conexion, $sql);
        
        if (!$result) {
            throw new Exception("Error en la consulta: " . mysqli_error($conexion));
        }
        
        $students = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $students[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'students' => $students,
            'total' => count($students)
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Buscar estudiantes por término
 */
function searchStudents() {
    global $conexion;
    
    $term = $_GET['term'] ?? '';
    $gradoFilter = $_GET['grado'] ?? '';
    $grupoFilter = $_GET['grupo'] ?? '';
    
    if (empty($term)) {
        echo json_encode(['success' => false, 'error' => 'Término de búsqueda requerido']);
        return;
    }
    
    try {
        $searchTerm = '%' . mysqli_real_escape_string($conexion, $term) . '%';
        
        $sql = "
            SELECT 
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.telefono,
                e.correo,
                g.grado,
                gr.grupo,
                gr.id_grupo,
                g.id_grado
            FROM estudiante e
            LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
            LEFT JOIN grado g ON gr.id_grado = g.id_grado
            WHERE 
                (e.nombre LIKE '$searchTerm' OR 
                e.apellidos LIKE '$searchTerm' OR 
                e.no_documento LIKE '$searchTerm' OR
                CONCAT(e.nombre, ' ', e.apellidos) LIKE '$searchTerm')
        ";
        
        // Añadir filtros opcionales
        if (!empty($gradoFilter)) {
            $gradoFilter = mysqli_real_escape_string($conexion, $gradoFilter);
            $sql .= " AND g.id_grado = '$gradoFilter'";
        }
        
        if (!empty($grupoFilter)) {
            $grupoFilter = mysqli_real_escape_string($conexion, $grupoFilter);
            $sql .= " AND gr.id_grupo = '$grupoFilter'";
        }
        
        $sql .= " ORDER BY e.apellidos, e.nombre";
        
        $result = mysqli_query($conexion, $sql);
        
        if (!$result) {
            throw new Exception("Error en la consulta: " . mysqli_error($conexion));
        }
        
        $students = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $students[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'students' => $students,
            'total' => count($students)
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Obtener detalles completos de un estudiante
 */
function getStudentDetails() {
    global $conexion;
    
    $studentId = $_GET['id'] ?? '';
    
    if (empty($studentId)) {
        echo json_encode(['success' => false, 'error' => 'ID de estudiante requerido']);
        return;
    }
    
    try {
        // Información básica del estudiante
        $studentData = getBasicStudentInfo($conexion, $studentId);
        
        if (!$studentData) {
            echo json_encode(['success' => false, 'error' => 'Estudiante no encontrado']);
            return;
        }
        
        // Información adicional
        $studentData['madre'] = getParentInfo($conexion, $studentData['id_madre'], 'madre');
        $studentData['padre'] = getParentInfo($conexion, $studentData['id_padre'], 'padre');
        $studentData['acudiente'] = getParentInfo($conexion, $studentData['id_cuidador'], 'acudiente');
        $studentData['entorno_educativo'] = getEducationalEnvironment($conexion, $studentId);
        $studentData['info_medica'] = getMedicalInfo($conexion, $studentId);
        $studentData['piar'] = getPiarInfo($conexion, $studentId);
        $studentData['valoraciones'] = getPedagogicalEvaluations($conexion, $studentId);
        $studentData['descripcion_general'] = getGeneralDescription($conexion, $studentId);
        
        // Información del grupo actual
        $groupInfo = getCurrentGroup($conexion, $studentId);
        if ($groupInfo) {
            $studentData['grado'] = $groupInfo['grado'];
            $studentData['grupo'] = $groupInfo['grupo'];
        }
        
        echo json_encode([
            'success' => true,
            'student' => $studentData
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Obtener filtros para grados y grupos
 */
function getFilters() {
    global $conexion;
    
    try {
        // Obtener grados
        $gradosResult = mysqli_query($conexion, "SELECT id_grado, grado FROM grado ORDER BY grado");
        if (!$gradosResult) {
            throw new Exception("Error obteniendo grados: " . mysqli_error($conexion));
        }
        
        $grados = [];
        while ($row = mysqli_fetch_assoc($gradosResult)) {
            $grados[] = $row;
        }
        
        // Obtener grupos
        $gruposResult = mysqli_query($conexion, "
            SELECT gr.id_grupo, gr.grupo, g.grado 
            FROM grupo gr 
            JOIN grado g ON gr.id_grado = g.id_grado 
            ORDER BY g.grado, gr.grupo
        ");
        
        if (!$gruposResult) {
            throw new Exception("Error obteniendo grupos: " . mysqli_error($conexion));
        }
        
        $grupos = [];
        while ($row = mysqli_fetch_assoc($gruposResult)) {
            $grupos[] = $row;
        }
        
        echo json_encode([
            'success' => true,
            'grados' => $grados,
            'grupos' => $grupos
        ]);
        
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Obtener información básica del estudiante
 */
function getBasicStudentInfo($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM estudiante WHERE id_estudiante = '$studentId'";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Obtener información de padre, madre o acudiente
 */
function getParentInfo($conexion, $parentId, $type) {
    if (!$parentId) return null;
    
    $table = $type;
    $idColumn = 'id_' . $type;
    $parentId = mysqli_real_escape_string($conexion, $parentId);
    
    $sql = "SELECT * FROM $table WHERE $idColumn = '$parentId'";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Obtener información del entorno educativo
 */
function getEducationalEnvironment($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM entorno_educativo WHERE id_estudiante = '$studentId'";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Obtener información médica completa
 */
function getMedicalInfo($conexion, $studentId) {
    $medicalInfo = [];
    
    try {
        $studentId = mysqli_real_escape_string($conexion, $studentId);
        
        // Obtener PIAR del estudiante
        $piarSql = "SELECT id_piar FROM piar WHERE id_estudiante = '$studentId' ORDER BY fecha DESC LIMIT 1";
        $piarResult = mysqli_query($conexion, $piarSql);
        
        if (!$piarResult || mysqli_num_rows($piarResult) == 0) {
            return null;
        }
        
        $piar = mysqli_fetch_assoc($piarResult);
        $piarId = mysqli_real_escape_string($conexion, $piar['id_piar']);
        
        // Obtener diagnósticos médicos con códigos CIE-10
        $diagnosticosSql = "
            SELECT dm.*, ddx.id_cie10, dx.descripcion as dx_descripcion, ddx.anio
            FROM diagnostico_medico dm
            LEFT JOIN diagnostico_dx_cie10 ddx ON dm.id_diag_med = ddx.id_diag_med
            LEFT JOIN dx_cie10 dx ON ddx.id_cie10 = dx.id_cie10
            WHERE dm.id_piar = '$piarId'
        ";
        $diagResult = mysqli_query($conexion, $diagnosticosSql);
        
        // Organizar diagnósticos
        $medicalInfo['diagnosticos'] = [];
        $medicalInfo['dx_general'] = null;
        $medicalInfo['apoyos_tecnicos'] = null;
        $medicalInfo['soporte_dx'] = null;
        
        if ($diagResult) {
            while ($diag = mysqli_fetch_assoc($diagResult)) {
                if (!empty($diag['DX'])) {
                    $medicalInfo['dx_general'] = $diag['DX'];
                }
                if (!empty($diag['apoyos_tecnicos'])) {
                    $medicalInfo['apoyos_tecnicos'] = $diag['apoyos_tecnicos'];
                }
                if (!empty($diag['url_soporte_dx'])) {
                    $medicalInfo['soporte_dx'] = $diag['url_soporte_dx'];
                }
                if ($diag['id_cie10'] && $diag['dx_descripcion']) {
                    $medicalInfo['diagnosticos'][] = [
                        'id_cie10' => $diag['id_cie10'],
                        'descripcion' => $diag['dx_descripcion'],
                        'anio' => $diag['anio']
                    ];
                }
            }
        }
        
        // Obtener medicamentos
        $medicamentosSql = "
            SELECT DISTINCT m.*
            FROM medicamento m
            JOIN entorno_salud es ON m.id_medicamento = es.id_medicamento
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = '$piarId'
        ";
        $medResult = mysqli_query($conexion, $medicamentosSql);
        $medicalInfo['medicamentos'] = [];
        
        if ($medResult) {
            while ($med = mysqli_fetch_assoc($medResult)) {
                $medicalInfo['medicamentos'][] = $med;
            }
        }
        
        // Obtener tratamientos
        $tratamientosSql = "
            SELECT DISTINCT t.*
            FROM tratamiento t
            JOIN entorno_salud es ON t.id_tratamiento = es.id_tratamiento
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = '$piarId'
        ";
        $tratResult = mysqli_query($conexion, $tratamientosSql);
        $medicalInfo['tratamientos'] = [];
        
        if ($tratResult) {
            while ($trat = mysqli_fetch_assoc($tratResult)) {
                $medicalInfo['tratamientos'][] = $trat;
            }
        }
        
        // Obtener atención médica
        $atencionSql = "
            SELECT DISTINCT a.*
            FROM atencion_medica a
            JOIN entorno_salud es ON a.id_atencion = es.id_atencion
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = '$piarId'
        ";
        $atenResult = mysqli_query($conexion, $atencionSql);
        $medicalInfo['atencion_medica'] = [];
        
        if ($atenResult) {
            while ($aten = mysqli_fetch_assoc($atenResult)) {
                $medicalInfo['atencion_medica'][] = $aten;
            }
        }
        
        return $medicalInfo;
        
    } catch (Exception $e) {
        error_log("Error obteniendo información médica: " . $e->getMessage());
        return null;
    }
}

/**
 * Obtener información del PIAR
 */
function getPiarInfo($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM piar WHERE id_estudiante = '$studentId' ORDER BY fecha DESC LIMIT 1";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Obtener valoraciones pedagógicas
 */
function getPedagogicalEvaluations($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "
        SELECT 
            vp.*,
            a.nombre_asig
        FROM valoracion_pedagogica vp
        JOIN piar p ON vp.id_piar = p.id_piar
        JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
        WHERE p.id_estudiante = '$studentId'
        ORDER BY vp.anio DESC, vp.periodo DESC
    ";
    $result = mysqli_query($conexion, $sql);
    
    $evaluations = [];
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $evaluations[] = $row;
        }
    }
    
    return $evaluations;
}

/**
 * Obtener descripción general del estudiante
 */
function getGeneralDescription($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "
        SELECT 
            dg.*,
            c.descripcion as capacidad_desc,
            gi.descripcion as gusto_interes_desc,
            e.descripcion as expectativa_desc,
            ef.descripcion as expectativa_familia_desc,
            ra.descripcion as red_apoyo_desc,
            od.descripcion as otra_descripcion_desc
        FROM descripcion_general dg
        LEFT JOIN capacidad c ON dg.id_capacidad = c.id_capacidad
        LEFT JOIN gusto_interes gi ON dg.id_gusto_e_interes = gi.id_gusto_e_interes
        LEFT JOIN expectativa e ON dg.id_expectativa = e.id_expectativa
        LEFT JOIN expectativa_familia ef ON dg.id_expectativa_familia = ef.id_expectativa_familia
        LEFT JOIN red_apoyo ra ON dg.id_red_apoyo = ra.id_red_apoyo
        LEFT JOIN otra_descripcion od ON dg.id_otra_descripcion = od.id_otra_descripcion
        WHERE dg.id_estudiante = '$studentId'
    ";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Obtener grupo actual del estudiante
 */
function getCurrentGroup($conexion, $studentId) {
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "
        SELECT 
            g.grado,
            gr.grupo
        FROM grupo_estudiante ge
        JOIN grupo gr ON ge.id_grupo = gr.id_grupo
        JOIN grado g ON gr.id_grado = g.id_grado
        WHERE ge.id_estudiante = '$studentId' 
        AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
        ORDER BY ge.anio DESC
        LIMIT 1
    ";
    $result = mysqli_query($conexion, $sql);
    
    if (!$result) {
        return null;
    }
    
    return mysqli_fetch_assoc($result);
}

/**
 * Función de utilidad para escapar HTML
 */
function escapeHtml($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Función de utilidad para validar entrada
 */
function validateInput($input, $type = 'string') {
    global $conexion;
    
    switch ($type) {
        case 'int':
            return filter_var($input, FILTER_VALIDATE_INT);
        case 'email':
            return filter_var($input, FILTER_VALIDATE_EMAIL);
        case 'string':
        default:
            return mysqli_real_escape_string($conexion, trim(strip_tags($input)));
    }
}

/**
 * Manejo de errores de base de datos
 */
function handleDatabaseError($e) {
    error_log("Database error: " . $e->getMessage());
    return json_encode([
        'success' => false, 
        'error' => 'Error interno del servidor. Por favor, inténtelo de nuevo.'
    ]);
}

?>