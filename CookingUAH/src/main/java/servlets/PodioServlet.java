
package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import modelo.Post;
import modelo.PostDAO;
import modelo.User;
import modelo.MensajeDAO;

/**
 *
 * @author fatim
 */
@WebServlet("/PodioServlet")
public class PodioServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener usuario de la sesión (Necesario para contar SUS mensajes)
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        // Si no hay usuario, mandamos al login (Seguridad básica)
        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        // 2. Obtener los mejores posts
        PostDAO dao = new PostDAO();
        List<Post> topPosts = dao.obtenerTop3(); 
        
        // 3. Contador de mensajes instantáneos para que salga en la sidebar al instante
        MensajeDAO msgDao = new MensajeDAO();
        int totalNoLeidos = msgDao.contarNoLeidosTotales(actual.getId());
        request.setAttribute("totalNoLeidos", totalNoLeidos);
        
        // 4. Enviar a la vista
        request.setAttribute("topPosts", topPosts);
        request.getRequestDispatcher("/jsp/Podio.jsp").forward(request, response);
    }
}
