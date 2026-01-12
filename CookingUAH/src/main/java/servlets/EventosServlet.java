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
import modelo.MensajeDAO;
import modelo.User;

@WebServlet("/EventosServlet")
public class EventosServlet extends HttpServlet {
    
    /**
     * Se ejecuta al cargar la página de eventos.
     * Recupera eventos Y cuenta notificaciones para el sidebar.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        // 1. Configuración de codificación
        request.setCharacterEncoding("UTF-8");
        response.setCharacterEncoding("UTF-8");

        // 2. Validación de seguridad y obtención de usuario
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }
        
        // 3. Obtener la lista de eventos (Lógica original)
        EventoDAO dao = new EventoDAO();
        List<Evento> lista = dao.listarTodos();
        request.setAttribute("listaEventos", lista);
        
        // 4. Contador de mensajes instantáneos para que salga en la sidebar al instante
        MensajeDAO msgDao = new MensajeDAO();
        int totalNoLeidos = msgDao.contarNoLeidosTotales(actual.getId());
        request.setAttribute("totalNoLeidos", totalNoLeidos);
        // -----------------------------------------------------------------
        
        // 5. Redirigir a la vista
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
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        // Solo permitir crear si el usuario está logueado
        if (actual != null) {
            try {
                // 1. Recuperar los parámetros del formulario
                String titulo = request.getParameter("titulo");
                String fechaStr = request.getParameter("fecha");
                String horaStr = request.getParameter("hora");
                String tipo = request.getParameter("tipo");

                // 2. Formatear y convertir datos para SQL
                Date fecha = Date.valueOf(fechaStr);
                
                // Si la hora viene como HH:mm, añadimos segundos para java.sql.Time
                if (horaStr != null && horaStr.length() == 5) {
                    horaStr += ":00";
                }
                Time hora = Time.valueOf(horaStr);

                // 3. Crear el objeto Evento
                Evento nuevoEvento = new Evento(actual.getId(), titulo, fecha, hora, tipo);

                // 4. Guardar en BBDD
                EventoDAO dao = new EventoDAO();
                boolean exito = dao.crear(nuevoEvento);
                
                if (exito) {
                    request.getSession().setAttribute("mensaje", "Evento creado correctamente");
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        
        // 5. Redirigir de vuelta al propio servlet para refrescar
        response.sendRedirect(request.getContextPath() + "/EventosServlet");
    }
}