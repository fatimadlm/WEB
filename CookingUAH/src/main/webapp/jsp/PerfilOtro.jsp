<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // 1. Verificación de seguridad: el usuario debe estar logueado
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
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
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
          <h2 id="profileName">${perfil.username}</h2>
          <p class="usuario" id="profileUsername">@${perfil.username}</p>
          <p class="bio" id="profileBio">${not empty perfil.bio ? perfil.bio : 'Este usuario aún no tiene biografía.'}</p>
          
          <div class="perfil-stats">
              <a href="javascript:void(0)" onclick="abrirSeguidores()" class="stat-link">
                <strong><span id="followersCount">${seguidoresCount}</span></strong> Seguidores
              </a>
              <a href="javascript:void(0)" onclick="abrirSiguiendo()" class="stat-link">
                <strong><span id="followingCount">${siguiendoCount}</span></strong> Siguiendo
              </a>
          </div>

          <%-- BLOQUE MODIFICADO: Lógica de Seguir/Dejar de Seguir --%>
          <div class="perfil-actions-container" style="margin-top: 15px;">
              <c:choose>
                  <c:when test="${esSeguido}">
                      <%-- Si ya lo sigue, el botón llama a DejarDeSeguirServlet --%>
                      <form action="${pageContext.request.contextPath}/DejarDeSeguirServlet" method="POST" style="display:inline;">
                          <input type="hidden" name="idSeguido" value="${perfil.id}">
                          <button type="submit" class="follow-btn following">
                              Dejar de seguir
                          </button>
                      </form>
                  </c:when>
                  <c:otherwise>
                      <%-- Si no lo sigue, el botón llama a SeguirServlet --%>
                      <form action="${pageContext.request.contextPath}/SeguirServlet" method="POST" style="display:inline;">
                          <input type="hidden" name="idSeguido" value="${perfil.id}">
                          <button type="submit" class="follow-btn">
                              Seguir
                          </button>
                      </form>
                  </c:otherwise>
              </c:choose>

              <%-- Botón para abrir chat directo --%>
              <a href="${pageContext.request.contextPath}/CargarChatServlet?id=${perfil.id}" 
                 class="btn-secondary" style="display:inline-block; margin-left: 10px; vertical-align: middle;">
                 Enviar Mensaje
              </a>
          </div>
        </div>
      </section>

      <section class="perfil-posts" id="profilePostsContainer">
        <h3>Publicaciones de ${perfil.username}</h3>
        
        <c:forEach var="post" items="${posts}">
            <div class="post">
                <div class="post-header">
                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${perfil.avatar}" 
                         onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
                         class="user-img" />
                    <div>
                        <h4>@${perfil.username}</h4>
                        <span>${post.createdAt}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.title}</p>
                    <c:if test="${not empty post.image}">
                        <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.image}" alt="Imagen post" class="post-img" />
                    </c:if>
                </div>
                <div class="post-actions">
                    <form action="${pageContext.request.contextPath}/InteraccionServlet" method="POST" style="display:inline;">
                        <input type="hidden" name="accion" value="like">
                        <input type="hidden" name="postId" value="${post.id}">
                        <button type="submit" class="like-btn ${post.likedByCurrentUser ? 'liked' : ''}">
                            ❤️ Me gusta (${post.likesCount})
                        </button>
                    </form>
                </div>
                <div class="comments">
                    <c:forEach var="c" items="${post.comments}">
                        <p><strong>@${c.authorName}:</strong> ${c.content}</p>
                    </c:forEach>
                </div>
            </div>
        </c:forEach>

        <c:if test="${empty posts}">
            <p>Este usuario aún no tiene publicaciones.</p>
        </c:if>
      </section>
    </main>
  </div>

  <%-- Modales (Sin cambios) --%>
  <div id="userListModal" class="user-list-modal" style="display: none;">
    <div class="modal-backdrop" onclick="cerrarListaUsuarios()"></div>
    <div class="modal-panel">
      <header class="modal-header">
        <h2 id="userListTitle">Usuarios</h2>
        <button onclick="cerrarListaUsuarios()" class="modal-close-btn">✕</button>
      </header>
      <div class="modal-body">
        <ul id="userList" class="user-list"></ul>
      </div>
    </div>
  </div>

  <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
  <script src="${pageContext.request.contextPath}/js/Home.js"></script>
  <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
</body>
</html>
