package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import modelo.Notificacion;
import modelo.NotificacionDAO;
import modelo.User;

@WebServlet(name = "NotificacionesServlet", urlPatterns = {"/NotificacionesServlet"})
public class NotificacionesServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        NotificacionDAO dao = new NotificacionDAO();
        // Ya NO llamamos a marcarComoLeidas aquí automáticamente
        List<Notificacion> lista = dao.listarPorUsuario(actual.getId());
        request.setAttribute("notificaciones", lista);

        request.getRequestDispatcher("/jsp/Notificaciones.jsp").forward(request, response);
    }
}