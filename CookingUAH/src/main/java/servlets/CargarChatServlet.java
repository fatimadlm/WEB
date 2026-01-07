package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.MensajeDAO;
import modelo.User;

@WebServlet(name = "CargarChatServlet", urlPatterns = {"/CargarChatServlet"})
public class CargarChatServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        
        if (actual != null) {
            MensajeDAO dao = new MensajeDAO();
            
            // 1. Cargar lista de contactos (Lo que ya tenías)
            request.setAttribute("listaContactos", dao.listarContactos(actual.getId()));

            // 2. NUEVO: Calcular mensajes NO leídos totales para el menú lateral
            // (Reutilizamos el mismo DAO que ya creamos arriba)
            int totalNoLeidos = dao.contarNoLeidosTotales(actual.getId());
            request.setAttribute("totalNoLeidos", totalNoLeidos);

            request.getRequestDispatcher("/jsp/Mensajes.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
        }
    }
}