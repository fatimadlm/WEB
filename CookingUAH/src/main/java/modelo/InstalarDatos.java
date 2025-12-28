package modelo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.SQLException;

public class InstalarDatos {

    // Configuración de conexión
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAH_DB;create=true";
    private static final String USER = "app";
    private static final String PASS = "app";

    public static void main(String[] args) {
        try {
            // 1. Cargar driver
            Class.forName("org.apache.derby.jdbc.ClientDriver");
            
            // 2. Conectar (El create=true crea la BD si no existe)
            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                 Statement stmt = conn.createStatement()) {
                 
                System.out.println("--- CONEXIÓN ÉXITOSA ---");
                System.out.println("Creando tablas...");

                // 3. Ejecutar las tablas UNA a UNA
                // Borramos versiones viejas por si acaso (para no dar error de 'ya existe')
                // Si da error al borrar es normal (porque no existen), así que usamos try-catch silenciosos
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
                System.out.println("Tabla 'users' creada.");

                // --- INSERTAR ADMIN ---
                stmt.executeUpdate("INSERT INTO users (username, email, password, role, active) " +
                        "VALUES ('admin', 'admin@cooking.com', 'admin', 'admin', true)");
                System.out.println("Usuario ADMIN creado.");

                // --- TABLA POSTS ---
                stmt.executeUpdate("CREATE TABLE posts (" +
                        "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                        "user_id INT, " +
                        "title VARCHAR(255) NOT NULL, " +
                        "image VARCHAR(255), " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                        ")");
                System.out.println("Tabla 'posts' creada.");

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
                 System.out.println("Tabla 'comments' creada.");
                 
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
                System.out.println("Tabla 'messages' creada.");

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
                System.out.println("Tabla 'events' creada.");

                // --- TABLA NOTIFICACIONES ---
                stmt.executeUpdate("CREATE TABLE notifications (" +
                        "id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1), " +
                        "user_id INT, " +
                        "text VARCHAR(500) NOT NULL, " +
                        "is_read BOOLEAN DEFAULT FALSE, " +
                        "created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, " +
                        "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE" +
                        ")");
                System.out.println("Tabla 'notifications' creada.");

                // --- TABLA SEGUIDORES ---
                stmt.executeUpdate("CREATE TABLE followers (" +
                        "follower_id INT, " +
                        "followed_id INT, " +
                        "PRIMARY KEY (follower_id, followed_id), " +
                        "FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE, " +
                        "FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE" +
                        ")");
                System.out.println("Tabla 'followers' creada.");

                // --- TABLA LIKES ---
                stmt.executeUpdate("CREATE TABLE likes (" +
                        "user_id INT, " +
                        "post_id INT, " +
                        "PRIMARY KEY (user_id, post_id), " +
                        "FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, " +
                        "FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE" +
                        ")");
                System.out.println("Tabla 'likes' creada.");

                System.out.println("¡TODO LISTO! YA PUEDES LOGUEARTE.");

            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    // Método auxiliar para borrar tablas viejas sin que explote si no existen
    private static void dropTable(Statement stmt, String table) {
        try {
            stmt.executeUpdate("DROP TABLE " + table);
        } catch (SQLException e) {
            // Ignoramos error si la tabla no existe
        }
    }
}