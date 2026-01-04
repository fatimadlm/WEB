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
        
        HttpSession session = request.getSession(false);
        User usuarioActual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (usuarioActual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        String nuevaBio = request.getParameter("bio");
        Part filePart = request.getPart("avatar");
        String nombreArchivoAvatar = null;

        // 1. Procesar la nueva foto de perfil si se ha subido una
if (filePart != null && filePart.getSize() > 0) {
    // Nombre del archivo con timestamp para evitar duplicados
    String fileName = System.currentTimeMillis() + "_" + filePart.getSubmittedFileName();
    
    // Ruta RELATIVA para guardar en la base de datos
    nombreArchivoAvatar = "Imagenes/avatares/" + fileName;
    
    // Ruta ABSOLUTA para escribir el archivo físicamente en el disco
    // Usamos getRealPath("Imagenes/avatares") para obtener la carpeta correcta directamente
    String uploadPath = getServletContext().getRealPath("/Imagenes/avatares");
    
    File uploadDir = new File(uploadPath);
    if (!uploadDir.exists()) {
        uploadDir.mkdirs(); // Crea la carpeta si no existe
    }
    
    // Construimos la ruta final de forma segura
    String fullPath = uploadPath + File.separator + fileName;
    
    try {
        filePart.write(fullPath);
        System.out.println("Archivo guardado en: " + fullPath);
    } catch (IOException e) {
        System.err.println("Error al escribir el archivo: " + e.getMessage());
        throw e;
    }
}

        // 2. Construir la SQL dinámicamente
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
                // 3. ¡IMPORTANTE! Actualizar el objeto usuario en la sesión
                // para que los cambios se vean reflejados inmediatamente sin re-loguear
                usuarioActual.setBio(nuevaBio);
                if (nombreArchivoAvatar != null) {
                    usuarioActual.setAvatar(nombreArchivoAvatar);
                }
                session.setAttribute("usuario", usuarioActual);
            }
            
        } catch (SQLException e) {
            e.printStackTrace();
        }

        // 4. Volver al perfil
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}