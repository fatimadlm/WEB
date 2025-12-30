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
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User usuario = (User) session.getAttribute("usuario");

        // Seguridad: Si no hay usuario, al login
        if (usuario == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        // Cargar Posts
        PostDAO dao = new PostDAO();
        List<Post> listaPosts = dao.obtenerFeed(usuario.getId());
        
        // Pasamos la lista al JSP
        request.setAttribute("listaPosts", listaPosts);
        
        // Abrimos la página
        request.getRequestDispatcher("Home.jsp").forward(request, response);
    }
}