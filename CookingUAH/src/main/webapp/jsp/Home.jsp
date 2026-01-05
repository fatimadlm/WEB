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
                        <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>          
                        <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary">Eventos</a>
                        <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
                        <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a> 
                        <a href="${pageContext.request.contextPath}/jsp/Podio.jsp" class="btn-secondary">Recetas TOP</a>
                        <button onclick="document.getElementById('postModal').style.display = 'flex'" class="btn-primary">Crear publicación</button>
                    </nav>
                </div>

                <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
            </aside>

            <main class="feed">
                <div class="top-bar">
                    <div class="search-bar">
                        <form action="${pageContext.request.contextPath}/BuscarServlet" method="GET">
                            <input type="text" name="busqueda" placeholder="Buscar usuarios..." />
                            <button type="submit">Buscar</button>
                        </form>
                    </div>
                    <a href="${pageContext.request.contextPath}/BuscarServlet" class="btn-secondary">Haz amigos</a>
                </div>

                <div class="create-post" id="caja-publicar">
                    <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
                        <textarea id="tituloPost" name="titulo" placeholder="¿Qué estás cocinando, <%= actual.getUsername()%>?" required></textarea>

                        <div id="file-name-container" style="display: none; align-items: center; gap: 10px; margin-bottom: 15px; background: #fff3e0; padding: 8px 12px; border-radius: 10px; border: 1px dashed #ffb74d; width: fit-content;">
                            <span style="font-size: 1.1rem;">📄</span>
                            <span id="nombre-archivo" style="font-size: 0.85rem; color: #d84315; font-weight: 600;"></span>
                            <button type="button" onclick="quitarArchivoHome()" style="background: none; border: none; color: #cc5500; cursor: pointer; font-weight: bold; font-size: 1.1rem; margin-left: 5px;">&times;</button>
                        </div>

                        <div class="post-controls">
                            <div class="post-options">
                                <label for="file-upload" class="btn-add-photo">📸 Añadir Foto</label>
                                <input id="file-upload" type="file" name="imagen" accept="image/*" style="display:none;" onchange="mostrarNombreArchivo(this)">
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
                                <a href="${pageContext.request.contextPath}/jsp/PerfilOtro.jsp?id=${post.userId}">
                                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${post.authorAvatar}" 
                                         class="user-img" 
                                         onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'">
                                </a>
                                <div>
                                    <a href="${pageContext.request.contextPath}/jsp/PerfilOtro.jsp?id=${post.userId}" class="post-author-link">
                                        <h3>${post.authorName}</h3>
                                    </a>
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
                                <form action="${pageContext.request.contextPath}/InteraccionServlet" method="POST">
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

                                <form action="${pageContext.request.contextPath}/InteraccionServlet" method="POST" class="comment-box">
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
        
        <div id="postModal" class="modal-backdrop" style="display: none;">
            <div class="modal-content">
                <span class="modal-close" onclick="cerrarModal()">&times;</span>
                <h2>Crear una nueva publicación</h2>

                <form action="${pageContext.request.contextPath}/PublicarServlet" method="POST" enctype="multipart/form-data">
                    <div class="modal-post-box">
                        <textarea name="titulo" id="modalNewPostContent" 
                                  placeholder="¿Qué estás cocinando, <%= actual.getUsername()%>?" required></textarea>

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
    </body>
</html>