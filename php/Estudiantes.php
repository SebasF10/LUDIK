<?php
$host = '127.0.0.1';
$dbname = 'ludik';
$username = 'root'; // Cambia por tu usuario de BD
$password = '';     // Cambia por tu contraseña de BD

// Configuración de respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejo de preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

try {
    // Conexión a la base de datos
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Error de conexión: ' . $e->getMessage()]));
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
    global $pdo;
    
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
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
        $students = $stmt->fetchAll();
        
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
    global $pdo;
    
    $term = $_GET['term'] ?? '';
    $gradoFilter = $_GET['grado'] ?? '';
    $grupoFilter = $_GET['grupo'] ?? '';
    
    if (empty($term)) {
        echo json_encode(['success' => false, 'error' => 'Término de búsqueda requerido']);
        return;
    }
    
    try {
        $searchTerm = '%' . $term . '%';
        
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
                (e.nombre LIKE ? OR 
                e.apellidos LIKE ? OR 
                e.no_documento LIKE ? OR
                CONCAT(e.nombre, ' ', e.apellidos) LIKE ?)
        ";
        
        $params = [$searchTerm, $searchTerm, $searchTerm, $searchTerm];
        
        // Añadir filtros opcionales
        if (!empty($gradoFilter)) {
            $sql .= " AND g.id_grado = ?";
            $params[] = $gradoFilter;
        }
        
        if (!empty($grupoFilter)) {
            $sql .= " AND gr.id_grupo = ?";
            $params[] = $grupoFilter;
        }
        
        $sql .= " ORDER BY e.apellidos, e.nombre";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $students = $stmt->fetchAll();
        
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
    global $pdo;
    
    $studentId = $_GET['id'] ?? '';
    
    if (empty($studentId)) {
        echo json_encode(['success' => false, 'error' => 'ID de estudiante requerido']);
        return;
    }
    
    try {
        // Información básica del estudiante
        $studentData = getBasicStudentInfo($pdo, $studentId);
        
        if (!$studentData) {
            echo json_encode(['success' => false, 'error' => 'Estudiante no encontrado']);
            return;
        }
        
        // Información adicional
        $studentData['madre'] = getParentInfo($pdo, $studentData['id_madre'], 'madre');
        $studentData['padre'] = getParentInfo($pdo, $studentData['id_padre'], 'padre');
        $studentData['acudiente'] = getParentInfo($pdo, $studentData['id_cuidador'], 'acudiente');
        $studentData['entorno_educativo'] = getEducationalEnvironment($pdo, $studentId);
        $studentData['info_medica'] = getMedicalInfo($pdo, $studentId);
        $studentData['piar'] = getPiarInfo($pdo, $studentId);
        $studentData['valoraciones'] = getPedagogicalEvaluations($pdo, $studentId);
        $studentData['descripcion_general'] = getGeneralDescription($pdo, $studentId);
        
        // Información del grupo actual
        $groupInfo = getCurrentGroup($pdo, $studentId);
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
    global $pdo;
    
    try {
        // Obtener grados
        $gradosStmt = $pdo->query("SELECT id_grado, grado FROM grado ORDER BY grado");
        $grados = $gradosStmt->fetchAll();
        
        // Obtener grupos
        $gruposStmt = $pdo->query("
            SELECT gr.id_grupo, gr.grupo, g.grado 
            FROM grupo gr 
            JOIN grado g ON gr.id_grado = g.id_grado 
            ORDER BY g.grado, gr.grupo
        ");
        $grupos = $gruposStmt->fetchAll();
        
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
function getBasicStudentInfo($pdo, $studentId) {
    $sql = "SELECT * FROM estudiante WHERE id_estudiante = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetch();
}

/**
 * Obtener información de padre, madre o acudiente
 */
function getParentInfo($pdo, $parentId, $type) {
    if (!$parentId) return null;
    
    $table = $type;
    $idColumn = 'id_' . $type;
    
    $sql = "SELECT * FROM $table WHERE $idColumn = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$parentId]);
    return $stmt->fetch();
}

/**
 * Obtener información del entorno educativo
 */
function getEducationalEnvironment($pdo, $studentId) {
    $sql = "SELECT * FROM entorno_educativo WHERE id_estudiante = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetch();
}

/**
 * Obtener información médica completa
 */
function getMedicalInfo($pdo, $studentId) {
    $medicalInfo = [];
    
    try {
        // Obtener PIAR del estudiante
        $piarSql = "SELECT id_piar FROM piar WHERE id_estudiante = ? ORDER BY fecha DESC LIMIT 1";
        $piarStmt = $pdo->prepare($piarSql);
        $piarStmt->execute([$studentId]);
        $piar = $piarStmt->fetch();
        
        if (!$piar) {
            return null;
        }
        
        $piarId = $piar['id_piar'];
        
        // Obtener diagnósticos médicos con códigos CIE-10
        $diagnosticosSql = "
            SELECT dm.*, ddx.id_cie10, dx.descripcion as dx_descripcion, ddx.anio
            FROM diagnostico_medico dm
            LEFT JOIN diagnostico_dx_cie10 ddx ON dm.id_diag_med = ddx.id_diag_med
            LEFT JOIN dx_cie10 dx ON ddx.id_cie10 = dx.id_cie10
            WHERE dm.id_piar = ?
        ";
        $diagStmt = $pdo->prepare($diagnosticosSql);
        $diagStmt->execute([$piarId]);
        $diagnosticos = $diagStmt->fetchAll();
        
        // Organizar diagnósticos
        $medicalInfo['diagnosticos'] = [];
        $medicalInfo['dx_general'] = null;
        $medicalInfo['apoyos_tecnicos'] = null;
        $medicalInfo['soporte_dx'] = null;
        
        foreach ($diagnosticos as $diag) {
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
        
        // Obtener medicamentos (a través del entorno de salud)
        $medicamentosSql = "
            SELECT DISTINCT m.*
            FROM medicamento m
            JOIN entorno_salud es ON m.id_medicamento = es.id_medicamento
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = ?
        ";
        $medStmt = $pdo->prepare($medicamentosSql);
        $medStmt->execute([$piarId]);
        $medicalInfo['medicamentos'] = $medStmt->fetchAll();
        
        // Obtener tratamientos
        $tratamientosSql = "
            SELECT DISTINCT t.*
            FROM tratamiento t
            JOIN entorno_salud es ON t.id_tratamiento = es.id_tratamiento
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = ?
        ";
        $tratStmt = $pdo->prepare($tratamientosSql);
        $tratStmt->execute([$piarId]);
        $medicalInfo['tratamientos'] = $tratStmt->fetchAll();
        
        // Obtener atención médica
        $atencionSql = "
            SELECT DISTINCT a.*
            FROM atencion_medica a
            JOIN entorno_salud es ON a.id_atencion = es.id_atencion
            JOIN diagnostico_medico dm ON es.id_entorno_salud = dm.id_entorno_salud
            WHERE dm.id_piar = ?
        ";
        $atenStmt = $pdo->prepare($atencionSql);
        $atenStmt->execute([$piarId]);
        $medicalInfo['atencion_medica'] = $atenStmt->fetchAll();
        
        return $medicalInfo;
        
    } catch (Exception $e) {
        error_log("Error obteniendo información médica: " . $e->getMessage());
        return null;
    }
}

/**
 * Obtener información del PIAR
 */
function getPiarInfo($pdo, $studentId) {
    $sql = "SELECT * FROM piar WHERE id_estudiante = ? ORDER BY fecha DESC LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetch();
}

/**
 * Obtener valoraciones pedagógicas
 */
function getPedagogicalEvaluations($pdo, $studentId) {
    $sql = "
        SELECT 
            vp.*,
            a.nombre_asig
        FROM valoracion_pedagogica vp
        JOIN piar p ON vp.id_piar = p.id_piar
        JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
        WHERE p.id_estudiante = ?
        ORDER BY vp.anio DESC, vp.periodo DESC
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetchAll();
}

/**
 * Obtener descripción general del estudiante
 */
function getGeneralDescription($pdo, $studentId) {
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
        WHERE dg.id_estudiante = ?
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetch();
}

/**
 * Obtener grupo actual del estudiante
 */
function getCurrentGroup($pdo, $studentId) {
    $sql = "
        SELECT 
            g.grado,
            gr.grupo
        FROM grupo_estudiante ge
        JOIN grupo gr ON ge.id_grupo = gr.id_grupo
        JOIN grado g ON gr.id_grado = g.id_grado
        WHERE ge.id_estudiante = ? 
        AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
        ORDER BY ge.anio DESC
        LIMIT 1
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$studentId]);
    return $stmt->fetch();
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
    switch ($type) {
        case 'int':
            return filter_var($input, FILTER_VALIDATE_INT);
        case 'email':
            return filter_var($input, FILTER_VALIDATE_EMAIL);
        case 'string':
        default:
            return trim(strip_tags($input));
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