/**
 * Funciones específicas para la página de Mi Perfil
 */

/**
 * Abre el modal de edición para una publicación existente
 * @param {string} id - ID de la publicación en la BBDD
 * @param {string} titulo - Título actual de la receta
 */
function abrirModalEdicion(id, titulo) {
    const modal = document.getElementById('editPostModal');
    const inputId = document.getElementById('editPostId');
    const inputContent = document.getElementById('editPostContent');

    if (modal && inputId && inputContent) {
        inputId.value = id;
        inputContent.value = titulo;
        modal.style.display = 'flex';
        inputContent.focus();
    }
}

/**
 * Cierra el modal de edición de posts
 */
function cerrarModalEdicion() {
    const modal = document.getElementById('editPostModal');
    if (modal) {
        modal.style.display = 'none';
        // Limpiamos el input de imagen si existe
        const imgInput = document.getElementById('editImageUpload');
        if (imgInput) imgInput.value = "";
    }
}

/**
 * Previsualización específica para la edición
 */
function previsualizarImagenEdicion(input) {
    if (input.files && input.files[0]) {
        const span = document.getElementById('editFileName');
        const container = document.getElementById('editImagePreviewContainer');
        if (span && container) {
            span.innerText = "Nueva: " + input.files[0].name;
            container.style.display = 'flex';
        }
    }
}

// Lógica para cerrar modales al hacer clic fuera (Específico de Perfil)
window.addEventListener('click', function(event) {
    const editModal = document.getElementById('editPostModal');
    if (event.target === editModal) {
        cerrarModalEdicion();
    }
});

/**
 * Placeholders para seguidores y siguiendo (Requieren integración con FollowerDAO/Servlet)
 */
function abrirSeguidores() {
    console.log("Cargando lista de seguidores desde la BBDD...");
    // Aquí se dispararía una petición fetch al servidor para obtener la tabla 'followers'
}

function abrirSiguiendo() {
    console.log("Cargando lista de usuarios seguidos...");
}