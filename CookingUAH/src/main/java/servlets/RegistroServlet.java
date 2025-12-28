package servlets;

import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "RegistroServlet", urlPatterns = {"/RegistroServlet"})
public class RegistroServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        String usuario = request.getParameter("username");
        String email = request.getParameter("email");
        String pass = request.getParameter("password");
        
        // Creamos el usuario (Avatar por defecto)
        User nuevoUsuario = new User(usuario, email, pass, "Imagenes/default.png");
        
        UserDAO dao = new UserDAO();
        boolean exito = dao.registrarUsuario(nuevoUsuario);
        
        if (exito) {
            request.setAttribute("mensajeExito", "¡Cuenta creada! Inicia sesión.");
            request.getRequestDispatcher("login.jsp").forward(request, response);
        } else {
            request.setAttribute("mensajeError", "El usuario o email ya existen.");
            request.getRequestDispatcher("registro.jsp").forward(request, response);
        }
    }
}