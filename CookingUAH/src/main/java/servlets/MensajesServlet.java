/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
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

/**
 *
 * @author fatim
 */
@WebServlet(name = "MensajesServlet", urlPatterns = {"/MensajesServlet"})
public class MensajesServlet extends HttpServlet {
    
    // doGet para CARGAR mensajes (AJAX)
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    HttpSession session = request.getSession(false);
    User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
    if (actual == null) return;

    int receptorId = Integer.parseInt(request.getParameter("conWho"));
    MensajeDAO dao = new MensajeDAO();
    List<Mensaje> conversacion = dao.obtenerConversacion(actual.getId(), receptorId);

    response.setContentType("text/html;charset=UTF-8");
    PrintWriter out = response.getWriter();

    for (Mensaje m : conversacion) {
        // Lógica de visualización: si el sender soy yo, es 'sent', si no, es 'received'
        String claseCss = (m.getSenderId() == actual.getId()) ? "sent" : "received";
        
        out.println("<div class='chat-bubble " + claseCss + "'>");
        out.println("  <p>" + m.getContent() + "</p>");
        out.println("</div>");
    }
}

    // doPost para ENVIAR mensajes (AJAX)
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