package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.Date;
import java.sql.Time;
import java.util.List;
import modelo.Evento;
import modelo.EventoDAO;
import modelo.User;

@WebServlet("/EventosServlet")
public class EventosServlet extends HttpServlet {
    
    // ESTO SE EJECUTA AL ENTRAR EN LA PÁGINA
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        EventoDAO dao = new EventoDAO();
        List<Evento> lista = dao.listarTodos(); // Método que hace el SELECT
        
        // Guardamos la lista para que el JSP la vea
        request.setAttribute("listaEventos", lista);
        
        // Enviamos al usuario al JSP
        request.getRequestDispatcher("/jsp/Eventos.jsp").forward(request, response);
    }

    // ESTO SE EJECUTA AL DARLE A "AÑADIR EVENTO"
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Recoger datos del formulario
        String titulo = request.getParameter("titulo");
        String fecha = request.getParameter("fecha");
        String hora = request.getParameter("hora");
        User usuario = (User) request.getSession().getAttribute("usuario");

        // 2. Guardar en BBDD
        Evento nuevo = new Evento(usuario.getId(), titulo, Date.valueOf(fecha), Time.valueOf(hora + ":00"), "TALLER");
        new EventoDAO().crear(nuevo);

        // 3. Volver a cargar la página para ver el nuevo evento
        response.sendRedirect(request.getContextPath() + "/EventosServlet");
    }
}