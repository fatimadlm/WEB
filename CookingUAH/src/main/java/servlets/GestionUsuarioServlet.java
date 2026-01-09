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
import modelo.User;
import modelo.UserDAO;

/**
 * Servlet encargado de gestionar las acciones administrativas sobre los usuarios,
 * permitiendo bloquear, desbloquear o eliminar registros de la base de datos.
 */
@WebServlet(name = "GestionUsuarioServlet", urlPatterns = {"/GestionUsuarioServlet"})
public class GestionUsuarioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Control de caché para seguridad
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
        
        // 2. Validación de Seguridad: Solo administradores
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null || !"admin".equalsIgnoreCase(actual.getRole())) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }
        
        // 1. Obtener parámetros de la petición
        String idParam = request.getParameter("id");
        String accion = request.getParameter("accion");

        if (idParam != null && accion != null) {
            try {
                int id = Integer.parseInt(idParam);
                UserDAO dao = new UserDAO();

                // 2. Llamar al método correspondiente del DAO según la acción
                if ("bloquear".equalsIgnoreCase(accion)) {
                    dao.bloquearUsuario(id);
                } else if ("desbloquear".equalsIgnoreCase(accion)) {
                    dao.desbloquearUsuario(id);
                } else if ("eliminar".equalsIgnoreCase(accion)) {
                    dao.eliminarUsuario(id);
                }
            } catch (NumberFormatException e) {
                e.printStackTrace();
            }
        }

        // 3. Redirigir siempre al para refrescar la tabla
        response.sendRedirect(request.getContextPath() + "/AdminServlet");
    }
    
    /**
     * Redirige las peticiones POST al método doGet.
     * @param request Objeto que contiene la petición del cliente.
     * @param response Objeto que contiene la respuesta del servlet.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}