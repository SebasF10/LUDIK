<?php
// Incluir el archivo de conexión
require_once 'conexion.php';

// Verificar si llegó el rol
if (!isset($_POST['rol'])) {
    die("Error: Rol no especificado.");
}

$rol = $_POST['rol'];

switch ($rol) {
    case "admin":
        $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
        $email = mysqli_real_escape_string($conexion, $_POST['email']);
        $contrasena = mysqli_real_escape_string($conexion, $_POST['contrasena']);
        
        $sql = "INSERT INTO admin (nombre, email, contrasena) 
                VALUES ('$nombre', '$email', '$contrasena')";
        
        if (mysqli_query($conexion, $sql)) {
            echo "Cuenta de administrador creada correctamente.";
        } else {
            echo "Error al crear la cuenta: " . mysqli_error($conexion);
        }
        break;

    case "docente":
        // Desactivar autocommit para manejar transacciones
        mysqli_autocommit($conexion, FALSE);
        
        try {
            // Escapar datos para evitar inyección SQL
            $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
            $email = mysqli_real_escape_string($conexion, $_POST['email']);
            $contrasena = mysqli_real_escape_string($conexion, $_POST['contrasena']);
            $telefono = mysqli_real_escape_string($conexion, $_POST['telefono']);
            $es_director = mysqli_real_escape_string($conexion, $_POST['es_director']);
            
            // Crear docente
            $sql = "INSERT INTO docente (nombre_completo, email, contrasena, telefono, es_director) 
                    VALUES ('$nombre', '$email', '$contrasena', '$telefono', '$es_director')";
            
            if (!mysqli_query($conexion, $sql)) {
                throw new Exception("Error al insertar docente: " . mysqli_error($conexion));
            }
            
            $id_docente = mysqli_insert_id($conexion);

            // Procesar grupos seleccionados y sus asignaturas
            if (!empty($_POST['grupos_seleccionados'])) {
                foreach ($_POST['grupos_seleccionados'] as $id_grupo) {
                    $id_grupo = mysqli_real_escape_string($conexion, $id_grupo);
                    
                    // Verificar si hay asignaturas seleccionadas para este grupo
                    $campo_asignaturas = "asignaturas_grupo_" . $id_grupo;
                    
                    if (!empty($_POST[$campo_asignaturas])) {
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

            // Si es director, guardar el grupo en docente_grupo con el año actual
            if (isset($_POST['es_director']) && $_POST['es_director'] == "1" && !empty($_POST['grupo_director'])) {
                $grupo_director = mysqli_real_escape_string($conexion, $_POST['grupo_director']);
                $anio_actual = date('Y');
                
                $sql3 = "INSERT INTO docente_grupo (id_docente, id_grupo, anio) 
                         VALUES ('$id_docente', '$grupo_director', '$anio_actual')";
                
                if (!mysqli_query($conexion, $sql3)) {
                    throw new Exception("Error al insertar docente-grupo: " . mysqli_error($conexion));
                }
            }

            // Confirmar transacción
            mysqli_commit($conexion);
            echo "Cuenta de docente creada correctamente.";
            
        } catch (Exception $e) {
            // Revertir transacción en caso de error
            mysqli_rollback($conexion);
            echo "Error al crear la cuenta del docente: " . $e->getMessage();
        } finally {
            // Reactivar autocommit
            mysqli_autocommit($conexion, TRUE);
        }
        break;

    case "directivos":
        $nombre = mysqli_real_escape_string($conexion, $_POST['nombre']);
        $cargo = mysqli_real_escape_string($conexion, $_POST['cargo']);
        $email = mysqli_real_escape_string($conexion, $_POST['email']);
        $contrasena = mysqli_real_escape_string($conexion, $_POST['contrasena']);
        
        $sql = "INSERT INTO directivo (nombre, cargo, email, contrasena) 
                VALUES ('$nombre', '$cargo', '$email', '$contrasena')";
        
        if (mysqli_query($conexion, $sql)) {
            echo "Cuenta de directivo creada correctamente.";
        } else {
            echo "Error al crear la cuenta: " . mysqli_error($conexion);
        }
        break;

    default:
        echo "Rol inválido.";
}

// No cerramos la conexión aquí ya que puede ser usada en otros archivos incluidos
?>