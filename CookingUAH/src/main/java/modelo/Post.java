package modelo;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Post {
    private int id;
    private int userId; 
    private String title;
    private String image;
    private Timestamp createdAt;
    
    // Datos extra para la vista (JOINs)
    private String authorName;
    private String authorAvatar;
    private int likesCount;
    private boolean likedByCurrentUser;
    private List<Comment> comments;

    public Post(int id, int userId, String title, String image, Timestamp createdAt, String authorName, String authorAvatar) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.image = image;
        this.createdAt = createdAt;
        this.authorName = authorName;
        this.authorAvatar = authorAvatar;
        this.comments = new ArrayList<>();
    }

    // --- GETTERS ---
    
    public int getId() { return id; }
    
    public int getUserId() { return userId; }

    public String getTitle() { return title; }
    public String getImage() { return image; }
    public Timestamp getCreatedAt() { return createdAt; }
    
    public String getAuthorName() { return authorName; }
    public String getAuthorAvatar() { return authorAvatar; }
    
    public int getLikesCount() { return likesCount; }
    public void setLikesCount(int likesCount) { this.likesCount = likesCount; }
    
    // Para booleanos se usa "is" en lugar de "get"
    public boolean isLikedByCurrentUser() { return likedByCurrentUser; }
    public void setLikedByCurrentUser(boolean likedByCurrentUser) { this.likedByCurrentUser = likedByCurrentUser; }
    
    public List<Comment> getComments() { return comments; }
    public void addComment(Comment c) { this.comments.add(c); }
}