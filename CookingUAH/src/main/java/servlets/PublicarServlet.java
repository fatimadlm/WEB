package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import modelo.PostDAO;
import modelo.User;

@WebServlet(name = "PublicarServlet", urlPatterns = {"/PublicarServlet"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024, // 1MB
    maxFileSize = 1024 * 1024 * 5,    // 5MB
    maxRequestSize = 1024 * 1024 * 10 // 10MB
)
public class PublicarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Configuración de codificación y sesión
        request.setCharacterEncoding("UTF-8");
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (usuario == null) { 
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp"); 
            return; 
        }

        // 2. Obtención de datos del formulario
        String titulo = request.getParameter("titulo");
        Part filePart = request.getPart("imagen");
        String nombreArchivoBBDD = null;

        // 3. Procesamiento de la imagen con Ruta Dinámica hacia GitHub
        if (filePart != null && filePart.getSize() > 0) {
            try {
                // Localizar la carpeta dinámica (3 niveles arriba desde el despliegue)
                String pathDespliegue = getServletContext().getRealPath("/");
                File dirDespliegue = new File(pathDespliegue);
                
                // Navegación: target/SNAPSHOT -> target -> CookingUAH -> WEB (Raíz del repo)
                File raizRepo = dirDespliegue.getParentFile().getParentFile().getParentFile();
                File directorioSubidas = new File(raizRepo, "Uploads_CookingUAH");

                // Crear la carpeta si no existe en el repositorio
                if (!directorioSubidas.exists()) {
                    directorioSubidas.mkdirs();
                }

                // Generar nombre de archivo único
                String fileName = "post_" + System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();

                // NORMALIZACIÓN DE RUTA: Forzamos una ruta absoluta limpia para Windows
                Path rutaLimpia = Paths.get(directorioSubidas.getAbsolutePath(), fileName).normalize();
                
                // GUARDADO MANUAL: Usamos Files.copy para saltarnos las restricciones de GlassFish
                try (InputStream input = filePart.getInputStream()) {
                    Files.copy(input, rutaLimpia, StandardCopyOption.REPLACE_EXISTING);
                }

                // Guardamos solo el nombre para la BBDD (el VerImagenServlet hará el resto)
                nombreArchivoBBDD = fileName;
                System.out.println("Imagen de post guardada en: " + rutaLimpia.toString());

            } catch (Exception e) {
                e.printStackTrace();
                // Si falla, mostramos el error exacto en el navegador
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error crítico al guardar la imagen: " + e.getMessage());
                return;
            }
        }

        // 4. Guardar registro en la Base de Datos
        PostDAO dao = new PostDAO();
        boolean exito = dao.crearPost(usuario.getId(), titulo, nombreArchivoBBDD);

        // 5. Redirección final
        if (exito) {
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al guardar el post en la base de datos.");
        }
    }
}