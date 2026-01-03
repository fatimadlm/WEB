<%-- web/jsp/Mensajes.jsp --%>
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
  <meta charset="UTF-8">
  <title>Mensajes - CookingUAH</title>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css"> 
</head>
<body data-context="${pageContext.request.contextPath}"> 
  
  <div class="home-container">
    <aside class="sidebar">
        <div class="logo">
          <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img" />
          <h1>CookingUAH</h1>
        </div>        <nav class="nav-buttons">
          <a href="${pageContext.request.contextPath}/FeedServlet" class="btn-secondary">Inicio</a> 
           <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>         
           <a href="${pageContext.request.contextPath}/jsp/Eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/jsp/MiPerfil.jsp" class="btn-secondary">Mi Perfil</a> 
          <a href="${pageContext.request.contextPath}/jsp/Podio.jsp" class="btn-secondary">Recetas TOP</a>
          <button onclick="document.getElementById('caja-publicar').scrollIntoView({behavior: 'smooth'}); document.getElementById('tituloPost').focus();" class="btn-primary">Crear publicación</button>
        </nav>
      <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed-chat-page">
      <div class="chat-list-container">
        <div class="search-bar">
          <form action="BuscarServlet" method="GET">
              <input type="text" name="busqueda" placeholder="Buscar usuarios..." />
              <button type="submit">Buscar</button>
          </form>
        </div>
            <ul class="chat-list">
          <c:forEach var="contacto" items="${listaContactos}"> 
              <li>
                <div class="chat-list-item" onclick="cargarChat('${contacto.id}', '${contacto.username}')" role="button">
                  <img src="${pageContext.request.contextPath}/${contacto.avatar}" onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" class="chat-avatar"> 
                  <div class="chat-info">
                    <h3>@${contacto.username}</h3>
                    <p class="chat-last-message">Haz clic para chatear</p>
                  </div>
                </div>
              </li>
          </c:forEach>
        </ul>
      </div>

      <div class="chat-conversation-container">
        <div class="chat-placeholder" id="chatPlaceholder">
          <h3>Tus mensajes</h3>
        </div>

        <div class="chat-active-window" id="chatActiveWindow" style="display: none;">
          <div class="chat-header"><h2 id="chatUserName">Chat</h2></div>
          <div class="chat-box" id="chatBox"></div>
          <div class="chat-input-area">
            <input type="text" id="chatInput" placeholder="Escribe tu mensaje...">
            <button id="sendChatBtn" onclick="enviarMensaje()">Enviar</button>
          </div>
        </div>
      </div>
    </main>
  </div>

  <%-- CARGA DEL ARCHIVO JS SEPARADO --%>
  <script src="${pageContext.request.contextPath}/js/Mensajes.js"></script>
</body>
</html> 