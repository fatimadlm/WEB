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
  <meta charset="UTF-8" />
  <title>CookingUAH - Eventos</title>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/Eventos.css?v=2.0" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
</head>
<body data-context="${pageContext.request.contextPath}">
  <div class="home-container">
    
    <aside class="sidebar">
      <div>
        <div class="logo">
          <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo" class="logo-img" />
          <h1>CookingUAH</h1>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
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
          <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary active">Eventos</a> 
          <a href="${pageContext.request.contextPath}/NotificacionesServlet" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
          <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
          <button type="button" class="btn-primary" onclick="abrirModal()" style="margin-top: 10px; width: 100%; border: none; cursor: pointer;">Crear publicación</button>
        </nav>
      </div>
      <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
    </aside>

    <main class="feed eventos-feed">
      <h2>Calendario de eventos</h2>

      <div class="calendar">
        <div class="calendar-header">
          <button id="prevMonth">←</button>
          <h3 id="monthYear"></h3>
          <button id="nextMonth">→</button>
        </div>
        <div class="calendar-grid" id="calendarGrid"></div>
      </div>

      <div class="event-details" id="eventDetails">
        <h3>Eventos seleccionados</h3>
        <ul id="eventList">
          <li>Selecciona un día para ver los eventos.</li>
        </ul>
      </div>

     <section class="crear-evento">
  <h3>Crear un nuevo evento</h3>
  <form action="${pageContext.request.contextPath}/EventosServlet" method="POST" class="form-evento">
    <label>Fecha:</label>
    <input type="date" name="fecha" id="eventDate" required />

    <label>Título:</label>
    <input type="text" name="titulo" placeholder="Ej: Taller de Pasta" required />

    <label>Hora:</label>
    <input type="time" name="hora" required />

    <label>Tipo de evento:</label>
    <select name="tipo" required class="form-control">
      <option value="" disabled selected>Selecciona una categoría</option>
      <option value="Taller">Taller de cocina</option>
      <option value="Degustación">Degustación</option>
      <option value="Concurso">Concurso</option>
      <option value="Quedada">Quedada / Cena</option>
      <option value="Online">Evento Online</option>
    </select>

    <button type="submit" class="btn-primary" style="margin-top: 10px;">Añadir evento</button>
  </form>
</section>
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
    window.eventosDesdeBBDD = [
        <c:forEach var="ev" items="${listaEventos}" varStatus="loop">
            {
                fecha: "${ev.eventDate}", 
                titulo: "${ev.title}",
                hora: "${ev.eventTime}",
                creador: "${ev.authorName}",
                tipo: "${ev.type}" 
            }${not loop.last ? ',' : ''}
        </c:forEach>
    ];
</script>
  
  <script src="${pageContext.request.contextPath}/js/Home.js"></script>
  <script src="${pageContext.request.contextPath}/js/Actualizador.js"></script>
  <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
  <script src="${pageContext.request.contextPath}/js/Eventos.js"></script>
</body>
</html>
