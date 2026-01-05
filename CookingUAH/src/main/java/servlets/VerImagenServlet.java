package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;

@WebServlet(name = "VerImagenServlet", urlPatterns = {"/VerImagen"})
public class VerImagenServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Obtener el nombre del archivo desde la URL (ej: /VerImagen?nombre=foto.jpg)
        String nombreImagen = request.getParameter("nombre");

        if (nombreImagen == null || nombreImagen.trim().isEmpty()) {
            return; // Si no hay nombre, no hacemos nada
        }

        try {
            // 2. Lógica de ruta dinámica para encontrar la carpeta en GitHub
            String pathDespliegue = getServletContext().getRealPath("/");
            File carpetaDespliegue = new File(pathDespliegue);

            // Subimos 3 niveles para llegar a la raíz donde está 'Uploads_CookingUAH'
            File raizRepo = carpetaDespliegue.getParentFile().getParentFile().getParentFile();
            File directorioSubidas = new File(raizRepo, "Uploads_CookingUAH");

            // 3. Construir y normalizar la ruta del archivo solicitado
            Path rutaArchivo = Paths.get(directorioSubidas.getAbsolutePath(), nombreImagen).toAbsolutePath().normalize();
            File imagenFile = rutaArchivo.toFile();

            // 4. Verificar si el archivo existe físicamente
            if (imagenFile.exists() && imagenFile.isFile()) {
                
                // Definir el tipo de contenido (image/jpeg, image/png, etc.)
                String mimeType = getServletContext().getMimeType(imagenFile.getName());
                if (mimeType == null) {
                    mimeType = "application/octet-stream";
                }
                response.setContentType(mimeType);
                response.setContentLength((int) imagenFile.length());

                // 5. Leer el archivo y escribirlo en la respuesta del navegador
                try (FileInputStream in = new FileInputStream(imagenFile);
                     OutputStream out = response.getOutputStream()) {
                    
                    byte[] buffer = new byte[4096];
                    int bytesRead;
                    while ((bytesRead = in.read(buffer)) != -1) {
                        out.write(buffer, 0, bytesRead);
                    }
                }
            } else {
                // Si la imagen no existe en la carpeta de GitHub, no enviamos nada o podrías enviar una por defecto
                System.out.println("Imagen no encontrada en el disco: " + imagenFile.getAbsolutePath());
                response.sendError(HttpServletResponse.SC_NOT_FOUND);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}