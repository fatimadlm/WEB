<%-- 
    Document   : login
    Created on : 28 dic 2025, 16:13:54
    Author     : cjcre
--%>

<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Cooking UAH - Iniciar sesión</title>
  <link rel="stylesheet" href="css/style.css" /> 
</head>
<body>
  <div class="login-container">
    <header class="logo">
      <img src="Imagenes/logo.png" alt="Logo Cooking UAH" class="logo-img" />
      <h1>Cooking UAH</h1>
    </header>

    <main class="login-box">
      <h2>Inicio de sesión</h2>
        
      <% 
          String error = (String) request.getAttribute("mensajeError");
          String exito = (String) request.getAttribute("mensajeExito");
          
          if (error != null) { 
      %>
          <div style="color: red; margin-bottom: 10px; font-weight: bold; text-align: center;">
              <%= error %>
          </div>
      <% } 
          if (exito != null) { 
      %>
          <div style="color: green; margin-bottom: 10px; font-weight: bold; text-align: center;">
              <%= exito %>
          </div>
      <% } %>

      <form action="LoginServlet" method="POST" id="loginForm">
        
        <label for="username">Nombre de usuario</label>
        <input type="text" id="username" name="username" placeholder="Introduce tu usuario" required />

        <label for="password">Contraseña</label>
        <input type="password" id="password" name="password" placeholder="Introduce tu contraseña" required />

        <button type="submit" class="btn-primary">Iniciar sesión</button>

        <p class="register-text">
          ¿No tienes cuenta?
          <a href="registro.jsp">Registrarse</a> 
        </p>
      </form>
    </main>
  </div>
</body>
</html>
