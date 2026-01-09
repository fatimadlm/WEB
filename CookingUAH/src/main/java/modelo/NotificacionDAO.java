package modelo;

import modelo.Notificacion;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NotificacionDAO {
    // Usamos tus credenciales de UserDAO
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD";
    private static final String USER = "root";
    private static final String PASS = "root";

    private Connection getConexion() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASS);
    }

    // Crear una nueva notificación (ej. cuando alguien te sigue)
    public void crear(int userId, String texto, String tipo) {
        String sql = "INSERT INTO NOTIFICATIONS (USER_ID, TEXT, TYPE, IS_READ, CREATED_AT) VALUES (?, ?, ?, false, CURRENT_TIMESTAMP)";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            ps.setString(2, texto);
            ps.setString(3, tipo);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Notificacion> listarPorUsuario(int userId) {
    List<Notificacion> lista = new ArrayList<>();
    // Asegúrate de que no haya un "FETCH FIRST 1 ROWS ONLY" al final de tu SQL
    String sql = "SELECT * FROM NOTIFICATIONS WHERE USER_ID = ? ORDER BY CREATED_AT DESC";
    
    try (Connection conn = getConexion();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        ps.setInt(1, userId);
        
        try (ResultSet rs = ps.executeQuery()) {
            // ¡IMPORTANTE!: Debe ser WHILE para traer todas
            while (rs.next()) { 
                Notificacion n = new Notificacion();
                n.setId(rs.getInt("ID"));
                n.setText(rs.getString("TEXT"));
                n.setType(rs.getString("TYPE"));
                n.setIsRead(rs.getBoolean("IS_READ"));
                n.setCreatedAt(rs.getTimestamp("CREATED_AT"));
                lista.add(n);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return lista; // Si el bucle es 'while', aquí debería haber 4 elementos
}
}