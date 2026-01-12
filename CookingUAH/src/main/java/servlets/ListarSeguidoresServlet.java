
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import modelo.User;
import modelo.UserDAO;


@WebServlet("/ListarSeguidoresServlet")
public class ListarSeguidoresServlet extends HttpServlet {
   @Override
protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    String userIdParam = request.getParameter("userId");
    String tipo = request.getParameter("tipo");

    if (userIdParam == null || tipo == null) {
        response.sendError(HttpServletResponse.SC_BAD_REQUEST);
        return;
    }

    try {
        int userId = Integer.parseInt(userIdParam);
        UserDAO uDao = new UserDAO();
        
        // Obtenemos la lista según el tipo (Seguidores/Siguiendo)
        List<User> lista = "seguidores".equals(tipo) ? 
                           uDao.obtenerSeguidores(userId) : 
                           uDao.obtenerSiguiendo(userId);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < lista.size(); i++) {
            User u = lista.get(i);
            json.append("{")
                .append("\"id\":").append(u.getId()).append(",")
                .append("\"username\":\"").append(u.getUsername()).append("\",")
                .append("\"avatar\":\"").append(u.getAvatar()).append("\"")
                .append("}");
            if (i < lista.size() - 1) json.append(",");
        }
        json.append("]");

        response.getWriter().write(json.toString());
    } catch (Exception e) {
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
}
}
