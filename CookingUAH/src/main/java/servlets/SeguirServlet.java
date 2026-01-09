package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import modelo.User;
import modelo.UserDAO;

@WebServlet("/SeguirServlet")
public class SeguirServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener usuario de la sesión (el que da "click" en seguir)
        User usuarioLogueado = (User) request.getSession().getAttribute("usuario");
        
        // 2. Obtener el ID del usuario al que queremos seguir
        String idSeguidoStr = request.getParameter("idSeguido");

        if (usuarioLogueado != null && idSeguidoStr != null) {
            try {
                int idSeguido = Integer.parseInt(idSeguidoStr);
                UserDAO dao = new UserDAO();
                
                // Evitar que un usuario se siga a sí mismo
                if (usuarioLogueado.getId() != idSeguido) {
                    dao.seguir(usuarioLogueado.getId(), idSeguido);
                }
            } catch (SQLException | NumberFormatException e) {
                e.printStackTrace(); // Log del error
            }
        }

        // 3. Redirigir de vuelta al perfil del usuario o a la lista
        // Usamos el 'referer' para volver a la misma página donde estábamos
        String origin = request.getHeader("referer");
        response.sendRedirect(origin != null ? origin : request.getContextPath() + "/EventosServlet");
    }
    @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) 
        throws ServletException, IOException {
    // Si alguien intenta entrar por URL (GET), lo mandamos al Feed
    response.sendRedirect(request.getContextPath() + "/FeedServlet");
}
}
