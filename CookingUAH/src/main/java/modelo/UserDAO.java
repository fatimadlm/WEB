package modelo;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UserDAO {

    // DATOS DE CONEXIÓN
    // Utilizamos 'create=true' para que, se despliegue donde se despliegue,
    // se cree la misma bbdd.
    private static final String URL = "jdbc:derby://localhost:1527/CookingUAH;create=true";
    private static final String USER = "root";
    private static final String PASS = "root";

    // -----------------------------------------------------------
    // MÉTODO AUXILIAR PARA CONECTARSE
    // -----------------------------------------------------------
    private Connection getConexion() throws SQLException {
        try {
            Class.forName("org.apache.derby.jdbc.ClientDriver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return DriverManager.getConnection(URL, USER, PASS);
    }

    // -----------------------------------------------------------
    // 1. MÉTODO PARA LOGIN
    // -----------------------------------------------------------
    public User validarLogin(String username, String password) {
        User usuario = null;
        String sql = "SELECT * FROM users WHERE username = ? AND password = ?";

        // Ahora sí, llamamos a getConexion() que es como se llama arriba
        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, password);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    usuario = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("avatar"),
                        rs.getString("role"),
                        rs.getBoolean("active")
                    );
                }
            }
        } catch (SQLException e) {
            System.err.println("Error en validarLogin: " + e.getMessage());
            e.printStackTrace();
            //getMessage no permite identificar dónde está el error. Hay que pelearse con el código
            // mejor printStackTrace().
        }
        return usuario;
    }

    // -----------------------------------------------------------
    // 2. MÉTODO PARA BUSCAR USUARIOS
    // -----------------------------------------------------------
    public List<User> buscarUsuarios(String busqueda) {
        List<User> lista = new ArrayList<>();
        String sql = "SELECT * FROM users WHERE username LIKE ?"; 

        // Aquí también usamos getConexion()
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
                        rs.getBoolean("active")
                    );
                    lista.add(u);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }
    
    // -----------------------------------------------------------
    // 3. MÉTODO PARA REGISTRAR
    // -----------------------------------------------------------
    public boolean registrarUsuario(User usuario) {
        boolean registrado = false;
        String sql = "INSERT INTO users (username, email, password, avatar, role, active) VALUES (?, ?, ?, ?, 'user', true)";

        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, usuario.getUsername());
            pstmt.setString(2, usuario.getEmail());
            pstmt.setString(3, usuario.getPassword());
            pstmt.setString(4, "Imagenes/default.png");
            
            int filasAfectadas = pstmt.executeUpdate();
            registrado = (filasAfectadas > 0);

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return registrado;
    }
    
    // -----------------------------------------------------------
    // 4. OBTENER POR ID
    // -----------------------------------------------------------
    public User obtenerPorId(int id) {
        User usuario = null;
        String sql = "SELECT * FROM users WHERE id = ?";

        try (Connection conn = getConexion();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
             
            pstmt.setInt(1, id);
            
            try (ResultSet rs = pstmt.executeQuery()) {
                if(rs.next()){
                    usuario = new User(
                        rs.getInt("id"),
                        rs.getString("username"),
                        rs.getString("email"),
                        rs.getString("password"),
                        rs.getString("avatar"),
                        rs.getString("role"),
                        rs.getBoolean("active")
                    );
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return usuario;
    }
}