<?php
// procesar_registro_completo.php
header('Content-Type: application/json; charset=utf-8');

// Configuración de la base de datos
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ludik";

try {
    // Verificar que se recibieron los datos POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Método no permitido');
    }
    
    // Crear conexión
    $conn = new mysqli($servername, $username, $password, $dbname);
    
    // Verificar conexión
    if ($conn->connect_error) {
        throw new Exception("Error de conexión: " . $conn->connect_error);
    }
    
    // Configurar charset
    $conn->set_charset("utf8");
    
    // Iniciar transacción
    $conn->autocommit(false);
    
    // Variables para los IDs generados
    $id_madre = null;
    $id_padre = null;
    $id_cuidador = null;
    $id_estudiante = null;
    $id_descripcion_general = null;
    
    // PASO 1: REGISTRAR MADRE
    $madre_nombre = trim($_POST['madre_nombre']);
    $madre_educacion = trim($_POST['madre_educacion']);
    $madre_ocupacion = trim($_POST['madre_ocupacion']);
    $madre_email = trim($_POST['madre_email']);
    $madre_telefono = trim($_POST['madre_telefono']);
    $madre_contrasena = trim($_POST['madre_contrasena']);
    
    $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta madre: " . $conn->error);
    }
    
    $stmt->bind_param("ssssss", $madre_nombre, $madre_educacion, $madre_ocupacion, $madre_email, $madre_telefono, $madre_contrasena);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando madre: " . $stmt->error);
    }
    $id_madre = $conn->insert_id;
    $stmt->close();
    
    // PASO 2: REGISTRAR PADRE
    $padre_nombre = trim($_POST['padre_nombre']);
    $padre_educacion = trim($_POST['padre_educacion']);
    $padre_ocupacion = trim($_POST['padre_ocupacion']);
    $padre_email = trim($_POST['padre_email']);
    $padre_telefono = trim($_POST['padre_telefono']);
    $padre_contrasena = trim($_POST['padre_contrasena']);
    
    $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta padre: " . $conn->error);
    }
    
    $stmt->bind_param("ssssss", $padre_nombre, $padre_educacion, $padre_ocupacion, $padre_email, $padre_telefono, $padre_contrasena);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando padre: " . $stmt->error);
    }
    $id_padre = $conn->insert_id;
    $stmt->close();
    
    // PASO 3: REGISTRAR CUIDADOR
    $cuidador_nombre = trim($_POST['cuidador_nombre']);
    $cuidador_educacion = trim($_POST['cuidador_educacion']);
    $cuidador_parentesco = trim($_POST['cuidador_parentesco']);
    $cuidador_email = trim($_POST['cuidador_email']);
    $cuidador_telefono = trim($_POST['cuidador_telefono']);
    $cuidador_contrasena = trim($_POST['cuidador_contrasena']);
    
    $stmt = $conn->prepare("INSERT INTO acudiente (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta cuidador: " . $conn->error);
    }
    
    $stmt->bind_param("ssssss", $cuidador_nombre, $cuidador_educacion, $cuidador_parentesco, $cuidador_email, $cuidador_telefono, $cuidador_contrasena);
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando cuidador: " . $stmt->error);
    }
    $id_cuidador = $conn->insert_id;
    $stmt->close();
    
    // PASO 4: REGISTRAR ESTUDIANTE
    $estudiante_nombre = trim($_POST['estudiante_nombre']);
    $estudiante_apellidos = trim($_POST['estudiante_apellidos']);
    $tipo_documento = trim($_POST['tipo_documento']);
    $no_documento = trim($_POST['no_documento']);
    $lugar_nacimiento = trim($_POST['lugar_nacimiento']);
    $fecha_nacimiento = $_POST['fecha_nacimiento'];
    $sector = trim($_POST['sector']);
    $direccion = trim($_POST['direccion']);
    $telefono = trim($_POST['telefono']);
    $correo = trim($_POST['correo']);
    $contrasena = trim($_POST['contrasena']);
    $victima_conflicto = trim($_POST['victima_conflicto']);
    
    // Manejar campos condicionales
    $victima_tipo = null;
    if ($victima_conflicto === 'Si' && isset($_POST['victima_tipo']) && !empty(trim($_POST['victima_tipo']))) {
        $victima_tipo = trim($_POST['victima_tipo']);
    }
    
    $registro_victima = isset($_POST['registro_victima']) ? trim($_POST['registro_victima']) : 'No';
    $centro_proteccion = isset($_POST['centro_proteccion']) ? trim($_POST['centro_proteccion']) : 'No';
    $grupo_etnico = trim($_POST['grupo_etnico']);
    
    $etnico_tipo = null;
    if ($grupo_etnico === 'Si' && isset($_POST['etnico_tipo']) && !empty(trim($_POST['etnico_tipo']))) {
        $etnico_tipo = trim($_POST['etnico_tipo']);
    }
    
    $no_hermanos = isset($_POST['no_hermanos']) && !empty($_POST['no_hermanos']) ? intval($_POST['no_hermanos']) : 0;
    $lugar_que_ocupa = trim($_POST['lugar_que_ocupa']);
    $con_quien_vive = trim($_POST['con_quien_vive']);
    $quien_apoya_crianza = trim($_POST['quien_apoya_crianza']);
    $afiliacion_salud = trim($_POST['afiliacion_salud']);
    
    // Insertar estudiante
    $stmt = $conn->prepare("INSERT INTO estudiante (
        nombre, apellidos, tipo_documento, no_documento, lugar_nacimiento, fecha_nacimiento, 
        sector, direccion, telefono, correo, contrasena, victima_conflicto, registro_victima, 
        centro_proteccion, grupo_etnico, no_hermanos, lugar_que_ocupa, con_quien_vive, 
        quien_apoya_crianza, afiliacion_salud, id_madre, id_padre, id_cuidador
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta estudiante: " . $conn->error);
    }
    
    $stmt->bind_param(
        "sssssssssssssssissssiii",
        $estudiante_nombre, $estudiante_apellidos, $tipo_documento, $no_documento, 
        $lugar_nacimiento, $fecha_nacimiento, $sector, $direccion, $telefono, 
        $correo, $contrasena, $victima_conflicto, $registro_victima, $centro_proteccion, 
        $grupo_etnico, $no_hermanos, $lugar_que_ocupa, $con_quien_vive, 
        $quien_apoya_crianza, $afiliacion_salud, $id_madre, $id_padre, $id_cuidador
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando estudiante: " . $stmt->error);
    }
    $id_estudiante = $conn->insert_id;
    $stmt->close();
    
    // PASO 4B: REGISTRAR ENTORNO EDUCATIVO
    $estado = isset($_POST['estado']) ? intval($_POST['estado']) : null;
    $ultimo_grado_cursado = isset($_POST['ultimo_grado_cursado']) ? trim($_POST['ultimo_grado_cursado']) : null;
    $vinculado_otra_inst = isset($_POST['vinculado_otra_inst']) ? trim($_POST['vinculado_otra_inst']) : null;
    
    // Procesar detalles de vinculación
    if ($vinculado_otra_inst === 'Si' && isset($_POST['vinculado_detalles']) && !empty(trim($_POST['vinculado_detalles']))) {
        $vinculado_otra_inst .= ' - Detalles: ' . trim($_POST['vinculado_detalles']);
    } elseif ($vinculado_otra_inst === 'No' && isset($_POST['no_vinculado_razon']) && !empty(trim($_POST['no_vinculado_razon']))) {
        $vinculado_otra_inst .= ' - Razón: ' . trim($_POST['no_vinculado_razon']);
    }
    
    $informe_pedagogico = isset($_POST['informe_pedagogico']) && $_POST['informe_pedagogico'] === 'Si' ? 1 : 0;
    
    $modalidad_proveniente = null;
    if ($informe_pedagogico && isset($_POST['modalidad_proveniente']) && !empty(trim($_POST['modalidad_proveniente']))) {
        $modalidad_proveniente = trim($_POST['modalidad_proveniente']);
    }
    
    $asiste_programas_complementarios = isset($_POST['asiste_programas_complementarios']) ? trim($_POST['asiste_programas_complementarios']) : null;
    $observacion = isset($_POST['observacion']) && !empty(trim($_POST['observacion'])) ? trim($_POST['observacion']) : null;
    
    // Insertar entorno educativo
    $stmt = $conn->prepare("INSERT INTO entorno_educativo (
        estado, ultimo_grado_cursado, vinculado_otra_inst, informe_pedagogico, 
        modalidad_proveniente, asiste_programas_complementarios, observacion, id_estudiante
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    
    if (!$stmt) {
        throw new Exception("Error preparando consulta entorno_educativo: " . $conn->error);
    }
    
    $stmt->bind_param(
        "ississsi",
        $estado, $ultimo_grado_cursado, $vinculado_otra_inst, $informe_pedagogico,
        $modalidad_proveniente, $asiste_programas_complementarios, $observacion, $id_estudiante
    );
    
    if (!$stmt->execute()) {
        throw new Exception("Error insertando entorno educativo: " . $stmt->error);
    }
    $stmt->close();
    
    // PASO 5: ASIGNAR GRUPO AL ESTUDIANTE
    if (isset($_POST['id_grupo']) && !empty($_POST['id_grupo'])) {
        $id_grupo = intval($_POST['id_grupo']);
        $anio_actual = date('Y');
        
        $stmt = $conn->prepare("INSERT INTO grupo_estudiante (id_grupo, id_estudiante, anio) VALUES (?, ?, ?)");
        if (!$stmt) {
            throw new Exception("Error preparando consulta grupo_estudiante: " . $conn->error);
        }
        
        $stmt->bind_param("iii", $id_grupo, $id_estudiante, $anio_actual);
        
        if (!$stmt->execute()) {
            throw new Exception("Error asignando grupo al estudiante: " . $stmt->error);
        }
        $stmt->close();
    }
    
    // PASOS 6-11: REGISTRAR DESCRIPCIÓN GENERAL
    
    // Variables para descripción
    $id_capacidad = null;
    $id_gusto_interes = null;
    $id_expectativa = null;
    $id_expectativa_familia = null;
    $id_red_apoyo = null;
    $id_otra_descripcion = null;
    
    // Insertar en tabla capacidad
    $capacidad_desc = trim($_POST['capacidades']);
    $stmt = $conn->prepare("INSERT INTO capacidad (descripcion) VALUES (?)");
    if (!$stmt) {
        throw new Exception("Error preparando consulta capacidad: " . $conn->error);
    }
    
    $stmt->bind_param("s", $capacidad_desc);
    if (!$stmt->execute()) {
        throw new Exception("Error insertando capacidad: " . $stmt->error);
    }
    $id_capacidad = $conn->insert_id;
    $stmt->close();

    // Aquí deberías continuar con las demás inserciones (gusto_interes, expectativa, etc.)
    // y finalmente insertar en descripcion_general y asociar con el estudiante.

    // Si todo fue bien, confirmar la transacción
    $conn->commit();

    echo json_encode([
        'success' => true,
        'id_estudiante' => $id_estudiante,
        'id_descripcion_general' => $id_descripcion_general ?? null,
        'message' => 'Registro completado exitosamente'
    ]);
    exit;

} catch (Exception $e) {
    if (isset($conn) && $conn->connect_errno === 0) {
        $conn->rollback();
        $conn->close();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    exit;
}