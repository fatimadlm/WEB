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
    
    // --- MÉTODOS EXTRA PARA LA VISTA (JSP) ---
    
    // Devuelve la hora corta: "14:30"
    public String getHoraFormateada() {
        if (createdAt == null) return "";
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("HH:mm");
        return sdf.format(createdAt);
    }

    // Devuelve la fecha para comparar: "2023-10-25"
    public String getFechaSolo() {
        if (createdAt == null) return "";
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
        return sdf.format(createdAt);
    }
    
    // Devuelve la fecha bonita para mostrar: "25 oct 2023"
    public String getFechaBonita() {
        if (createdAt == null) return "";
        // Locale.SPANISH asegura que salga "oct" y no "Oct" (depende del sistema)
        java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("d MMM yyyy", new java.util.Locale("es", "ES"));
        return sdf.format(createdAt);
    }
}
