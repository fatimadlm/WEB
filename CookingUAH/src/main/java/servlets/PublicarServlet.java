package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
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
        
        // 1. SEGURIDAD: Usar false para no crear una sesión nueva si no existe
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (usuario == null) { 
            // CORRECCIÓN: Usar ContextPath para asegurar que el navegador llegue al login
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp"); 
            return; 
        }

        // 2. DATOS DEL FORMULARIO
        // Usamos UTF-8 para evitar problemas con tildes o caracteres especiales
        request.setCharacterEncoding("UTF-8");
        String titulo = request.getParameter("titulo");
        Part filePart = request.getPart("imagen");
        String rutaImagenBBDD = null;

        // 3. PROCESAR IMAGEN
        if (filePart != null && filePart.getSize() > 0) {
            // Obtenemos la ruta absoluta de la carpeta 'uploads' dentro de webapp
            String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            // Generar nombre único para evitar que fotos con el mismo nombre se sobreescriban
            String fileName = "post_" + System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();
            String fullPath = uploadPath + File.separator + fileName;

            // Transferencia de datos segura
            try (InputStream input = filePart.getInputStream();
                 OutputStream output = new FileOutputStream(fullPath)) {
                
                byte[] buffer = new byte[4096];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
                // La ruta que guardamos en BBDD es relativa para que el JSP la cargue bien
                rutaImagenBBDD = "uploads/" + fileName;
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        // 4. GUARDAR EN BBDD
        PostDAO dao = new PostDAO();
        boolean exito = dao.crearPost(usuario.getId(), titulo, rutaImagenBBDD);

        // 5. REDIRECCIÓN TRAS ÉXITO
        if (exito) {
            // CORRECCIÓN: Redirigir al Servlet del Feed con ContextPath
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
        } else {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al guardar la publicación.");
        }
    }
}