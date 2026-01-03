package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.util.List;
import modelo.Post;
import modelo.PostDAO;
import modelo.User;

@WebServlet(name = "FeedServlet", urlPatterns = {"/FeedServlet"})
public class FeedServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. SEGURIDAD: Intentamos obtener la sesión actual sin crear una nueva
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;

        // Si el usuario no está logueado, redirigir al login usando el Context Path
        if (usuario == null) {
            // CORRECCIÓN: Usar getContextPath() para evitar errores 404 en la redirección
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        // 2. CARGA DE DATOS: Obtener los posts desde la BBDD
        try {
            PostDAO dao = new PostDAO();
            List<Post> listaPosts = dao.obtenerFeed(usuario.getId());
            
            // Pasamos la lista al request para que el JSP (Home.jsp) la recorra con JSTL
            request.setAttribute("listaPosts", listaPosts);
            
            // 3. NAVEGACIÓN: Ir a la página Home.jsp
            // CORRECCIÓN: La barra "/" inicial indica que busque desde la raíz de la carpeta web
            request.getRequestDispatcher("/jsp/Home.jsp").forward(request, response);
            
        } catch (Exception e) {
            // En caso de error de base de datos, lo imprimimos en consola para depurar
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error al cargar el feed.");
        }
    }
}