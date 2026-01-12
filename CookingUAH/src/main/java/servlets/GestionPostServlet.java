
package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.User;
import modelo.PostDAO;

/**
 * Servlet controlador encargado de gestionar las acciones administrativas sobre 
 * las publicaciones y comentarios, tales como la eliminación definitiva.
 */
@WebServlet(name = "GestionPostServlet", urlPatterns = {"/GestionPostServlet"})
public class GestionPostServlet extends HttpServlet {

    /**
     * Procesa las peticiones GET para eliminar publicaciones o comentarios.
     * Implementa verificaciones de seguridad para asegurar que solo un administrador realice la acción.
     * @param request Objeto que contiene los parámetros 'id' y 'accion' (y opcionalmente 'idComentario').
     * @param response Objeto para gestionar la redirección tras la operación.
     * @throws ServletException si ocurre un error interno en el servlet.
     * @throws IOException si ocurre un error de entrada/salida.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Configuración de cabeceras de caché para seguridad
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);

        // 2. Validación de sesión y rol de administrador
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null || !"admin".equalsIgnoreCase(actual.getRole())) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }

        // 3. Captura de parámetros de la URL
        String idParam = request.getParameter("id");
        String accion = request.getParameter("accion");

        if (idParam != null && accion != null) {
            try {
                int id = Integer.parseInt(idParam);
                PostDAO pDao = new PostDAO(); 

                // 4. Ejecución de la lógica según la acción solicitada
                if ("eliminar".equalsIgnoreCase(accion)) {
                    pDao.eliminarPostAdmin(id);
                } else if ("eliminarComentario".equalsIgnoreCase(accion)) {
 
                    pDao.eliminarComentario(id);
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }

        // 5. Redirección al controlador principal de administración para refrescar la vista
        response.sendRedirect(request.getContextPath() + "/AdminServlet");
    }

    /**
     * Redirige las peticiones POST al método doGet para centralizar la lógica.
     * @param request Objeto con la petición del cliente.
     * @param response Objeto con la respuesta del servlet.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}
