package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "SeguirServlet", urlPatterns = {"/SeguirServlet"})
public class SeguirServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User usuarioLogueado = (session != null) ? (User) session.getAttribute("usuario") : null;
        String idSeguidoStr = request.getParameter("id");

        if (usuarioLogueado != null && idSeguidoStr != null) {
            int idSeguido = Integer.parseInt(idSeguidoStr);
            
            // Evitar seguirse a sí mismo
            if (usuarioLogueado.getId() != idSeguido) {
                try {
                    UserDAO dao = new UserDAO();
                    dao.seguir(usuarioLogueado.getId(), idSeguido);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        // Redirige a la página de donde venía el usuario
        response.sendRedirect(request.getHeader("referer"));
    }
}