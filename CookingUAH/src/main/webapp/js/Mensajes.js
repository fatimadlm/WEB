let partnerIdActual = null;
const contextPath = document.body.dataset.context || "";
let intervaloChat = null;

function cargarChat(id, nombre) {
    partnerIdActual = id;
    
    // Avisamos al sistema que estamos leyendo este chat para que oculte el icono rojo
    window.idChatActivo = parseInt(id);

    // Cambios visuales
    document.getElementById('chatPlaceholder').style.display = 'none';
    document.getElementById('chatActiveWindow').style.display = 'flex';
    document.getElementById('chatUserName').innerText = "Chat con @" + nombre;
    
    // Limpieza visual inmediata del punto rojo en la lista
    const itemChat = document.getElementById('chat-item-' + id);
    if (itemChat) {
        itemChat.classList.remove('unread');
        const puntoRojo = itemChat.querySelector('.unread-dot');
        if (puntoRojo) puntoRojo.remove();
    }

    // Cargar mensajes y marcar como leído en BBDD
    refrescarMensajes(true); 

    if (!intervaloChat) {
        intervaloChat = setInterval(() => { refrescarMensajes(false); }, 2000);
    }
}

function refrescarMensajes(forzarAbajo = false) {
    if (!partnerIdActual) return;
    const box = document.getElementById('chatBox');
    const estabaAbajo = (box.scrollHeight - box.scrollTop - box.clientHeight) < 50;
    const posicionPrevia = box.scrollTop;

    // AÑADIDO ?ts=... para evitar caché y asegurar que el Servlet ejecute marcarComoLeidos
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

document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                enviarMensaje();
            }
        });
    }
});