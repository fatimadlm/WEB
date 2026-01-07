/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "ListarUsuariosServlet", urlPatterns = {"/ListarUsuariosServlet"})
public class ListarUsuariosServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Instanciar el DAO para acceder a la base de datos Derby
        UserDAO dao = new UserDAO();
        
        // 2. Obtener la lista de todos los usuarios usando una búsqueda vacía
        List<User> lista = dao.buscarUsuarios("");
        
        // 3. Guardar la lista en el objeto request para que el JSP pueda leerla
        request.setAttribute("listaUsuarios", lista);
        
        // 4. Redirigir la petición al JSP de Administración
        request.getRequestDispatcher("/jsp/Admin.jsp").forward(request, response);
    }
}
