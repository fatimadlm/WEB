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
    
    /**
     * Se ejecuta al cargar la página de eventos.
     * Recupera todos los eventos de la BBDD para mostrarlos en el calendario.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Validación de seguridad: comprobar sesión activa
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("usuario") == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }
        
        // 2. Obtener la lista de eventos desde el DAO
        EventoDAO dao = new EventoDAO();
        List<Evento> lista = dao.listarTodos();
        
        // 3. Pasar la lista al JSP para que el bucle <c:forEach> la procese
        request.setAttribute("listaEventos", lista);
        
        // 4. Redirigir a la vista
        request.getRequestDispatcher("/jsp/Eventos.jsp").forward(request, response);
    }

    /**
     * Se ejecuta al enviar el formulario de "Añadir evento".
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
    
        HttpSession session = request.getSession(false);
        User actual = (User) session.getAttribute("usuario");

        // Solo permitir crear si el usuario está logueado
        if (actual != null) {
            try {
                // 1. Recuperar los parámetros del formulario
                String titulo = request.getParameter("titulo");
                String fechaStr = request.getParameter("fecha");
                String horaStr = request.getParameter("hora");
                String tipo = request.getParameter("tipo"); // Captura el valor del <select>

                // 2. Formatear y convertir datos para SQL
                Date fecha = Date.valueOf(fechaStr);
                
                // Si la hora viene como HH:mm, añadimos segundos para java.sql.Time
                if (horaStr != null && horaStr.length() == 5) {
                    horaStr += ":00";
                }
                Time hora = Time.valueOf(horaStr);

                // 3. Crear el objeto Evento usando el constructor de 5 parámetros
                // El campo 'tipo' es fundamental para los colores del CSS
                Evento nuevoEvento = new Evento(actual.getId(), titulo, fecha, hora, tipo);

                // 4. Guardar en BBDD a través del DAO
                EventoDAO dao = new EventoDAO();
                boolean exito = dao.crear(nuevoEvento);
                
                if (exito) {
                    // Opcional: podrías añadir un mensaje de éxito para el JSP
                    request.getSession().setAttribute("mensaje", "Evento creado correctamente");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        // 5. Redirigir de vuelta al propio servlet (doGet) para refrescar la lista
        response.sendRedirect(request.getContextPath() + "/EventosServlet");
    }
}