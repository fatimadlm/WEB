package modelo;

import java.sql.Date;
import java.sql.Time;

public class Evento {
    private int id;
    private int userId;
    private String title;
    private Date eventDate;
    private Time eventTime;
    private String type;
    private String authorName;

    // Constructor vacío (necesario para edición)
    public Evento() {}

    // Constructor para crear nuevos eventos
    public Evento(int userId, String title, Date eventDate, Time eventTime, String type) {
        this.userId = userId;
        this.title = title;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.type = type;
    }

    // Constructor para recuperar de la BBDD
    public Evento(int id, int userId, String title, Date eventDate, Time eventTime, String type, String authorName) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.eventDate = eventDate;
        this.eventTime = eventTime;
        this.type = type;
        this.authorName = authorName;
    }

    // Getters y Setters completos
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    
    public Date getEventDate() { return eventDate; }
    public void setEventDate(Date eventDate) { this.eventDate = eventDate; }
    
    public Time getEventTime() { return eventTime; }
    public void setEventTime(Time eventTime) { this.eventTime = eventTime; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    
    public String getAuthorName() { return authorName; }
    public void setAuthorName(String authorName) { this.authorName = authorName; }
}