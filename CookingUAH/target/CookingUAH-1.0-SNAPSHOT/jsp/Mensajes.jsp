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
                <div> 
                    <div class="logo">
                        <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo" class="logo-img" />
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

                <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
            </aside>

                <main class="feed-chat-page">
                      <div class="chat-list-container">
                    <div class="search-bar">
                        <form action="${pageContext.request.contextPath}/BuscarServlet" method="GET">
                            <input type="text" name="busqueda" placeholder="Buscar usuarios..." />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                            <ul class="chat-list">
                                  <c:forEach var="contacto" items="${listaContactos}"> 
                                          <li>
                                                <div class="chat-list-item" onclick="cargarChat('${contacto.id}', '${contacto.username}')" role="button">
                                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${contacto.avatar}" 
                                         onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
                                         class="chat-avatar">                  <div class="chat-info">
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
                                      <div class="chat-header">
                                <h2 id="chatUserName">Chat</h2>
                            </div>
                                      <div class="chat-box" id="chatBox"></div>
                                      <div class="chat-input-area">
                                            <input type="text" id="chatInput" placeholder="Escribe tu mensaje...">
                                            <button id="sendChatBtn" onclick="enviarMensaje()">Enviar</button>
                                          </div>
                                    </div>
                              </div>
                        </main>
                  </div>

            <div id="postModal" class="modal-backdrop" style="display: none;">
                <div class="modal-content">
                    <span class="modal-close" onclick="cerrarModal()">&times;</span>
                    <h2>Crear una nueva publicación</h2>

                    <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
                    <div class="modal-post-box">
                        <textarea name="titulo" id="modalNewPostContent" 
                                  placeholder="¿Qué estás cocinando, <%= ((modelo.User) session.getAttribute("usuario")).getUsername()%>?" required></textarea>

                        <div id="modalImagePreviewContainer" style="display: none; align-items: center; gap: 10px; margin-bottom: 15px; background: #fdf2e9; padding: 10px; border-radius: 10px; border: 1px dashed #ffb74d;">
                            <span style="font-size: 1.2rem;">📄</span>
                            <span id="modalFileName" style="font-size: 0.9rem; color: #d84315; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;"></span>

                            <button type="button" onclick="quitarImagen()" style="background: none; border: none; color: #cc5500; cursor: pointer; font-weight: bold; font-size: 1.2rem; margin-left: auto;">&times;</button>
                        </div>

                        <div class="post-controls" style="display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                            <div class="post-options">
                                <input type="file" name="imagen" id="modalImageUpload" accept="image/*" style="display: none;" onchange="previsualizarImagen(this)">
                                <button type="button" class="btn-add-photo" onclick="document.getElementById('modalImageUpload').click()">
                                    📸 Añadir Foto
                                </button>
                            </div>
                            <button type="submit" class="btn-primary" id="modalNewPostBtn" style="padding: 10px 25px; border-radius: 25px; white-space: nowrap;">
                                Publicar Receta
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

        <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
          <%-- CARGA DEL ARCHIVO JS SEPARADO --%>
          <script src="${pageContext.request.contextPath}/js/Mensajes.js"></script>
    </body>
</html> 