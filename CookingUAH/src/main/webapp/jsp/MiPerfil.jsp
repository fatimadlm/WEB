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
  <meta charset="UTF-8">
  <title>Mi Perfil - CookingUAH</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/MiPerfil.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/PerfilModal.css">
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
</head>

<body data-context="${pageContext.request.contextPath}">
  <div class="home-container">

    <aside class="sidebar">
      <div>
        <div class="logo">
          <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img">
          <h1>CookingUAH</h1>
        </div>
        <nav class="nav-buttons">
          <a href="${pageContext.request.contextPath}/FeedServlet" class="btn-secondary">Inicio</a>
          <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>
                        <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary">Eventos</a>
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary active">Mi Perfil</a> 
                        <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
          <button onclick="abrirModal()" class="btn-primary">Crear publicación</button>
        </nav>
      </div>
      <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed perfil-page" id="mi-perfil-main">

      <section class="perfil-info">
        <img src="${pageContext.request.contextPath}/VerImagen?nombre=${usuario.avatar}" 
             onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
             alt="Foto de perfil" class="perfil-img">
             
        <div class="perfil-datos">
          <h2>${usuario.username}</h2>
          <p class="usuario">@${usuario.username}</p>
          <p class="bio">${not empty usuario.bio ? usuario.bio : '¡Bienvenido a mi cocina!'}</p>
          
          <div class="perfil-stats">
              <a href="javascript:void(0)" onclick="abrirSeguidores()" class="stat-link">
                <strong>${seguidoresCount}</strong> Seguidores
              </a>
              <a href="javascript:void(0)" onclick="abrirSiguiendo()" class="stat-link">
                <strong>${siguiendoCount}</strong> Siguiendo
              </a>
          </div>

          <a href="#editar" class="btn-editar">Editar perfil</a>
        </div>
      </section>

      <section class="perfil-posts">
        <h3>Mis publicaciones</h3>
        
        <c:forEach var="post" items="${misPosts}">
            <div class="post">
                <div class="post-header">
                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${usuario.avatar}" 
                         onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
                         class="user-img">
                    <div>
                        <h4>${usuario.username}</h4>
                        <span>${post.createdAt}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.title}</p>
                    <c:if test="${not empty post.image}">
                        <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.image}" class="post-img">
                    </c:if>
                </div>
                <div class="post-actions">
                    <button class="like-btn">❤️ ${post.likesCount} Likes</button>
                    <button class="btn-edit-post" onclick="abrirModalEdicion('${post.id}', '${post.title}')">📝 Editar</button>
                    
                    <form action="${pageContext.request.contextPath}/EliminarPostServlet" method="POST" style="display:inline;" onsubmit="return confirm('¿Eliminar esta receta?')">
                        <input type="hidden" name="postId" value="${post.id}">
                        <button type="submit" class="btn-delete-post">🗑️ Eliminar</button>
                    </form>
                </div>
            </div>
        </c:forEach>

        <c:if test="${empty misPosts}">
            <p style="padding: 20px; color: #666;">Aún no has compartido ninguna receta.</p>
        </c:if>
      </section>
              
             <section class="perfil-eventos">
    <h3>Mis Eventos Creados</h3>
    
    <c:forEach var="evento" items="${misEventos}">
        <div class="post event-item-perfil" style="border-left: 5px solid #FFA500;">
            <div class="post-header">
                <div>
                    <h4>${evento.title}</h4>
                    <span>📅 ${evento.eventDate} - 🕒 ${evento.eventTime}</span>
                    <br>
                    <small>Tipo: ${evento.type}</small>
                </div>
            </div>
            
            <div class="post-actions">
                <%-- Botón Editar Evento --%>
                <button class="btn-edit-post" onclick="abrirModalEditarEvento('${evento.id}', '${evento.title}', '${evento.eventDate}', '${evento.eventTime}')">
                    📝 Editar
                </button>
                
                <%-- Formulario Eliminar Evento --%>
                <form action="${pageContext.request.contextPath}/EliminarEventoServlet" method="POST" style="display:inline;" onsubmit="return confirm('¿Estás seguro de que quieres eliminar este evento?')">
                    <input type="hidden" name="eventoId" value="${evento.id}">
                    <button type="submit" class="btn-delete-post">🗑️ Eliminar</button>
                </form>
            </div>
        </div>
    </c:forEach>

    <c:if test="${empty misEventos}">
        <p style="padding: 20px; color: #666;">No has organizado ningún evento todavía.</p>
    </c:if>
</section>
    </main>
  </div>
    <section id="editarEvento" class="modal">
    <a href="#" class="modal__backdrop"></a>
    <div class="modal__panel">
        <header class="modal__header">
            <h2>Editar Evento</h2>
            <a href="#" class="modal__close">✕</a>
        </header>
        <div class="modal__body">
            <form action="${pageContext.request.contextPath}/EditarEventoServlet" method="POST">
                <input type="hidden" name="eventoId" id="editEventoId">
                
                <label>Título del Evento:</label>
                <input type="text" name="titulo" id="editEventoTitulo" class="form-control" required>
                
                <label>Fecha:</label>
                <input type="date" name="fecha" id="editEventoFecha" class="form-control" required>
                
                <label>Hora:</label>
                <input type="time" name="hora" id="editEventoHora" class="form-control" required>
                
                <button type="submit" class="btn-primary" style="margin-top:15px; width:100%;">Actualizar Evento</button>
            </form>
        </div>
    </div>
</section>          

  <section id="editar" class="modal">
    <a href="#" class="modal__backdrop"></a>
    <div class="modal__panel">
      <header class="modal__header">
        <h2>Editar perfil</h2>
        <a href="#" class="modal__close">✕</a>
      </header>
      <div class="modal__body">
        <form action="${pageContext.request.contextPath}/EditarPerfilServlet" method="POST" enctype="multipart/form-data">
            <label>Biografía:</label>
            <textarea name="bio" style="width:100%; height:80px;">${usuario.bio}</textarea>
            <label>Nueva foto de perfil:</label>
            <input type="file" name="avatar" accept="image/*">
            <button type="submit" class="btn-primary" style="margin-top:15px; width:100%;">Guardar cambios</button>
        </form>
      </div>
    </div>
  </section>

  <div id="postModal" class="modal-backdrop" style="display: none;">
    </div>

        <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
        <%-- Home.js para actualizar el Feed de recetas --%>
        <script src="${pageContext.request.contextPath}/js/Home.js"></script>
        <%-- Actualizador.js para las notificaciones rojas de mensajes --%>
        <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
  <script src="${pageContext.request.contextPath}/js/MiPerfil.js"></script>
</body>
</html>