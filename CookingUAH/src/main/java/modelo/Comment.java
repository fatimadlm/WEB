package modelo;
import java.sql.Timestamp;

public class Comment {
    private int id;
    private int userId;
    private int postId;
    private String content;
    private Timestamp createdAt;
    private String authorName; // Para pintar el nombre sin hacer otra consulta

    public Comment(int id, int userId, int postId, String content, Timestamp createdAt, String authorName) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
        this.content = content;
        this.createdAt = createdAt;
        this.authorName = authorName;
    }
    // Getters
    public int getId() { return id; }
    public String getContent() { return content; }
    public String getAuthorName() { return authorName; }
    public Timestamp getCreatedAt() { return createdAt; }
}