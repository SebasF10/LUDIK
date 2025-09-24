<?php

/**
 * Documentos.php - Backend para gestión de documentos
 * Maneja subida de archivos y consulta de documentos desde MySQL
 * Usando solo las columnas existentes: id_doc, url_doc, nombre_doc
 */

// ===================== CONFIGURACIÓN =====================
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Incluir archivo de conexión existente
require_once 'conexion.php';

// Configuración de archivos
define('UPLOAD_DIR', '../uploads/');
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_TYPES', [
    'pdf' => 'application/pdf',
    'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'jpg' => 'image/jpeg',
    'jpeg' => 'image/jpeg',
    'png' => 'image/png'
]);

// Headers para CORS y JSON
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ===================== CLASE PRINCIPAL =====================
class DocumentManager
{
    private $conexion;

    public function __construct($conexion)
    {
        $this->conexion = $conexion;
        $this->createUploadDir();
    }

    /**
     * Crear directorio de uploads si no existe
     */
    private function createUploadDir()
    {
        if (!is_dir(UPLOAD_DIR)) {
            if (!mkdir(UPLOAD_DIR, 0755, true)) {
                $this->sendError("Error creando directorio de uploads");
            }
        }
    }

    /**
     * Manejar subida de archivo
     */
    public function handleUpload()
    {
        // Verificar que se envió un archivo
        if (!isset($_FILES['archivo']) || $_FILES['archivo']['error'] !== UPLOAD_ERR_OK) {
            $this->sendError("No se recibió ningún archivo válido");
        }

        $file = $_FILES['archivo'];

        // Validaciones
        $this->validateFile($file);

        // Generar nombre único
        $originalName = $file['name'];
        $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $uniqueName = uniqid() . '_' . time() . '.' . $fileExtension;
        $filePath = UPLOAD_DIR . $uniqueName;

        // Mover archivo
        if (!move_uploaded_file($file['tmp_name'], $filePath)) {
            $this->sendError("Error moviendo el archivo");
        }

        // Guardar en base de datos (solo las 3 columnas existentes)
        $fileUrl = 'uploads/' . $uniqueName;
        $documentId = $this->saveToDatabase($originalName, $fileUrl);

        if ($documentId) {
            $this->sendSuccess("Documento subido correctamente", [
                'id' => $documentId,
                'nombre' => $originalName,
                'url' => $fileUrl
            ]);
        } else {
            // Si falla la BD, eliminar archivo
            unlink($filePath);
            $this->sendError("Error guardando en base de datos");
        }
    }

    /**
     * Validar archivo subido
     */
    private function validateFile($file)
    {
        // Verificar tamaño
        if ($file['size'] > MAX_FILE_SIZE) {
            $maxMB = MAX_FILE_SIZE / (1024 * 1024);
            $this->sendError("El archivo es demasiado grande. Máximo {$maxMB}MB");
        }

        // Verificar tipo
        $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!array_key_exists($fileExtension, ALLOWED_TYPES)) {
            $this->sendError("Tipo de archivo no permitido. Solo: " . implode(', ', array_keys(ALLOWED_TYPES)));
        }

