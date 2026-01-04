
// Definimos el intervalo de refresco
const TIEMPO_REFRESCO = 3000;

function actualizarFeed() {
    const container = document.getElementById('postsContainer');
    // SEGURIDAD: Si no existe el contenedor de posts, detenemos el bucle
    // Esto evita que el script intente ejecutarse en la página de Mensajes
    if (!container) return; 

    const elementoActivo = document.activeElement;
    const escribiendo = elementoActivo && (elementoActivo.tagName === 'INPUT' || elementoActivo.tagName === 'TEXTAREA');

    if (escribiendo) return;

    // Obtenemos el contextPath desde el body (igual que en Mensajes.js)
    const contextPath = document.body.dataset.context || "";

    fetch(`${contextPath}/FeedServlet`)
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const nuevosPosts = doc.getElementById('postsContainer').innerHTML;
            
            // Solo actualizamos si el contenido ha cambiado para evitar parpadeos
            if (container.innerHTML !== nuevosPosts) {
                container.innerHTML = nuevosPosts;
                console.log("Feed sincronizado con BBDD ");
            }
        })
        .catch(err => console.error('Error en refresco del feed:', err));
}

// Funciones para la gestión de archivos en el Home
function mostrarNombreArchivo(input) {
    const container = document.getElementById('file-name-container');
    const spanNombre = document.getElementById('nombre-archivo');
    if (input.files && input.files[0]) {
        spanNombre.innerText = input.files[0].name;
        container.style.display = 'flex';
    }
}

function quitarArchivoHome() {
    const input = document.getElementById('file-upload');
    const container = document.getElementById('file-name-container');
    if (input) input.value = "";
    if (container) container.style.display = 'none';
}

// Iniciar el intervalo
setInterval(actualizarFeed, TIEMPO_REFRESCO);