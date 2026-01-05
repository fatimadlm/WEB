/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

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

/**
 *
 * @author fatim
 */
@WebServlet("/PodioServlet")
public class PodioServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        PostDAO dao = new PostDAO();
        // Método que implementaremos en el DAO para traer solo los 3 mejores
        List<Post> topPosts = dao.obtenerTop3(); 
        
        request.setAttribute("topPosts", topPosts);
        request.getRequestDispatcher("/jsp/Podio.jsp").forward(request, response);
    }
}