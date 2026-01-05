package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class PostDAO {
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    // OBTENER FEED COMPLETO
    public List<Post> obtenerFeed(int currentUserId) {
        List<Post> posts = new ArrayList<>();
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
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
                
                // Carga dinámica de datos adicionales
                post.setLikesCount(contarLikes(conn, post.getId()));
                post.setLikedByCurrentUser(usuarioDioLike(conn, post.getId(), currentUserId));
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
            ps.setString(3, nombreImagen); 
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); return false; }
    }

    // DAR/QUITAR LIKE (Toggle)
    public void toggleLike(int userId, int postId) {
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS)) {
            if (usuarioDioLike(conn, postId, userId)) {
                String sqlDelete = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(sqlDelete)) {
                    ps.setInt(1, userId);
                    ps.setInt(2, postId);
                    ps.executeUpdate();
                }
            } else {
                String sqlInsert = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
                try (PreparedStatement ps = conn.prepareStatement(sqlInsert)) {
                    ps.setInt(1, userId);
                    ps.setInt(2, postId);
                    ps.executeUpdate();
                }
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

    // LISTAR POSTS DE UN USUARIO (Para el Perfil)
    public List<Post> listarPostsPorUsuario(int userId) {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT p.*, u.username as authorName, u.avatar as authorAvatar " +
                     "FROM posts p JOIN users u ON p.user_id = u.id " +
                     "WHERE p.user_id = ? ORDER BY p.created_at DESC";
        
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Post p = new Post(
                        rs.getInt("id"),
                        rs.getInt("user_id"),
                        rs.getString("title"),
                        rs.getString("image"),
                        rs.getTimestamp("created_at"),
                        rs.getString("authorName"),
                        rs.getString("authorAvatar")
                    );
                    // Importante: Contar likes dinámicamente
                    p.setLikesCount(contarLikes(conn, p.getId()));
                    posts.add(p);
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return posts;
    }

    // --- MÉTODOS AUXILIARES (Dentro de la clase) ---
    private int contarLikes(Connection conn, int postId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM likes WHERE post_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt(1) : 0;
            }
        }
    }

    private boolean usuarioDioLike(Connection conn, int postId, int userId) throws SQLException {
        String sql = "SELECT 1 FROM likes WHERE post_id = ? AND user_id = ?";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ps.setInt(2, userId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    private List<Comment> obtenerComentarios(Connection conn, int postId) throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String sql = "SELECT c.*, u.username FROM comments c JOIN users u ON c.id = u.id WHERE c.post_id = ? ORDER BY c.created_at ASC";
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
} // Cierre correcto de la clase