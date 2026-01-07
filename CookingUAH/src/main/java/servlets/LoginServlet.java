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
        
        String user = request.getParameter("username");
        String pass = request.getParameter("password");
        
        UserDAO dao = new UserDAO();
        User usuarioEncontrado = dao.validarLogin(user, pass);

        if (usuarioEncontrado != null) {
            // 1. Verificar si la cuenta está activa
            if (!usuarioEncontrado.isActive()) {
                request.setAttribute("mensajeError", "Tu cuenta está desactivada.");
                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
                return;
            }

            // 2. Login exitoso: Guardar objeto usuario en la sesión
            HttpSession session = request.getSession();
            session.setAttribute("usuario", usuarioEncontrado);

            // 3. Gestión de redirección según el ROL
            // Usamos equalsIgnoreCase para que sea más robusto (acepta "admin" o "ADMIN")
            if ("admin".equalsIgnoreCase(usuarioEncontrado.getRole())) {
                // Redirigir a la nueva página JSP de administración
                response.sendRedirect(request.getContextPath() + "/ListarUsuariosServlet");
            } else {
                // Redirigir al flujo principal de la aplicación (Home/Feed)
                response.sendRedirect(request.getContextPath() + "/FeedServlet");
            }

        } else {
            // 4. Caso de error: Credenciales incorrectas
            request.setAttribute("mensajeError", "Usuario o contraseña incorrectos.");
            request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
        }
    }
}