const contextPathGlobal = document.body.dataset.context || "";

// Iniciar bucle cada 2 segundos
setInterval(verificarEstadoGlobal, 2000);

function verificarEstadoGlobal() {
    if (!contextPathGlobal) return;

    fetch(`${contextPathGlobal}/MensajesServlet?accion=estado&ts=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
            let total = data.total;
            let ids = data.ids;

            // --- LÓGICA INTELIGENTE ---
            // Si tengo un chat abierto, ignoro las notificaciones de ESA persona
            // para que no parpadee el icono rojo mientras hablo con ella.
            if (window.idChatActivo) {
                if (ids.includes(window.idChatActivo)) {
                    // Lo quitamos de la lista para no iluminar el chat
                    ids = ids.filter(id => id !== window.idChatActivo);
                    // Restamos 1 al total visualmente
                    total = Math.max(0, total - 1);
                }
            }

            actualizarBadgeSidebar(total);

            if (document.querySelector('.chat-list')) {
                actualizarListaChats(ids);
            }
        })
        .catch(err => console.error("...", err));
}

function actualizarBadgeSidebar(total) {
    const linkMensajes = document.querySelector('a[href*="CargarChatServlet"]');
    if (!linkMensajes) return;

    let badge = linkMensajes.querySelector('.badge');

    if (total > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            badge.style.cssText = "background-color: #d32f2f; color: white; padding: 2px 6px; border-radius: 50%; font-size: 0.8em; margin-left: 5px;";
            linkMensajes.appendChild(badge);
        }
        badge.innerText = total;
        badge.style.display = 'inline-block';
    } else {
        if (badge) badge.style.display = 'none';
    }
}

function actualizarListaChats(ids) {
    const items = document.querySelectorAll('.chat-list-item');
    items.forEach(item => {
        if (!item.id) return;
        const userId = parseInt(item.id.replace('chat-item-', ''));
        
        const tieneMensaje = ids.includes(userId);
        const dot = item.querySelector('.unread-dot');

        if (tieneMensaje) {
            item.classList.add('unread');
            if (!dot) {
                const h3Container = item.querySelector('h3').parentNode;
                const newDot = document.createElement('span');
                newDot.className = 'unread-dot';
                h3Container.appendChild(newDot);
            }
        } else {
            item.classList.remove('unread');
            if (dot) dot.remove();
        }
    });
}