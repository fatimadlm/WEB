<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Política de Privacidad - CookingUAH</title>
    
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css">
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Privacidad.css">
</head>
<body>
    <div class="home-container"> <aside class="sidebar">
            <div class="logo">
                <img src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo CookingUAH" class="logo-img">
                <h1>CookingUAH</h1>
            </div>

            <nav class="nav-buttons">
                <a href="../index.jsp" class="btn-secondary">Volver</a>
            </nav>
        </aside>

        <main class="main-content">
            <header>
                <h2>Política de Privacidad</h2>
                <p style="color: #a46b3b; font-size: 0.9rem;">Última actualización: 2026</p>
            </header>
            
            <section class="notif-item" style="display: block; background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3>Introducción</h3>
                <p>En <strong>CookingUAH</strong>, nos comprometemos a proteger tu privacidad y garantizar la seguridad de tu información personal. Al usar nuestra plataforma, aceptas las prácticas descritas en esta política.</p>
            </section>
            <section class="notif-item" style="display: block; background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3>1. Información que recopilamos</h3>
                <ul style="margin-left: 20px; color: #4a2a0a;">
                    <li>Datos de registro: nombre, correo electrónico y contraseña (encriptada).</li>
                    <li>Publicaciones y recetas que compartes en la plataforma.</li>
                    <li>Interacciones sociales: comentarios y "me gusta".</li>
                    <li>Avatar y biografía de perfil.</li>
                </ul>
            </section>

            <section class="notif-item" style="display: block; background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3>2. Cómo usamos tu información</h3>
                <ul style="margin-left: 20px; color: #4a2a0a;">
                    <li>Gestionar tu perfil y autenticación.</li>
                    <li>Permitir el funcionamiento del chat y notificaciones.</li>
                    <li>Mejorar el algoritmo de "Recetas TOP".</li>
                </ul>
            </section>

            <section class="notif-item" style="display: block; background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3>3. Seguridad de los Datos</h3>
                <p>Tus datos se almacenan en nuestra base de datos CookingUAHBBDD. Utilizamos el borrado en cascada (CASCADE) para asegurar que, si decides eliminar tu cuenta, toda tu información se borre permanentemente de nuestros registros.</p>
            </section>

            

            <section class="notif-item" style="display: block; background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                <h3>4. Tus derechos</h3>
                <p>En cumplimiento con las normativas de protección de datos, puedes solicitar la eliminación completa de tu cuenta desde tu perfil en la sección "Configuración de la cuenta".</p>
            </section>

            <footer style="margin-top: 40px; text-align: center; color: #6b2b00; font-size: 0.8rem;">
                <p>&copy; 2026 CookingUAH - Universidad de Alcalá</p>
            </footer>
        </main>
    </div>
</body>
</html>