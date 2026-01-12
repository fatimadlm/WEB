document.addEventListener('DOMContentLoaded', () => {
    // Cerrar modal al hacer clic fuera
    const userListModal = document.getElementById('userListModal');
    if (userListModal) {
        userListModal.addEventListener('click', (e) => {
            if (e.target === userListModal) {
                cerrarListaUsuarios();
            }
        });
    }
});

function abrirSeguidores() {
    cargarListaUsuarios('seguidores', 'Seguidores');
}

function abrirSiguiendo() {
    cargarListaUsuarios('siguiendo', 'Siguiendo');
}

function cerrarListaUsuarios() {
    const modal = document.getElementById('userListModal');
    if (modal) modal.style.display = 'none';
}

function cargarListaUsuarios(tipo, titulo) {
    const context = document.body.dataset.context;
    const userIdInput = document.getElementById('userIdHidden');
    
    if (!userIdInput) return;

    const userId = userIdInput.value;
    const modal = document.getElementById('userListModal');
    const titleElem = document.getElementById('userListTitle');
    const container = document.getElementById('userListContainer');

    modal.style.display = 'flex';
    titleElem.innerText = titulo;
    container.innerHTML = '<p style="text-align:center; padding:20px;">Cargando...</p>';

    fetch(`${context}/ListarSeguidoresServlet?userId=${userId}&tipo=${tipo}`)
        .then(response => response.json())
        .then(data => {
            container.innerHTML = ''; 
            if (!data || data.length === 0) {
                container.innerHTML = `<p style="text-align:center; padding:20px;">No hay ${tipo} todavía.</p>`;
                return;
            }
            data.forEach(u => {
                container.innerHTML += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${context}/VerImagen?nombre=${u.avatar}" 
                                 onerror="this.src='${context}/Imagenes/default.png'"
                                 style="width: 45px; height: 45px; border-radius: 50%; object-fit: cover; border: 2px solid #ffb74d;">
                            <span style="color: #6b2b00; font-weight: bold;">@${u.username}</span>
                        </div>
                        <a href="${context}/PerfilOtroServlet?id=${u.id}" class="btn-primary" 
                           style="font-size: 0.75rem; padding: 6px 14px; text-decoration:none; border-radius:20px; width:auto; display:inline-block; text-align:center;">
                            Ver Perfil
                        </a>
                    </div>
                `;
            });
        })
        .catch(err => {
            container.innerHTML = '<p style="color:red; text-align:center;">Error al cargar lista.</p>';
        });
}

function darLikePerfil(postId) {
    const context = document.body.dataset.context;
    const params = new URLSearchParams();
    params.append('accion', 'like');
    params.append('postId', postId);

    fetch(`${context}/InteraccionServlet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'ok') {
            const spanCount = document.getElementById('likes-count-' + postId);
            if (spanCount) spanCount.innerText = data.likes;
            const btn = document.getElementById('btn-like-' + postId);
            btn.classList.toggle('liked');
        }
    })
    .catch(err => console.error("Error al dar like:", err));
}