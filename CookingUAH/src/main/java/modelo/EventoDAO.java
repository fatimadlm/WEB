package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class EventoDAO {
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    public List<Evento> listarTodos() {
        List<Evento> eventos = new ArrayList<>();
        // JOIN con users para saber el nombre del organizador
        String sql = "SELECT e.*, u.username FROM events e JOIN users u ON e.user_id = u.id ORDER BY e.event_date ASC";
        
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            
            while (rs.next()) {
                eventos.add(new Evento(
                    rs.getInt("id"),
                    rs.getInt("user_id"),
                    rs.getString("title"),
                    rs.getDate("event_date"),
                    rs.getTime("event_time"),
                    rs.getString("type"),
                    rs.getString("username")
                ));
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return eventos;
    }

    public boolean crear(Evento ev) {
        String sql = "INSERT INTO events (user_id, title, event_date, event_time, type) VALUES (?, ?, ?, ?, ?)";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, ev.getUserId());
            ps.setString(2, ev.getTitle());
            ps.setDate(3, ev.getEventDate());
            ps.setTime(4, ev.getEventTime());
            ps.setString(5, ev.getType());
            
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }
}