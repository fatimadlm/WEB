const TIEMPO_REFRESCO = 2000;

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

setInterval(actualizarFeed, TIEMPO_REFRESCO);