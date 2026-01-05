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
    private String authorName; // Para mostrar quién lo creó en el calendario

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

    // Getters y Setters
    public int getId() { return id; }
    public int getUserId() { return userId; }
    public String getTitle() { return title; }
    public Date getEventDate() { return eventDate; }
    public Time getEventTime() { return eventTime; }
    public String getType() { return type; }
    public String getAuthorName() { return authorName; }
}