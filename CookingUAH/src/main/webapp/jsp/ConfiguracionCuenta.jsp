<%@ page contentType="text/html; charset=UTF-8" %>
<%@ page import="modelo.User" %>
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
    <meta charset="UTF-8">
    <title>Borrar Cuenta - CookingUAH</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
    <style>
        .danger-zone {
            background: #fff5f5;
            border: 2px solid #ff4d4d;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            margin: 100px auto;
            text-align: center;
        }
    </style>
</head>
<body>
<div class="danger-zone">
    <h1 style="color: #ff4d4d;">Zona de Peligro</h1>
    <p>Para borrar tu cuenta, por favor introduce tu contraseña actual:</p>
    
    <form action="${pageContext.request.contextPath}/BorrarCuentaServlet" method="POST">
        <input type="password" name="passwordConfirm" placeholder="Tu contraseña" required 
               style="padding: 10px; width: 80%; border: 1px solid #ccc; border-radius: 5px; margin-bottom: 20px;">
        
        <button type="submit" class="btn-logout" style="background-color: #ff4d4d; width: 100%; cursor:pointer; border:none;">
            BORRAR MI CUENTA DEFINITIVAMENTE
        </button>
    </form>
    
    <c:if test="${param.error == 'pass_incorrecta'}">
        <p style="color: red; margin-top: 10px;">La contraseña es incorrecta. Inténtalo de nuevo.</p>
    </c:if>
    
    <a href="${pageContext.request.contextPath}/PerfilServlet" style="display: block; margin-top: 20px; color: #666;">Cancelar y volver al perfil</a>
</div>
</body>
</html>