let partnerIdActual = null;
const contextPath = document.body.dataset.context || "";
let intervaloChat = null;

/* ==========================================
   1. INICIALIZACIÓN Y EVENTOS
   ========================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Configurar envío con Enter
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                enviarMensaje();
            }
        });
    }

    // 2. CONFIGURAR EL FILTRO DE CHATS (NUEVO)
    const filtroInput = document.getElementById('filtroChatsInput');
    if (filtroInput) {
        // Filtrar la lista en tiempo real al escribir
        filtroInput.addEventListener('keyup', filtrarChats);
    }
});

/* ==========================================
   2. LÓGICA DEL CHAT
   ========================================== */
// AÑADIDO: Ahora aceptamos el parámetro 'avatar'
function cargarChat(id, nombre, avatar) {
    partnerIdActual = id;
    
    // Avisamos globalmente
    window.idChatActivo = parseInt(id); 

    // Visuales
    document.getElementById('chatPlaceholder').style.display = 'none';
    document.getElementById('chatActiveWindow').style.display = 'flex';
    
    // --- NUEVO: CONSTRUCCIÓN DE LA CABECERA CON FOTO Y ENLACE ---
    const headerElement = document.getElementById('chatUserName');
    
    // Calculamos la ruta de la imagen
    // Si avatar está vacío, usará el default en el onerror, pero por si acaso definimos ruta base
    const rutaImagen = avatar && avatar.trim() !== '' 
        ? `${contextPath}/VerImagen?nombre=${avatar}` 
        : `${contextPath}/Imagenes/default.png`;

    // Inyectamos HTML con la imagen y el enlace al perfil
    headerElement.innerHTML = `
        <a href="${contextPath}/PerfilOtroServlet?id=${id}" 
           style="display: flex; align-items: center; gap: 12px; text-decoration: none; color: inherit;">
            
            <img src="${rutaImagen}" 
                 onerror="this.src='${contextPath}/Imagenes/default.png'" 
                 style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                 
            <span>Chat con @${nombre}</span>
        </a>
    `;
    // -------------------------------------------------------------
    
    // Limpieza visual instantánea
    const itemChat = document.getElementById('chat-item-' + id);
    if (itemChat) {
        itemChat.classList.remove('unread');
        const puntoRojo = itemChat.querySelector('.unread-dot');
        if (puntoRojo) puntoRojo.remove();
    }

    // Cargar mensajes
    refrescarMensajes(true); 

    if (!intervaloChat) {
        intervaloChat = setInterval(() => { refrescarMensajes(false); }, 1000);
    }
}

function refrescarMensajes(forzarAbajo = false) {
    if (!partnerIdActual) return;
    const box = document.getElementById('chatBox');
    
    // Detectar si el usuario estaba abajo para no molestarle si lee mensajes viejos
    const estabaAbajo = (box.scrollHeight - box.scrollTop - box.clientHeight) < 50;
    const posicionPrevia = box.scrollTop;

    // Usamos ts=Date.now() para evitar caché
    fetch(`${contextPath}/MensajesServlet?conWho=${partnerIdActual}&ts=${Date.now()}`)
        .then(response => response.text())
        .then(html => {
            if (box.innerHTML !== html) {
                box.innerHTML = html;
                if (forzarAbajo || estabaAbajo) {
                    box.scrollTop = box.scrollHeight;
                } else {
                    box.scrollTop = posicionPrevia;
                }
            }
        });
}

function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    if (!texto || !partnerIdActual) return;

    const params = new URLSearchParams();
    params.append('receptorId', partnerIdActual);
    params.append('contenido', texto);

    fetch(`${contextPath}/MensajesServlet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    }).then(response => {
        if (response.ok) {
            input.value = ''; 
            refrescarMensajes(true); 
        }
    });
}

/* ==========================================
   3. FUNCIÓN DE FILTRADO (NUEVA Y ROBUSTA)
   ========================================== */
function filtrarChats() {
    // 1. Qué has escrito (en mayúsculas para que de igual "juan" que "JUAN")
    const input = document.getElementById('filtroChatsInput');
    if (!input) return; // Seguridad
    const filtro = input.value.toUpperCase().trim();
    
    // 2. Cogemos todas las tarjetas de usuario directamente
    // (Buscamos por la clase .chat-list-item que sabemos que existe)
    const tarjetas = document.querySelectorAll('.chat-list-item');

    // 3. Revisamos una a una
    tarjetas.forEach(tarjeta => {
        // Buscamos el nombre dentro de esta tarjeta
        const h3 = tarjeta.querySelector('h3');
        
        if (h3) {
            // Texto del nombre (ej: "@Juan")
            const nombreUsuario = h3.innerText || h3.textContent;
            
            // Buscamos al "padre" de la tarjeta (el <li>) para ocultarlo entero
            const elementoLi = tarjeta.closest('li');

            if (elementoLi) {
                // 4. ¿El nombre contiene lo que escribiste?
                if (nombreUsuario.toUpperCase().includes(filtro)) {
                    elementoLi.style.display = ""; // SÍ -> Mostrar
                } else {
                    elementoLi.style.display = "none"; // NO -> Ocultar
                }
            }
        }
    });
}
