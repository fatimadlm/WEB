/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

/**
 * Servlet encargado de finalizar la sesión del usuario.
 */
@WebServlet(name = "LogoutServlet", urlPatterns = {"/LogoutServlet"})
public class LogoutServlet extends HttpServlet {

    /**
     * Procesa la petición GET para invalidar la sesión actual del usuario.
     * @param request Objeto que contiene la petición del cliente.
     * @param response Objeto que contiene la respuesta del servlet.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Obtener la sesión actual si existe (false indica que no cree una nueva)
        HttpSession session = request.getSession(false);
        
        if (session != null) {
            // 2. Invalidar la sesión para borrar todos los atributos (incluyendo 'usuario')
            session.invalidate();
        }
        
        // 3. Redirigir al usuario a la página inicial tras cerrar sesión
        response.sendRedirect(request.getContextPath() + "/index.jsp");
    }

    /**
     * Redirige las peticiones POST al método doGet para reutilizar la lógica de cierre de sesión.
     * @param request Objeto que contiene la petición del cliente.
     * @param response Objeto que contiene la respuesta del servlet.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}