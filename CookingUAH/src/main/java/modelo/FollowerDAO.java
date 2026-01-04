package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FollowerDAO {
    // Mantenemos las mismas constantes de conexión que en MensajesDAO
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    /**
     * Cuenta cuántos usuarios siguen a un perfil específico (Seguidores).
     */
    public int contarSeguidores(int userId) {
        String sql = "SELECT COUNT(*) FROM followers WHERE followed_id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return 0;
    }

    /**
     * Cuenta a cuántos usuarios sigue el perfil actual (Siguiendo).
     */
    public int contarSiguiendo(int userId) {
        String sql = "SELECT COUNT(*) FROM followers WHERE follower_id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) return rs.getInt(1);
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return 0;
    }

    /**
     * Registra una nueva relación de seguimiento.
     */
    public boolean seguir(int followerId, int followedId) {
        String sql = "INSERT INTO followers (follower_id, followed_id) VALUES (?, ?)";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { 
            e.printStackTrace(); 
            return false; 
        }
    }

    /**
     * Elimina una relación de seguimiento existente.
     */
    public boolean dejarDeSeguir(int followerId, int followedId) {
        String sql = "DELETE FROM followers WHERE follower_id = ? AND followed_id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { 
            e.printStackTrace(); 
            return false; 
        }
    }

    /**
     * Verifica si existe una relación de seguimiento entre dos usuarios.
     */
    public boolean esSeguidor(int followerId, int followedId) {
        String sql = "SELECT 1 FROM followers WHERE follower_id = ? AND followed_id = ?";
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, followerId);
            ps.setInt(2, followedId);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return false;
    }
}