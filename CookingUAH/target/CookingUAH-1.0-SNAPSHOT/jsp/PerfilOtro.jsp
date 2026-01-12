<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    User actual = (User) session.getAttribute("usuario");
    if (actual == null) { 
        response.sendRedirect(request.getContextPath() + "/jsp/login.jsp"); 
        return; 
    }
%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Perfil de ${perfil.username} - CookingUAH</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Perfil.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
</head>

<body data-context="${pageContext.request.contextPath}">
  <input type="hidden" id="userIdHidden" value="${perfil.id}">

  <div class="home-container">
    <aside class="sidebar">
      <div> 
        <div class="logo">
          <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img" />
          <h1>CookingUAH</h1>
        </div>
        <nav class="nav-buttons">
          <a href="${pageContext.request.contextPath}/FeedServlet" class="btn-secondary">Inicio</a> 
          <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a> 
          <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary">Eventos</a>
          <a href="${pageContext.request.contextPath}/NotificacionesServlet" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
          <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
          <button onclick="abrirModal()" class="btn-primary">Crear publicación</button>
        </nav>
      </div>
      <a href="${pageContext.request.contextPath}/LogoutServlet" id="btnLogout" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed perfil-page">
      <section class="perfil-info">
        <img src="${pageContext.request.contextPath}/VerImagen?nombre=${perfil.avatar}" 
             onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
             alt="Foto de perfil" class="perfil-img" />
             
        <div class="perfil-datos">
          <h2>${perfil.username}</h2>
          <p class="usuario">@${perfil.username}</p>
          <p class="bio">${not empty perfil.bio ? perfil.bio : 'Este usuario aún no tiene biografía.'}</p>
          
          <div class="perfil-stats">
              <a href="javascript:void(0)" onclick="abrirSeguidores()" id="showFollowers" class="stat-link">
                <strong><span id="followersCount">${seguidoresCount}</span></strong> Seguidores
              </a>
              <a href="javascript:void(0)" onclick="abrirSiguiendo()" id="showFollowing" class="stat-link">
                <strong><span id="followingCount">${siguiendoCount}</span></strong> Siguiendo
              </a>
          </div>

          <div class="perfil-actions-container" style="margin-top: 15px;">
              <c:choose>
                  <c:when test="${esSeguido}">
                      <form action="${pageContext.request.contextPath}/DejarDeSeguirServlet" method="POST" style="display:inline;">
                          <input type="hidden" name="idSeguido" value="${perfil.id}">
                          <button type="submit" class="follow-btn following">Dejar de seguir</button>
                      </form>
                  </c:when>
                  <c:otherwise>
                      <form action="${pageContext.request.contextPath}/SeguirServlet" method="POST" style="display:inline;">
                          <input type="hidden" name="idSeguido" value="${perfil.id}">
                          <button type="submit" class="follow-btn">Seguir</button>
                      </form>
                  </c:otherwise>
              </c:choose>

              <a href="${pageContext.request.contextPath}/CargarChatServlet?id=${perfil.id}" 
                 class="btn-secondary" style="display:inline-block; margin-left: 10px; vertical-align: middle;">
                 Enviar Mensaje
              </a>
          </div>
        </div>
      </section>

      <section class="perfil-posts">
        <h3>Publicaciones de ${perfil.username}</h3>
        <c:forEach var="post" items="${posts}">
            <div class="post">
                <div class="post-header">
                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${perfil.avatar}" onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" class="user-img" />
                    <div>
                        <h4>@${perfil.username}</h4>
                        <span>${post.createdAt}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.title}</p>
                    <c:if test="${not empty post.image}">
                        <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.image}" class="post-img" />
                    </c:if>
                </div>
                <div class="post-actions">
                    <button type="button" id="btn-like-${post.id}" class="like-btn ${post.likedByCurrentUser ? 'liked' : ''}" onclick="darLikePerfil('${post.id}')">
                        ❤️ Me gusta (<span id="likes-count-${post.id}">${post.likesCount}</span>)
                    </button>
                </div>
            </div>
        </c:forEach>
      </section>
    </main>
  </div>

  <div id="userListModal" class="modal-backdrop" style="display: none;">
    <div class="modal-content" style="max-width: 400px; position: relative;">
        <span class="modal-close" onclick="cerrarListaUsuarios()">&times;</span>
        <h2 id="userListTitle">Usuarios</h2>
        <div id="userListContainer" style="max-height: 400px; overflow-y: auto; margin-top: 15px;"></div>
    </div>
  </div>

  <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
  <script src="${pageContext.request.contextPath}/js/Home.js"></script>
  <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
  <script src="${pageContext.request.contextPath}/js/PerfilOtro.js"></script>
</body>
</html>