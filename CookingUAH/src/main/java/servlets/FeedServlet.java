package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import modelo.MensajeDAO; 
import modelo.Post;
import modelo.PostDAO;
import modelo.User;

@WebServlet(name = "FeedServlet", urlPatterns = {"/FeedServlet"})
public class FeedServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (usuario == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        try {
            // 1. Cargar Posts (Lo que ya tenías)
            PostDAO dao = new PostDAO();
            List<Post> listaPosts = dao.obtenerFeed(usuario.getId());
            request.setAttribute("listaPosts", listaPosts);

            // 2. NUEVO: Calcular mensajes NO leídos para el menú lateral
            MensajeDAO msgDao = new MensajeDAO();
            int totalNoLeidos = msgDao.contarNoLeidosTotales(usuario.getId());
            request.setAttribute("totalNoLeidos", totalNoLeidos); // Pasamos el dato al JSP
            
            // 3. Ir a Home.jsp
            request.getRequestDispatcher("/jsp/Home.jsp").forward(request, response);
            
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar el feed.");
        }
    }
}