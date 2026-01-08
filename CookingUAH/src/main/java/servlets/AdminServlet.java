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
import jakarta.servlet.http.HttpSession;
import modelo.Comment;
import modelo.Post;
import modelo.PostDAO;
import modelo.User;
import modelo.UserDAO;

/**
 * Servlet controlador central para el panel de administración. 
 * Se encarga de cargar la lista completa de usuarios y publicaciones del sistema
 * verificando siempre la identidad y el rol del administrador.
 */
@WebServlet(name = "AdminServlet", urlPatterns = {"/AdminServlet"})
public class AdminServlet extends HttpServlet {

    /**
     * Procesa la petición GET para cargar los datos necesarios en Admin.jsp.
     * Implementa control de caché y validación de rol 'admin' para proteger el acceso.
     * @param request Objeto que recibirá los atributos 'listaUsuarios' y 'listaPosts'.
     * @param response Objeto para gestionar la respuesta y cabeceras de seguridad.
     * @throws ServletException si ocurre un error en el procesamiento del servlet.
     * @throws IOException si ocurre un error de comunicación.
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // Control de caché para evitar que el navegador cargue la página desde el historial tras el logout
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1
        response.setHeader("Pragma", "no-cache"); // HTTP 1.0
        response.setDateHeader("Expires", 0); // Proxies

        // Recuperar la sesión actual sin crear una nueva
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        // Validación de seguridad: Usuario autenticado y con rol de 'admin'
        if (actual == null || !"admin".equalsIgnoreCase(actual.getRole())) {
            response.sendRedirect(request.getContextPath() + "/index.jsp");
            return;
        }
        
        // Obtención de datos desde el Modelo (DAOs)
        UserDAO uDao = new UserDAO();
        PostDAO pDao = new PostDAO();
        
        // Recuperamos todos los usuarios registrados
        List<User> usuarios = uDao.buscarUsuarios("");
        
        // Recuperamos todas las recetas usando el nuevo método optimizado (ID 0 = todas)
        List<Post> publicaciones = pDao.listarPosts(0);
        
        // Carga de Comentarios: Usamos el método unificado optimizado con ID 0 (Todos)
        // Este es el método que acabamos de discutir que incluye el nombre del autor
        List<Comment> comentarios = pDao.listarComentarios(0);
        
        // 4. Almacenamiento de datos en el objeto request para la vista JSP
        request.setAttribute("listaUsuarios", usuarios);
        request.setAttribute("listaPosts", publicaciones);
        request.setAttribute("listaComentarios", comentarios);
        
        // Cargar Comentarios globales si fuera necesario
        
        request.getRequestDispatcher("/jsp/Admin.jsp").forward(request, response);
    }
    
    /**
     * Redirige las peticiones POST al método doGet para centralizar la carga de datos.
     * @param request Objeto con la petición del cliente.
     * @param response Objeto con la respuesta del servlet.
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        doGet(request, response);
    }
}