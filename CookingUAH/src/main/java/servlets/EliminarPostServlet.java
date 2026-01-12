package servlets;

import jakarta.servlet.ServletException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.PostDAO;
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "EliminarPostServlet", urlPatterns = {"/EliminarPostServlet"})
public class EliminarPostServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        String postId = request.getParameter("postId");
        
        // Llamada al DAO para eliminar
        PostDAO pDao = new PostDAO();
        // Es recomendable pasar el ID del usuario actual para validar propiedad en el SQL
        boolean ok =pDao.eliminarPost(Integer.parseInt(postId), actual.getId());

        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}