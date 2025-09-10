<?php
// filepath: c:\xampp\htdocs\LUDIK\php\registrar_estudiante.php

// Iniciar sesión
session_start();

// Conectar a la base de datos
$servername = "localhost";
$username = "root"; // Cambiar según la configuración de tu base de datos
$password = ""; // Cambiar según la configuración de tu base de datos
$dbname = "ludik"; // Nombre de la base de datos

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
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