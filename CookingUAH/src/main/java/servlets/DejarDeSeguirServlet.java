package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.SQLException;
import modelo.User;
import modelo.UserDAO;

@WebServlet("/DejarDeSeguirServlet")
public class DejarDeSeguirServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        User usuarioLogueado = (User) request.getSession().getAttribute("usuario");
        String idSeguidoStr = request.getParameter("idSeguido");

        if (usuarioLogueado != null && idSeguidoStr != null) {
            try {
                int idSeguido = Integer.parseInt(idSeguidoStr);
                UserDAO dao = new UserDAO();
                
                dao.dejarDeSeguir(usuarioLogueado.getId(), idSeguido);
            } catch (SQLException | NumberFormatException e) {
                e.printStackTrace();
            }
        }

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
