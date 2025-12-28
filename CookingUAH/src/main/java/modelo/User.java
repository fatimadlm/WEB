package modelo;

import java.io.Serializable;

public class User implements Serializable {
    
    // 1. Atributos (Coinciden con las columnas de tu tabla SQL 'users')
    private int id;
    private String username;
    private String email;
    private String password;
    private String avatar;
    private String role;    // 'admin' o 'user'
    private boolean active;

    // 2. Constructor Vacío (Obligatorio para que funcione bien con JSP/Frameworks)
    public User() {
    }

    // 3. Constructor Completo (Útil para crear objetos rápidos desde el DAO)
    public User(int id, String username, String email, String password, String avatar, String role, boolean active) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.role = role;
        this.active = active;
    }
    
    // Constructor sin ID (Para cuando vamos a registrar uno nuevo y aún no tiene ID de la BBDD)
    public User(String username, String email, String password, String avatar) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.avatar = avatar;
        this.role = "user"; // Por defecto
        this.active = true; // Por defecto
    }

    // 4. Getters y Setters (Para leer y escribir datos, usados por JSP como ${usuario.username})
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
    
    // Método toString (Opcional, pero muy útil para depurar errores y ver qué datos tiene el objeto)
    @Override
    public String toString() {
        return "User{" + "id=" + id + ", username=" + username + ", email=" + email + ", role=" + role + '}';
    }
}