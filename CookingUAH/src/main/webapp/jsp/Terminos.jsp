<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="modelo.User" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>


<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Términos y condiciones — Cooking UAH</title>
  
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/terminos.css" />
  <link rel="stylesheet" href="${pageContext.request.contextPath}/css/Home.css" /> <meta name="description" content="Términos y condiciones de uso de la red Cooking UAH." />
</head>
<body>
  <div class="container" role="main">
    <header>
      <img class="logo-img" src="${pageContext.request.contextPath}/Imagenes/logo.png" alt="Logo Cooking UAH" />
      <div>
        <h1>Términos y condiciones — Cooking UAH</h1>
        <div class="meta">Última actualización: <strong>12 de enero de 2026</strong></div>
      </div>
    </header>

    <nav class="toc" aria-label="Índice de términos">
      <strong>Índice:</strong>
      <a href="#aceptacion">Aceptación</a>
      <a href="#registro">Registro</a>
      <a href="#contenido">Contenido</a>
      <a href="#uso">Uso</a>
      <a href="#propiedad">Propiedad</a>
      <a href="#privacidad">Privacidad</a>
      <a href="#responsabilidad">Responsabilidad</a>
      <a href="#terminacion">Terminación</a>
      <a href="#ley">Ley aplicable</a>
      <a href="#contacto">Contacto</a>
    </nav>

    <section id="aceptacion" aria-labelledby="h-aceptacion">
      <h2 id="h-aceptacion">1. Aceptación de los términos</h2>
      <p>Al acceder y utilizar <strong>Cooking UAH</strong> (en adelante, "la Plataforma"), aceptas quedar sujeto a estos Términos y Condiciones, así como a la <a href="${pageContext.request.contextPath}/jsp/Privacidad.jsp">Política de Privacidad</a>. Si no estás de acuerdo, no debes utilizar la Plataforma.</p>
    </section>

    <section id="registro" aria-labelledby="h-registro">
      <h2 id="h-registro">2. Registro y cuenta</h2>
      <p>Para usar funciones de la Plataforma es necesario crear una cuenta.</p>
      <ul>
        <li>Debes facilitar información veraz y mantenerla actualizada.</li>
        <li>Eres responsable de la confidencialidad de tus credenciales.</li>
        <li>Notificarás inmediatamente sobre cualquier uso no autorizado de tu cuenta.</li>
      </ul>
    </section>

    <section id="contenido" aria-labelledby="h-contenido">
      <h2 id="h-contenido">3. Contenido publicado por los usuarios</h2>
      <p>La Plataforma permite publicar recetas, fotos y comentarios.</p>
      <ul>
        <li>Eres el responsable legal del Contenido que publiques.</li>
        <li>Concedes a la Plataforma una licencia para mostrar y distribuir ese Contenido.</li>
        <li>No publicarás contenido ilegal, discriminatorio o spam.</li>
      </ul>
    </section>

    <section id="uso" aria-labelledby="h-uso">
      <h2 id="h-uso">4. Uso permitido y conductas prohibidas</h2>
      <p>Se espera que uses la Plataforma de buena fe. Está prohibido:</p>
      <ul>
        <li>Suplantación de identidad.</li>
        <li>Intentos de acceder sin autorización a datos de otros usuarios.</li>
        <li>Afectar el correcto funcionamiento de los servidores de Cooking UAH.</li>
      </ul>
    </section>

    <section id="propiedad" aria-labelledby="h-propiedad">
      <h2 id="h-propiedad">5. Propiedad intelectual</h2>
      <p>Los derechos sobre la marca, diseño y código de la Plataforma pertenecen a Cooking UAH. El borrado en cascada (CASCADE) configurado en nuestra base de datos garantiza que, al terminar tu relación con nosotros, tus datos se eliminen conforme a derecho.</p>
    </section>

    <section id="privacidad" aria-labelledby="h-privacidad">
      <h2 id="h-privacidad">6. Privacidad y datos personales</h2>
      <p>El tratamiento de tus datos personales se rige por nuestra <a href="Privacidad.jsp">Política de Privacidad</a>.</p>
    </section>

    <section id="responsabilidad" aria-labelledby="h-responsabilidad">
      <h2 id="h-responsabilidad">7. Limitación de responsabilidad</h2>
      <p>Cooking UAH no será responsable por daños derivados del uso de la Plataforma. El servicio se ofrece "tal cual" según la disponibilidad técnica.</p>
    </section>

    <section id="terminacion" aria-labelledby="h-terminacion">
      <h2 id="h-terminacion">8. Suspensión y terminación</h2>
      <p>Nos reservamos el derecho de suspender tu cuenta si incumples estos Términos o por razones de seguridad y mantenimiento.</p>
    </section>

    <section id="ley" aria-labelledby="h-ley">
      <h2 id="h-ley">9. Legislación aplicable y jurisdicción</h2>
      <p>Estos Términos se rigen por la legislación española. Cualquier controversia se resolverá en los tribunales de <strong>Alcalá de Henares</strong>.</p>
    </section>

    <section id="contacto" aria-labelledby="h-contacto">
      <h2 id="h-contacto">10. Contacto</h2>
      <p>Si tienes dudas, contáctanos en:</p>
      <p class="small">
        Cooking UAH — Email: <a href="mailto:soporte@cooking.uah">soporte@cooking.uah</a><br />
        Universidad de Alcalá, España
      </p>
      
      <div style="margin-top: 2rem;">
        <a class="accept-btn" href="../index.jsp" role="button" 
           style="background-color: #FFA500; color: white; padding: 10px 25px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block;">
           Volver
        </a>
      </div>
      
      <p class="small" style="margin-top:1rem; color: #666;">Al continuar usando la Plataforma confirmas que has leído y aceptas estos Términos.</p>
    </section>
  </div>
</body>
</html>