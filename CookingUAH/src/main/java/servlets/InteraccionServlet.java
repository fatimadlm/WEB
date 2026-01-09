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
        if (usuario == null) return; // O enviar error 401

        String accion = request.getParameter("accion");
        
        // --- CASO 1: LIKE (AJAX - Sin recarga) ---
        if ("like".equals(accion)) {
            int postId = Integer.parseInt(request.getParameter("postId"));
            PostDAO dao = new PostDAO();
            
            // 1. Hacemos el cambio en la BBDD
            dao.toggleLike(usuario.getId(), postId);
            
            // 2. Obtenemos el nuevo número de likes REAL de la BBDD
            int nuevosLikes = dao.contarLikes(postId); // ¡Necesitamos crear este método rápido en DAO!
            
            // 3. Respondemos al JavaScript con el número nuevo
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"likes\": " + nuevosLikes + "}");
            return; // ¡Importante! Cortamos aquí para no redirigir.
        } 
        
        // --- CASO 2: COMENTARIOS (Formulario normal - Con recarga y scroll) ---
        else if ("comentar".equals(accion)) {
            int postId = Integer.parseInt(request.getParameter("postId"));
            String texto = request.getParameter("comentario");
            
            if (texto != null && !texto.trim().isEmpty()) {
                PostDAO dao = new PostDAO();
                dao.comentar(usuario.getId(), postId, texto);
            }
            // Redirigir al ancla para bajar scroll
            response.sendRedirect(request.getContextPath() + "/FeedServlet#post-" + postId);
        }
    }
}