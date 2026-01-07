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
import modelo.MensajeDAO; // Asegúrate de importar esto
import modelo.User;

@WebServlet(name = "MensajesServlet", urlPatterns = {"/MensajesServlet"})
public class MensajesServlet extends HttpServlet {
    
    // doGet para CARGAR mensajes y ESTADO
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        if (actual == null) return;

        MensajeDAO dao = new MensajeDAO();
        String accion = request.getParameter("accion");

        // --- MODO "ESTADO" (Para el icono rojo del menú) ---
        if ("estado".equals(accion)) {
            response.setContentType("application/json"); 
            response.setCharacterEncoding("UTF-8");
            
            int total = dao.contarNoLeidosTotales(actual.getId());
            List<Integer> ids = dao.obtenerIdsRemitentesNoLeidos(actual.getId());
            
            StringBuilder json = new StringBuilder();
            json.append("{");
            json.append("\"total\":").append(total).append(",");
            json.append("\"ids\":").append(ids.toString()); 
            json.append("}");
            
            response.getWriter().write(json.toString());
            return; 
        }

        // --- MODO "CARGAR CHAT" (HTML) ---
        if (request.getParameter("conWho") != null) {
            int otroUsuarioId = Integer.parseInt(request.getParameter("conWho"));
            
            // ¡¡ESTA ES LA LÍNEA QUE FALTABA!! 
            // Sin esto, la base de datos nunca se entera de que has leído el mensaje.
            dao.marcarComoLeidos(actual.getId(), otroUsuarioId);

            // Ahora sí, cargamos la conversación
            List<Mensaje> conversacion = dao.obtenerConversacion(actual.getId(), otroUsuarioId);

            response.setContentType("text/html;charset=UTF-8");
            PrintWriter out = response.getWriter();

            for (Mensaje m : conversacion) {
                String claseCss = (m.getSenderId() == actual.getId()) ? "sent" : "received";
                out.println("<div class='chat-bubble " + claseCss + "'>");
                out.println("  <p>" + m.getContent() + "</p>");
                out.println("</div>");
            }
        }
    }

    // doPost para ENVIAR mensajes
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        if (actual == null) return;

        int receptorId = Integer.parseInt(request.getParameter("receptorId"));
        String contenido = request.getParameter("contenido");

        MensajeDAO dao = new MensajeDAO();
        dao.enviarMensaje(actual.getId(), receptorId, contenido);
    }
}