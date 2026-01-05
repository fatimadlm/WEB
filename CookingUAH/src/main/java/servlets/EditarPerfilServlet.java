package servlets;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import modelo.User;

@WebServlet(name = "EditarPerfilServlet", urlPatterns = {"/EditarPerfilServlet"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024 * 2, // 2MB
    maxFileSize = 1024 * 1024 * 10,      // 10MB
    maxRequestSize = 1024 * 1024 * 50    // 50MB
)
public class EditarPerfilServlet extends HttpServlet {

    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        User usuarioActual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (usuarioActual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        String nuevaBio = request.getParameter("bio");
        Part filePart = request.getPart("avatar");
        String nombreArchivoAvatar = null;

        try {
            // 1. Lógica de ruta dinámica para encontrar la carpeta hermana 'Uploads_CookingUAH'
            String pathDespliegue = getServletContext().getRealPath("/");
            File carpetaDespliegue = new File(pathDespliegue);
            
            // Subimos 3 niveles: SNAPSHOT -> target -> CookingUAH (Raíz del repo)
            File raizRepo = carpetaDespliegue.getParentFile().getParentFile().getParentFile();
            File directorioSubidas = new File(raizRepo, "Uploads_CookingUAH");

            if (!directorioSubidas.exists()) {
                directorioSubidas.mkdirs();
            }

            // 2. Procesar imagen con el método robuso de Files.copy
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = "avatar_" + System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();
                
                // Normalizamos la ruta para evitar el error de volumen C:\...C:\
                Path rutaLimpia = Paths.get(directorioSubidas.getAbsolutePath(), fileName).normalize();
                
                // Realizamos la copia física ignorando las restricciones de GlassFish
                try (InputStream input = filePart.getInputStream()) {
                    Files.copy(input, rutaLimpia, StandardCopyOption.REPLACE_EXISTING);
                }
                
                nombreArchivoAvatar = fileName; 
            }

            // 3. Actualizar la Base de Datos
            StringBuilder sql = new StringBuilder("UPDATE users SET bio = ?");
            if (nombreArchivoAvatar != null) {
                sql.append(", avatar = ?");
            }
            sql.append(" WHERE id = ?");

            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 PreparedStatement ps = conn.prepareStatement(sql.toString())) {
                
                ps.setString(1, nuevaBio);
                if (nombreArchivoAvatar != null) {
                    ps.setString(2, nombreArchivoAvatar);
                    ps.setInt(3, usuarioActual.getId());
                } else {
                    ps.setInt(2, usuarioActual.getId());
                }

                int filas = ps.executeUpdate();
                
                if (filas > 0) {
                    usuarioActual.setBio(nuevaBio);
                    if (nombreArchivoAvatar != null) {
                        usuarioActual.setAvatar(nombreArchivoAvatar);
                    }
                    session.setAttribute("usuario", usuarioActual);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            // Mostramos el error exacto si falla el guardado físico
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al actualizar perfil: " + e.getMessage());
            return;
        }

        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}