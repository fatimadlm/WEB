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
                    <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>
                    <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary">Eventos</a>
                    <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
                    <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
                    <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary active">Recetas TOP</a> 
                    <button onclick="abrirModal()" class="btn-primary">Crear publicación</button>
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

    <%-- Reutilizamos el modal de publicación estándar --%>
    <div id="postModal" class="modal-backdrop" style="display: none;">
        <div class="modal-content">
            <span class="modal-close" onclick="cerrarModal()">&times;</span>
            <h2>Nueva Receta</h2>
            <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
                <textarea name="titulo" placeholder="¿Qué estás cocinando?" required></textarea>
                <input type="file" name="imagen" accept="image/*">
                <button type="submit" class="btn-primary">Publicar</button>
            </form>
        </div>
    </div>

    <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
    <script src="${pageContext.request.contextPath}/js/Home.js"></script>
        <script src="${pageContext.request.contextPath}/js/Podio.js"></script>

</body>
</html>