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
import modelo.FollowerDAO; 

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
            UserDAO uDao = new UserDAO();
            User usuarioCompleto = uDao.obtenerUsuarioPorId(actual.getId());

            PostDAO pDao = new PostDAO();
            List<Post> misPosts = pDao.listarPostsPorUsuario(actual.getId());

            FollowerDAO fDao = new FollowerDAO();
            int seguidores = fDao.contarSeguidores(actual.getId());
            int siguiendo = fDao.contarSiguiendo(actual.getId());

            request.setAttribute("usuario", usuarioCompleto);
            request.setAttribute("misPosts", misPosts);
            request.setAttribute("seguidoresCount", seguidores);
            request.setAttribute("siguiendoCount", siguiendo);

            request.getRequestDispatcher("/jsp/MiPerfil.jsp").forward(request, response);

        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
        }
    }
}