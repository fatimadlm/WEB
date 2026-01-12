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

function abrirSeguidores() {
    cargarListaUsuarios('seguidores', 'Seguidores');
}

function abrirSiguiendo() {
    cargarListaUsuarios('siguiendo', 'Siguiendo');
}

function cargarListaUsuarios(tipo, titulo) {
    const context = document.body.dataset.context;
    const userId = document.getElementById('userIdHidden').value; 
    
    // Configuración visual del Modal
    document.getElementById('userListModal').style.display = 'flex';
    document.getElementById('userListTitle').innerText = titulo;
    const container = document.getElementById('userListContainer');
    
    container.innerHTML = '<p style="text-align:center; padding:20px; color:#666;">Cargando...</p>';

    fetch(`${context}/ListarSeguidoresServlet?userId=${userId}&tipo=${tipo}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 

            if (data.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:20px; color:#888;">No hay usuarios en esta lista.</p>`;
                return;
            }

            data.forEach(u => {
                // Generamos la fila con el botón "Ver Perfil"
                const itemHtml = `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${context}/VerImagen?nombre=${u.avatar}" 
                                 onerror="this.src='${context}/Imagenes/default.png'"
                                 style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #ffb74d;">
                            <span style="color: #6b2b00; font-weight: bold;">@${u.username}</span>
                        </div>
                        
                        <a href="${context}/PerfilOtroServlet?id=${u.id}" class="btn-primary" 
                           style="font-size: 0.75rem; padding: 6px 14px; text-decoration:none; border-radius:20px; width:auto;">
                            Ver Perfil
                        </a>
                    </div>
                `;
                container.innerHTML += itemHtml;
            });
        })
        .catch(err => {
            container.innerHTML = '<p style="color:red; text-align:center;">Error al conectar con el servidor.</p>';
        });
}

function abrirModalEdicion(id, titulo) {
    document.getElementById('editPostId').value = id;
    document.getElementById('editPostTitle').value = titulo;
    document.getElementById('editPostModal').style.display = 'flex';
}

function guardarEdicionPost(event) {
    event.preventDefault(); // Evita la recarga
    const form = event.target;
    const formData = new FormData(form);
    formData.append("accion", "editar"); // Aseguramos la acción para el servlet

    const contextPath = document.body.dataset.context || "";

    fetch(`${contextPath}/InteraccionServlet`, {
        method: 'POST',
        body: formData // FormData maneja automáticamente el enctype="multipart/form-data"
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            const postId = formData.get("postId");
            // 1. Actualizar el título en el post correspondiente
            const postElement = document.querySelector(`.post[id="post-${postId}"]`) 
                                || document.querySelector(`button[onclick*="'${postId}'"]`).closest('.post');
            
            if (postElement) {
                postElement.querySelector('.post-content p').innerText = data.title;
                
                // 2. Si se subió una imagen nueva, actualizarla
                if (data.image) {
                    let imgHtml = postElement.querySelector('.post-img');
                    const nuevaRuta = `${contextPath}/VerImagen?nombre=${data.image}`;
                    if (imgHtml) {
                        imgHtml.src = nuevaRuta;
                    } else {
                        // Si antes no tenía imagen, la creamos
                        const contentDiv = postElement.querySelector('.post-content');
                        contentDiv.innerHTML += `<img src="${nuevaRuta}" class="post-img">`;
                    }
                }
            }
            // 3. Cerrar el modal
            document.getElementById('editPostModal').style.display = 'none';
            alert("¡Receta actualizada con éxito! 🍳");
        }
    })
    .catch(err => console.error("Error al editar:", err));
}