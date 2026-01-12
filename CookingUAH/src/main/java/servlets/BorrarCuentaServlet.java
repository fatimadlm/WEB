package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import modelo.User;
import modelo.UserDAO;


@WebServlet(name = "BorrarCuentaServlet", urlPatterns = {"/BorrarCuentaServlet"})
public class BorrarCuentaServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        String passwordConfirm = request.getParameter("passwordConfirm");

        if (actual != null && passwordConfirm != null) {
            // 1. Validar la contraseña (asumiendo que User tiene el método getPassword())
            if (passwordConfirm.equals(actual.getPassword())) {
                UserDAO dao = new UserDAO();
                boolean eliminado = dao.eliminarUsuario(actual.getId());

                if (eliminado) {
                    session.invalidate();
                    response.sendRedirect(request.getContextPath() + "/jsp/login.jsp?msg=cuenta_borrada");
                } else {
                    response.sendRedirect(request.getContextPath() + "/jsp/ConfiguracionCuenta.jsp?error=db_error");
                }
            } else {
                // Contraseña incorrecta
                response.sendRedirect(request.getContextPath() + "/jsp/ConfiguracionCuenta.jsp?error=pass_incorrecta");
            }
        } else {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
        }
    }
}