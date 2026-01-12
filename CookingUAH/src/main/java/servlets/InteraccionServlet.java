package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import modelo.PostDAO;
import modelo.NotificacionDAO;
import modelo.User;

@WebServlet(name = "InteraccionServlet", urlPatterns = {"/InteraccionServlet"})
@MultipartConfig(
    fileSizeThreshold = 1024 * 1024, // 1MB
    maxFileSize = 1024 * 1024 * 5,    // 5MB
    maxRequestSize = 1024 * 1024 * 10 // 10MB
)
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
        
        PostDAO postDao = new PostDAO();
        NotificacionDAO notifDao = new NotificacionDAO();

        try {
            if ("like".equals(accion)) {
                manejarLike(request, response, usuario, postDao, notifDao);
            } 
            else if ("comentar".equals(accion)) {
                manejarComentario(request, response, usuario, postDao, notifDao);
            } 
            else if ("eliminar".equals(accion)) {
                int postId = Integer.parseInt(postIdStr);
                // Solo permitimos eliminar si el post pertenece al usuario
                boolean ok = postDao.eliminarPost(postId, usuario.getId());
                response.sendRedirect(request.getContextPath() + "/PerfilServlet"); // [cite: 1015]
            } 
            else if ("editar".equals(accion)) {
                int postId = Integer.parseInt(postIdStr);
                String nuevoTitulo = request.getParameter("titulo");
                
                // Lógica de imagen similar a vuestro EditarPerfilServlet
                Part filePart = request.getPart("imagen");
                String rutaImagen = null;

                if (filePart != null && filePart.getSize() > 0) {
                    String fileName = usuario.getId() + "_edit_" + Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
                    String uploadPath = getServletContext().getRealPath("") + File.separator + "Imagenes";
                    filePart.write(uploadPath + File.separator + fileName);
                    rutaImagen = "Imagenes/" + fileName;
                }
                // Llamada al método en PostDAO (vuestra versión corregida)
                boolean ok = postDao.actualizarPost(postId, nuevoTitulo, rutaImagen, usuario.getId());

                if (ok) {
                    response.setContentType("application/json");
                    // Devolvemos el nuevo título y la imagen (si cambió) para actualizar el DOM
                    String jsonResponse = String.format(
                        "{\"status\":\"ok\", \"title\":\"%s\", \"image\":\"%s\"}",
                        nuevoTitulo.replace("\"", "\\\""), 
                        (rutaImagen != null ? rutaImagen : "")
                    );
                    response.getWriter().write(jsonResponse);
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp); 
    }
    
    
    
    // Métodos auxiliares para mantener el doPost limpio
    private void manejarLike(HttpServletRequest request, HttpServletResponse response, User usuario, PostDAO postDao, NotificacionDAO notifDao) throws IOException {
        int postId = Integer.parseInt(request.getParameter("postId"));
        postDao.toggleLike(usuario.getId(), postId);
        
        int autorId = postDao.getAutorId(postId);
        if (autorId != usuario.getId()) {
            notifDao.crear(autorId, "@" + usuario.getUsername() + " le ha dado me gusta a tu receta.", "LIKE");
        }

        int nuevosLikes = postDao.contarLikes(postId);
        response.setContentType("application/json");
        response.getWriter().write("{\"status\":\"ok\", \"likes\": " + nuevosLikes + "}");
    }

    private void manejarComentario(HttpServletRequest request, HttpServletResponse response, User usuario, PostDAO postDao, NotificacionDAO notifDao) throws IOException {
        int postId = Integer.parseInt(request.getParameter("postId"));
        String contenido = request.getParameter("comentario");
        
        if (contenido != null && !contenido.trim().isEmpty()) {
            postDao.comentar(usuario.getId(), postId, contenido);
            int autorId = postDao.getAutorId(postId);
            if (autorId != usuario.getId()) {
                notifDao.crear(autorId, "@" + usuario.getUsername() + " ha comentado en tu publicación.", "COMMENT");
            }
            response.setContentType("application/json");
            String textoLimpio = contenido.replace("\"", "\\\"").replace("\n", " ");
            response.getWriter().write(String.format("{\"status\":\"ok\", \"author\":\"%s\", \"content\":\"%s\"}", usuario.getUsername(), textoLimpio));
        }
    }
}
