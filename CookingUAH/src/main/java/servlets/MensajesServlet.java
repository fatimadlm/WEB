package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.util.List;
import modelo.Mensaje;
import modelo.MensajeDAO;
import modelo.User;

@WebServlet(name = "MensajesServlet", urlPatterns = {"/MensajesServlet"})
public class MensajesServlet extends HttpServlet {
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        request.setCharacterEncoding("UTF-8");
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        if (actual == null) return;

        MensajeDAO dao = new MensajeDAO();
        String accion = request.getParameter("accion");


        if ("estado".equals(accion)) {
            response.setContentType("application/json"); 
            response.setCharacterEncoding("UTF-8");
            
            int total = dao.contarNoLeidosTotales(actual.getId());
            List<Integer> ids = dao.obtenerIdsRemitentesNoLeidos(actual.getId());
            
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"total\":").append(total).append(",");
            

            json.append("\"ids\":").append(ids.toString()).append(","); 

            json.append("\"updates\":[");
            for (int i = 0; i < ids.size(); i++) {
                int id = ids.get(i);
                String txt = dao.obtenerUltimoMensaje(actual.getId(), id);
                // Limpieza de caracteres para no romper el JSON
                if (txt == null) txt = "";
                txt = txt.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ");
                
                json.append("{");
                json.append("\"id\":").append(id).append(",");
                json.append("\"text\":\"").append(txt).append("\"");
                json.append("}");
                
                if (i < ids.size() - 1) json.append(",");
            }
            json.append("]");
            json.append("}");
            
            response.getWriter().write(json.toString());
            return; 
        }

        // --- MODO "CARGAR CHAT" ---
        if (request.getParameter("conWho") != null) {
            int otroUsuarioId = Integer.parseInt(request.getParameter("conWho"));
            
            // Marcar como leídos
            dao.marcarComoLeidos(actual.getId(), otroUsuarioId);

            List<Mensaje> conversacion = dao.obtenerConversacion(actual.getId(), otroUsuarioId);

            response.setContentType("text/html;charset=UTF-8");
            PrintWriter out = response.getWriter();

            String fechaAnterior = ""; // Para controlar cuándo cambia el día

            for (Mensaje m : conversacion) {
                // 1. CONTROL DE FECHAS (SEPARADOR)
                String fechaActual = m.getFechaSolo(); // "2025-10-20"
                
                // Si cambiamos de día, pintamos la barrita de fecha
                if (!fechaActual.equals(fechaAnterior)) {
                    out.println("<div class='chat-date-separator'>");
                    out.println("  <span>" + m.getFechaBonita() + "</span>");
                    out.println("</div>");
                    fechaAnterior = fechaActual;
                }

                // 2. BURBUJA DEL MENSAJE
                String claseCss = (m.getSenderId() == actual.getId()) ? "sent" : "received";
                out.println("<div class='chat-bubble " + claseCss + "'>");
                out.println("  <p>" + m.getContent() + "</p>");
                
                // 3. HORA DEL MENSAJE (NUEVO)
                out.println("  <span class='chat-time'>" + m.getHoraFormateada() + "</span>");
                
                out.println("</div>");
            }
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        request.setCharacterEncoding("UTF-8");
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        if (actual == null) return;

        int receptorId = Integer.parseInt(request.getParameter("receptorId"));
        String contenido = request.getParameter("contenido");

        MensajeDAO dao = new MensajeDAO();
        dao.enviarMensaje(actual.getId(), receptorId, contenido);
    }
}
