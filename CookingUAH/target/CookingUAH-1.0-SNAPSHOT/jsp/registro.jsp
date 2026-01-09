<%-- 
    Document   : registro
    Created on : 28 dic 2025, 16:53:39
    Author     : cjcre
--%>

<%@ page contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cooking UAH - Registro</title>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <div class="login-container">
    <header class="logo">
      <img src="../Imagenes/logo.png" alt="Logo Cooking UAH" class="logo-img">
      <h1>Cooking UAH</h1>
    </header>

    <main class="login-box">
      <h2>Crear Cuenta</h2>

      <% String error = (String) request.getAttribute("mensajeError");
         if (error != null) { %>
          <p style="color: red; font-weight: bold; text-align: center;"><%= error %></p>
      <% } %>

        <form action="${pageContext.request.contextPath}/RegistroServlet" method="POST">

            <label for="username">Nombre de usuario</label>
            <input type="text" name="username" placeholder="Elige un nombre único" required />

            <label for="email">Correo Electrónico</label>
            <input type="email" name="email" placeholder="tu@email.com" required />

            <label for="password">Contraseña</label>
            <input type="password" name="password" placeholder="Mínimo 4 caracteres" required />

            <button type="submit" class="btn-primary">Registrarse</button>

            <p class="register-text">
              ¿Ya tienes cuenta?
              <a href="${pageContext.request.contextPath}/jsp/login.jsp">Iniciar Sesión</a>
            </p>
      </form>   
    </main>
  </div>
</body>
</html>