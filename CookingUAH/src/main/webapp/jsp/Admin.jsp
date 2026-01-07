<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // Recuperar usuario y validar sesión (Seguridad nivel JSP)
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cooking UAH — Admin</title>
  <%-- Uso de path dinámico para el CSS --%>
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Admin.css">
</head>
<body>
  <div class="page">
    <header class="brand">
      <%-- Uso de path dinámico para la imagen del logo --%>
      <img class="brand__logo" src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo Cooking UAH">
      <h1 class="brand__title">Cooking UAH</h1>
      <p class="brand__subtitle">Menú de administrador</p>
      <p>Bienvenido, <%= actual.getUsername() %></p>
    </header>

    <div class="card card--menu">
      <button class="menu-btn" data-target="#users">Gestionar usuarios</button>
      <button class="menu-btn" data-target="#posts">Gestionar publicaciones</button>
      <button class="menu-btn" data-target="#comments">Gestionar comentarios</button>

      <div class="search">
          <input id="adminSearch" type="search"
                placeholder="Buscar en usuarios, publicaciones y comentarios"
                aria-label="Buscar">
      </div>
    </div>

    <section id="users" class="card">
      <div class="card__header">
        <h2>Usuarios</h2>
        <div class="legend">
          <span class="badge success">Activo</span>
          <span class="badge warn">Bloqueado</span>
          <span class="badge neutral">Rol</span>
        </div>
      </div>
      <div class="table-wrap" role="region" aria-label="Tabla de usuarios">
        <table class="table" id="usersTable">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Rol</th>
              <th>Estado</th>
              <th style="width:200px">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <section id="posts" class="card">
      <div class="card__header">
        <h2>Publicaciones</h2>
      </div>
      <div class="table-wrap" role="region" aria-label="Tabla de publicaciones">
        <table class="table" id="postsTable">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Fecha</th>
              <th>Comentarios</th>
              <th style="width:220px">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <section id="comments" class="card">
      <div class="card__header">
        <h2>Comentarios</h2>
      </div>
      <div class="table-wrap" role="region" aria-label="Tabla de comentarios">
        <table class="table" id="commentsTable">
          <thead>
            <tr>
              <th>Publicación</th>
              <th>Autor</th>
              <th>Contenido</th>
              <th>Fecha</th>
              <th style="width:160px">Acciones</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>

    <footer class="footer">
      <a class="link" href="${pageContext.request.contextPath}/FeedServlet">← Volver a Inicio</a>
      <a class="link" href="${pageContext.request.contextPath}/LogoutServlet">Cerrar sesión</a>
    </footer>
  </div>

  <%-- Carga del script con path dinámico --%>
  <script type="module" src="${pageContext.request.contextPath}/js/Admin.js"></script>
</body>
</html>