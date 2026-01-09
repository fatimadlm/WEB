package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import modelo.Evento;
import modelo.EventoDAO;

@WebServlet("/EditarEventoServlet")
public class ModificarEventoServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        try {
            // 1. Recoger parámetros del formulario del modal
            int id = Integer.parseInt(request.getParameter("eventoId"));
            String titulo = request.getParameter("titulo");
            String fechaStr = request.getParameter("fecha");
            String horaStr = request.getParameter("hora");

            // 2. Crear objeto con los nuevos datos
            // Añadimos ":00" a la hora si viene en formato HH:mm para que Time.valueOf no falle
            if (horaStr.length() == 5) horaStr += ":00";
            
            Evento eventoEditado = new Evento();
            eventoEditado.setId(id);
            eventoEditado.setTitle(titulo);
            eventoEditado.setEventDate(Date.valueOf(fechaStr));
            eventoEditado.setEventTime(Time.valueOf(horaStr));

            // 3. Actualizar en la base de datos
            EventoDAO dao = new EventoDAO();
            dao.actualizar(eventoEditado);

        } catch (Exception e) {
            e.printStackTrace();
        }

        // 4. Volver al perfil
        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}