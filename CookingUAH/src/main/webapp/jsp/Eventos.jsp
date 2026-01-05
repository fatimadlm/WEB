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
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Eventos.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
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
          <a href="${pageContext.request.contextPath}/EventosServlet" class="btn-secondary active">Eventos</a> 
          <a href="${pageContext.request.contextPath}/jsp/Notificaciones.jsp" class="btn-secondary">Notificaciones</a>
          <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
                        <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
          <button onclick="abrirModal()" class="btn-primary">Crear publicación</button>
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

          <button type="submit" class="btn-primary">Añadir evento</button>
        </form>
      </section>
    </main>
  </div>
<script>
    window.eventosDesdeBBDD = [
        <c:forEach var="ev" items="${listaEventos}" varStatus="loop">
            {
                fecha: "${ev.eventDate}", 
                titulo: "${ev.title}",
                hora: "${ev.eventTime}",
                creador: "${ev.authorName}"
            }${not loop.last ? ',' : ''}
        </c:forEach>
    ];
</script>
  
  <script src="${pageContext.request.contextPath}/js/LogicaModal.js"></script>
  <script src="${pageContext.request.contextPath}/js/Eventos.js"></script>
</body>
</html>