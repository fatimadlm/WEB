package modelo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    private static final String URL = "jdbc:derby://localhost:1527/CookingUAHBBDD;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    private Connection getConexion() throws SQLException {
        try {
            Class.forName("org.apache.derby.jdbc.ClientDriver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }

    // 1. MÉTODO PARA LOGIN (Actualizado con 8 parámetros)
    public User validarLogin(String username, String password) {
        User usuario = null;
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";

        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, password);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    // Importante: Usar el constructor de 8 parámetros
                    usuario = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("avatar"),
                        rs.getString("role"),
                        rs.getBoolean("active"),
                        rs.getString("bio")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usuario;
    }

    // 2. MÉTODO PARA BUSCAR USUARIOS (Actualizado con 8 parámetros)
    public List<User> buscarUsuarios(String busqueda) {
        List<User> lista = new ArrayList<>();
        String sql = "SELECT * FROM users WHERE UPPER(username) LIKE UPPER(?)"; 

        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "%" + busqueda + "%");

            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    User u = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("avatar"),
                        rs.getString("role"),
                        rs.getBoolean("active"),
                        rs.getString("bio")
                    );
                    lista.add(u);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }
    
    // 3. MÉTODO PARA REGISTRAR
    public boolean registrarUsuario(User usuario) {
        boolean registrado = false;
        // Agregamos 'bio' al insert con un valor por defecto o vacío
        String sql = "INSERT INTO users (username, email, password, avatar, role, active, bio) VALUES (?, ?, ?, ?, 'user', true, ?)";

        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, usuario.getUsername());
            pstmt.setString(2, usuario.getEmail());
            pstmt.setString(3, usuario.getPassword());
            pstmt.setString(4, "Imagenes/default.png");
            pstmt.setString(5, "¡Hola! Soy nuevo en CookingUAH."); // Bio por defecto
            
            int filasAfectadas = pstmt.executeUpdate();
            registrado = (filasAfectadas > 0);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return registrado;
    }
    
    // 4. OBTENER POR ID
    public User obtenerUsuarioPorId(int id) {
        User u = null;
        String sql = "SELECT * FROM users WHERE id = ?";
        try (Connection conn = getConexion();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    u = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("avatar"),
                        rs.getString("role"),
                        rs.getBoolean("active"),
                        rs.getString("bio")
                    );
                }
            }
        } catch (SQLException e) { 
            e.printStackTrace(); 
        }
        return u;
    }
    
    /**
    * Bloquea a un usuario estableciendo su columna 'active' a false
    * @param id Identificador único del usuario
    * @return true si se actualizó correctamente
    */
    public boolean bloquearUsuario(int id) {
       String sql = "UPDATE users SET active = false WHERE id = ?";

       try (Connection conn = getConexion();
            PreparedStatement ps = conn.prepareStatement(sql)) {

           ps.setInt(1, id);
           int filas = ps.executeUpdate();
           return filas > 0;

       } catch (SQLException e) {
           e.printStackTrace();
           return false;
       }
    }

    /**
    * Desbloquea a un usuario estableciendo su columna 'active' a true
    * @param id Identificador único del usuario
    * @return true si se actualizó correctamente
    */
    public boolean desbloquearUsuario(int id) {
       String sql = "UPDATE users SET active = true WHERE id = ?";

       try (Connection conn = getConexion();
            PreparedStatement ps = conn.prepareStatement(sql)) {

           ps.setInt(1, id);
           int filas = ps.executeUpdate();
           return filas > 0;

       } catch (SQLException e) {
           e.printStackTrace();
           return false;
       }
    }
    
    /**
    * Elimina permanentemente un usuario de la base de datos
    * @param id Identificador del usuario a borrar
    * @return true si la operación tuvo éxito
    */
    public boolean eliminarUsuario(int id) {
       String sql = "DELETE FROM users WHERE id = ?";

       try (Connection conn = getConexion();
            PreparedStatement ps = conn.prepareStatement(sql)) {

           ps.setInt(1, id);
           int filasAfectadas = ps.executeUpdate();
           return filasAfectadas > 0;

       } catch (SQLException e) {
           e.printStackTrace();
           return false;
       }
    }
    
    /**
 * Comprueba si un usuario sigue a otro
 * @param followerId ID del usuario que realiza la acción (tú)
 * @param followedId ID del usuario cuyo perfil estás viendo
 * @return true si ya existe la relación en la tabla followers
 */
public boolean comprobarSeguimiento(int followerId, int followedId) {
    String sql = "SELECT 1 FROM followers WHERE follower_id = ? AND followed_id = ?";
    try (Connection conn = getConexion();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setInt(1, followerId);
        ps.setInt(2, followedId);
        
        try (ResultSet rs = ps.executeQuery()) {
            return rs.next(); // Retorna true si encuentra una fila
        }
    } catch (SQLException e) {
        e.printStackTrace();
        return false;
    }
}

/**
 * Cuenta cuántas personas siguen a un usuario específico
 * @param userId ID del usuario a consultar
 * @return Número total de seguidores
 */
public int contarSeguidores(int userId) {
    String sql = "SELECT COUNT(*) FROM followers WHERE followed_id = ?";
    try (Connection conn = getConexion();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setInt(1, userId);
        
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return 0;
}

/**
 * Cuenta a cuántas personas está siguiendo un usuario específico
 * @param userId ID del usuario a consultar
 * @return Número total de seguidos
 */
public int contarSiguiendo(int userId) {
    String sql = "SELECT COUNT(*) FROM followers WHERE follower_id = ?";
    try (Connection conn = getConexion();
         PreparedStatement ps = conn.prepareStatement(sql)) {
        
        ps.setInt(1, userId);
        
        try (ResultSet rs = ps.executeQuery()) {
            if (rs.next()) {
                return rs.getInt(1);
            }
        }
    } catch (SQLException e) {
        e.printStackTrace();
    }
    return 0;
}
}