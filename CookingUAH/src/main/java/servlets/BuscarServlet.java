package servlets;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.stream.Collectors;
import modelo.User;
import modelo.UserDAO;
import modelo.MensajeDAO;

/**
 * Servlet que gestiona la búsqueda de usuarios para la red social.
 * Implementa un filtro de seguridad para excluir a los administradores.
 */
@WebServlet(name = "BuscarServlet", urlPatterns = {"/BuscarServlet"})
public class BuscarServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Forzar codificación UTF-8 (para ñ y tildes)
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");
        
        // 2. Verificación de sesión
        HttpSession session = request.getSession();
        User usuarioLogueado = (User) session.getAttribute("usuario");
        
        if (usuarioLogueado == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp"); 
            return;
        }

        // 3. Obtención del término de búsqueda
        String textoBusqueda = request.getParameter("busqueda");

        // 4. Consulta al Modelo (UserDAO)
        UserDAO dao = new UserDAO();
        List<User> listaResultados = null;

        if (textoBusqueda != null && !textoBusqueda.trim().isEmpty()) {
            // Obtenemos los usuarios que coinciden con el nombre
            List<User> resultadosBrutos = dao.buscarUsuarios(textoBusqueda);
            
            if (resultadosBrutos != null) {
                // FILTRADO: Excluimos a cualquier usuario cuyo rol sea 'admin'
                listaResultados = resultadosBrutos.stream()
                    .filter(u -> !"admin".equalsIgnoreCase(u.getRole()))
                    .collect(Collectors.toList());
            }
        }

        // 5. Preparación de datos para la Vista
        request.setAttribute("resultadosBusqueda", listaResultados);
        request.setAttribute("terminoBusqueda", textoBusqueda);

        // 6. Contador de mensajes instantáneos para que salga en la sidebar al instante
        MensajeDAO msgDao = new MensajeDAO();
        int totalNoLeidos = msgDao.contarNoLeidosTotales(usuarioLogueado.getId());
        request.setAttribute("totalNoLeidos", totalNoLeidos);
        
        // 7. Envío a la página de resultados
        request.getRequestDispatcher("/jsp/BuscaAmigos.jsp").forward(request, response);
    }
}