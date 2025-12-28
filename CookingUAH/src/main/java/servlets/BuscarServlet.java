package servlets;

import java.io.IOException;
import java.util.List;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.User;
import modelo.UserDAO;


// Cuando en el form del JSP ponemos action="BuscarServlet" viene a buscar aqui
@WebServlet(name = "BuscarServlet", urlPatterns = {"/BuscarServlet"})
public class BuscarServlet extends HttpServlet {

    // Este método atiende las peticiones GET (cuando escribes en la URL o buscas en el form)
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        // 1. COMPROBAR SESIÓN (Seguridad)
        // Si no estás logueado, no puedes buscar. Te mandamos al login.
        HttpSession session = request.getSession();
        User usuarioLogueado = (User) session.getAttribute("usuario");
        
        if (usuarioLogueado == null) {
            response.sendRedirect("login.jsp"); 
            return;
        }

        // 2. RECIBIR DATOS DEL FORMULARIO
        // "busqueda" es el name="busqueda" del input en buscarAmigos.jsp
        String textoBusqueda = request.getParameter("busqueda");

        // 3. LLAMAR AL DAO (MODELO)
        UserDAO dao = new UserDAO();
        List<User> listaResultados;

        if (textoBusqueda != null && !textoBusqueda.trim().isEmpty()) {
            // Si escribieron algo, buscamos en la BBDD
            listaResultados = dao.buscarUsuarios(textoBusqueda);
        } else {
            // Si la búsqueda está vacía, o no buscamos nada o devolvemos todos (opcional)
            listaResultados = null; 
        }

        // 4. GUARDAR RESULTADOS PARA EL JSP
        // Guardamos la lista en la "mochila" (request) con la etiqueta "resultadosBusqueda"
        // Esta etiqueta DEBE coincidir con la que pusiste en el JSP: request.getAttribute("resultadosBusqueda")
        request.setAttribute("resultadosBusqueda", listaResultados);

        // 5. ENVIAR DE VUELTA AL JSP
        request.getRequestDispatcher("BuscaAmigos.jsp").forward(request, response);
    }
}