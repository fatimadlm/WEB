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
        
        String nombreImagen = request.getParameter("nombre");

        if (nombreImagen == null || nombreImagen.trim().isEmpty()) {
            enviarImagenPorDefecto(response);
            return;
        }

        try {
            // 1. Obtener la ruta base (puedes hacerla configurable)
            String pathDespliegue = getServletContext().getRealPath("/");
            File carpetaDespliegue = new File(pathDespliegue);
            
            // Subida de niveles con validación
            File raizRepo = carpetaDespliegue;
            for(int i=0; i<3; i++) {
                if(raizRepo.getParentFile() != null) raizRepo = raizRepo.getParentFile();
            }
            
            File directorioSubidas = new File(raizRepo, "Uploads_CookingUAH");
            
            // 2. Construcción segura del Path
            Path rutaArchivo = directorioSubidas.toPath().resolve(nombreImagen).normalize();
            
            // SEGURIDAD: Validar que el archivo esté DENTRO del directorio de subidas
            if (!rutaArchivo.startsWith(directorioSubidas.toPath())) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN);
                return;
            }

            File imagenFile = rutaArchivo.toFile();

            if (imagenFile.exists() && imagenFile.isFile()) {
                servirArchivo(imagenFile, response);
            } else {
                // Si no existe, enviamos la imagen por defecto en lugar de error 404
                enviarImagenPorDefecto(response);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    private void servirArchivo(File file, HttpServletResponse response) throws IOException {
        String mimeType = getServletContext().getMimeType(file.getName());
        response.setContentType(mimeType != null ? mimeType : "image/jpeg");
        response.setContentLength((int) file.length());

        try (FileInputStream in = new FileInputStream(file);
             OutputStream out = response.getOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        }
    }

    private void enviarImagenPorDefecto(HttpServletResponse response) throws IOException {
        // Busca el default.png interno del proyecto
        String defaultPath = getServletContext().getRealPath("/Imagenes/DEFECTO.png");
        File defaultFile = new File(defaultPath);
        if (defaultFile.exists()) {
            servirArchivo(defaultFile, response);
        } else {
            response.sendError(HttpServletResponse.SC_NOT_FOUND);
        }
    }
}