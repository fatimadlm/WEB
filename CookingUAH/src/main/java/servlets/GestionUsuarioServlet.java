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
import modelo.UserDAO;

@WebServlet(name = "GestionUsuarioServlet", urlPatterns = {"/GestionUsuarioServlet"})
public class GestionUsuarioServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

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

        // 3. Redirigir siempre al ListarUsuariosServlet para refrescar la tabla
        response.sendRedirect(request.getContextPath() + "/ListarUsuariosServlet");
    }
}