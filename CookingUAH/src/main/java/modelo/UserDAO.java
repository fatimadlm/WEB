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
        // Corregido: Usar getConexion() para mantener consistencia
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
}