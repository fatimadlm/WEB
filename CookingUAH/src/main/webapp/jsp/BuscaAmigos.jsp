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
          <a href="FeedServlet" class="btn-secondary">Inicio</a> 
          <a href="mensajes.jsp" class="btn-secondary">Mensajes</a>
          <a href="eventos.jsp" class="btn-secondary">Eventos</a>
          <a href="notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="MiPerfil.jsp" class="btn-secondary">Mi Perfil</a>
          <a href="podio.jsp" class="btn-secondary">Recetas TOP</a>
          <button id="openModalBtn" class="btn-primary" onclick="window.location.href='FeedServlet'">Crear publicación</button>
        </nav>
      </div>

      <a href="index.html" class="btn-logout">Cerrar sesión</a>
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
            
            <div class="user-card" style="background: white; padding: 20px; border-radius: 15px; text-align: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                
                <img src="${u.avatar}" onerror="this.src='Imagenes/default.png'" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
                
                <h3 style="color: #6b2b00; margin-bottom: 5px;">${u.username}</h3>
                <p style="font-size: 0.8em; color: #666; margin-bottom: 15px;">${u.email}</p>
                
                <div style="display: flex; gap: 10px; justify-content: center;">
                    
                    <a href="PerfilOtro.jsp?id=${u.id}" class="btn-secondary" style="font-size: 0.8em; padding: 5px 10px;">Perfil</a>

                    <c:choose>
                        <c:when test="${u.id == sessionScope.usuario.id}">
                             <button class="btn-primary btn-disabled" style="font-size: 0.8em; padding: 5px 10px;">
                                (Tú)
                             </button>
                        </c:when>
                        <c:otherwise>
                             <form action="SeguirServlet" method="POST">
                                <input type="hidden" name="idASeguir" value="${u.id}">
                                <button type="submit" class="btn-primary" style="font-size: 0.8em; padding: 5px 10px;">
                                    Seguir
                                </button>
                             </form>
                        </c:otherwise>
                    </c:choose>

                </div>
            </div>
            
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
</body>
</html>