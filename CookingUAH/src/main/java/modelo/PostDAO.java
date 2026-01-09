package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class PostDAO {
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    private Connection getConexion() throws SQLException {
        try {
            Class.forName("org.apache.derby.jdbc.ClientDriver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }

    /**
     * Obtiene el feed completo optimizado con JOINs para evitar consultas N+1.
     */
    public List<Post> obtenerFeed(int currentUserId) {
        Map<Integer, Post> postsMap = new LinkedHashMap<>();

        try (Connection conn = getConexion()) {
            String sql = "SELECT p.id, p.user_id, p.title, p.image, p.created_at, p.likes_count, " +
                         "u.username as postAuthor, u.avatar as postAvatar, " +
                         "COUNT(DISTINCT l_me.user_id) AS userLiked, " +
                         "c.id as commentId, c.user_id as commentUserId, c.content as commentContent, " +
                         "c.created_at as commentCreatedAt, uc.username as commentAuthorName " +
                         "FROM posts p " +
                         "JOIN users u ON p.user_id = u.id " +
                         "LEFT JOIN likes l_me ON p.id = l_me.post_id AND l_me.user_id = ? " +
                         "LEFT JOIN comments c ON p.id = c.post_id " +
                         "LEFT JOIN users uc ON c.user_id = uc.id " +
                         "GROUP BY p.id, p.user_id, p.title, p.image, p.created_at, p.likes_count, u.username, u.avatar, " +
                         "c.id, c.user_id, c.content, c.created_at, uc.username " +
                         "ORDER BY p.created_at DESC, c.created_at ASC";

            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, currentUserId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int postId = rs.getInt("id");

                    if (!postsMap.containsKey(postId)) {
                        Post p = new Post(
                            postId,
                            rs.getInt("user_id"),
                            rs.getString("title"),
                            rs.getString("image"),
                            rs.getTimestamp("created_at"),
                            rs.getString("postAuthor"),
                            rs.getString("postAvatar")
                        );
                        p.setLikesCount(rs.getInt("likes_count"));
                        p.setLikedByCurrentUser(rs.getInt("userLiked") > 0);
                        postsMap.put(postId, p);
                    }

                    int commentId = rs.getInt("commentId");
                    if (commentId > 0) {
                        Comment c = new Comment(
                            commentId,
                            rs.getInt("commentUserId"),
                            postId,
                            rs.getString("commentContent"),
                            rs.getTimestamp("commentCreatedAt"),
                            rs.getString("commentAuthorName")
                        );

                        List<Comment> postComments = postsMap.get(postId).getComments();
                        if (postComments.stream().noneMatch(exist -> exist.getId() == commentId)) {
                            postComments.add(c);
                        }
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ArrayList<>(postsMap.values());
    }

    public boolean crearPost(int userId, String titulo, String nombreImagen) {
        try (Connection conn = getConexion()) {
            String sql = "INSERT INTO posts (user_id, title, image, likes_count) VALUES (?, ?, ?, 0)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setString(2, titulo);
            ps.setString(3, nombreImagen);
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); return false; }
    }

    public boolean eliminarPost(int id) {
        String sql = "DELETE FROM posts WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    public void toggleLike(int userId, int postId) {
        try (Connection conn = getConexion()) {
            conn.setAutoCommit(false); 
            try {
                if (usuarioDioLike(conn, postId, userId)) {
                    String sqlDelete = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
                    try (PreparedStatement ps = conn.prepareStatement(sqlDelete)) {
                        ps.setInt(1, userId);
                        ps.setInt(2, postId);
                        ps.executeUpdate();
                    }
                    String sqlUpdate = "UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?";
                    try (PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
                        ps.setInt(1, postId);
                        ps.executeUpdate();
                    }
                } else {
                    String sqlInsert = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
                    try (PreparedStatement ps = conn.prepareStatement(sqlInsert)) {
                        ps.setInt(1, userId);
                        ps.setInt(2, postId);
                        ps.executeUpdate();
                    }
                    String sqlUpdate = "UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?";
                    try (PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
                        ps.setInt(1, postId);
                        ps.executeUpdate();
                    }
                }
                conn.commit(); 
            } catch (SQLException e) {
                conn.rollback(); 
                throw e;
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    public void comentar(int userId, int postId, String contenido) {
        try (Connection conn = getConexion()) {
            String sql = "INSERT INTO comments (user_id, post_id, content) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setInt(2, postId);
            ps.setString(3, contenido);
            ps.executeUpdate();
        } catch (Exception e) { e.printStackTrace(); }
    }

    /**
     * MÈTODO AÑADIDO: Elimina un comentario por ID.
     */
    public boolean eliminarComentario(int id) {
        String sql = "DELETE FROM comments WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    /**
     * MÈTODO AÑADIDO: Recupera una lista de publicaciones (todas o por usuario).
     */
    public List<Post> listarPosts(int userId) {
        List<Post> posts = new ArrayList<>();
        String sql = "SELECT p.*, u.username as authorName, u.avatar as authorAvatar " +
                     "FROM posts p JOIN users u ON p.user_id = u.id ";
        if (userId > 0) sql += "WHERE p.user_id = ? ";
        sql += "ORDER BY p.created_at DESC";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (userId > 0) ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Post p = new Post(
                        rs.getInt("id"), rs.getInt("user_id"), rs.getString("title"),
                        rs.getString("image"), rs.getTimestamp("created_at"),
                        rs.getString("authorName"), rs.getString("authorAvatar")
                    );
                    p.setLikesCount(rs.getInt("likes_count"));
                    posts.add(p);
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return posts;
    }

    public List<Post> listarPostsPorUsuario(int userId) {
        return listarPosts(userId); // Reutilizamos listarPosts con filtro
    }

    public List<Comment> listarComentarios(int postId) {
        List<Comment> comentarios = new ArrayList<>();
        String sql = "SELECT c.*, u.username as authorName FROM comments c " +
                     "JOIN users u ON c.user_id = u.id ";
        if (postId > 0) sql += "WHERE c.post_id = ? ";
        sql += "ORDER BY c.created_at ASC";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            if (postId > 0) ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    comentarios.add(new Comment(
                        rs.getInt("id"), rs.getInt("user_id"), rs.getInt("post_id"),
                        rs.getString("content"), rs.getTimestamp("created_at"), 
                        rs.getString("authorName")
                    ));
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return comentarios;
    }

    public List<Post> obtenerTop3() {
        List<Post> top = new ArrayList<>();
        String sql = "SELECT p.*, u.username as authorName, u.avatar as authorAvatar " +
                     "FROM posts p JOIN users u ON p.user_id = u.id " +
                     "ORDER BY p.likes_count DESC FETCH FIRST 3 ROWS ONLY";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                Post p = new Post(
                    rs.getInt("id"), rs.getInt("user_id"), rs.getString("title"),
                    rs.getString("image"), rs.getTimestamp("created_at"),
                    rs.getString("authorName"), rs.getString("authorAvatar")
                );
                p.setLikesCount(rs.getInt("likes_count"));
                top.add(p);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return top;
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

    public int contarLikes(int postId) {
        String sql = "SELECT likes_count FROM posts WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }
}