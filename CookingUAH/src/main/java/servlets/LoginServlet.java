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
            // Caso A: Usuario desactivado
            if (!usuarioEncontrado.isActive()) {
                request.setAttribute("mensajeError", "Tu cuenta está desactivada.");
                // CORRECCIÓN: Usar "/" para indicar la raíz de webapp
                request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
                return;
            }

            // Caso B: Login exitoso
            HttpSession session = request.getSession();
            session.setAttribute("usuario", usuarioEncontrado);

            // Caso C: Redirección con ContextPath (Correcto)
            if ("admin".equals(usuarioEncontrado.getRole())) {
                response.sendRedirect(request.getContextPath() + "/jsp/admin.jsp");
            } else {
                response.sendRedirect(request.getContextPath() + "/FeedServlet");
            }

        } else {
            // Caso D: Login fallido
            request.setAttribute("mensajeError", "Usuario o contraseña incorrectos.");
            // CORRECCIÓN: Añadir la barra "/" inicial
            request.getRequestDispatcher("/jsp/login.jsp").forward(request, response);
        }
    }
}