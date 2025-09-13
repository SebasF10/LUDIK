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
// Configurar charset para evitar problemas con caracteres especiales
$conn->set_charset("utf8");

// Procesar el formulario
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    try {
        // Iniciar transacción para asegurar consistencia
        $conn->begin_transaction();
        
        // 1. Registrar Madre
        $madre_nombre = $_POST['madre_nombre'];
        $madre_nivel = $_POST['madre_nivel'];
        $madre_ocupacion = $_POST['madre_ocupacion'];
        $madre_email = $_POST['madre_email'];
        $madre_contrasena = $_POST['madre_contrasena'];
        $madre_telefono = $_POST['madre_telefono'];

        $stmt = $conn->prepare("INSERT INTO madre (nombre_completo, nivel_educativo, ocupacion, email, contrasena, telefono) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $madre_nombre, $madre_nivel, $madre_ocupacion, $madre_email, $madre_contrasena, $madre_telefono);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar madre: " . $stmt->error);
        }
        
        $id_madre = $stmt->insert_id;
        $stmt->close();

        // 2. Registrar Padre
        $padre_nombre = $_POST['padre_nombre'];
        $padre_nivel = $_POST['padre_nivel'];
        $padre_ocupacion = $_POST['padre_ocupacion'];
        $padre_email = $_POST['padre_email'];
        $padre_contrasena = $_POST['padre_contrasena'];
        $padre_telefono = $_POST['padre_telefono'];

        $stmt = $conn->prepare("INSERT INTO padre (nombre_completo, nivel_educativo, ocupacion, email, contrasena, telefono) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $padre_nombre, $padre_nivel, $padre_ocupacion, $padre_email, $padre_contrasena, $padre_telefono);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar padre: " . $stmt->error);
        }
        
        $id_padre = $stmt->insert_id;
        $stmt->close();

        // 3. Registrar Cuidador
        $cuidador_nombre = $_POST['cuidador_nombre'];
        $cuidador_parentesco = $_POST['cuidador_parentesco'];
        $cuidador_nivel = $_POST['cuidador_nivel'];
        $cuidador_ocupacion = $_POST['cuidador_ocupacion'];
        $cuidador_email = $_POST['cuidador_email'];
        $cuidador_contrasena = $_POST['cuidador_contrasena'];
        $cuidador_telefono = $_POST['cuidador_telefono'];

        $stmt = $conn->prepare("INSERT INTO acudiente (nombre_completo, nivel_educativo, parentesco, email, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $cuidador_nombre, $cuidador_nivel, $cuidador_parentesco, $cuidador_email, $cuidador_telefono, $cuidador_contrasena);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar cuidador: " . $stmt->error);
        }
        
        $id_cuidador = $stmt->insert_id;
        $stmt->close();

        // 4. Registrar Estudiante
        $estudiante_nombre = $_POST['estudiante_nombre'];
        $estudiante_apellidos = $_POST['estudiante_apellidos'];
        $tipo_documento = $_POST['tipo_documento'];
        $no_documento = $_POST['no_documento'];
        $lugar_nacimiento = $_POST['lugar_nacimiento'];
        $fecha_nacimiento = $_POST['fecha_nacimiento'];
        $sector = $_POST['sector'];
        $direccion = $_POST['direccion'];
        $telefono = $_POST['telefono'];
        $correo = $_POST['correo'];
        $contrasena = $_POST['contrasena'];
        $victima_conflicto = $_POST['victima_conflicto'];
        $victima_tipo = isset($_POST['victima_tipo']) && !empty($_POST['victima_tipo']) ? $_POST['victima_tipo'] : null;
        $registro_victima = $_POST['registro_victima'];
        $centro_proteccion = $_POST['centro_proteccion'];
        $grupo_etnico = $_POST['grupo_etnico'];
        $etnico_tipo = isset($_POST['etnico_tipo']) && !empty($_POST['etnico_tipo']) ? $_POST['etnico_tipo'] : null;
        $no_hermanos = intval($_POST['no_hermanos']);
        $lugar_que_ocupa = $_POST['lugar_que_ocupa'];
        $con_quien_vive = $_POST['con_quien_vive'];
        $quien_apoya_crianza = $_POST['quien_apoya_crianza'];
        $afiliacion_salud = $_POST['afiliacion_salud'];

        $stmt = $conn->prepare("INSERT INTO estudiante (
            nombre, apellidos, tipo_documento, no_documento, lugar_nacimiento, fecha_nacimiento, sector, direccion, telefono, correo, contrasena, victima_conflicto, registro_victima, centro_proteccion, grupo_etnico, no_hermanos, lugar_que_ocupa, con_quien_vive, quien_apoya_crianza, afiliacion_salud, id_madre, id_padre, id_cuidador
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param(
            "sssssssssssssssissssiii",
            $estudiante_nombre,
            $estudiante_apellidos,
            $tipo_documento,
            $no_documento,
            $lugar_nacimiento,
            $fecha_nacimiento,
            $sector,
            $direccion,
            $telefono,
            $correo,
            $contrasena,
            $victima_conflicto,
            $registro_victima,
            $centro_proteccion,
            $grupo_etnico,
            $no_hermanos,
            $lugar_que_ocupa,
            $con_quien_vive,
            $quien_apoya_crianza,
            $afiliacion_salud,
            $id_madre,
            $id_padre,
            $id_cuidador
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar estudiante: " . $stmt->error);
        }
        
        $id_estudiante = $stmt->insert_id;
        $stmt->close();

        // 5. Registrar Entorno Educativo
        $estado = $_POST['estado'];
        $ultimo_grado_cursado = $_POST['ultimo_grado_cursado'];
        
        // Procesar el campo vinculado_otra_inst
        $vinculado_otra_inst_value = $_POST['vinculado_otra_inst'];
        $vinculado_otra_inst = $vinculado_otra_inst_value;
        
        // Si está vinculado, agregar detalles
        if ($vinculado_otra_inst_value === 'Si' && isset($_POST['vinculado_detalles']) && !empty($_POST['vinculado_detalles'])) {
            $vinculado_otra_inst .= ' - Detalles: ' . $_POST['vinculado_detalles'];
        }
        // Si no está vinculado, agregar razón
        elseif ($vinculado_otra_inst_value === 'No' && isset($_POST['no_vinculado_razon']) && !empty($_POST['no_vinculado_razon'])) {
            $vinculado_otra_inst .= ' - Razón: ' . $_POST['no_vinculado_razon'];
        }
        
        // Convertir informe_pedagogico a booleano para la base de datos
        $informe_pedagogico = $_POST['informe_pedagogico'] === 'Si' ? 1 : 0;
        
        $modalidad_proveniente = null;
        if ($informe_pedagogico && isset($_POST['modalidad_proveniente']) && !empty($_POST['modalidad_proveniente'])) {
            $modalidad_proveniente = $_POST['modalidad_proveniente'];
        }
        
        $asiste_programas_complementarios = $_POST['asiste_programas_complementarios'];
        $observacion = isset($_POST['observacion']) && !empty($_POST['observacion']) ? $_POST['observacion'] : null;

        $stmt = $conn->prepare("INSERT INTO entorno_educativo (
            estado, ultimo_grado_cursado, vinculado_otra_inst, informe_pedagogico, modalidad_proveniente, asiste_programas_complementarios, observacion, id_estudiante
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        $stmt->bind_param(
            "sssisssi",
            $estado,
            $ultimo_grado_cursado,
            $vinculado_otra_inst,
            $informe_pedagogico,
            $modalidad_proveniente,
            $asiste_programas_complementarios,
            $observacion,
            $id_estudiante
        );
        
        if (!$stmt->execute()) {
            throw new Exception("Error al registrar entorno educativo: " . $stmt->error);
        }
        
        $stmt->close();

        // Confirmar transacción
        $conn->commit();
        
        // Respuesta de éxito
        echo "<script>
            alert('¡Registro exitoso!\\n\\nEl estudiante " . addslashes($estudiante_nombre . " " . $estudiante_apellidos) . " y su entorno educativo han sido registrados correctamente.');
            window.location='../Registrar_estudiante.html';
        </script>";
        
    } catch (Exception $e) {
        // En caso de error, revertir transacción
        $conn->rollback();
        
        // Log del error para debugging
        error_log("Error en registro de estudiante: " . $e->getMessage());
        
        // Mostrar error al usuario
        echo "<script>
            alert('Error al registrar:\\n" . addslashes($e->getMessage()) . "\\n\\nPor favor, intente nuevamente.');
            history.back();
        </script>";
    }
} else {
    // Si se accede al archivo sin POST, redirigir
    echo "<script>
        alert('Acceso no autorizado.');
        window.location='../Registrar_estudiante.html';
    </script>";
}

// Cerrar conexión
$conn->close();
?>
