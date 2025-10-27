<?php
// Estudiantes_con_roles.php - API con control de acceso por roles
session_start();
require_once 'conexion.php';

// Configuración de respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Verificar que el usuario esté logueado
if (!isset($_SESSION['usuario']) || !isset($_SESSION['rol'])) {
    echo json_encode(['success' => false, 'error' => 'No autorizado - Inicie sesión']);
    exit;
}

$rol = $_SESSION['rol'];
$usuario = $_SESSION['usuario'];

// Manejo de preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Obtener la acción solicitada
$action = $_GET['action'] ?? '';

try {
    switch ($action) {
        case 'getAllStudents':
            getAllStudents($conexion, $rol, $usuario);
            break;
        case 'searchStudents':
            searchStudents($conexion, $rol, $usuario);
            break;
        case 'getStudentDetails':
            getStudentDetails($conexion, $rol, $usuario);
            break;
        case 'getFilters':
            getFilters($conexion, $rol, $usuario);
            break;
        case 'getStudentsForPDF':
            getStudentsForPDF($conexion, $rol, $usuario);
            break;
        case 'getStudentFullDetails':
            getStudentFullDetails($conexion, $rol, $usuario);
            break;
        case 'exportStudentsCSV':
            exportStudentsCSV($conexion, $rol, $usuario);
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Acción no válida']);
            break;
    }
} catch (Exception $e) {
    error_log("Error en Estudiantes_con_roles.php: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Error interno del servidor']);
}

mysqli_close($conexion);

/**
 * Obtener todos los estudiantes según el rol
 */
function getAllStudents($conexion, $rol, $usuario)
{
    try {
        $whereClause = getAccessControlClause($conexion, $rol, $usuario);

        $sql = "
            SELECT DISTINCT
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.telefono,
                e.correo,
                e.url_foto,
                g.grado,
                gr.grupo,
                gr.id_grupo,
                g.id_grado
            FROM estudiante e
            LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
            LEFT JOIN grado g ON gr.id_grado = g.id_grado
            $whereClause
            ORDER BY e.apellidos, e.nombre
        ";

        $result = mysqli_query($conexion, $sql);

        if (!$result) {
            throw new Exception("Error en la consulta: " . mysqli_error($conexion));
        }

        $students = [];
        while ($row = mysqli_fetch_assoc($result)) {
            // Procesar la URL de la foto
            $row['foto_url'] = getPhotoUrl($row['url_foto'], $row['id_estudiante']);
            $students[] = $row;
        }

        echo json_encode([
            'success' => true,
            'students' => $students,
            'total' => count($students),
            'rol' => $rol
        ]);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

/**
 * Buscar estudiantes por término según el rol
 */
function searchStudents($conexion, $rol, $usuario)
{
    $term = $_GET['term'] ?? '';
    $gradoFilter = $_GET['grado'] ?? '';
    $grupoFilter = $_GET['grupo'] ?? '';

    if (empty($term)) {
        echo json_encode(['success' => false, 'error' => 'Término de búsqueda requerido']);
        return;
    }

    try {
        $searchTerm = '%' . mysqli_real_escape_string($conexion, $term) . '%';
        $whereClause = getAccessControlClause($conexion, $rol, $usuario);

        $sql = "
            SELECT DISTINCT
                e.id_estudiante,
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.telefono,
                e.correo,
                e.url_foto,
                g.grado,
                gr.grupo,
                gr.id_grupo,
                g.id_grado
            FROM estudiante e
            LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
            LEFT JOIN grado g ON gr.id_grado = g.id_grado
            $whereClause
            AND (e.nombre LIKE '$searchTerm' OR 
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
            $row['foto_url'] = getPhotoUrl($row['url_foto'], $row['id_estudiante']);
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
 * Obtener detalles completos de un estudiante según el rol
 */
function getStudentDetails($conexion, $rol, $usuario)
{
    $studentId = $_GET['id'] ?? '';

    if (empty($studentId)) {
        echo json_encode(['success' => false, 'error' => 'ID de estudiante requerido']);
        return;
    }

    try {
        // Verificar acceso al estudiante
        if (!hasAccessToStudent($conexion, $rol, $usuario, $studentId)) {
            echo json_encode(['success' => false, 'error' => 'No tiene acceso a este estudiante']);
            return;
        }

        // Información básica del estudiante
        $studentData = getBasicStudentInfo($conexion, $studentId);

        if (!$studentData) {
            echo json_encode(['success' => false, 'error' => 'Estudiante no encontrado']);
            return;
        }

        // Procesar URL de foto
        $studentData['foto_url'] = getPhotoUrl($studentData['url_foto'], $studentData['id_estudiante']);

        // Información adicional según el rol
        $studentData['madre'] = getParentInfo($conexion, $studentData['id_madre'], 'madre');
        $studentData['padre'] = getParentInfo($conexion, $studentData['id_padre'], 'padre');
        $studentData['acudiente'] = getParentInfo($conexion, $studentData['id_acudiente'], 'acudiente');

        // Solo roles educativos pueden ver información médica y académica completa
        if (in_array($rol, ['admin', 'directivo', 'docente_apoyo', 'docente'])) {
            $studentData['entorno_educativo'] = getEducationalEnvironment($conexion, $studentId);
            $studentData['info_medica'] = getMedicalInfo($conexion, $studentId);
            $studentData['piar'] = getPiarInfo($conexion, $studentId);
            $studentData['valoraciones'] = getPedagogicalEvaluations($conexion, $studentId);
            $studentData['descripcion_general'] = getGeneralDescription($conexion, $studentId);
        } else {
            // Padres solo ven información básica médica
            $studentData['info_medica'] = getMedicalInfoBasic($conexion, $studentId);
        }

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
 * Obtener filtros según el rol
 */
function getFilters($conexion, $rol, $usuario)
{
    try {
        $whereClause = getAccessControlClause($conexion, $rol, $usuario, 'filter');

        // Obtener grados
        $gradosSQL = "
            SELECT DISTINCT g.id_grado, g.grado 
            FROM grado g
            JOIN grupo gr ON g.id_grado = gr.id_grado
            JOIN grupo_estudiante ge ON gr.id_grupo = ge.id_grupo
            JOIN estudiante e ON ge.id_estudiante = e.id_estudiante
            $whereClause
            ORDER BY g.grado
        ";

        $gradosResult = mysqli_query($conexion, $gradosSQL);
        if (!$gradosResult) {
            throw new Exception("Error obteniendo grados: " . mysqli_error($conexion));
        }

        $grados = [];
        while ($row = mysqli_fetch_assoc($gradosResult)) {
            $grados[] = $row;
        }

        // Obtener grupos
        $gruposSQL = "
            SELECT DISTINCT gr.id_grupo, gr.grupo, g.grado 
            FROM grupo gr 
            JOIN grado g ON gr.id_grado = g.id_grado
            JOIN grupo_estudiante ge ON gr.id_grupo = ge.id_grupo
            JOIN estudiante e ON ge.id_estudiante = e.id_estudiante
            $whereClause
            ORDER BY g.grado, gr.grupo
        ";

        $gruposResult = mysqli_query($conexion, $gruposSQL);
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
 * Generar cláusula WHERE según el rol y usuario
 */
function getAccessControlClause($conexion, $rol, $usuario, $context = 'main')
{
    switch ($rol) {
        case 'admin':
        case 'directivo':
        case 'docente_apoyo':
            // Acceso completo a todos los estudiantes
            return "WHERE 1=1";

        case 'docente':
            // Solo estudiantes de los grupos que enseña
            $id_docente = mysqli_real_escape_string($conexion, $usuario['id_docente']);
            return "
                INNER JOIN asignatura_docente_grupo adg ON gr.id_grupo = adg.id_grupo
                WHERE adg.id_docente = '$id_docente'
            ";

        case 'madre':
            // Solo sus hijos
            $id_madre = mysqli_real_escape_string($conexion, $usuario['id_madre']);
            return "WHERE e.id_madre = '$id_madre'";

        case 'padre':
            // Solo sus hijos
            $id_padre = mysqli_real_escape_string($conexion, $usuario['id_padre']);
            return "WHERE e.id_padre = '$id_padre'";

        case 'acudiente':
            // Solo estudiantes bajo su cuidado
            $id_acudiente = mysqli_real_escape_string($conexion, $usuario['id_acudiente']);
            return "WHERE e.id_acudiente = '$id_acudiente'";

        default:
            // Sin acceso por defecto
            return "WHERE 1=0";
    }
}

/**
 * Verificar si el usuario tiene acceso a un estudiante específico
 */
function hasAccessToStudent($conexion, $rol, $usuario, $studentId)
{
    $studentId = mysqli_real_escape_string($conexion, $studentId);

    switch ($rol) {
        case 'admin':
        case 'directivo':
        case 'docente_apoyo':
            return true; // Acceso completo

        case 'docente':
            $id_docente = mysqli_real_escape_string($conexion, $usuario['id_docente']);
            $sql = "
                SELECT COUNT(*) as count
                FROM estudiante e
                JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante
                JOIN asignatura_docente_grupo adg ON ge.id_grupo = adg.id_grupo
                WHERE e.id_estudiante = '$studentId' AND adg.id_docente = '$id_docente'
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            ";
            break;

        case 'madre':
            $id_madre = mysqli_real_escape_string($conexion, $usuario['id_madre']);
            $sql = "SELECT COUNT(*) as count FROM estudiante WHERE id_estudiante = '$studentId' AND id_madre = '$id_madre'";
            break;

        case 'padre':
            $id_padre = mysqli_real_escape_string($conexion, $usuario['id_padre']);
            $sql = "SELECT COUNT(*) as count FROM estudiante WHERE id_estudiante = '$studentId' AND id_padre = '$id_padre'";
            break;

        case 'acudiente':
            $id_acudiente = mysqli_real_escape_string($conexion, $usuario['id_acudiente']);
            $sql = "SELECT COUNT(*) as count FROM estudiante WHERE id_estudiante = '$studentId' AND id_acudiente = '$id_acudiente'";
            break;

        default:
            return false;
    }

    $result = mysqli_query($conexion, $sql);
    if ($result) {
        $row = mysqli_fetch_assoc($result);
        return $row['count'] > 0;
    }

    return false;
}

/**
 * Generar URL de foto del estudiante
 */
function getPhotoUrl($urlFoto, $idEstudiante)
{
    // Si hay URL en la base de datos
    if (!empty($urlFoto)) {
        // Verificar si el archivo existe en la carpeta correcta
        if (file_exists(__DIR__ . '/../photos/' . basename($urlFoto))) {
            return '../photos/' . basename($urlFoto);
        }
    }
    // Si no hay URL o el archivo no existe, usar foto por defecto
    //return '../photos/default.png';
}

/**
 * Obtener información médica básica (para padres)
 */
function getMedicalInfoBasic($conexion, $studentId)
{
    $medicalInfo = getMedicalInfo($conexion, $studentId);

    if (!$medicalInfo) {
        return null;
    }

    // Filtrar información sensible para padres
    return [
        'tiene_diagnosticos' => !empty($medicalInfo['diagnosticos']),
        'total_diagnosticos' => count($medicalInfo['diagnosticos'] ?? []),
        'tiene_medicamentos' => !empty($medicalInfo['medicamentos']),
        'total_medicamentos' => count($medicalInfo['medicamentos'] ?? []),
        'tiene_tratamientos' => !empty($medicalInfo['tratamientos']),
        'total_tratamientos' => count($medicalInfo['tratamientos'] ?? []),
        'dx_general' => $medicalInfo['dx_general'] ?? null
    ];
}

// Reutilizar las demás funciones del archivo original
function getStudentsForPDF($conexion, $rol, $usuario)
{
    // Similar a getAllStudents pero optimizado para PDF
    getAllStudents($conexion, $rol, $usuario);
}

function getStudentFullDetails($conexion, $rol, $usuario)
{
    // Similar a getStudentDetails
    getStudentDetails($conexion, $rol, $usuario);
}

function exportStudentsCSV($conexion, $rol, $usuario)
{
    $type = $_GET['type'] ?? 'all';
    $searchTerm = $_GET['term'] ?? '';

    try {
        $whereClause = getAccessControlClause($conexion, $rol, $usuario);

        $sql = "
            SELECT DISTINCT
                e.nombre,
                e.apellidos,
                e.tipo_documento,
                e.no_documento,
                e.fecha_nacimiento,
                e.telefono,
                e.correo,
                g.grado,
                gr.grupo,
                e.sector,
                e.direccion,
                e.victima_conflicto,
                e.grupo_etnico,
                e.afiliacion_salud
            FROM estudiante e
            LEFT JOIN grupo_estudiante ge ON e.id_estudiante = ge.id_estudiante 
                AND (ge.anio = YEAR(CURDATE()) OR ge.anio IS NULL)
            LEFT JOIN grupo gr ON ge.id_grupo = gr.id_grupo
            LEFT JOIN grado g ON gr.id_grado = g.id_grado
            $whereClause
        ";

        if ($type === 'search' && !empty($searchTerm)) {
            $searchTerm = '%' . mysqli_real_escape_string($conexion, $searchTerm) . '%';
            $sql .= " AND (e.nombre LIKE '$searchTerm' OR 
                    e.apellidos LIKE '$searchTerm' OR 
                    e.no_documento LIKE '$searchTerm' OR
                    CONCAT(e.nombre, ' ', e.apellidos) LIKE '$searchTerm')";
        }

        $sql .= " ORDER BY e.apellidos, e.nombre";

        $result = mysqli_query($conexion, $sql);

        if (!$result) {
            throw new Exception("Error en la consulta: " . mysqli_error($conexion));
        }

        // Configurar headers para descarga de archivo
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="estudiantes_' . date('Y-m-d') . '.csv"');
        header('Access-Control-Allow-Origin: *');

        // Crear output
        $output = fopen('php://output', 'w');

        // Headers del CSV
        fputcsv($output, [
            'Nombre',
            'Apellidos',
            'Tipo Documento',
            'No. Documento',
            'Fecha Nacimiento',
            'Teléfono',
            'Correo',
            'Grado',
            'Grupo',
            'Sector',
            'Dirección',
            'Víctima Conflicto',
            'Grupo Étnico',
            'Afiliación Salud'
        ]);

        // Datos
        while ($row = mysqli_fetch_assoc($result)) {
            fputcsv($output, [
                $row['nombre'] ?? '',
                $row['apellidos'] ?? '',
                $row['tipo_documento'] ?? '',
                $row['no_documento'] ?? '',
                $row['fecha_nacimiento'] ?? '',
                $row['telefono'] ?? '',
                $row['correo'] ?? '',
                $row['grado'] ?? '',
                $row['grupo'] ?? '',
                $row['sector'] ?? '',
                $row['direccion'] ?? '',
                $row['victima_conflicto'] ?? '',
                $row['grupo_etnico'] ?? '',
                $row['afiliacion_salud'] ?? ''
            ]);
        }

        fclose($output);
        exit;
    } catch (Exception $e) {
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}

// Incluir las funciones auxiliares del archivo original
function getBasicStudentInfo($conexion, $studentId)
{
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM estudiante WHERE id_estudiante = '$studentId'";
    $result = mysqli_query($conexion, $sql);

    if (!$result) {
        return null;
    }

    return mysqli_fetch_assoc($result);
}

function getParentInfo($conexion, $parentId, $type)
{
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

function getEducationalEnvironment($conexion, $studentId)
{
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM entorno_educativo WHERE id_estudiante = '$studentId'";
    $result = mysqli_query($conexion, $sql);

    if (!$result) {
        return null;
    }

    return mysqli_fetch_assoc($result);
}

function getMedicalInfo($conexion, $studentId)
{
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

        return $medicalInfo;
    } catch (Exception $e) {
        error_log("Error obteniendo información médica: " . $e->getMessage());
        return null;
    }
}

function getPiarInfo($conexion, $studentId)
{
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "SELECT * FROM piar WHERE id_estudiante = '$studentId' ORDER BY fecha DESC LIMIT 1";
    $result = mysqli_query($conexion, $sql);

    if (!$result) {
        return null;
    }

    return mysqli_fetch_assoc($result);
}

function getPedagogicalEvaluations($conexion, $studentId)
{
    $studentId = mysqli_real_escape_string($conexion, $studentId);
    $sql = "
        SELECT 
            vp.*,
            a.nombre_asig,
            d.nombre_completo as docente_nombre,
            d.email as docente_email
        FROM valoracion_pedagogica vp
        JOIN piar p ON vp.id_piar = p.id_piar
        JOIN asignatura a ON vp.id_asignatura = a.id_asignatura
        LEFT JOIN asignatura_docente_grupo adg ON (
            adg.id_asignatura = vp.id_asignatura 
            AND adg.id_grupo = (
                SELECT ge.id_grupo 
                FROM grupo_estudiante ge 
                WHERE ge.id_estudiante = p.id_estudiante 
                AND ge.anio = vp.anio
                LIMIT 1
            )
        )
        LEFT JOIN docente d ON adg.id_docente = d.id_docente
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

function getGeneralDescription($conexion, $studentId)
{
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

function getCurrentGroup($conexion, $studentId)
{
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
 * Obtener compromisos del estudiante desde el PIAR más reciente
 */
function getStudentCommitments($conexion, $studentId)
{
    try {
        $studentId = mysqli_real_escape_string($conexion, $studentId);
        
        // Obtener el PIAR más reciente del estudiante
        $sql = "
            SELECT 
                p.compromiso,
            FROM piar p
            WHERE p.id_estudiante = '$studentId'
            ORDER BY p.fecha DESC, p.anio DESC
            LIMIT 1
        ";
        
        $result = mysqli_query($conexion, $sql);
        
        if (!$result) {
            error_log("Error obteniendo compromisos: " . mysqli_error($conexion));
            return null;
        }
        
        if (mysqli_num_rows($result) == 0) {
            return null;
        }
        
        $data = mysqli_fetch_assoc($result);
        
        return [
            'compromiso' => $data['compromiso'] ?? '',
        ];
        
    } catch (Exception $e) {
        error_log("Error en getStudentCommitments: " . $e->getMessage());
        return null;
    }
}

/**
 * Obtener información completa para el Acta de Acuerdo
 */
function getActaAcuerdoInfo($conexion, $studentId, $rol, $usuario)
{
    try {
        // Verificar acceso al estudiante
        if (!hasAccessToStudent($conexion, $rol, $usuario, $studentId)) {
            return [
                'success' => false, 
                'error' => 'No tiene acceso a este estudiante'
            ];
        }
        
        $studentId = mysqli_real_escape_string($conexion, $studentId);
        
        // Información básica del estudiante
        $studentData = getBasicStudentInfo($conexion, $studentId);
        
        if (!$studentData) {
            return [
                'success' => false, 
                'error' => 'Estudiante no encontrado'
            ];
        }
        
        // Procesar URL de foto
        $studentData['foto_url'] = getPhotoUrl(
            $studentData['url_foto'], 
            $studentData['id_estudiante']
        );
        
        // Obtener grupo actual
        $groupInfo = getCurrentGroup($conexion, $studentId);
        if ($groupInfo) {
            $studentData['grado'] = $groupInfo['grado'];
            $studentData['grupo'] = $groupInfo['grupo'];
        }
        
        // Obtener compromisos del PIAR
        $studentData['compromisos'] = getStudentCommitments($conexion, $studentId);
        
        // Obtener información de padres/acudientes
        $studentData['madre'] = getParentInfo(
            $conexion, 
            $studentData['id_madre'], 
            'madre'
        );
        $studentData['padre'] = getParentInfo(
            $conexion, 
            $studentData['id_padre'], 
            'padre'
        );
        $studentData['acudiente'] = getParentInfo(
            $conexion, 
            $studentData['id_acudiente'], 
            'acudiente'
        );
        
        return [
            'success' => true,
            'student' => $studentData
        ];
        
    } catch (Exception $e) {
        error_log("Error en getActaAcuerdoInfo: " . $e->getMessage());
        return [
            'success' => false, 
            'error' => 'Error obteniendo información del acta de acuerdo'
        ];
    }
}
