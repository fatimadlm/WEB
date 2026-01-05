package servlets;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.PostDAO;
import modelo.User;

@WebServlet(name = "InteraccionServlet", urlPatterns = {"/InteraccionServlet"})
public class InteraccionServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession();
        User usuario = (User) session.getAttribute("usuario");
        if (usuario == null) return;

        String accion = request.getParameter("accion"); // "like" o "comentar"
        int postId = Integer.parseInt(request.getParameter("postId"));
        PostDAO dao = new PostDAO();

        if ("like".equals(accion)) {
            dao.toggleLike(usuario.getId(), postId);
        } else if ("comentar".equals(accion)) {
            String texto = request.getParameter("comentario");
            if (texto != null && !texto.trim().isEmpty()) {
                dao.comentar(usuario.getId(), postId, texto);
            }
        }
        // Recargar la página para ver cambios
response.sendRedirect(request.getContextPath() + "/FeedServlet");    }
}