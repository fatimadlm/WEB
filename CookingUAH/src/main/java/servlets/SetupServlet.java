package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet(name = "SetupServlet", urlPatterns = {"/SetupServlet"})
public class SetupServlet extends HttpServlet {

    // Configuración de conexión
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAH_DB;create=true";
    private static final String USER = "app";
    private static final String PASS = "app";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html;charset=UTF-8");
        
        try (PrintWriter out = response.getWriter()) {
            out.println("<!DOCTYPE html>");
            out.println("<html>");
            out.println("<head><title>Instalación BBDD</title></head>");
            out.println("<body>");
            out.println("<h1>Iniciando instalación de tablas...</h1>");
            
            try {
                // 1. Cargar driver (Aquí GlassFish SÍ lo encontrará)
                Class.forName("org.apache.derby.jdbc.ClientDriver");
                
                // 2. Conectar
                try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                     Statement stmt = conn.createStatement()) {
                     
                    out.println("<p>✅ Conexión establecida.</p>");

                    // Borrar tablas viejas (orden inverso a creación por las Foreign Keys)
                    dropTable(stmt, "likes");
                    dropTable(stmt, "followers");
                    dropTable(stmt, "notifications");
                    dropTable(stmt, "events");
                    dropTable(stmt, "messages");
                    dropTable(stmt, "comments");
                    dropTable(stmt, "posts");
                    dropTable(stmt, "users");

                    // --- TABLA USUARIOS ---
                    stmt.executeUpdate("CREATE TABLE users (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "username VARCHAR(50) UNIQUE NOT NULL, " +
                            "email VARCHAR(100) UNIQUE NOT NULL, " +
                            "password VARCHAR(255) NOT NULL, " +
                            "avatar VARCHAR(255), " +
                            "role VARCHAR(20) DEFAULT 'user', " +
                            "active BOOLEAN DEFAULT TRUE" +
                            ")");
                    out.println("<p>✅ Tabla 'users' creada.</p>");

                    // --- INSERTAR ADMIN ---
                    stmt.executeUpdate("INSERT INTO users (username, email, password, role, active) " +
                            "VALUES ('admin', 'admin@cooking.com', 'admin', 'admin', true)");
                    out.println("<p>👤 Usuario ADMIN creado (user: admin, pass: admin).</p>");

                    // --- TABLA POSTS ---
                    stmt.executeUpdate("CREATE TABLE posts (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "user_id INT, " +
                            "title VARCHAR(255) NOT NULL, " +
                            "image VARCHAR(255), " +
                            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                            "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'posts' creada.</p>");

                    // --- TABLA COMENTARIOS ---
                    stmt.executeUpdate("CREATE TABLE comments (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "user_id INT, " +
                            "post_id INT, " +
                            "content VARCHAR(1000) NOT NULL, " +
                            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                            "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, " +
                            "FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'comments' creada.</p>");
                    
                    // --- TABLA MENSAJES ---
                    stmt.executeUpdate("CREATE TABLE messages (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "sender_id INT, " +
                            "receiver_id INT, " +
                            "content VARCHAR(1000) NOT NULL, " +
                            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                            "FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE, " +
                            "FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'messages' creada.</p>");

                    // --- TABLA EVENTOS ---
                    stmt.executeUpdate("CREATE TABLE events (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "user_id INT, " +
                            "title VARCHAR(255) NOT NULL, " +
                            "event_date DATE NOT NULL, " +
                            "event_time TIME, " +
                            "type VARCHAR(50), " +
                            "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'events' creada.</p>");

                    // --- TABLA NOTIFICACIONES ---
                    stmt.executeUpdate("CREATE TABLE notifications (" +
                            "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                            "user_id INT, " +
                            "text VARCHAR(500) NOT NULL, " +
                            "is_read BOOLEAN DEFAULT FALSE, " +
                            "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                            "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'notifications' creada.</p>");

                    // --- TABLA SEGUIDORES ---
                    stmt.executeUpdate("CREATE TABLE followers (" +
                            "follower_id INT, " +
                            "followed_id INT, " +
                            "PRIMARY KEY (follower_id, followed_id), " +
                            "FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE, " +
                            "FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'followers' creada.</p>");

                    // --- TABLA LIKES ---
                    stmt.executeUpdate("CREATE TABLE likes (" +
                            "user_id INT, " +
                            "post_id INT, " +
                            "PRIMARY KEY (user_id, post_id), " +
                            "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, " +
                            "FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE" +
                            ")");
                    out.println("<p>✅ Tabla 'likes' creada.</p>");

                    out.println("<h2>✨ ¡TODO LISTO! Tablas creadas correctamente. ✨</h2>");
                    out.println("<a href='login.jsp'>Ir a Iniciar Sesión</a>");

                }
            } catch (Exception e) {
                out.println("<h2 style='color:red'>❌ ERROR: " + e.getMessage() + "</h2>");
                e.printStackTrace(out);
            }
            
            out.println("</body>");
            out.println("</html>");
        }
    }
    
    // Auxiliar para borrar tablas sin errores
    private void dropTable(Statement stmt, String table) {
        try {
            stmt.executeUpdate("DROP TABLE " + table);
        } catch (SQLException e) {
            // Ignorar si no existe
        }
    }
}