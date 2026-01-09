package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import modelo.EventoDAO;

@WebServlet("/EliminarEventoServlet")
public class EliminarEventoServlet extends HttpServlet {
    
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Obtener el ID del evento desde el formulario oculto
        String idStr = request.getParameter("eventoId");
        
        if (idStr != null) {
            try {
                int id = Integer.parseInt(idStr);
                EventoDAO dao = new EventoDAO();
                
                // 2. Ejecutar el borrado en la BBDD
                dao.eliminar(id);
                
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }
        
        // 3. Redirigir de vuelta al perfil para ver los cambios
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}