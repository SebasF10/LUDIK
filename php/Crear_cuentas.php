<?php
// NO salida antes de headers ni espacios en blanco
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

// Validar método POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Método no permitido.']);
    exit;
}

if (!isset($_POST['rol'])) {
    echo json_encode(['status' => 'error', 'message' => 'Rol no especificado.']);
    exit;
}

$rol = $_POST['rol'];

try {
    if ($rol === 'admin') {
        $nombre = mysqli_real_escape_string($conexion, $_POST['nombre'] ?? '');
        $email = mysqli_real_escape_string($conexion, $_POST['email'] ?? '');
        $contrasena_plain = $_POST['contrasena'] ?? '';
        
        // Encriptar contraseña
        $contrasena_hash = password_hash($contrasena_plain, PASSWORD_DEFAULT);

        $sql = "INSERT INTO admin (nombre, email, contrasena) VALUES ('$nombre', '$email', '$contrasena_hash')";
        if (mysqli_query($conexion, $sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Cuenta de administrador creada correctamente.']);
        } else {
            throw new Exception("Error al crear la cuenta admin: " . mysqli_error($conexion));
        }

    } elseif ($rol === 'docente') {
        mysqli_autocommit($conexion, FALSE);
        try {
            $nombre = mysqli_real_escape_string($conexion, $_POST['nombre'] ?? '');
            $email = mysqli_real_escape_string($conexion, $_POST['email'] ?? '');
            $contrasena_plain = $_POST['contrasena'] ?? '';
            $telefono = mysqli_real_escape_string($conexion, $_POST['telefono'] ?? '');
            $es_director = mysqli_real_escape_string($conexion, $_POST['es_director'] ?? '0');

            // Encriptar contraseña
            $contrasena_hash = password_hash($contrasena_plain, PASSWORD_DEFAULT);

            $sql = "INSERT INTO docente (nombre_completo, email, contrasena, telefono, es_director) 
                    VALUES ('$nombre', '$email', '$contrasena_hash', '$telefono', '$es_director')";
            if (!mysqli_query($conexion, $sql)) {
                throw new Exception("Error al insertar docente: " . mysqli_error($conexion));
            }

            $id_docente = mysqli_insert_id($conexion);

            if (!empty($_POST['grupos_seleccionados']) && is_array($_POST['grupos_seleccionados'])) {
                foreach ($_POST['grupos_seleccionados'] as $id_grupo) {
                    $id_grupo = mysqli_real_escape_string($conexion, $id_grupo);
                    $campo_asignaturas = "asignaturas_grupo_" . $id_grupo;
                    if (!empty($_POST[$campo_asignaturas]) && is_array($_POST[$campo_asignaturas])) {
                        foreach ($_POST[$campo_asignaturas] as $id_asignatura) {
                            $id_asignatura = mysqli_real_escape_string($conexion, $id_asignatura);
                            $anio = date('Y');
                            $sql2 = "INSERT INTO asignatura_docente_grupo (id_docente, id_grupo, id_asignatura, anio) 
                                     VALUES ('$id_docente', '$id_grupo', '$id_asignatura', '$anio')";
                            if (!mysqli_query($conexion, $sql2)) {
                                throw new Exception("Error al insertar asignatura-docente-grupo: " . mysqli_error($conexion));
                            }
                        }
                    }
                }
            }

            if ($es_director === "1" && !empty($_POST['grupo_director'])) {
                $grupo_director = mysqli_real_escape_string($conexion, $_POST['grupo_director']);
                $anio_actual = date('Y');
                $sql3 = "INSERT INTO docente_grupo (id_docente, id_grupo, anio) 
                         VALUES ('$id_docente', '$grupo_director', '$anio_actual')";
                if (!mysqli_query($conexion, $sql3)) {
                    throw new Exception("Error al insertar docente-grupo: " . mysqli_error($conexion));
                }
            }

            mysqli_commit($conexion);
            echo json_encode(['status' => 'success', 'message' => 'Cuenta de docente creada correctamente.']);
        } catch (Exception $e) {
            mysqli_rollback($conexion);
            echo json_encode(['status' => 'error', 'message' => 'Error al crear la cuenta del docente: ' . $e->getMessage()]);
        } finally {
            mysqli_autocommit($conexion, TRUE);
        }

    } elseif ($rol === 'directivos') {
        $nombre = mysqli_real_escape_string($conexion, $_POST['nombre'] ?? '');
        $cargo = mysqli_real_escape_string($conexion, $_POST['cargo'] ?? '');
        $email = mysqli_real_escape_string($conexion, $_POST['email'] ?? '');
        $contrasena_plain = $_POST['contrasena'] ?? '';

        // Encriptar contraseña
        $contrasena_hash = password_hash($contrasena_plain, PASSWORD_DEFAULT);

        $sql = "INSERT INTO directivo (nombre, cargo, email, contrasena) 
                VALUES ('$nombre', '$cargo', '$email', '$contrasena_hash')";
        if (mysqli_query($conexion, $sql)) {
            echo json_encode(['status' => 'success', 'message' => 'Cuenta de directivo creada correctamente.']);
        } else {
            throw new Exception("Error al crear la cuenta directivo: " . mysqli_error($conexion));
        }

    } else {
        echo json_encode(['status' => 'error', 'message' => 'Rol inválido.']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>