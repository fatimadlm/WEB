package servlets;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(name = "EliminarPostServlet", urlPatterns = {"/EliminarPostServlet"})
public class EliminarPostServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String idParam = request.getParameter("postId");
        if (idParam == null) {
            response.sendRedirect(request.getContextPath() + "/PerfilServlet");
            return;
        }

        int postId = Integer.parseInt(idParam);
        String sql = "DELETE FROM posts WHERE id = ?";
        
        // Usamos las credenciales de tu MensajeDAO
        String url = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
        
        try (Connection conn = DriverManager.getConnection(url, "root", "root");
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.executeUpdate();
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        
        // Redirigimos de vuelta al PerfilServlet para que refresque la lista
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}