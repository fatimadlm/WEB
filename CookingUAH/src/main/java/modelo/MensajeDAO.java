package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class MensajeDAO {
    // Configuración de la Base de Datos
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    // --- APORTACIÓN DE TU COMPAÑERO (MÉTODO HELPER PARA CONECTAR) ---
    // Esto limpia el código y evita repetir el DriverManager en cada método.
    private Connection getConexion() throws SQLException {
        try {
            Class.forName("org.apache.derby.jdbc.ClientDriver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }

    // 1. LISTAR CONTACTOS (TU VERSIÓN: ORDENADA POR FECHA RECIENTE)
    public List<User> listarContactos(int miId) {
        List<User> contactos = new ArrayList<>();

        // MANTENEMOS TU SQL AVANZADO (GROUP BY y MAX)
        String sql = "SELECT u.id, u.username, u.avatar, MAX(m.created_at) as fecha_reciente " +
                     "FROM users u " +
                     "JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id) " +
                     "WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id <> ? " +
                     "GROUP BY u.id, u.username, u.avatar " +
                     "ORDER BY fecha_reciente DESC";

        // Usamos su getConexion() aquí
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, miId);
            ps.setInt(2, miId);
            ps.setInt(3, miId);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    User u = new User();
                    u.setId(rs.getInt("id"));
                    u.setUsername(rs.getString("username"));
                    u.setAvatar(rs.getString("avatar"));
                    contactos.add(u);
                }
            } 

            // Rellenamos datos extra
            for (User u : contactos) {
                u.setUltimoMensaje(obtenerUltimoMensajeTexto(conn, miId, u.getId()));
                u.setMensajesNoLeidos(contarNoLeidosDeUsuario(conn, miId, u.getId()));
            }

        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return contactos;
    }

    // 2. OBTENER CONVERSACIÓN
    public List<Mensaje> obtenerConversacion(int emisorId, int receptorId) {
        List<Mensaje> mensajes = new ArrayList<>();
        String sql = "SELECT * FROM messages " +
                     "WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) " +
                     "ORDER BY created_at ASC";
        
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, emisorId); ps.setInt(2, receptorId);
            ps.setInt(3, receptorId); ps.setInt(4, emisorId);
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    mensajes.add(new Mensaje(
                        rs.getInt("id"), rs.getInt("sender_id"), rs.getInt("receiver_id"), 
                        rs.getString("content"), rs.getTimestamp("created_at")
                    ));
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return mensajes;
    }

    // 3. ENVIAR MENSAJE
    public boolean enviarMensaje(int emisorId, int receptorId, String contenido) {
        String sql = "INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES (?, ?, ?, FALSE)";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, emisorId);
            ps.setInt(2, receptorId);
            ps.setString(3, contenido);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) { e.printStackTrace(); return false; }
    }

    // 4. MARCAR COMO LEÍDOS
    public void marcarComoLeidos(int miId, int otroUsuarioId) {
        String sql = "UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, miId); 
            ps.setInt(2, otroUsuarioId); 
            ps.executeUpdate();
        } catch (SQLException e) { e.printStackTrace(); }
    }

    // 5. CONTAR NO LEÍDOS TOTALES (TU VERSIÓN: EXCLUYENDO AUTO-MENSAJES)
    public int contarNoLeidosTotales(int miId) {
        String sql = "SELECT COUNT(DISTINCT sender_id) FROM messages WHERE receiver_id = ? AND is_read = FALSE AND sender_id <> ?";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, miId);
            ps.setInt(2, miId); 
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        } catch (SQLException e) { e.printStackTrace(); }
        return 0;
    }

    // 6. OBTENER IDs DE REMITENTES NO LEÍDOS (TU VERSIÓN: EXCLUYENDO AUTO-MENSAJES)
    public List<Integer> obtenerIdsRemitentesNoLeidos(int miId) {
        List<Integer> ids = new ArrayList<>();
        String sql = "SELECT DISTINCT sender_id FROM messages WHERE receiver_id = ? AND is_read = FALSE AND sender_id <> ?";

        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, miId);
            ps.setInt(2, miId); 
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    ids.add(rs.getInt("sender_id"));
                }
            }
        } catch (SQLException e) { e.printStackTrace(); }
        return ids;
    }

    // 7. OBTENER ÚLTIMO MENSAJE (TU VERSIÓN PÚBLICA: VITAL PARA ACTUALIZADOR.JS)
    // Tu compañero borró esto, lo cual rompería las notificaciones de texto en vivo.
    public String obtenerUltimoMensaje(int miId, int otroId) {
        try (Connection conn = getConexion()) {
            return obtenerUltimoMensajeTexto(conn, miId, otroId);
        } catch (SQLException e) { e.printStackTrace(); return ""; }
    }

    // --- MÉTODOS AUXILIARES PRIVADOS ---

    private String obtenerUltimoMensajeTexto(Connection conn, int miId, int otroId) throws SQLException {
        String sql = "SELECT content FROM messages WHERE (sender_id=? AND receiver_id=?) OR (sender_id=? AND receiver_id=?) ORDER BY created_at DESC";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setMaxRows(1);
            ps.setInt(1, miId); ps.setInt(2, otroId); ps.setInt(3, otroId); ps.setInt(4, miId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                String msg = rs.getString(1);
                return msg.length() > 25 ? msg.substring(0, 25) + "..." : msg;
            }
        }
        return "Sin mensajes";
    }

    private int contarNoLeidosDeUsuario(Connection conn, int miId, int otroId) throws SQLException {
        String sql = "SELECT COUNT(*) FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE";
        try (PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, miId);
            ps.setInt(2, otroId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) return rs.getInt(1);
        }
        return 0;
    }
}