// Variable para saber con quién estamos hablando actualmente
let partnerIdActual = null;

// Leemos el contextPath del body (asegúrate de que en el JSP esté: <body data-context="${pageContext.request.contextPath}">)
const contextPath = document.body.dataset.context || ""; 

/**
 * Se activa al hacer clic en un usuario de la lista lateral
 */
function cargarChat(id, nombre) {
    partnerIdActual = id;
    
    // 1. Mostrar la ventana de chat y ocultar el placeholder
    const placeholder = document.getElementById('chatPlaceholder');
    const activeWindow = document.getElementById('chatActiveWindow');
    if (placeholder) placeholder.style.display = 'none';
    if (activeWindow) activeWindow.style.display = 'flex';
    
    // 2. Actualizar el nombre en la cabecera
    const userNameHeader = document.getElementById('chatUserName');
    if (userNameHeader) userNameHeader.innerText = "Chat con @" + nombre;
    
    // 3. Cargar los mensajes inmediatamente
    console.log("Cargando mensajes con ID: " + id);
    refrescarMensajes();
}

/**
 * Trae los mensajes del servidor (Llama al doGet de MensajesServlet)
 */
function refrescarMensajes() {
    if (!partnerIdActual) return;
    
    // Llamamos al servlet pasando 'conWho' (como espera tu doGet en Java)
    fetch(`${contextPath}/MensajesServlet?conWho=${partnerIdActual}`)
        .then(response => {
            if (!response.ok) throw new Error('Error al cargar mensajes');
            return response.text(); // Esperamos HTML (las burbujas que genera el out.println en Java)
        })
        .then(html => {
            const box = document.getElementById('chatBox');
            if (box) {
                box.innerHTML = html;
                // Auto-scroll al final para ver el último mensaje
                box.scrollTop = box.scrollHeight;
            }
        })
        .catch(err => console.error('Error en refresco:', err));
}

/**
 * Envía un mensaje al servidor (Llama al doPost de MensajesServlet)
 */
function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    
    // Si no hay texto o no hay receptor, no hacemos nada
    if (!texto || !partnerIdActual) return;

    // Preparamos los datos tal como los espera el request.getParameter en Java
    const params = new URLSearchParams();
    params.append('receptorId', partnerIdActual);
    params.append('contenido', texto);

    fetch(`${contextPath}/MensajesServlet`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
    })
    .then(response => {
        if (response.ok) {
            input.value = ''; // Limpiamos el campo
            refrescarMensajes(); // Refrescamos el chat para ver nuestro mensaje
        } else {
            console.error("Error en el servidor al enviar mensaje");
        }
    })
    .catch(err => console.error('Error al enviar:', err));
}

// Configuración de eventos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // 1. Permitir enviar con la tecla Enter
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Evita saltos de línea
                enviarMensaje();
            }
        });
    }

    // 2. Refresco automático cada 1 segundo para ver mensajes nuevos del otro
    setInterval(refrescarMensajes, 1000);
});