package servlets;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modelo.Post;
import modelo.PostDAO;
import modelo.User;
import modelo.UserDAO;

@WebServlet("/PerfilOtroServlet")
public class PerfilOtroServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        // Obtenemos el usuario logueado
        User actual = (User) request.getSession().getAttribute("usuario");
        
        // Seguridad básica
        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        // Obtener el ID que queremos visitar
        String idParam = request.getParameter("id");
        if (idParam == null || idParam.isEmpty()) {
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
            return;
        }
        
        int targetId = Integer.parseInt(idParam);

        // Si el ID que intentas visitar es TU propio ID...
        if (targetId == actual.getId()) {
            // ...te mandamos internamente a tu servlet de "Mi Perfil"
            request.getRequestDispatcher("/PerfilServlet").forward(request, response);
            return; 
        }

        // 1. Obtener datos del perfil ajeno (Si no eres tú)
        UserDAO uDao = new UserDAO();
        User perfil = uDao.obtenerUsuarioPorId(targetId);
        
        // Si el usuario no existe, volvemos al feed
        if (perfil == null) {
            response.sendRedirect(request.getContextPath() + "/FeedServlet");
            return;
        }
        
        // 2. Obtener posts del usuario
        PostDAO pDao = new PostDAO();
        List<Post> posts = pDao.listarPostsPorUsuario(targetId);
        
        // 3. Comprobar relación de seguimiento
        boolean esSeguido = uDao.comprobarSeguimiento(actual.getId(), targetId);
        
        // 4. Calcular estadísticas
        int seguidores = uDao.contarSeguidores(targetId);
        int siguiendo = uDao.contarSiguiendo(targetId);
        
        // 5. Enviar atributos al JSP
        request.setAttribute("perfil", perfil);
        request.setAttribute("posts", posts);
        request.setAttribute("esSeguido", esSeguido);
        request.setAttribute("seguidoresCount", seguidores);
        request.setAttribute("siguiendoCount", siguiendo);

        request.getRequestDispatcher("/jsp/PerfilOtro.jsp").forward(request, response);
    }
}