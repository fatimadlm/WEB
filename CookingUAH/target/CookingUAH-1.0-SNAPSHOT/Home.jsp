<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // Recuperar usuario (por seguridad visual)
    User actual = (User) session.getAttribute("usuario");
    if (actual == null) { response.sendRedirect("login.jsp"); return; }
%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CookingUAH - Inicio</title>
  <link rel="stylesheet" href="css/Home.css">
  
  <style>
      .hidden-input { display: none; }
      .comment-box { display: flex; gap: 5px; margin-top: 10px; }
      .comment-box input { flex: 1; padding: 5px; border-radius: 5px; border: 1px solid #ccc;}
      .nav-buttons form { width: 100%; }
      
      
      .btn-add-photo {
        background-color: #fff3e0; 
        color: #d84315;            
        border: 2px dashed #ffb74d; 
        padding: 8px 15px;
        border-radius: 20px;       /* Bordes redondos */
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        transition: all 0.3s ease;
    }

    .btn-add-photo:hover {
        background-color: #ffe0b2; /* Más oscuro al pasar el ratón */
        transform: translateY(-2px); /* Se levanta un poco */
        box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
    
  </style>
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
          <a href="FeedServlet" class="btn-secondary">Inicio</a> 
          <a href="Mensajes.jsp" class="btn-secondary">Mensajes</a>
          <a href="Eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="MiPerfil.jsp" class="btn-secondary">Mi Perfil</a>
          <a href="Podio.jsp" class="btn-secondary">Recetas TOP</a>
          
          <button onclick="document.getElementById('caja-publicar').scrollIntoView({behavior: 'smooth'}); document.getElementById('tituloPost').focus();" class="btn-primary">Crear publicación</button>
        </nav>
      </div>

      <a href="index.html" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed">
      
      <div class="top-bar">
        <div class="search-bar">
          <form action="BuscarServlet" method="GET" style="display:flex; gap:10px;">
              <input type="text" name="busqueda" placeholder="Buscar usuarios..." />
              <button type="submit" style="background:#cc5500; color:white; border:none; padding:8px; border-radius:5px; cursor:pointer;">Buscar</button>
          </form>
        </div>
        <a href="BuscarServlet" class="btn-secondary">Haz amigos</a>
      </div>

      <div class="create-post" id="caja-publicar">
        <form action="PublicarServlet" method="POST" enctype="multipart/form-data">
            <textarea id="tituloPost" name="titulo" placeholder="¿Qué estás cocinando, <%= actual.getUsername() %>?" required style="width:100%; padding:10px; margin-bottom:10px;"></textarea>
            
            <div class="post-controls">
                <div class="post-options">
                    <label for="file-upload" class="btn-add-photo">
                        📸 Añadir Foto
                    </label>
                    <input id="file-upload" type="file" name="imagen" accept="image/*" class="hidden-input" onchange="document.getElementById('nombre-archivo').innerText = this.files[0].name;">
                    <span id="nombre-archivo" style="font-size:0.8em; color:#666;"></span>
                </div>
                <button type="submit" id="newPostBtn">Publicar Receta</button>
            </div>
        </form>
      </div>

      <h2>Recetas de tus amigos</h2>
      <div id="postsContainer">
          
          <c:forEach var="post" items="${listaPosts}">
              <div class="post">
                <div class="post-header">
                  <a href="PerfilOtro.jsp?id=${post.userId}">
                    <img src="${post.authorAvatar}" class="user-img" onerror="this.src='Imagenes/default.png'">
                  </a>
                  <div>
                    <a href="PerfilOtro.jsp?id=${post.userId}" style="text-decoration:none; color:inherit;">
                        <h3>${post.authorName}</h3>
                    </a>
                    <span>${post.createdAt}</span>
                  </div>
                </div>

                <div class="post-content">
                  <p>${post.title}</p>
                  <c:if test="${not empty post.image}">
                      <img src="${post.image}" class="post-img" alt="Post" />
                  </c:if>
                </div>
                
                <div class="post-actions">
                  <form action="InteraccionServlet" method="POST" style="display:inline;">
                      <input type="hidden" name="accion" value="like">
                      <input type="hidden" name="postId" value="${post.id}">
                      <button type="submit" class="like-btn ${post.likedByCurrentUser ? 'liked' : ''}">
                          ❤️ ${post.likesCount} Me gusta
                      </button>
                  </form>
                  <button class="comment-btn">💬 Comentar</button>
                </div>

                <div class="comments">
                    <c:forEach var="comentario" items="${post.comments}">
                        <p><strong>${comentario.authorName}:</strong> ${comentario.content}</p>
                    </c:forEach>
                    
                    <form action="InteraccionServlet" method="POST" class="comment-box">
                        <input type="hidden" name="accion" value="comentar">
                        <input type="hidden" name="postId" value="${post.id}">
                        <input type="text" name="comentario" placeholder="Escribe un comentario..." required>
                        <button type="submit" style="background:#cc5500; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Enviar</button>
                    </form>
                </div>
              </div>
          </c:forEach>

          <c:if test="${empty listaPosts}">
              <p style="text-align: center; color: #666;">No hay publicaciones aún. ¡Sé el primero!</p>
          </c:if>

      </div>
    </main>
  </div>
  <script>
    // Configuración: Tiempo entre actualizaciones = 3 segundos
    const TIEMPO_REFRESCO = 3000;

    function actualizarFeed() {
        // 1. Comprobamos si el usuario está escribiendo (Input o Textarea)
        // Si está escribiendo, NO actualizamos para no borrarle lo que escribe.
        const elementoActivo = document.activeElement;
        const escribiendo = elementoActivo && (elementoActivo.tagName === 'INPUT' || elementoActivo.tagName === 'TEXTAREA');

        if (escribiendo) {
            console.log("Usuario escribiendo, saltamos actualización...");
            return;
        }

        // 2. Pedimos los datos al Servlet en segundo plano
        fetch('FeedServlet')
            .then(response => response.text())
            .then(html => {
                // 3. Convertimos el texto recibido en un documento HTML virtual
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 4. Buscamos el contenedor nuevo de posts
                const nuevosPosts = doc.getElementById('postsContainer').innerHTML;
                
                // 5. Reemplazamos el viejo por el nuevo
                document.getElementById('postsContainer').innerHTML = nuevosPosts;
                
                console.log("Feed actualizado automáticamente 🔄");
            })
            .catch(error => console.error('Error al actualizar:', error));
    }

    // Iniciamos el temporizador
    setInterval(actualizarFeed, TIEMPO_REFRESCO);
</script>
</body>
</html>