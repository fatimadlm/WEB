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

        String accion = request.getParameter("accion");
        int postId = Integer.parseInt(request.getParameter("postId"));
        PostDAO dao = new PostDAO();
        
        // Preparamos la respuesta JSON común
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        // --- CASO 1: LIKE (AJAX) ---
        if ("like".equals(accion)) {
            dao.toggleLike(usuario.getId(), postId);
            // AQUÍ IRÍA LA NOTIFICACIÓN DE LIKE
            // notificacionesDao.notificarLike(...)
            
            int nuevosLikes = dao.contarLikes(postId);
            response.getWriter().write("{\"status\":\"ok\", \"likes\": " + nuevosLikes + "}");
        } 
        
        // --- CASO 2: COMENTARIOS (AHORA TAMBIÉN AJAX) ---
        else if ("comentar".equals(accion)) {
            String texto = request.getParameter("comentario");
            
            if (texto != null && !texto.trim().isEmpty()) {
                // 1. Guardar en Base de Datos
                dao.comentar(usuario.getId(), postId, texto);
                
                // AQUÍ IRÍA LA NOTIFICACIÓN DE COMENTARIO
                // notificacionesDao.notificarComentario(...)

                // 2. Limpiamos el texto para no romper el JSON (evitar comillas locas)
                String textoLimpio = texto.replace("\"", "\\\"").replace("\n", " ");
                
                // 3. Devolvemos los datos para pintarlos al instante
                // Devolvemos el nombre del usuario actual porque es quien acaba de comentar
                String jsonResponse = String.format("{\"status\":\"ok\", \"author\":\"%s\", \"content\":\"%s\"}", 
                        usuario.getUsername(), textoLimpio);
                
                response.getWriter().write(jsonResponse);
            }
        }
    }
}