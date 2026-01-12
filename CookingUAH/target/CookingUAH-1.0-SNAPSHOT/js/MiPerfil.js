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
function abrirModalEditarEvento(id, titulo, fecha, hora) {
    document.getElementById('editEventoId').value = id;
    document.getElementById('editEventoTitulo').value = titulo;
    document.getElementById('editEventoFecha').value = fecha;
    document.getElementById('editEventoHora').value = hora;
    
    // Redirigir al ancla del modal
    window.location.hash = 'editarEvento';
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
 * Muestra el nombre del archivo seleccionado para el avatar y activa el contenedor de previsualización.
 */
function previsualizarAvatar(input) {
    const fileName = input.files[0]?.name;
    if (fileName) {
        document.getElementById('avatarFileName').textContent = fileName;
        document.getElementById('avatarPreviewContainer').style.display = 'flex';
    }
}

/**
 * Limpia el input de archivo y oculta el contenedor de previsualización.
 */
function quitarAvatarEdicion() {
    document.getElementById('editAvatarUpload').value = "";
    document.getElementById('avatarPreviewContainer').style.display = 'none';
}

/**
 * Previsualización específica para la edición
 */
//function previsualizarImagenEdicion(input) {
//    if (input.files && input.files[0]) {
//       const span = document.getElementById('editFileName');
//       const container = document.getElementById('editImagePreviewContainer');
//       if (span && container) {
//           span.innerText = "Nueva: " + input.files[0].name;
//           container.style.display = 'flex';
//       }
//    }
//}

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
function cerrarModalEditarEvento() {
    // Al usar anclas (#), para cerrar el modal volvemos a la URL base o arriba
    window.location.hash = ''; 
    
    // Opcional: Limpiar los campos del formulario por seguridad
    const formulario = document.querySelector('#editarEvento form');
    if (formulario) {
        formulario.reset();
    }
}