<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>

<%
    // Verificamos si hay un usuario en sesión para personalizar el botón de "Volver"
    User actual = (User) session.getAttribute("usuario");
    String urlVolver = (actual != null) ? request.getContextPath() + "/FeedServlet" : request.getContextPath() + "/index.jsp";
%>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sobre Nosotros | CookingUAH</title>
    
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/SobreNosotros.css">
</head>
<body>

    <header style="background-color: #6b2b00; color: white; padding: 2rem; text-align: center;">
        <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo" style="width: 60px; margin-bottom: 10px;">
        <h1>Sobre Nosotros</h1>
    </header>

    <div class="container" style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">

        <section style="margin-bottom: 2rem;">
            <h2 style="color: #cc5500; border-bottom: 2px solid #ffb74d; padding-bottom: 5px;">¿Qué es CookingUAH?</h2>
            <p>
                CookingUAH es una red social diseñada para entusiastas de la cocina que buscan aprender y compartir recetas mediante el uso de tecnologías web de vanguardia.
            </p>
        </section>

        <section style="margin-bottom: 2rem;">
            <h2 style="color: #cc5500; border-bottom: 2px solid #ffb74d; padding-bottom: 5px;">Nuestra historia</h2>
            <p>
                CookingUAH nace como un proyecto académico para la asignatura <strong>Arquitectura y Diseño de Sistemas Web y C/S</strong> en la Universidad de Alcalá (UAH). Nuestro objetivo fue crear una plataforma robusta, escalable y con una experiencia de usuario excepcional.
            </p>
        </section>

        <section style="margin-bottom: 2rem;">
            <h2 style="color: #cc5500; border-bottom: 2px solid #ffb74d; padding-bottom: 5px;">Equipo de Desarrollo</h2>
            <ul style="list-style: none; padding-left: 0;">
                <li style="margin-bottom: 5px;">👨‍💻 Fátima C. de la Morena</li>
                <li style="margin-bottom: 5px;">👨‍💻 Carlos Crespo</li>
                <li style="margin-bottom: 5px;">👨‍💻 Fernando Villa</li>
                <li style="margin-bottom: 5px;">👨‍💻 Domingo Jarrillo</li>
            </ul>
        </section>

        <section style="margin-bottom: 2rem; background-color: #fffaf5; padding: 1.5rem; border-radius: 12px; border: 1px solid #ffb74d;">
            <h2 style="color: #6b2b00;">Contacto</h2>
            <p>¿Tienes preguntas, sugerencias o simplemente quieres saludar?</p>
            <p style="margin-top: 10px;">
                <strong>Correo general:</strong> 
                <a style="color: #cc5500; font-weight: bold; text-decoration: none;" href="mailto:contacto@cookinguah.com">contacto@cookinguah.com</a>
            </p>
            <p>
                <strong>Soporte técnico:</strong> 
                <a style="color: #cc5500; font-weight: bold; text-decoration: none;" href="mailto:soporte@cookinguah.com">soporte@cookinguah.com</a>
            </p>
        </section>

        <div class="button-container" style="text-align: center; margin-top: 3rem;">
            <a href="../index.jsp" class="btn-primary" 
               style="background-color: #FFA500; color: white; padding: 12px 30px; border-radius: 25px; text-decoration: none; font-weight: bold; display: inline-block;">
                Volver al Inicio
            </a>
        </div>
    </div>

</body>
</html>