package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PostDAO {
    // Reutilizamos la conexión de UserDAO
    //Para fatima
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    // private static final String URL = "jdbc:derby://localhost:1527/CookingUAH;create=true";
     private static final String USER = "root";
    private static final String PASS = "root";

    // OBTENER FEED COMPLETO
    public List<Post> obtenerFeed(int currentUserId) {
        List<Post> posts = new ArrayList<>();
        
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            // 1. Obtener Posts + Datos de Autor
            String sql = "SELECT p.*, u.username, u.avatar FROM posts p " +
                         "JOIN users u ON p.user_id = u.id ORDER BY p.created_at DESC";
            PreparedStatement ps = conn.prepareStatement(sql);
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                Post post = new Post(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("title"),
                    rs.getString("image"),
                    rs.getTimestamp("created_at"),
                    rs.getString("username"),
                    rs.getString("avatar")
                );
                
                // 2. Obtener Likes del post
                post.setLikesCount(contarLikes(conn, post.getId()));
                post.setLikedByCurrentUser(usuarioDioLike(conn, post.getId(), currentUserId));
                
                // 3. Obtener Comentarios del post
                post.getComments().addAll(obtenerComentarios(conn, post.getId()));
                
                posts.add(post);
            }
        } catch (Exception e) { e.printStackTrace(); }
        return posts;
    }
    
    // CREAR POST
    public boolean crearPost(int userId, String titulo, String nombreImagen) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "INSERT INTO posts (user_id, title, image) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setString(2, titulo);
            ps.setString(3, nombreImagen); // Guardamos la ruta o nombre del archivo
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); return false; }
    }

    // DAR/QUITAR LIKE (Toggle)
    public void toggleLike(int userId, int postId) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            if (usuarioDioLike(conn, postId, userId)) {
                conn.createStatement().executeUpdate("DELETE FROM likes WHERE user_id=" + userId + " AND post_id=" + postId);
            } else {
                conn.createStatement().executeUpdate("INSERT INTO likes (user_id, post_id) VALUES (" + userId + ", " + postId + ")");
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
    
    // AGREGAR COMENTARIO
    public void comentar(int userId, int postId, String contenido) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            String sql = "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setInt(2, postId);
            ps.setString(3, contenido);
            ps.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
    }

    // --- MÉTODOS AUXILIARES ---
    private int contarLikes(Connection conn, int postId) throws SQLException {
        ResultSet rs = conn.createStatement().executeQuery("SELECT COUNT(*) FROM likes WHERE post_id=" + postId);
        return rs.next() ? rs.getInt(1) : 0;
    }
    
    private boolean usuarioDioLike(Connection conn, int postId, int userId) throws SQLException {
        ResultSet rs = conn.createStatement().executeQuery(
            "SELECT * FROM likes WHERE post_id=" + postId + " AND user_id=" + userId);
        return rs.next();
    }
    
    private List<Comment> obtenerComentarios(Connection conn, int postId) throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String sql = "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC";
        PreparedStatement ps = conn.prepareStatement(sql);
        ps.setInt(1, postId);
        ResultSet rs = ps.executeQuery();
        while (rs.next()) {
            comments.add(new Comment(
                rs.getInt("id"), rs.getInt("user_id"), rs.getInt("post_id"),
                rs.getString("content"), rs.getTimestamp("created_at"), rs.getString("username")
            ));
        }
        return comments;
    }
}