/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.Part;
import java.io.File;
import java.nio.file.Paths;
import modelo.PostDAO;
import modelo.User;
import modelo.UserDAO;

/**
 *
 * @author fernando
 */
@WebServlet(name = "EditarPostServlet", urlPatterns = {"/EditarPostServlet"})
@MultipartConfig(maxFileSize = 1024 * 1024 * 5)
public class EditarPostServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");

        
        HttpSession session = request.getSession(false);
        User actual = (session != null) ? (User) session.getAttribute("usuario") : null;

        if (actual == null) {
            response.sendRedirect(request.getContextPath() + "/jsp/login.jsp");
            return;
        }

        int postId = Integer.parseInt(request.getParameter("postId"));
        String nuevoTitulo = request.getParameter("titulo");
        
        // Lógica de imagen similar a EditarPerfilServlet
        Part filePart = request.getPart("imagen");
        String rutaImagen = null; // Si es null, el DAO no debería actualizar este campo

        if (filePart != null && filePart.getSize() > 0) {
            String fileName = actual.getId() + "_post_" + Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            String uploadPath = getServletContext().getRealPath("") + File.separator + "Imagenes";
            filePart.write(uploadPath + File.separator + fileName);
            rutaImagen = "Imagenes/" + fileName;
        }

        PostDAO pDao = new PostDAO();
        pDao.actualizarPost(postId, nuevoTitulo, rutaImagen, actual.getId());

        response.sendRedirect(request.getContextPath() + "/PerfilServlet");
    }
}