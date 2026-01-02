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
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "PerfilServlet", urlPatterns = {"/Perfil"})
public class PerfilServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        // 1. Instanciar el DAO y obtener la sesión
        UserDAO dao = new UserDAO();
        HttpSession session = request.getSession(false);
        // Recuperar el usuario que inició sesión (se guarda al validar el login)
        User usuarioLogueado = (session != null) ? (User) session.getAttribute("usuarioLogueado") : null;

        // 2. Leer el ID de la URL (?id=123)
        String idParam = request.getParameter("id");
        User viewedUser = null;
        boolean isOwnProfile = false;
        
        try {
            if (idParam != null && !idParam.isEmpty()) {
                // Caso A: Estamos visitando un perfil específico por su ID
                int id = Integer.parseInt(idParam);
                viewedUser = dao.obtenerPorId(id); // Usamos el método de tu DAO
                
                // Comprobamos si el ID visitado coincide con el ID del logueado
                if (usuarioLogueado != null && viewedUser != null) {
                    isOwnProfile = (usuarioLogueado.getId() == viewedUser.getId());
                }
            } else if (usuarioLogueado != null) {
                // Caso B: No hay ID en la URL, mostramos el perfil propio del logueado
                viewedUser = usuarioLogueado;
                isOwnProfile = true;
            }

            // 3. Gestión de errores: Si el usuario no existe
            if (viewedUser == null) {
                response.sendRedirect("index.jsp"); 
                return;
            }

            // 4. Pasar datos al JSP
            request.setAttribute("viewedUser", viewedUser);
            request.setAttribute("isOwnProfile", isOwnProfile);
            
            // Redirigir a la vista
            request.getRequestDispatcher("MiPerfil.jsp").forward(request, response);

        }catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "ID de usuario no válido");
        }
        
        }
}
