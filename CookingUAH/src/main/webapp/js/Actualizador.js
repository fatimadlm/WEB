const contextPathGlobal = document.body.dataset.context || "";

setInterval(verificarEstadoGlobal, 1000);

function verificarEstadoGlobal() {
    if (!contextPathGlobal) return;

    fetch(`${contextPathGlobal}/MensajesServlet?accion=estado&ts=${Date.now()}`)
        .then(response => response.json())
        .then(data => {
            let total = data.total;
            let ids = data.ids || [];      // Lista simple de IDs: [3, 5]
            let updates = data.updates || []; // Lista con textos: [{id:3, text:"Hola"}, ...]

            // Anti-Parpadeo si estamos dentro del chat
            if (window.idChatActivo) {
                if (ids.includes(window.idChatActivo)) {
                    ids = ids.filter(id => id !== window.idChatActivo);
                    // Filtramos también los updates para no sobrescribir si estamos escribiendo
                    updates = updates.filter(u => u.id !== window.idChatActivo);
                    total = Math.max(0, total - 1);
                }
            }

            actualizarBadgeSidebar(total);

            if (document.querySelector('.chat-list')) {
                // Pasamos los updates (textos) también
                actualizarListaChats(ids, updates);
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

function actualizarListaChats(ids, updates) {
    const items = document.querySelectorAll('.chat-list-item');
    items.forEach(item => {
        if (!item.id) return;
        const userId = parseInt(item.id.replace('chat-item-', ''));
        
        const tieneMensaje = ids.includes(userId);
        const dot = item.querySelector('.unread-dot');
        const textElement = item.querySelector('.chat-last-message'); // El párrafo del texto

        if (tieneMensaje) {
            item.classList.add('unread');
            
            // 1. Poner punto rojo
            if (!dot) {
                const h3Container = item.querySelector('h3').parentNode;
                const newDot = document.createElement('span');
                newDot.className = 'unread-dot';
                h3Container.appendChild(newDot);
            }

            // 2. ACTUALIZAR EL TEXTO
            // Buscamos si el servidor nos mandó texto nuevo para este usuario
            const dataUsuario = updates.find(u => u.id === userId);
            if (dataUsuario && textElement) {
                // Solo actualizamos si es diferente para no molestar al navegador
                if (textElement.innerText !== dataUsuario.text) {
                    textElement.innerText = dataUsuario.text;
                }
            }

        } else {
            item.classList.remove('unread');
            if (dot) dot.remove();
        }
    });
}
