package servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import modelo.PostDAO;
import modelo.User;

@WebServlet(name = "PublicarServlet", urlPatterns = {"/PublicarServlet"})
@MultipartConfig // ¡OBLIGATORIO!
public class PublicarServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        
        // 1. Seguridad
        HttpSession session = request.getSession();
        User usuario = (User) session.getAttribute("usuario");
        if (usuario == null) { response.sendRedirect("login.jsp"); return; }

        // 2. Datos del formulario
        String titulo = request.getParameter("titulo");
        Part filePart = request.getPart("imagen");
        String rutaImagenBBDD = null;

        // 3. Procesar Imagen (Copia Manual byte a byte)
        if (filePart != null && filePart.getSize() > 0) {
            
            // Ruta real en tu disco duro (carpeta target)
            String uploadPath = getServletContext().getRealPath("") + File.separator + "uploads";
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) uploadDir.mkdir();

            // Nombre único
            String fileName = "post_" + System.currentTimeMillis() + ".jpg";
            String fullPath = uploadPath + File.separator + fileName;

            // --- AQUÍ ESTÁ EL TRUCO PARA EVITAR EL ERROR 500 ---
            // Usamos InputStream en lugar de filePart.write()
            try (InputStream input = filePart.getInputStream();
                 OutputStream output = new FileOutputStream(fullPath)) {
                
                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = input.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                }
            } catch (Exception e) {
                e.printStackTrace(); // Mira el Output de NetBeans si falla
            }
            // ----------------------------------------------------

            rutaImagenBBDD = "uploads/" + fileName;
        }

        // 4. Guardar en BBDD
        PostDAO dao = new PostDAO();
        dao.crearPost(usuario.getId(), titulo, rutaImagenBBDD);

        response.sendRedirect("FeedServlet");
    }
}