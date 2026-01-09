package modelo;
import java.sql.Timestamp;

public class Comment {
    private int id;
    private int userId;
    private int postId;
    private String content;
    private Timestamp createdAt;
    private String authorName; // Para pintar el nombre sin hacer otra consulta

    /**
     * Constructor completo para inicializar todos los campos desde el DAO.
     */
    public Comment(int id, int userId, int postId, String content, Timestamp createdAt, String authorName) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.createdAt = createdAt;
        this.authorName = authorName;
    }
    // Getters
    
    /**
     * Obtiene el ID único del comentario.
     * @return id del comentario.
     */
    public int getId() { return id; }
    
    /**
     * Obtiene el ID del usuario autor del comentario.
     * @return identificador del usuario.
     */
    public int getUserId() { return userId; }
    
    /**
     * Obtiene el ID de la publicación a la que pertenece el comentario.
     * Requerido por la tabla de administración en Admin.jsp.
     * @return identificador del post.
     */
    public int getPostId() { return postId; }
    
    /**
     * Obtiene el contenido textual del comentario.
     * @return contenido del comentario.
     */
    public String getContent() { return content; }
    
    /**
     * Obtiene el nombre del autor para su visualización.
     * @return nombre de usuario del autor.
     */
    public String getAuthorName() { return authorName; }
    
    /**
     * Obtiene la fecha de creación del comentario.
     * @return marca de tiempo de la creación.
     */
    public Timestamp getCreatedAt() { return createdAt; }
}