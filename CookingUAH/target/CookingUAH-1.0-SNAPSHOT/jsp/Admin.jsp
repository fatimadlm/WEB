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
      <p class="brand__subtitle">Bienvenido, <%= actual.getUsername() %></p>
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
    <tbody>
      <%-- Iteramos sobre la lista enviada por el Servlet --%>
      <c:forEach var="u" items="${listaUsuarios}">
        <tr>
          <td>
            <img src="${pageContext.request.contextPath}/Imagenes/${u.avatar}" 
                 alt="@${u.username}" 
                 style="width:30px; height:30px; border-radius:50%; margin-right:8px; vertical-align:middle;"
                 onerror="this.src='${pageContext.request.contextPath}/Imagenes/Default.png'">
            @<c:out value="${u.username}" />
          </td>
          <td><span class="badge neutral">${u.role}</span></td>
          <td>
            <span class="badge ${u.active ? 'success' : 'warn'}">
              ${u.active ? 'Activo' : 'Bloqueado'}
            </span>
          </td>
          <td class="actions">
            <c:choose>
                <%-- Si el usuario está activo, mostramos botón para BLOQUEAR --%>
                <c:when test="${u.active}">
                    <a href="${pageContext.request.contextPath}/GestionUsuarioServlet?id=${u.id}&accion=bloquear" 
                       class="btn outline">Bloquear</a>
                </c:when>
                <%-- Si está bloqueado, mostramos botón para DESBLOQUEAR --%>
                <c:otherwise>
                    <a href="${pageContext.request.contextPath}/GestionUsuarioServlet?id=${u.id}&accion=desbloquear" 
                       class="btn outline">Desbloquear</a>
                </c:otherwise>
            </c:choose>
            <%-- Enlace de eliminar con confirmación de seguridad --%>
            <a href="${pageContext.request.contextPath}/GestionUsuarioServlet?id=${u.id}&accion=eliminar" 
               class="btn danger" 
               onclick="return confirm('¿Estás seguro de que deseas eliminar permanentemente a este usuario?')">
               Eliminar
            </a>
          </td>
        </tr>
      </c:forEach>
      
      <c:if test="${empty listaUsuarios}">
        <tr>
          <td colspan="4" style="text-align: center; color: #666;">No hay usuarios registrados en la base de datos.</td>
        </tr>
      </c:if>
    </tbody>
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
          <tbody>
            <c:forEach var="p" items="${listaPosts}">
              <tr>
                <td>${p.title}</td>
                <td>@${p.authorName}</td>
                <td>${p.createdAt}</td>
                <td>${p.likesCount}</td>
                <td class="actions">
                  <a href="${pageContext.request.contextPath}/GestionPostServlet?id=${p.id}&accion=eliminar" 
                     class="btn danger" onclick="return confirm('¿Borrar receta?')">Borrar</a>
                </td>
              </tr>
            </c:forEach>
          </tbody>
        </table>
      </div>
    </section>

    <section id="comments" class="card">
        <div class="card__header">
          <h2>Comentarios</h2>
        </div>
        <div class="table-wrap">
          <table class="table" id="commentsTable">
            <thead>
              <tr>
                <th>ID Post</th>
                <th>Autor</th>
                <th>Contenido</th>
                <th>Fecha</th>
                <th style="width:160px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <c:forEach var="c" items="${listaComentarios}">
                <tr>
                  <td>#${c.postId}</td>
                  <td>@${c.authorName}</td>
                  <td>${c.content}</td>
                  <td>${c.createdAt}</td>
                  <td class="actions">
                    <%-- Acción definida en el GestionPostServlet --%>
                    <a href="${pageContext.request.contextPath}/GestionPostServlet?id=${c.id}&accion=eliminarComentario" 
                       class="btn danger" 
                       onclick="return confirm('¿Seguro que deseas borrar este comentario?')">
                       Borrar
                    </a>
                  </td>
                </tr>
              </c:forEach>
              <c:if test="${empty listaComentarios}">
                <tr><td colspan="5" style="text-align:center;">No hay comentarios.</td></tr>
              </c:if>
            </tbody>
          </table>
        </div>
    </section>

    <footer class="footer">
      <a class="link" href="${pageContext.request.contextPath}/FeedServlet">← Volver a Inicio</a>
      <a class="link" href="${pageContext.request.contextPath}/LogoutServlet">Cerrar sesión</a>
    </footer>
  </div>

  <script>
    window.currentUserRole = "<%= actual.getRole() %>";
  </script>
  <%-- Carga del script con path dinámico --%>
  <script type="module" src="${pageContext.request.contextPath}/js/Admin.js"></script>
</body>
</html>