<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // Recuperar usuario (Seguridad nivel JSP)
    User actual = (User) session.getAttribute("usuario");
    if (actual == null) { 
        response.sendRedirect(request.getContextPath() + "/jsp/login.jsp"); 
        return; 
    }
%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>CookingUAH - Inicio</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
</head>
<body>
  <div class="home-container">
    
    <aside class="sidebar">
      <div> 
        <div class="logo">
          <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img" />
          <h1>CookingUAH</h1>
        </div>

        <nav class="nav-buttons">
          <a href="${pageContext.request.contextPath}/FeedServlet" class="btn-secondary">Inicio</a> 
           <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>          <a href="${pageContext.request.contextPath}/jsp/Eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/jsp/MiPerfil.jsp" class="btn-secondary">Mi Perfil</a> 
          <a href="${pageContext.request.contextPath}/jsp/Podio.jsp" class="btn-secondary">Recetas TOP</a>
          <button onclick="document.getElementById('caja-publicar').scrollIntoView({behavior: 'smooth'}); document.getElementById('tituloPost').focus();" class="btn-primary">Crear publicación</button>
        </nav>
      </div>

      <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed">
      <div class="top-bar">
        <div class="search-bar">
          <form action="BuscarServlet" method="GET">
              <input type="text" name="busqueda" placeholder="Buscar usuarios..." />
              <button type="submit">Buscar</button>
          </form>
        </div>
        <a href="BuscarServlet" class="btn-secondary">Haz amigos</a>
      </div>

      <div class="create-post" id="caja-publicar">
        <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
            <textarea id="tituloPost" name="titulo" placeholder="¿Qué estás cocinando, <%= actual.getUsername() %>?" required></textarea>
            
            <div class="post-controls">
                <div class="post-options">
                    <label for="file-upload" class="btn-add-photo">📸 Añadir Foto</label>
                    <input id="file-upload" type="file" name="imagen" accept="image/*" style="display:none;" onchange="document.getElementById('nombre-archivo').innerText = this.files[0].name;">
                    <span id="nombre-archivo" style="font-size:0.8em; color:#666; margin-left:10px;"></span>
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
                    <img src="${pageContext.request.contextPath}/${post.authorAvatar}" class="user-img" onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'">
                  </a>
                  <div>
                    <a href="PerfilOtro.jsp?id=${post.userId}" class="post-author-link">
                        <h3>${post.authorName}</h3>
                    </a>
                    <span>${post.createdAt}</span>
                  </div>
                </div>

                <div class="post-content">
                  <p>${post.title}</p>
                  <c:if test="${not empty post.image}">
                      <img src="${pageContext.request.contextPath}/${post.image}" class="post-img" alt="Post" />
                  </c:if>
                </div>
                
                <div class="post-actions">
                  <form action="InteraccionServlet" method="POST">
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
                        <button type="submit">Enviar</button>
                    </form>
                </div>
              </div>
          </c:forEach>

          <c:if test="${empty listaPosts}">
              <p style="text-align: center; color: #666; padding: 20px;">No hay publicaciones aún. ¡Sé el primero!</p>
          </c:if>
      </div>
    </main>
  </div>

  <script>
    const TIEMPO_REFRESCO = 3000;

    function actualizarFeed() {
        const elementoActivo = document.activeElement;
        const escribiendo = elementoActivo && (elementoActivo.tagName === 'INPUT' || elementoActivo.tagName === 'TEXTAREA');

        if (escribiendo) return;

        fetch('${pageContext.request.contextPath}/FeedServlet')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const nuevosPosts = doc.getElementById('postsContainer').innerHTML;
                document.getElementById('postsContainer').innerHTML = nuevosPosts;
                console.log("Feed sincronizado con BBDD 🔄");
            })
            .catch(err => console.error('Error en refresco:', err));
    }

    setInterval(actualizarFeed, TIEMPO_REFRESCO);
  </script>
</body>
</html>