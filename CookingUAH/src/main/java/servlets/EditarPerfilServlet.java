package servlets;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import modelo.User;
import modelo.UserDAO;

/**
 * Servlet que procesa la actualización de los datos de perfil.
 * Soporta la subida de archivos (avatar) y actualización de biografía.
 */
@WebServlet(name = "EditarPerfilServlet", urlPatterns = {"/EditarPerfilServlet"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024, // 1MB
    maxFileSize = 1024 * 1024 * 5,    // 5MB
    maxRequestSize = 1024 * 1024 * 10 // 10MB
)
public class EditarPerfilServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Validar Sesión
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        // 2. Obtener parámetros de texto
        String nuevaBio = request.getParameter("bio");
        String rutaAvatar = actual.getAvatar(); // Por defecto mantenemos la actual

        // 3. Gestionar subida de Imagen (Avatar)
        Part filePart = request.getPart("avatar");
        if (filePart != null && filePart.getSize() > 0) {
            String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            // Nombre único para evitar colisiones: id_nombrearchivo
            String nombreFinal = actual.getId() + "_" + fileName;
            
            // Ruta física en el servidor (Carpeta Imagenes)
            String uploadPath = getServletContext().getRealPath("") + File.separator + "Imagenes";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            filePart.write(uploadPath + File.separator + nombreFinal);
            rutaAvatar = "Imagenes/" + nombreFinal;
        }

        // 4. Actualizar en Base de Datos
        UserDAO dao = new UserDAO();
        boolean exito = dao.actualizarPerfil(actual.getId(), rutaAvatar, nuevaBio);

        if (exito) {
            // IMPORTANTE: Actualizar el objeto en la sesión para refrescar la vista
            actual.setBio(nuevaBio);
            actual.setAvatar(rutaAvatar);
            session.setAttribute("usuario", actual);
        }

        // 5. Redirigir de vuelta al perfil para ver los cambios
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}