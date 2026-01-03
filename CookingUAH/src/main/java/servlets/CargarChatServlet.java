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
import modelo.MensajeDAO;
import modelo.User;

/**
 *
 * @author fatim
 */
@WebServlet(name = "CargarChatServlet", urlPatterns = {"/CargarChatServlet"})
public class CargarChatServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        
        if (actual != null) {
            MensajeDAO dao = new MensajeDAO();
            request.setAttribute("listaContactos", dao.listarContactos(actual.getId()));
            request.getRequestDispatcher("/jsp/Mensajes.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
        }
    }
}