        // Verificar MIME type
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mimeType = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mimeType, ALLOWED_TYPES)) {
            $this->sendError("Tipo MIME no válido");
        }
    }

    /**
     * Guardar información en base de datos (solo columnas existentes)
     */
    private function saveToDatabase($nombreOriginal, $url)
    {
        // Escapar datos para prevenir inyección SQL
        $nombreOriginal = mysqli_real_escape_string($this->conexion, $nombreOriginal);
        $url = mysqli_real_escape_string($this->conexion, $url);

        $sql = "INSERT INTO documento (nombre_doc, url_doc) VALUES ('$nombreOriginal', '$url')";

        if (mysqli_query($this->conexion, $sql)) {
            return mysqli_insert_id($this->conexion);
        } else {
            error_log("Error guardando documento: " . mysqli_error($this->conexion));
            return false;
        }
    }

    /**
     * Obtener lista de documentos
     */
    public function getDocuments()
    {
        $sql = "SELECT id_doc, nombre_doc, url_doc FROM documento ORDER BY id_doc DESC";

        $result = mysqli_query($this->conexion, $sql);

        if (!$result) {
            error_log("Error obteniendo documentos: " . mysqli_error($this->conexion));
            return '';
        }

        $documents = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $documents[] = $row;
        }

        return $this->generateDocumentsHTML($documents);
    }

    /**
     * Generar HTML para la cuadrícula de documentos
     */
    private function generateDocumentsHTML($documents)
    {
        if (empty($documents)) {
            return '';
        }

        $html = '';

        foreach ($documents as $doc) {
            // Obtener tipo de archivo desde el nombre
            $fileType = strtolower(pathinfo($doc['nombre_doc'], PATHINFO_EXTENSION));
            $icon = $this->getFileIcon($fileType);

            $html .= '
            <div class="document-card">
                <div class="document-icon ' . $icon['class'] . '">
                    ' . $icon['icon'] . '
                </div>
                
                <div class="document-name">
                    ' . htmlspecialchars($doc['nombre_doc']) . '
                </div>
                
                <div class="document-info">
                    <small>ID: ' . $doc['id_doc'] . '</small>
                </div>
                
                <div class="document-actions">
                    <button class="btn-document btn-view" 
                            data-url="' . htmlspecialchars($doc['url_doc']) . '"
                            data-name="' . htmlspecialchars($doc['nombre_doc']) . '">
                        👁️ Ver en el sitio
                    </button>
                    
                    <button class="btn-document btn-open" 
                            data-url="' . htmlspecialchars($doc['url_doc']) . '">
                        🔗 Abrir archivo
                    </button>
                </div>
            </div>';
        }

        return $html;
    }

    /**
     * Obtener icono según tipo de archivo
     */
    private function getFileIcon($fileType)
    {
        switch (strtolower($fileType)) {
            case 'pdf':
                return ['class' => 'pdf', 'icon' => '📄'];
            case 'docx':
            case 'doc':
                return ['class' => 'docx', 'icon' => '📝'];
            case 'xlsx':
            case 'xls':
                return ['class' => 'xlsx', 'icon' => '📊'];
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
                return ['class' => 'image', 'icon' => '🖼️'];
            default:
                return ['class' => 'default', 'icon' => '📎'];
        }
    }

    /**
     * Enviar respuesta de éxito
     */
    private function sendSuccess($message, $data = null)
    {
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
        exit;
    }

    /**
     * Enviar respuesta de error
     */
    private function sendError($message)
    {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => $message
        ]);
        exit;
    }
}

// ===================== MANEJO DE REQUESTS =====================

try {
    // Verificar que la conexión existe
    if (!$conexion) {
        throw new Exception("No se pudo establecer conexión con la base de datos");
    }

    $documentManager = new DocumentManager($conexion);

    // Verificar método de request
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'POST':
            // Subir nuevo documento
            $documentManager->handleUpload();
            break;

        case 'GET':
            // Obtener lista de documentos (retorna HTML)
            header('Content-Type: text/html; charset=utf-8');
            echo $documentManager->getDocuments();
            break;

        case 'OPTIONS':
            // Manejo de preflight CORS
            http_response_code(200);
            break;

        default:
            http_response_code(405);
            echo json_encode([
                'success' => false,
                'message' => 'Método no permitido'
            ]);
            break;
    }
} catch (Exception $e) {
    error_log("Error general en Documentos.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Error interno del servidor'
    ]);
}

// ===================== FUNCIONES DE UTILIDAD ADICIONALES =====================

/**
 * Limpiar archivos antiguos (ejecutar periódicamente)
 */
function cleanOldFiles($days = 30)
{
    $uploadDir = UPLOAD_DIR;
    $cutoffTime = time() - ($days * 24 * 60 * 60);

    if (is_dir($uploadDir)) {
        $files = glob($uploadDir . '*');
        foreach ($files as $file) {
            if (is_file($file) && filemtime($file) < $cutoffTime) {
                unlink($file);
            }
        }
    }
}

/**
 * Generar thumbnail para imágenes (función futura)
 */
function generateThumbnail($imagePath, $thumbnailPath, $width = 150, $height = 150)
{
    // Implementación futura para generar miniaturas de imágenes
    // Esto mejoraría la experiencia visual en la cuadrícula
}

/**
 * Validar permisos de usuario (función futura)
 */
function validateUserPermissions($userId, $action)
{
    // Implementación futura para control de acceso
    // Podría integrarse con el sistema de roles de la aplicación
    return true;
}

/**
 * Log de actividades
 */
function logActivity($action, $details = '')
{
    $logFile = '../logs/documents.log';
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] $action: $details" . PHP_EOL;

    // Crear directorio de logs si no existe
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }

    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

/**
 * Backup de base de datos (función de mantenimiento)
 */
function backupDatabase()
{
    // Implementación futura para respaldo automático
    // Útil para mantener integridad de los datos
}
