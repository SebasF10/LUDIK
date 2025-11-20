<?php
require_once 'conexion.php';

header('Content-Type: application/json; charset=utf-8');

// Acción solicitada
$action = $_GET['action'] ?? $_POST['action'] ?? '';

try {
    if ($action === 'listar_docentes') {
        listarDocentes($conexion);
    } elseif ($action === 'actualizar_asignacion') {
        actualizarAsignacion($conexion);
    } else {
        echo json_encode(['error' => 'Acción no especificada']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

// ========== FUNCIONES ==========

function listarDocentes($conexion) {
    $anio = mysqli_real_escape_string($conexion, $_GET['anio'] ?? date('Y'));
    
    // Obtener todos los docentes
    $sql_docentes = "SELECT id_docente, nombre_completo, email, es_director FROM docente ORDER BY nombre_completo";
    $result_docentes = mysqli_query($conexion, $sql_docentes);
    
    if (!$result_docentes) {
        throw new Exception("Error al obtener docentes: " . mysqli_error($conexion));
    }
    
    $docentes = [];
    
    while ($docente = mysqli_fetch_assoc($result_docentes)) {
        $id_docente = $docente['id_docente'];
        
        // Obtener grupos del docente
        $sql_grupos = "SELECT DISTINCT g.id_grupo, g.grupo 
                    FROM grupo g
                    INNER JOIN asignatura_docente_grupo adg ON g.id_grupo = adg.id_grupo
                    WHERE adg.id_docente = $id_docente AND adg.anio = '$anio'
                    ORDER BY g.grupo";
        $result_grupos = mysqli_query($conexion, $sql_grupos);
        
        $grupos = [];
        while ($grupo = mysqli_fetch_assoc($result_grupos)) {
            $grupos[] = [
                'id' => $grupo['id_grupo'],
                'nombre' => $grupo['grupo']
            ];
        }
        
        // Obtener asignaturas del docente con sus grupos
        $sql_asignaturas = "SELECT DISTINCT a.id_asignatura, a.nombre_asig, adg.id_grupo
                            FROM asignatura a
                            INNER JOIN asignatura_docente_grupo adg ON a.id_asignatura = adg.id_asignatura
                            WHERE adg.id_docente = $id_docente AND adg.anio = '$anio'
                            ORDER BY a.nombre_asig";
        $result_asignaturas = mysqli_query($conexion, $sql_asignaturas);
        
        $asignaturas = [];
        while ($asignatura = mysqli_fetch_assoc($result_asignaturas)) {
            $asignaturas[] = [
                'id' => $asignatura['id_asignatura'],
                'nombre' => $asignatura['nombre_asig'],
                'id_grupo' => $asignatura['id_grupo']
            ];
        }
        
        // Obtener grupo que dirige (si es director)
        $grupo_director = null;
        if ($docente['es_director'] == 1) {
            $sql_director = "SELECT g.grupo 
                            FROM docente_grupo dg
                            INNER JOIN grupo g ON dg.id_grupo = g.id_grupo
                            WHERE dg.id_docente = $id_docente AND dg.anio = '$anio'
                            LIMIT 1";
            $result_director = mysqli_query($conexion, $sql_director);
            if ($row_director = mysqli_fetch_assoc($result_director)) {
                $grupo_director = $row_director['grupo'];
            }
        }
        
        $docentes[] = [
            'id' => $docente['id_docente'],
            'nombre_completo' => $docente['nombre_completo'],
            'email' => $docente['email'],
            'es_director' => $docente['es_director'],
            'grupos' => $grupos,
            'asignaturas' => $asignaturas,
            'grupo_director' => $grupo_director
        ];
    }
    
    echo json_encode($docentes);
}

function actualizarAsignacion($conexion) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['status' => 'error', 'message' => 'Método no permitido']);
        return;
    }
    
    $id_docente = mysqli_real_escape_string($conexion, $_POST['id_docente'] ?? '');
    $anio = mysqli_real_escape_string($conexion, $_POST['anio'] ?? '');
    $es_director = mysqli_real_escape_string($conexion, $_POST['es_director'] ?? '0');
    $grupo_director = mysqli_real_escape_string($conexion, $_POST['grupo_director'] ?? '');
    
    if (empty($id_docente) || empty($anio)) {
        echo json_encode(['status' => 'error', 'message' => 'Datos incompletos']);
        return;
    }
    
    mysqli_autocommit($conexion, FALSE);
    
    try {
        // 1. Actualizar campo es_director en la tabla docente
        $sql_update_docente = "UPDATE docente SET es_director = '$es_director' WHERE id_docente = $id_docente";
        if (!mysqli_query($conexion, $sql_update_docente)) {
            throw new Exception("Error al actualizar campo es_director: " . mysqli_error($conexion));
        }
        
        // 2. Eliminar asignaciones anteriores de grupos y asignaturas para este año
        $sql_delete_asig = "DELETE FROM asignatura_docente_grupo 
                        WHERE id_docente = $id_docente AND anio = '$anio'";
        if (!mysqli_query($conexion, $sql_delete_asig)) {
            throw new Exception("Error al eliminar asignaciones anteriores: " . mysqli_error($conexion));
        }
        
        // 3. Eliminar asignación de director de grupo anterior para este año
        $sql_delete_director = "DELETE FROM docente_grupo 
                            WHERE id_docente = $id_docente AND anio = '$anio'";
        if (!mysqli_query($conexion, $sql_delete_director)) {
            throw new Exception("Error al eliminar director de grupo anterior: " . mysqli_error($conexion));
        }
        
        // 4. Insertar nuevas asignaciones de grupos y asignaturas
        if (!empty($_POST['grupos_seleccionados']) && is_array($_POST['grupos_seleccionados'])) {
            foreach ($_POST['grupos_seleccionados'] as $id_grupo) {
                $id_grupo = mysqli_real_escape_string($conexion, $id_grupo);
                $campo_asignaturas = "asignaturas_grupo_" . $id_grupo;
                
                if (!empty($_POST[$campo_asignaturas]) && is_array($_POST[$campo_asignaturas])) {
                    foreach ($_POST[$campo_asignaturas] as $id_asignatura) {
                        $id_asignatura = mysqli_real_escape_string($conexion, $id_asignatura);
                        
                        $sql_insert = "INSERT INTO asignatura_docente_grupo 
                                    (id_docente, id_grupo, id_asignatura, anio) 
                                    VALUES ($id_docente, $id_grupo, $id_asignatura, '$anio')";
                        
                        if (!mysqli_query($conexion, $sql_insert)) {
                            throw new Exception("Error al insertar asignación: " . mysqli_error($conexion));
                        }
                    }
                }
            }
        }
        
        // 5. Insertar nuevo director de grupo si aplica
        if ($es_director === "1" && !empty($grupo_director)) {
            $sql_insert_director = "INSERT INTO docente_grupo (id_docente, id_grupo, anio) 
                                VALUES ($id_docente, $grupo_director, '$anio')";
            
            if (!mysqli_query($conexion, $sql_insert_director)) {
                throw new Exception("Error al asignar director de grupo: " . mysqli_error($conexion));
            }
        }
        
        mysqli_commit($conexion);
        echo json_encode([
            'status' => 'success', 
            'message' => 'Asignación actualizada correctamente'
        ]);
        
    } catch (Exception $e) {
        mysqli_rollback($conexion);
        echo json_encode([
            'status' => 'error', 
            'message' => $e->getMessage()
        ]);
    } finally {
        mysqli_autocommit($conexion, TRUE);
    }
}
?>