package servlets;

import java.util.List;
import java.io.IOException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import modelo.MensajeDAO;
import modelo.User;
import modelo.UserDAO;

@WebServlet(name = "CargarChatServlet", urlPatterns = {"/CargarChatServlet"})
public class CargarChatServlet extends HttpServlet {
    
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;
        
        if (actual != null) {
            MensajeDAO msgDao = new MensajeDAO();
            
            // 1. Cargar lista de contactos existente (Gente con la que ya has hablado)
            List<User> contactos = msgDao.listarContactos(actual.getId());
            
            // 2. LOGICA DE CHAT NUEVO O DIRECTO 🧠
            String idParam = request.getParameter("id");
            
            if (idParam != null && !idParam.isEmpty()) {
                try {
                    int idDestino = Integer.parseInt(idParam);
                    
                    // Comprobamos si este usuario YA está en la lista
                    boolean existe = false;
                    for (User u : contactos) {
                        if (u.getId() == idDestino) {
                            existe = true;
                            break;
                        }
                    }
                    
                    // Si NO existe (es un chat nuevo), buscamos sus datos y lo añadimos a la lista temporalmente
                    if (!existe && idDestino != actual.getId()) {
                        UserDAO uDao = new UserDAO(); // Necesitamos UserDAO para buscar al usuario
                        User nuevoContacto = uDao.obtenerUsuarioPorId(idDestino);
                        
                        if (nuevoContacto != null) {
                            // Ponemos un mensaje ficticio para que no salga null en la vista
                            nuevoContacto.setUltimoMensaje("¡Saluda a tu nuevo amigo!"); 
                            nuevoContacto.setMensajesNoLeidos(0);
                            
                            // Lo añadimos al PRINCIPIO de la lista para que salga arriba
                            contactos.add(0, nuevoContacto);
                        }
                    }
                    
                    // Pasamos este ID a la vista para que el JavaScript sepa qué chat abrir automáticamente
                    request.setAttribute("idChatAutomatico", idDestino);
                    
                } catch (NumberFormatException e) {
                    e.printStackTrace();
                }
            }

            // 3. Pasar atributos y renderizar
            request.setAttribute("listaContactos", contactos);
            
            // Calcular mensajes no leídos (esto sigue igual)
            int totalNoLeidos = msgDao.contarNoLeidosTotales(actual.getId());
            request.setAttribute("totalNoLeidos", totalNoLeidos);

            request.getRequestDispatcher("/jsp/Mensajes.jsp").forward(request, response);
        } else {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
        }
    }
}