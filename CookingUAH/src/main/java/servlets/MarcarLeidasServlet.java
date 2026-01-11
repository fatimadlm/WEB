package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.NotificacionDAO;
import modelo.User;

@WebServlet(name = "MarcarLeidasServlet", urlPatterns = {"/MarcarLeidasServlet"})
public class MarcarLeidasServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;
        if (usuario == null) { response.setStatus(401); return; }

        NotificacionDAO dao = new NotificacionDAO();
        String idParam = request.getParameter("id");

        if (idParam != null && !idParam.isEmpty()) {
            dao.marcarUnaComoLeida(Integer.parseInt(idParam)); // Borrar una
        } else {
            dao.marcarComoLeidas(usuario.getId()); // Borrar todas
        }
        response.setStatus(200); // OK para AJAX
    }
}