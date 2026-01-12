<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // Seguridad: Redirigir si no hay sesión activa
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
    <title>Top Publicaciones - CookingUAH</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Podio.css" />
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
                    <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary"> Mensajes
                        <c:if test="${totalNoLeidos > 0}">
                            <span class="badge" style="background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 50%; font-size: 0.8em; margin-left: 5px;">
                                ${totalNoLeidos}
                            </span>
                        </c:if>
                    </a>
                    <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary">Eventos</a>
                    <a href="${pageContext.request.contextPath}/NotificacionesServlet" class="btn-secondary">Notificaciones</a>
                    <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
                    <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary active">Recetas TOP</a> 
                    <button type="button" class="btn-primary" onclick="abrirModal()" style="margin-top: 10px; width: 100%; border: none; cursor: pointer;">Crear publicación</button>
                </nav>
            </div>
            <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
        </aside>

        <main class="feed">
            <h2>🏆 Top 3 Publicaciones con más Likes</h2>
            
            <div class="podio-container" id="podio">
                <c:forEach var="post" items="${topPosts}" varStatus="status">
                    <%-- Definir estilos según posición --%>
                    <c:set var="posClase" value="${status.index == 0 ? 'first' : (status.index == 1 ? 'second' : 'third')}" />
                    
                    <div class="podio-post ${posClase}" style="background-color: #fff8f0;">
                        <div class="post-header">
                            <%-- Uso de VerImagen para el avatar del autor --%>
                            <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.authorAvatar}" 
                                 alt="${post.authorName}" class="avatar"
                                 onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'">
                            <div>
                                <strong>@${post.authorName}</strong><br>
                                <small>${post.createdAt}</small>
                            </div>
                        </div>
                        <p>${post.title}</p>
                        <%-- Uso de VerImagen para la imagen del plato --%>
                        <c:if test="${not empty post.image}">
                            <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.image}" class="post-img">
                        </c:if>
                        <div class="likes">❤️ ${post.likesCount} Likes</div>
                    </div>
                </c:forEach>
            </div>
        </main>
    </div>
    <div id="postModal" class="modal-backdrop" style="display: none;">
            <div class="modal-content">
                <span class="modal-close" onclick="cerrarModal()">&times;</span>
                <h2>Crear una nueva publicación</h2>

                <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
                    <div class="modal-post-box">
                        <textarea name="titulo" id="modalNewPostContent" placeholder="¿Qué estás cocinando, <%= actual.getUsername()%>?" required></textarea>

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
    <script src="${pageContext.request.contextPath}/js/Home.js"></script>
    <script src="${pageContext.request.contextPath}/js/Podio.js"></script>
    <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>

</body>
</html>
