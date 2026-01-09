package servlets;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.List;
import modelo.Post;
import modelo.PostDAO;
import modelo.User;
import modelo.UserDAO;


@WebServlet("/PerfilOtroServlet")
public class PerfilOtroServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        int targetId = Integer.parseInt(request.getParameter("id"));
        User actual = (User) request.getSession().getAttribute("usuario");

        // 1. Obtener datos del perfil ajeno
        UserDAO uDao = new UserDAO();
        User perfil = uDao.obtenerUsuarioPorId(targetId);
        
        // 2. Obtener posts del usuario
        PostDAO pDao = new PostDAO();
        List<Post> posts = pDao.listarPostsPorUsuario(targetId);
        
        // 3. Comprobar relación de seguimiento
        boolean esSeguido = uDao.comprobarSeguimiento(actual.getId(), targetId);
        
        request.setAttribute("perfil", perfil);
        request.setAttribute("posts", posts);
        request.setAttribute("esSeguido", esSeguido);
        request.setAttribute("seguidoresCount", uDao.contarSeguidores(targetId));
        request.setAttribute("siguiendoCount", uDao.contarSiguiendo(targetId));

        request.getRequestDispatcher("/jsp/PerfilOtro.jsp").forward(request, response);
    }
}