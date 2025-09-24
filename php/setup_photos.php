<?php
/**
 * Script para configurar la carpeta de fotos y crear imagen por defecto
 * setup_photos.php
 */

// Crear directorio de fotos si no existe
$photosDir = '../photos';
if (!is_dir($photosDir)) {
    if (mkdir($photosDir, 0755, true)) {
        echo "Directorio 'photos' creado exitosamente.\n";
    } else {
        echo "Error: No se pudo crear el directorio 'photos'.\n";
        exit(1);
    }
} else {
    echo "El directorio 'photos' ya existe.\n";
}

// Crear imagen por defecto si no existe
$defaultImagePath = $photosDir . '/default.png';
if (!file_exists($defaultImagePath)) {
    // Crear una imagen PNG simple de 100x100 con un ícono de usuario
    $img = imagecreate(100, 100);
    
    // Colores
    $background = imagecolorallocate($img, 102, 126, 234); // Color azul del diseño
    $white = imagecolorallocate($img, 255, 255, 255);
    
    // Llenar el fondo
    imagefill($img, 0, 0, $background);
    
    // Dibujar un círculo para la cabeza (simple representación de usuario)
    imagefilledellipse($img, 50, 30, 25, 25, $white);
    
    // Dibujar el cuerpo (parte superior)
    imagefilledellipse($img, 50, 75, 45, 35, $white);
    
    // Guardar la imagen
    if (imagepng($img, $defaultImagePath)) {
        echo "Imagen por defecto creada en: $defaultImagePath\n";
    } else {
        echo "Error: No se pudo crear la imagen por defecto.\n";
    }
    
    // Liberar memoria
    imagedestroy($img);
} else {
    echo "La imagen por defecto ya existe.\n";
}

// Crear archivo .htaccess para proteger el directorio
$htaccessPath = $photosDir . '/.htaccess';
$htaccessContent = "# Protección para fotos de estudiantes
<Files *.php>
    Order allow,deny
    Deny from all
</Files>

# Permitir solo imágenes
<FilesMatch \"\.(jpg|jpeg|png|gif)$\">
    Order allow,deny
    Allow from all
</FilesMatch>

# Cache para imágenes
<FilesMatch \"\.(jpg|jpeg|png|gif)$\">
    ExpiresActive on
    ExpiresDefault \"access plus 1 month\"
</FilesMatch>";

if (!file_exists($htaccessPath)) {
    if (file_put_contents($htaccessPath, $htaccessContent)) {
        echo "Archivo .htaccess creado para proteger el directorio de fotos.\n";
    } else {
        echo "Advertencia: No se pudo crear el archivo .htaccess.\n";
    }
} else {
    echo "El archivo .htaccess ya existe en el directorio de fotos.\n";
}

// Crear un README con instrucciones
$readmePath = $photosDir . '/README.txt';
$readmeContent = "DIRECTORIO DE FOTOS DE ESTUDIANTES
=====================================

Este directorio contiene las fotos de los estudiantes del sistema LUDIK.

INSTRUCCIONES:
1. Las fotos deben nombrarse con el ID del estudiante: [ID].jpg, [ID].png, etc.
   Ejemplo: 123.jpg para el estudiante con ID 123

2. Formatos soportados: .jpg, .jpeg, .png, .gif

3. Tamaño recomendado: 200x200 píxeles (se redimensionará automáticamente)

4. Si un estudiante no tiene foto, se usará default.png

5. Para agregar una foto:
   - Nombrar el archivo con el ID del estudiante
   - Copiarlo a este directorio
   - Opcionalmente, actualizar el campo url_foto en la base de datos

SEGURIDAD:
- Este directorio está protegido contra la ejecución de scripts PHP
- Solo se permiten archivos de imagen
- Las imágenes tienen cache de 1 mes

ÚLTIMA ACTUALIZACIÓN: " . date('Y-m-d H:i:s') . "
";

if (!file_exists($readmePath)) {
    if (file_put_contents($readmePath, $readmeContent)) {
        echo "Archivo README creado con instrucciones.\n";
    }
}

echo "\n=== CONFIGURACIÓN COMPLETADA ===\n";
echo "Directorio de fotos configurado correctamente.\n";
echo "Ruta: " . realpath($photosDir) . "\n";
echo "\nPróximos pasos:\n";
echo "1. Agregar fotos de estudiantes usando el formato: ID.jpg\n";
echo "2. Verificar que el servidor web tenga permisos de lectura en el directorio\n";
echo "3. Probar la funcionalidad en la aplicación web\n";

// Función auxiliar para actualizar URLs de fotos en la base de datos
function updatePhotoUrls($conexion) {
    echo "\n¿Desea actualizar las URLs de fotos en la base de datos? (y/n): ";
    $handle = fopen("php://stdin", "r");
    $response = trim(fgets($handle));
    fclose($handle);
    
    if (strtolower($response) === 'y') {
        // Obtener lista de archivos de foto
        $photoFiles = glob('photos/*.{jpg,jpeg,png,gif}', GLOB_BRACE);
        
        foreach ($photoFiles as $photoFile) {
            $fileName = basename($photoFile);
            $studentId = pathinfo($fileName, PATHINFO_FILENAME);
            
            // Verificar si es numérico (ID de estudiante)
            if (is_numeric($studentId)) {
                $sql = "UPDATE estudiante SET url_foto = ? WHERE id_estudiante = ?";
                $stmt = mysqli_prepare($conexion, $sql);
                mysqli_stmt_bind_param($stmt, "si", $photoFile, $studentId);
                
                if (mysqli_stmt_execute($stmt)) {
                    echo "URL actualizada para estudiante ID $studentId: $photoFile\n";
                } else {
                    echo "Error actualizando estudiante ID $studentId\n";
                }
                
                mysqli_stmt_close($stmt);
            }
        }
        
        echo "Actualización de URLs completada.\n";
    }
}

// Si se incluye conexión, ofrecer actualizar URLs
if (file_exists('conexion.php')) {
    echo "\nSe detectó el archivo de conexión a la base de datos.\n";
    // Descomentar la siguiente línea si desea habilitar la actualización automática
    // require_once 'conexion.php';
    // updatePhotoUrls($conexion);
}
?>