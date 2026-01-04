let partnerIdActual = null;
const contextPath = document.body.dataset.context || ""; 

function cargarChat(id, nombre) {
    partnerIdActual = id;
    document.getElementById('chatPlaceholder').style.display = 'none';
    document.getElementById('chatActiveWindow').style.display = 'flex';
    document.getElementById('chatUserName').innerText = "Chat con @" + nombre;
    
    // Solo bajamos el scroll la primera vez que abrimos el chat
    refrescarMensajes(true); 
}

function refrescarMensajes(forzarAbajo = false) {
    if (!partnerIdActual) return;
    
    fetch(`${contextPath}/MensajesServlet?conWho=${partnerIdActual}`)
        .then(response => response.text())
        .then(html => {
            const box = document.getElementById('chatBox');
            if (box) {
                // Guardamos la posición exacta antes de actualizar
                const posicionPrevia = box.scrollTop;

                box.innerHTML = html;

                if (forzarAbajo) {
                    box.scrollTop = box.scrollHeight;
                } else {
                    // Mantenemos al usuario donde estaba, sin cálculos raros
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
            refrescarMensajes(true); // Bajamos al fondo para ver nuestro mensaje enviado
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