package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.PostDAO;
import modelo.NotificacionDAO;
import modelo.User;

@WebServlet(name = "InteraccionServlet", urlPatterns = {"/InteraccionServlet"})
public class InteraccionServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User usuario = (session != null) ? (User) session.getAttribute("usuario") : null;
        
        // Si no hay usuario, no permitimos la interacción
        if (usuario == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        String accion = request.getParameter("accion");
        String postIdStr = request.getParameter("postId");
        
        if (postIdStr == null || accion == null) return;
        
        int postId = Integer.parseInt(postIdStr);
        PostDAO postDao = new PostDAO();
        NotificacionDAO notifDao = new NotificacionDAO();

        // Configuramos la respuesta como JSON
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            if ("like".equals(accion)) {
                // 1. Alternar el Like en la BBDD
                postDao.toggleLike(usuario.getId(), postId);
                
                // 2. Lógica de Notificación
                int autorId = postDao.getAutorId(postId); // Método que añadimos antes
                if (autorId != usuario.getId()) { // No notificarse a uno mismo
                    notifDao.crear(autorId, "@" + usuario.getUsername() + " le ha dado me gusta a tu receta.", "LIKE");
                }

                // 3. Devolver respuesta para AJAX
                int nuevosLikes = postDao.contarLikes(postId);
                response.getWriter().write("{\"status\":\"ok\", \"likes\": " + nuevosLikes + "}");

            } else if ("comentar".equals(accion)) {
                String contenido = request.getParameter("comentario");
                
                if (contenido != null && !contenido.trim().isEmpty()) {
                    // 1. Guardar comentario
                    postDao.comentar(usuario.getId(), postId, contenido);
                    
                    // 2. Notificar al autor del post
                    int autorId = postDao.getAutorId(postId);
                    if (autorId != usuario.getId()) {
                        notifDao.crear(autorId, "@" + usuario.getUsername() + " ha comentado en tu publicación.", "COMMENT");
                    }

                    // 3. Devolver JSON con los datos del nuevo comentario
                    String textoLimpio = contenido.replace("\"", "\\\"").replace("\n", " ");
                    String jsonResponse = String.format(
                        "{\"status\":\"ok\", \"author\":\"%s\", \"content\":\"%s\"}", 
                        usuario.getUsername(), textoLimpio
                    );
                    response.getWriter().write(jsonResponse);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"status\":\"error\"}");
        }
    }
}
