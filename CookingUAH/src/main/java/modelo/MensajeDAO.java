    package modelo;

    import java.sql.*;
    import java.util.ArrayList;
    import java.util.List;

    public class MensajeDAO {
        private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
        private static final String USER = "root";
        private static final String PASS = "root";

        // Obtener la lista de usuarios con los que se ha chateado
        public List<User> listarContactos(int userId) {
            List<User> contactos = new ArrayList<>();
            // Buscamos usuarios que enviaron o recibieron mensajes del usuario actual
            String sql = "SELECT DISTINCT u.id, u.username, u.avatar FROM users u " +
                        "JOIN messages m ON (u.id = m.sender_id OR u.id = m.receiver_id) " +
                        "WHERE (m.sender_id = ? OR m.receiver_id = ?) AND u.id <> ?";
            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, userId);
                ps.setInt(2, userId);
                ps.setInt(3, userId);
                try (ResultSet rs = ps.executeQuery()) {
                    while (rs.next()) {
                        User u = new User();
                        u.setId(rs.getInt("id"));
                        u.setUsername(rs.getString("username"));
                        u.setAvatar(rs.getString("avatar"));
                        contactos.add(u);
                    }
                }
            } catch (SQLException e) { e.printStackTrace(); }
            return contactos;
        }

        // Obtener conversación entre dos usuarios
        // Obtener conversación entre dos usuarios usando el objeto modelo Mensaje
    public List<Mensaje> obtenerConversacion(int emisorId, int receptorId) {
        List<Mensaje> mensajes = new ArrayList<>();
        String sql = "SELECT id, sender_id, receiver_id, content, created_at FROM messages " +
                    "WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) " +
                    "ORDER BY created_at ASC";
        
        try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
            PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, emisorId);
            ps.setInt(2, receptorId);
            ps.setInt(3, receptorId);
            ps.setInt(4, emisorId);
            
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Mensaje m = new Mensaje(
                        rs.getInt("id"),
                        rs.getInt("sender_id"),
                        rs.getInt("receiver_id"),
                        rs.getString("content"),
                        rs.getTimestamp("created_at")
                    );
                    mensajes.add(m);
                }
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return mensajes;
    }

        // Guardar nuevo mensaje
        public boolean enviarMensaje(int emisorId, int receptorId, String contenido) {
            String sql = "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)";
            try (Connection conn = DriverManager.getConnection(URL, USER, PASS);
                PreparedStatement ps = conn.prepareStatement(sql)) {
                ps.setInt(1, emisorId);
                ps.setInt(2, receptorId);
                ps.setString(3, contenido);
                return ps.executeUpdate() > 0;
            } catch (SQLException e) { e.printStackTrace(); return false; }
        }
    }