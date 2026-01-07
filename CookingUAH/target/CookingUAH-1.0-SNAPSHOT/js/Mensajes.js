let partnerIdActual = null;
const contextPath = document.body.dataset.context || "";
let intervaloChat = null; // Para controlar el temporizador

// 1. CARGAR CHAT (Al hacer clic en un usuario)
function cargarChat(id, nombre) {
    partnerIdActual = id;
    document.getElementById('chatPlaceholder').style.display = 'none';
    document.getElementById('chatActiveWindow').style.display = 'flex';
    document.getElementById('chatUserName').innerText = "Chat con @" + nombre;
    
    // Forzamos bajada la primera vez que abrimos
    refrescarMensajes(true); 

    // Iniciamos el bucle automático si no existía
    if (!intervaloChat) {
        intervaloChat = setInterval(() => {
            // Llamamos a refrescar en modo automático (false)
            refrescarMensajes(false); 
        }, 2000); // Se actualiza cada 2 segundos
    }
}

// 2. REFRESCO INTELIGENTE (La magia está aquí)
function refrescarMensajes(forzarAbajo = false) {
    if (!partnerIdActual) return;
    
    const box = document.getElementById('chatBox');
    
    // A. DETECCIÓN: ¿Estaba el usuario abajo del todo ANTES de actualizar?
    // Usamos un margen de error de 50px por si no estaba al milímetro
    const estabaAbajo = (box.scrollHeight - box.scrollTop - box.clientHeight) < 50;
    
    // Guardamos la posición exacta por si estaba leyendo arriba
    const posicionPrevia = box.scrollTop;

    fetch(`${contextPath}/MensajesServlet?conWho=${partnerIdActual}`)
        .then(response => response.text())
        .then(html => {
            // B. ACTUALIZACIÓN: Cambiamos el contenido
            // (Si el HTML es idéntico, idealmente no haríamos nada, pero reemplazarlo funciona bien)
            if (box.innerHTML !== html) {
                box.innerHTML = html;

                // C. DECISIÓN DE SCROLL
                if (forzarAbajo || estabaAbajo) {
                    // CASO 1: Acabo de enviar un mensaje O estaba esperando mensajes abajo
                    // -> Bajamos el scroll al fondo automáticamente
                    box.scrollTop = box.scrollHeight;
                } else {
                    // CASO 2: Estaba leyendo mensajes antiguos arriba
                    // -> Mantenemos la posición donde estaba (Quietecito)
                    box.scrollTop = posicionPrevia;
                }
            }
        });
}

// 3. ENVIAR MENSAJE
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
            // Al enviar, SIEMPRE forzamos bajar (true) para ver nuestro mensaje
            refrescarMensajes(true); 
        }
    });
}

// 4. DETECTAR ENTER PARA ENVIAR
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