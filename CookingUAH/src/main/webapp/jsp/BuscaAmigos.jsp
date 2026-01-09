<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // 1. PROTECCIÓN DE SESIÓN
    User usuarioLogueado = (User) session.getAttribute("usuario");
    if (usuarioLogueado == null) {
        response.sendRedirect("login.jsp");
        return;
    }
%>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CookingUAH - Buscar Amigos</title>
  <link rel="stylesheet" href="css/Home.css" />
  
  <style>
      .btn-disabled {
          background-color: #cccccc !important;
          color: #666666 !important;
          border: 1px solid #999999 !important;
          cursor: not-allowed;
          pointer-events: none;
      }
      /* Estilo para el mensaje de error con buen contraste */
      .mensaje-vacio {
          grid-column: 1 / -1; /* Ocupa todo el ancho */
          background-color: rgba(255, 250, 245, 0.95); /* Fondo casi blanco */
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          border: 2px dashed #d6b58e; /* Borde punteado decorativo */
      }
  </style>
</head>
<body>
  <div class="home-container">
    
    <aside class="sidebar">
      <div> 
        <div class="logo">
          <img src="Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img" />
          <h1>CookingUAH</h1>
        </div>

        <nav class="nav-buttons">
          <a href="${pageContext.request.contextPath}/FeedServlet" class="btn-secondary">Inicio</a> 
          <a href="${pageContext.request.contextPath}/CargarChatServlet" class="btn-secondary">Mensajes</a>          
          <a href="${pageContext.request.contextPath}/jsp/Eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/jsp/MiPerfil.jsp" class="btn-secondary">Mi Perfil</a> 
                        <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
          <button onclick="document.getElementById('postModal').style.display = 'flex'" class="btn-primary">Crear publicación</button>
        </nav>
      </div>
      <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed">
      
      <div class="top-bar" style="justify-content: center; margin-bottom: 2rem;">
        <form action="BuscarServlet" method="GET" class="search-bar" style="width: 100%; display: flex; gap: 10px;">
          <input type="text" name="busqueda" value="${param.busqueda}" placeholder="Buscar amigos por nombre..." style="flex: 1; padding: 15px; border-radius: 10px; border: 1px solid #ccc;"/>
          <button type="submit" class="btn-primary" style="width: auto;">Buscar</button>
        </form>
      </div>

      <h2>Resultados de búsqueda</h2>

      <div id="usersContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
        
        <c:forEach var="u" items="${resultadosBusqueda}">
            
            <%-- ENLACE QUE ENVUELVE TODA LA TARJETA --%>
            <a href="${pageContext.request.contextPath}/PerfilOtroServlet?id=${u.id}" 
               class="user-card-link" 
               style="text-decoration: none; color: inherit; display: block;">
               
                <div class="user-card">
                    <img src="${pageContext.request.contextPath}/VerImagen?nombre=${u.avatar}" 
                         onerror="this.src='${pageContext.request.contextPath}/Imagenes/default.png'" 
                         class="user-card-avatar">

                    <h3 class="user-card-name">@${u.username}</h3>
                    
                    <%-- YA NO SALE EL EMAIL POR SEGURIDAD --%>
                    
                    <%-- NUEVO ESTILO DE BOTÓN SUAVE --%>
                    <div class="user-card-cta">
                        Ver perfil <span class="arrow">→</span>
                    </div>
                </div>
            </a>
            
        </c:forEach>

        <c:if test="${empty resultadosBusqueda}">
            <div class="mensaje-vacio">
                <h3 style="color: #cc5500; font-size: 1.5em; margin-bottom: 10px;">😕 Vaya...</h3>
                <p style="color: #5a2500; font-size: 1.1em; line-height: 1.5;">
                    No hemos encontrado ningún chef con ese nombre.<br>
                    <strong>¡Intenta buscar a otro usuario!</strong>
                </p>
            </div>
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
                          placeholder="¿Qué estás cocinando, <%= ((modelo.User)session.getAttribute("usuario")).getUsername() %>?" required></textarea>
                
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
        <script src="${pageContext.request.contextPath}/js/Mensajes.js"></script>
        <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
</body>
</html>