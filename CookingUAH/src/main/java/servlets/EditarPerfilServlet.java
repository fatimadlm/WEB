package servlets;

import java.io.File;
import java.io.IOException;
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
        
        // 1. Configuración de caracteres para evitar errores en la bio
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

        // 2. Lógica de ruta dinámica para Carpeta de GitHub
        try {
            // Obtenemos la ruta donde se está ejecutando el servidor
            String pathDespliegue = getServletContext().getRealPath("/");
            File carpetaDespliegue = new File(pathDespliegue);
            
            // Navegamos hacia atrás para encontrar la raíz del repositorio
            // Desde target/CookingUAH-1.0-SNAPSHOT subimos 3 niveles para llegar a la carpeta WEB
            File raizRepo = carpetaDespliegue.getParentFile().getParentFile().getParentFile();
            File directorioSubidas = new File(raizRepo, "Uploads_CookingUAH");

            // Procesar imagen si el usuario subió una
            if (filePart != null && filePart.getSize() > 0) {
                String fileName = System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();
                
                if (!directorioSubidas.exists()) {
                    directorioSubidas.mkdirs();
                }
                
                File archivoDestino = new File(directorioSubidas, fileName);
                
                // Realizamos la copia física del archivo
                filePart.write(archivoDestino.getAbsolutePath());
                
                // Guardamos solo el nombre para la BBDD
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
                    // Sincronizamos el objeto en sesión
                    usuarioActual.setBio(nuevaBio);
                    if (nombreArchivoAvatar != null) {
                        usuarioActual.setAvatar(nombreArchivoAvatar);
                    }
                    session.setAttribute("usuario", usuarioActual);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // Redirigimos al servlet de perfil para recargar todos los datos
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}