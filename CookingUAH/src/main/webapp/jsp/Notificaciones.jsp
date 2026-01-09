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
    <%-- Reutilizamos tus estilos base --%>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" />
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Perfil.css" />
    <style>
        .notif-container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
        }
        .notif-item {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: transform 0.2s;
            border-left: 5px solid #ccc;
        }
        .notif-item:hover {
            transform: translateY(-2px);
        }
        .notif-unread {
            background: #f0f7ff;
            border-left-color: #3498db; /* Azul para no leídas */
        }
        .notif-icon {
            font-size: 1.5rem;
            margin-right: 15px;
        }
        .notif-content {
            flex-grow: 1;
        }
        .notif-text {
            margin: 0;
            color: #333;
            font-size: 0.95rem;
        }
        .notif-date {
            font-size: 0.8rem;
            color: #888;
            display: block;
            margin-top: 5px;
        }
        .notif-type-follow { border-left-color: #f39c12; } /* Naranja para nuevos seguidores */
        .notif-type-like { border-left-color: #e74c3c; }   /* Rojo para likes */
    </style>
</head>

<body>
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
                    <a href="${pageContext.request.contextPath}/NotificacionesServlet" class="btn-primary">Notificaciones</a>
                    <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-secondary">Mi Perfil</a>
                    <a href="${pageContext.request.contextPath}/PodioServlet" class="btn-secondary">Recetas TOP</a>
                </nav>
            </div>
            <a href="${pageContext.request.contextPath}/LogoutServlet" class="btn-logout">Cerrar sesión</a>
        </aside>

        <main class="feed">
            <div class="notif-container">
                <header style="margin-bottom: 20px;">
                    <h2>Centro de Notificaciones</h2>
                </header>

                <c:choose>
                    <c:when test="${not empty notificaciones}">
                        <c:forEach var="n" items="${notificaciones}">
                            <div class="notif-item ${n.isRead ? '' : 'notif-unread'} notif-type-${n.type.toLowerCase()}">
                                <div class="notif-icon">
                                    <c:choose>
                                        <c:when test="${n.type == 'FOLLOW'}">👤</c:when>
                                        <c:when test="${n.type == 'LIKE'}">❤️</c:when>
                                        <c:otherwise>🔔</c:otherwise>
                                    </c:choose>
                                </div>
                                <div class="notif-content">
                                    <p class="notif-text">${n.text}</p>
                                    <span class="notif-date">
                                        <fmt:formatDate value="${n.createdAt}" pattern="dd MMM yyyy, HH:mm" />
                                    </span>
                                </div>
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
        </main>
    </div>

    <script src="${pageContext.request.contextPath}/js/Home.js"></script>
</body>
</html>