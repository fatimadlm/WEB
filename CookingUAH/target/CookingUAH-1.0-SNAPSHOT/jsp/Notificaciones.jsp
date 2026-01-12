<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt" %>

<%
    // Verificación de seguridad: el usuario debe estar logueado
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
    <title>Notificaciones - CookingUAH</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Notificaciones.css" />
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
                    <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
                    <button type="button" class="btn-primary" onclick="abrirModal()" style="margin-top: 10px; width: 100%; border: none; cursor: pointer;">Crear publicación</button>
                </nav>
            </div>
            <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
        </aside>

        <main class="feed">
            <div class="notif-container">
                <header style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2>Centro de Notificaciones</h2>
                    
                    <c:if test="${not empty notificaciones}">
                        <button type="button" class="btn-mark-read-all" onclick="marcarTodas()">✓ Marcar todas como leídas</button>
                    </c:if>
                </header>

                <div id="notif-list">
                    <c:choose>
                        <c:when test="${not empty notificaciones}">
                            <c:forEach var="n" items="${notificaciones}">
                                <div class="notif-item ${n.isRead ? '' : 'notif-unread'}" id="notif-${n.id}">
                                    <div class="notif-icon">
                                        <c:choose>
                                            <c:when test="${n.type == 'FOLLOW'}">👤</c:when>
                                            <c:when test="${n.type == 'LIKE'}">❤️</c:when>
                                            <c:when test="${n.type == 'COMMENT'}">💬</c:when>
                                            <c:otherwise>🔔</c:otherwise>
                                        </c:choose>
                                    </div>
                                    <div class="notif-content">
                                        <p class="notif-text">${n.text}</p>
                                        <span class="notif-date">
                                            <fmt:formatDate value="${n.createdAt}" pattern="dd MMM, HH:mm" />
                                        </span>
                                    </div>
                                    
                                    
                                    <button type="button" class="btn-delete-notif" onclick="eliminarNotif('${n.id}')">&times;</button>
                                </div>
                            </c:forEach>
                        </c:when>
                        <c:otherwise>
                            <div style="text-align: center; padding: 50px; color: #888;">
                                <p>No tienes notificaciones por el momento.</p>
                            </div>
                        </c:otherwise>
                    </c:choose>
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
<script>
    const contextPath = "${pageContext.request.contextPath}";
</script>

    <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
    <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
<script src="${pageContext.request.contextPath}/js/Notificaciones.js"></script>

</body>
</html>

