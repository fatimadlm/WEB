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
    <meta charset="UTF-8">
    <title>Borrar Cuenta - CookingUAH</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
    <style>
        /* Estilos específicos para esta zona */
        .danger-zone {
            background: #fff5f5;
            border: 2px solid #ff4d4d;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            margin: 100px auto;
            text-align: center;
            font-family: 'Poppins', sans-serif;
            box-shadow: 0 4px 15px rgba(255, 77, 77, 0.2);
        }
        .btn-cancel {
            display: inline-block;
            margin-top: 15px;
            color: #666;
            text-decoration: none;
            font-size: 0.9em;
        }
        .btn-cancel:hover { text-decoration: underline; color: #333; }
    </style>
</head>
<body>

<div class="danger-zone">
    <h1 style="color: #ff4d4d; margin-bottom: 15px;">Zona de Peligro</h1>
    <p style="margin-bottom: 20px; color: #555;">Para borrar tu cuenta permanentemente, por favor confirma tu contraseña actual:</p>
    
    <form action="${pageContext.request.contextPath}/BorrarCuentaServlet" method="POST">
        <input type="password" name="passwordConfirm" placeholder="Tu contraseña actual" required 
               style="padding: 12px; width: 80%; border: 1px solid #ccc; border-radius: 8px; margin-bottom: 40px; font-size: 1rem;">
        
        <button type="submit" class="btn-logout" style="background-color: #ff4d4d; width: 80%; cursor:pointer; border:none; padding: 12px; border-radius: 8px; color: white; font-weight: bold; font-size: 1rem;">
            BORRAR CUENTA DEFINITIVAMENTE
        </button>
    </form>
    
    <c:if test="${param.error == 'pass_incorrecta'}">
        <p style="color: #d32f2f; font-weight: bold; margin-top: 20px; background-color: #ffebee; padding: 10px; border-radius: 5px;">
            ⚠️ La contraseña no coincide. Inténtalo de nuevo.
        </p>
    </c:if>
    
    <c:if test="${param.error == 'db_error'}">
        <p style="color: #d32f2f; font-weight: bold; margin-top: 20px;">
            ❌ Error en la base de datos. Inténtalo más tarde.
        </p>
    </c:if>
    
    <br>
    <a href="${pageContext.request.contextPath}/PerfilServlet" class="btn-cancel">Cancelar y volver a mi perfil</a>
</div>

</body>
</html>