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
    * Obtiene el feed completo de publicaciones optimizando la carga de likes y el estado de 
    * interacción del usuario actual mediante JOINs para evitar el problema de consultas N+1.
    * @param currentUserId Identificador del usuario que consulta el feed.
    * @return Lista de publicaciones con su autor, conteo de likes y comentarios precargados.
    */
    public List<Post> obtenerFeed(int currentUserId) {
        
        // Usamos LinkedHashMap para mantener el orden cronológico (DESC) del ResultSet
        Map<Integer, Post> postsMap = new LinkedHashMap<>();
        
        try (Connection conn = getConexion()) {
            // SQL que une Posts, Autores, Likes (con DISTINCT) y Comentarios con sus Autores
            // l_all cuenta todos los likes para totalLikes.
            // l_me busca específicamente si el usuario actual ha dado like para userLiked.
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
            
            // Pasamos el ID del usuario actual para la columna dinámica userLiked
            ps.setInt(1, currentUserId);
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    int postId = rs.getInt("id");

                    // 1. Si el Post aún no está en el mapa, lo instanciamos
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

                    // 2. Si la fila actual contiene un comentario (commentId > 0), lo añadimos
                    int commentId = rs.getInt("commentId");
                    if (commentId > 0) {
                        Comment c = new Comment(
                            commentId,
                            rs.getInt("commentUserId"),
                            postId,
                            rs.getString("commentContent"),
                            rs.getTimestamp("commentCreatedAt"),
                            rs.getString("commentAuthorName") // Nombre del autor del comentario
                        );

                        // Solo añadimos el comentario si no ha sido añadido ya (evita duplicidad por el join de likes)
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
        // Devolvemos los valores del mapa como una lista
    return new ArrayList<>(postsMap.values());
    }

    // CREAR POST
    public boolean crearPost(int userId, String titulo, String nombreImagen) {
        try (Connection conn = getConexion()) {
            String sql = "INSERT INTO posts (user_id, title, image) VALUES (?, ?, ?)";
            PreparedStatement ps = conn.prepareStatement(sql);
            ps.setInt(1, userId);
            ps.setString(2, titulo);
            ps.setString(3, nombreImagen); 
            return ps.executeUpdate() > 0;
        } catch (Exception e) { e.printStackTrace(); return false; }
    }
    
    /**
     * Elimina una publicación y, por integridad referencial, sus likes y comentarios asociados.
     * @param id Identificador de la publicación a borrar.
     * @return true si la eliminación fue exitosa.
     */
    public boolean eliminarPost(int id) {
        String sql = "DELETE FROM posts WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }


// DAR/QUITAR LIKE (Toggle) + ACTUALIZAR CONTADOR
    public void toggleLike(int userId, int postId) {
        try (Connection conn = getConexion()) {
            if (usuarioDioLike(conn, postId, userId)) {
                // 1. Si ya dio like, lo quitamos
                String sqlDelete = "DELETE FROM likes WHERE user_id = ? AND post_id = ?";
                try (PreparedStatement ps = conn.prepareStatement(sqlDelete)) {
                    ps.setInt(1, userId);
                    ps.setInt(2, postId);
                    ps.executeUpdate();
                }
                // 2. RESTAMOS 1 al contador del post
                String sqlUpdate = "UPDATE posts SET likes_count = likes_count - 1 WHERE id = ?";
                try (PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
                    ps.setInt(1, postId);
                    ps.executeUpdate();
                }
                
            } else {
                // 1. Si no dio like, lo ponemos
                String sqlInsert = "INSERT INTO likes (user_id, post_id) VALUES (?, ?)";
                try (PreparedStatement ps = conn.prepareStatement(sqlInsert)) {
                    ps.setInt(1, userId);
                    ps.setInt(2, postId);
                    ps.executeUpdate();
                }
                // 2. SUMAMOS 1 al contador del post
                String sqlUpdate = "UPDATE posts SET likes_count = likes_count + 1 WHERE id = ?";
                try (PreparedStatement ps = conn.prepareStatement(sqlUpdate)) {
                    ps.setInt(1, postId);
                    ps.executeUpdate();
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
    }
    // AGREGAR COMENTARIO
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
     * Elimina un comentario específico de la base de datos.
     * @param id Identificador del comentario.
     * @return true si se eliminó correctamente.
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
    * Recupera una lista de publicaciones de la base de datos. Permite filtrar por un usuario
    * específico o recuperar todas las publicaciones del sistema si el ID proporcionado es 0.
    * @param userId Identificador del usuario para filtrar (0 para obtener todos los posts).
    * @return Lista de objetos Post con datos del autor y conteo de likes.
    */
    public List<Post> listarPosts(int userId) {
       List<Post> posts = new ArrayList<>();

       // 1. Construcción dinámica de la consulta SQL
       String sql = "SELECT p.id, p.user_id, p.title, p.image, p.created_at, " +
                    "u.username as authorName, u.avatar as authorAvatar, " +
                    "COUNT(l.post_id) as totalLikes " +
                    "FROM posts p " +
                    "JOIN users u ON p.user_id = u.id " +
                    "LEFT JOIN likes l ON p.id = l.post_id ";

       if (userId > 0) {
           sql += "WHERE p.user_id = ? ";
       }
       sql += "GROUP BY p.id, p.user_id, p.title, p.image, p.created_at, u.username, u.avatar ";
       sql += "ORDER BY p.created_at DESC";

       try (Connection conn = getConexion();
            PreparedStatement ps = conn.prepareStatement(sql)) {

           // 2. Si hay filtro por usuario, asignamos el parámetro
           if (userId > 0) {
               ps.setInt(1, userId);
           }

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

                   // 3. Incluimos el conteo de likes para que sea útil tanto en perfil como en admin
                   p.setLikesCount(rs.getInt("totalLikes"));
                   posts.add(p);
               }
           }
       } catch (SQLException e) {
           e.printStackTrace();
       }
       return posts;
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
    /**
 * Recupera todas las publicaciones de un usuario específico.
 * Incluye el conteo de likes y los datos del autor para su correcta visualización.
 * @param userId ID del usuario cuyo perfil se está consultando.
 * @return Lista de objetos Post pertenecientes al usuario.
 */
public List<Post> listarPostsPorUsuario(int userId) {
    List<Post> posts = new ArrayList<>();
    
    // Consulta optimizada con JOIN para traer datos del autor y conteo de likes
    String sql = "SELECT p.id, p.user_id, p.title, p.image, p.created_at, " +
                 "u.username as authorName, u.avatar as authorAvatar, " +
                 "COUNT(l.user_id) as totalLikes " +
                 "FROM posts p " +
                 "JOIN users u ON p.user_id = u.id " +
                 "LEFT JOIN likes l ON p.id = l.post_id " +
                 "WHERE p.user_id = ? " +
                 "GROUP BY p.id, p.user_id, p.title, p.image, p.created_at, u.username, u.avatar " +
                 "ORDER BY p.created_at DESC";

    try (Connection conn = getConexion();
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

                // Asignamos el conteo de likes obtenido por el COUNT del SQL
                p.setLikesCount(rs.getInt("totalLikes"));
                
                // Opcional: Si necesitas cargar los comentarios de cada post en el perfil
                p.setComments(listarComentarios(p.getId()));
                
                posts.add(p);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return posts;
}
    
    /**
    * Recupera comentarios de la base de datos. Si se proporciona un postId, devuelve solo los 
    * de esa receta; si se pasa 0, devuelve todos los del sistema (para administración).
    * @param postId Identificador de la receta (0 para todos los comentarios).
    * @return Lista de objetos Comment con los nombres de autor integrados.
    */
    public List<Comment> listarComentarios(int postId) {
       List<Comment> comentarios = new ArrayList<>();

       // Consulta con JOIN para obtener siempre el nombre del autor
       String sql = "SELECT c.*, u.username as authorName FROM comments c " +
                    "JOIN users u ON c.user_id = u.id ";

       if (postId > 0) {
           sql += "WHERE c.post_id = ? ";
       }

       sql += "ORDER BY c.created_at ASC";

       try (Connection conn = getConexion();
            PreparedStatement ps = conn.prepareStatement(sql)) {

           if (postId > 0) {
               ps.setInt(1, postId);
           }

           try (ResultSet rs = ps.executeQuery()) {
               while (rs.next()) {
                   comentarios.add(new Comment(
                       rs.getInt("id"), 
                       rs.getInt("user_id"), 
                       rs.getInt("post_id"),
                       rs.getString("content"), 
                       rs.getTimestamp("created_at"), 
                       rs.getString("authorName")
                   ));
               }
           }
       } catch (SQLException e) {
           e.printStackTrace();
       }
       return comentarios;
    }
   
    public List<Post> obtenerTop3() {
        List<Post> top = new ArrayList<>();
        // SQL: Unimos con usuarios y ordenamos por likes descendente, limitado a 3
        String sql = "SELECT p.*, u.username as authorName, u.avatar as authorAvatar " +
                  "FROM posts p JOIN users u ON p.user_id = u.id " +
                  "ORDER BY p.likes_count DESC FETCH FIRST 3 ROWS ONLY";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
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
                p.setLikesCount(rs.getInt("likes_count"));
                top.add(p);
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return top;}
    
    // Método auxiliar para obtener likes actuales
    public int contarLikes(int postId) {
        String sql = "SELECT likes_count FROM posts WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, postId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }
    
        
} // Cierre correcto de la clase