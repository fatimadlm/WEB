
function abrirModal() {
    console.log("Abriendo modal...");
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.style.display = 'flex';
        const textarea = document.getElementById('modalNewPostContent');
        if (textarea) textarea.focus();
    }
}

function cerrarModal() {
    console.log("Cerrando modal...");
    const modal = document.getElementById('postModal');
    if (modal) {
        modal.style.display = 'none';
        quitarImagen(); // Limpia la imagen al cerrar
    }
}

// Cerrar al hacer clic fuera de la caja blanca
window.addEventListener('click', function(event) {
    const modal = document.getElementById('postModal');
    if (event.target === modal) {
        cerrarModal();
    }
});

function previsualizarImagen(input) {
    if (input.files && input.files[0]) {
        const fileName = input.files[0].name; // Capturamos el nombre
        const fileNameSpan = document.getElementById('modalFileName');
        const container = document.getElementById('modalImagePreviewContainer');
        
        if (fileNameSpan && container) {
            fileNameSpan.innerText = fileName; // Ponemos el nombre en el span
            container.style.display = 'flex';  // Mostramos el contenedor (usamos flex para alinear el icono y el texto)
        }
    }
}

function quitarImagen() {
    const input = document.getElementById('modalImageUpload');
    const fileNameSpan = document.getElementById('modalFileName');
    const container = document.getElementById('modalImagePreviewContainer');
    
    if (input) input.value = ""; // Limpiamos el input file
    if (fileNameSpan) fileNameSpan.innerText = "";
    if (container) container.style.display = 'none';
}

function mostrarNombreArchivo(input) {
    const container = document.getElementById('file-name-container');
    const spanNombre = document.getElementById('nombre-archivo');
    
    if (input.files && input.files[0]) {
        spanNombre.innerText = input.files[0].name;
        container.style.display = 'flex'; // Muestra el recuadro naranja
    }
}

function quitarArchivoHome() {
    const input = document.getElementById('file-upload');
    const container = document.getElementById('file-name-container');
    
    if (input) input.value = ""; // Limpia el archivo seleccionado
    if (container) container.style.display = 'none'; // Esconde el recuadro
}