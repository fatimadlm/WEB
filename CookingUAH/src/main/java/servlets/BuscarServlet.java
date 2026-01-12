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

/**
 * Servlet que gestiona la búsqueda de usuarios para la red social.
 * Implementa un filtro de seguridad para excluir a los administradores de los resultados,
 * asegurando que las cuentas de gestión no sean visibles en la búsqueda pública.
 */
@WebServlet(name = "BuscarServlet", urlPatterns = {"/BuscarServlet"})
public class BuscarServlet extends HttpServlet {
    
    /**
     * Procesa la petición GET de búsqueda, recupera los usuarios del DAO y
     * aplica un filtrado por rol antes de enviar los resultados a BuscaAmigos.jsp.
     * @param request Objeto que contiene el parámetro 'busqueda'.
     * @param response Objeto para redirigir o reenviar la petición.
     * @throws ServletException si ocurre un error específico del servlet.
     * @throws IOException si ocurre un error de entrada/salida.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        
        //1. Codificacion UTF-8 (para ñ y tildes)
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

        // 4. Preparación de datos para la Vista. Guardamos los resultados en el request para enviarlos al JSP
        request.setAttribute("resultadosBusqueda", listaResultados);
        request.setAttribute ("terminoBusqueda", textoBusqueda);

        // 5. Envío a la página de resultados
        request.getRequestDispatcher("/jsp/BuscaAmigos.jsp").forward(request, response);
    }
}