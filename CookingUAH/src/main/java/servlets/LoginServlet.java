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

@WebServlet(name = "LoginServlet", urlPatterns = {"/LoginServlet"})
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. Recoger datos del formulario (login.jsp)
        String user = request.getParameter("username");
        String pass = request.getParameter("password");
        
        // 2. Preguntar a la Base de Datos
        UserDAO dao = new UserDAO();
        User usuarioEncontrado = dao.validarLogin(user, pass);

        // 3. Lógica de Redirección
        if (usuarioEncontrado != null) {
            // --- LOGIN CORRECTO ---
            
            // A. Comprobar si está activo (por si fue baneado)
            if (!usuarioEncontrado.isActive()) {
                request.setAttribute("mensajeError", "Tu cuenta está desactivada. Contacta con admin.");
                request.getRequestDispatcher("login.jsp").forward(request, response);
                return;
            }

            // B. Crear la sesión
            HttpSession session = request.getSession();
            session.setAttribute("usuario", usuarioEncontrado);

            // C. Redirigir según el rol
            if ("admin".equals(usuarioEncontrado.getRole())) {
                response.sendRedirect("admin.jsp"); // Si tienes panel admin
            } else {
                // Ir al feed principal ( feed.jsp)
                response.sendRedirect("feed.jsp"); // O buscarAmigos.jsp para probar
            }

        } else {
            // --- LOGIN INCORRECTO ---
            request.setAttribute("mensajeError", "Usuario o contraseña incorrectos.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        }
    }
}