package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import modelo.MensajeDAO;
import modelo.Notificacion;
import modelo.NotificacionDAO;
import modelo.User;

@WebServlet(name = "NotificacionesServlet", urlPatterns = {"/NotificacionesServlet"})
public class NotificacionesServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Configuración de codificación
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        try {
            // 2. Cargar la lista de notificaciones (Tu lógica original)
            NotificacionDAO dao = new NotificacionDAO();
            List<Notificacion> lista = dao.listarPorUsuario(actual.getId());
            request.setAttribute("notificaciones", lista);

            // 3. Contador de mensajes instantáneos para que salga en la sidebar al instantea
            MensajeDAO msgDao = new MensajeDAO();
            int totalNoLeidos = msgDao.contarNoLeidosTotales(actual.getId());
            request.setAttribute("totalNoLeidos", totalNoLeidos);

            // 4. Enviar al JSP
            request.getRequestDispatcher("/jsp/Notificaciones.jsp").forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
        }
    }
}