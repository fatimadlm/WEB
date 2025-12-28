<%@ page contentType="text/html; charset=UTF-8" language="java" %>
<%@ page import="java.util.List" %>
<%@ page import="modelo.User" %> 
<%
    // 1. PROTECCIÓN DE SESIÓN
    // Si no hay usuario en la sesión, lo mandamos al login.
    User usuarioLogueado = (User) session.getAttribute("usuario");
    if (usuarioLogueado == null) {
        response.sendRedirect("login.jsp");
        return;
    }

    // Recuperamos la lista de resultados si el Servlet nos la ha enviado
    List<User> resultados = (List<User>) request.getAttribute("resultadosBusqueda");
%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CookingUAH - Buscar Amigos</title>
  <link rel="stylesheet" href="css/Home.css" />
</head>
<body>
  <div class="home-container">
    
    <aside class="sidebar">
      <div> 
        <div class="logo">
          <img src="Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img" />
          <h1>CookingUAH</h1>
        </div>

        <nav class="nav-buttons">
          <a href="feed.jsp" class="btn-secondary">Inicio</a> 
          <a href="mensajes.jsp" class="btn-secondary">Mensajes</a>
          <a href="eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="PerfilServlet?id=<%= usuarioLogueado.getId() %>" class="btn-secondary">Mi Perfil</a>
          <a href="podio.jsp" class="btn-secondary">Recetas TOP</a>
          <button id="openModalBtn" class="btn-primary">Crear publicación</button>
        </nav>
      </div>

      <a href="LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed">
      <div class="top-bar" style="justify-content: center">
        <form action="BuscarServlet" method="GET" class="search-bar">
          <input type="text" name="busqueda" id="searchInput" placeholder="Buscar amigos por nombre..." />
          <button type="submit" id="searchBtn">Buscar</button>
        </form>
      </div>

      <h2>Explorar Usuarios</h2>

      <div id="usersContainer">
        
        <% 
           // LÓGICA DE VISUALIZACIÓN
           // Si la lista no es nula y tiene gente, la recorremos
           if (resultados != null && !resultados.isEmpty()) {
               for (User u : resultados) {
        %>
            <div class="user-card">
                <img src="<%= u.getAvatar() != null ? u.getAvatar() : "Imagenes/default.png" %>" alt="Avatar" class="user-avatar">
                <h3><%= u.getUsername() %></h3>
                <p><%= u.getEmail() %></p>
                
                <form action="SeguirServlet" method="POST">
                    <input type="hidden" name="idASeguir" value="<%= u.getId() %>">
                    <button type="submit">Seguir</button>
                </form>
            </div>
        <% 
               } 
           } else if (resultados != null && resultados.isEmpty()) {
        %>
            <p>No se encontraron usuarios con ese nombre.</p>
        <% 
           } else {
        %>
            <p>Usa el buscador para encontrar chefs.</p>
        <% } %>

      </div>
    </main>
  </div>

  <div id="postModal" class="modal-backdrop" style="display: none;">
    <div class="modal-content">
      <span class="modal-close">&times;</span>
      <h2>Crear una nueva publicación</h2>
      
      <form action="PublicacionServlet" method="POST" enctype="multipart/form-data">
          <div id="modalPostBox" class="modal-post-box">
            <textarea name="contenido" id="modalNewPostContent" placeholder="¿Qué estás cocinando, <%= usuarioLogueado.getUsername() %>?"></textarea>
            
            <div id="modalImagePreviewContainer" class="image-preview-container" style="display: none;">
                <img id="modalImagePreview" src="#" alt="Previsualización" class="image-preview" style="display: none;">
                <button type="button" id="modalRemoveImageBtn" class="remove-image-btn">✖</button>
            </div>
            
            <div class="post-controls">
              <div class="post-options">
                <input type="file" name="imagen" id="modalImageUpload" accept="image/*" style="display: none;">
                <button type="button" class="option-btn" id="modalAddImgBtn" title="Añadir Imagen">📸</button>
              </div>
              <button type="submit" id="modalNewPostBtn">Publicar Receta</button>
            </div>
          </div>
      </form>

    </div>
  </div>

  <script type="module" src="js/Home.js"></script>
  </body>
</html>