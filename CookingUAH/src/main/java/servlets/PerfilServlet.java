package servlets;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import modelo.User;
import modelo.UserDAO;
import modelo.Post;
import modelo.PostDAO;
import modelo.Evento;
import modelo.EventoDAO;
import modelo.MensajeDAO;

@WebServlet(name = "PerfilServlet", urlPatterns = {"/PerfilServlet"})
public class PerfilServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        try {
            // 1. Obtener datos actualizados del usuario
            UserDAO uDao = new UserDAO();
            User usuarioCompleto = uDao.obtenerUsuarioPorId(actual.getId());

            // 2. Obtener publicaciones del usuario
            PostDAO pDao = new PostDAO();
            List<Post> misPosts = pDao.listarPostsPorUsuario(actual.getId());

            // 3. Obtener eventos creados por el usuario
            EventoDAO eDao = new EventoDAO();
            // Nota: Si aún no tienes EventoDAO implementado, comenta la siguiente línea para evitar errores
            List<Evento> misEventos = eDao.listarPorUsuario(actual.getId());

            // 4. Estadísticas de seguimiento
            int seguidores = uDao.contarSeguidores(actual.getId());
            int siguiendo = uDao.contarSiguiendo(actual.getId());

            // 5. Contador de mensajes instantáneos para que salga en la sidebar al instante
            MensajeDAO msgDao = new MensajeDAO();
            int totalNoLeidos = msgDao.contarNoLeidosTotales(actual.getId());
            request.setAttribute("totalNoLeidos", totalNoLeidos);

            // 6. Pasar datos al JSP
            request.setAttribute("usuario", usuarioCompleto);
            request.setAttribute("misPosts", misPosts);
            request.setAttribute("misEventos", misEventos); 
            request.setAttribute("seguidoresCount", seguidores);
            request.setAttribute("siguiendoCount", siguiendo);

            request.getRequestDispatcher("/jsp/MiPerfil.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            // Si falla algo grave, redirigimos al Feed para no mostrar pantalla de error
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
        }
    }
}