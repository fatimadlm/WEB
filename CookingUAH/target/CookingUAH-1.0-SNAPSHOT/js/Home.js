const TIEMPO_REFRESCO = 1000;

function actualizarFeed() {
    const container = document.getElementById('postsContainer');
    if (!container) return; // No estamos en Home

    // No molestar si escribe
    const elementoActivo = document.activeElement;
    if (elementoActivo && (elementoActivo.tagName === 'INPUT' || elementoActivo.tagName === 'TEXTAREA')) {
        return;
    }

    const contextPath = document.body.dataset.context || "";
    // URL ÚNICA para saltar caché
    const urlAntiCache = `${contextPath}/FeedServlet?ts=${Date.now()}`;

    fetch(urlAntiCache)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nuevosPosts = doc.getElementById('postsContainer');
            
            if (nuevosPosts && container.innerHTML !== nuevosPosts.innerHTML) {
                container.innerHTML = nuevosPosts.innerHTML;
                console.log("Feed actualizado 🥘");
            }
        })
        .catch(err => console.error('Error feed:', err));
}

// Fotos
function mostrarNombreArchivo(input) {
    const container = document.getElementById('file-name-container');
    const spanNombre = document.getElementById('nombre-archivo');
    if (input.files && input.files[0]) {
        spanNombre.innerText = input.files[0].name;
        if (container) container.style.display = 'flex';
    }
}

function quitarArchivoHome() {
    const input = document.getElementById('file-upload');
    const container = document.getElementById('file-name-container');
    if (input) input.value = "";
    if (container) container.style.display = 'none';
}

// --- LÓGICA DE LIKE INSTANTÁNEO (AJAX) ---
function darLike(boton, postId) {
    const contextPath = document.body.dataset.context || "";
    
    // 1. Preparamos los datos para enviar
    const params = new URLSearchParams();
    params.append('accion', 'like');
    params.append('postId', postId);

    // 2. Enviamos al Servlet sin recargar página
    fetch(`${contextPath}/InteraccionServlet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    })
    .then(response => response.json()) // Esperamos respuesta JSON {"likes": 5}
    .then(data => {
        // 3. ÉXITO: Actualizamos la pantalla
        
        // A) Cambiamos el número
        const spanNumero = document.getElementById(`likes-count-${postId}`);
        if (spanNumero) {
            spanNumero.innerText = data.likes;
        }

        // B) Cambiamos el color del botón (Toggle de la clase 'liked')
        boton.classList.toggle('liked');
        
        // Efecto visual opcional (pequeña animación)
        boton.style.transform = "scale(1.2)";
        setTimeout(() => boton.style.transform = "scale(1)", 200);
    })
    .catch(err => console.error("Error dando like:", err));
}

setInterval(actualizarFeed, TIEMPO_REFRESCO);

