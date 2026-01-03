package modelo;

import java.io.Serializable;
import java.sql.Timestamp;

public class Mensaje implements Serializable {
    private int id;
    private int senderId;
    private int receiverId;
    private String content;
    private Timestamp createdAt;
    
    // Atributo extra opcional para facilitar la visualización en el chat
    private String usernameEmisor;

    public Mensaje() {
    }

    // Constructor completo
    public Mensaje(int id, int senderId, int receiverId, String content, Timestamp createdAt) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getSenderId() {
        return senderId;
    }

    public void setSenderId(int senderId) {
        this.senderId = senderId;
    }

    public int getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(int receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public String getUsernameEmisor() {
        return usernameEmisor;
    }

    public void setUsernameEmisor(String usernameEmisor) {
        this.usernameEmisor = usernameEmisor;
    }
    
}