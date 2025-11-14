import { getPosts, savePosts, getCurrentUser, getUsers, saveCurrentUser, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

    // 0. Inicialización y Comprobaciones 
    
    // Carga datos demo si está vacío
    if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
        seedDemo();
        console.log('Datos demo cargados.');
    }

    const currentUser = getCurrentUser();
    const allUsers = getUsers();
    let currentPosts = getPosts();

    // Redirección de seguridad
    if (!currentUser.id) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'IniciarSesion.html';
        throw new Error('Usuario no autenticado');
    }

    // 1. Funciones de Ayuda

    
    function findUser(id) {
        return allUsers.find(u => u.id === id);
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId.replace('#', ''));
        if (modal) modal.style.display = 'none';
    }

    // Formateo de fecha robusto (funciona con timestamps nuevos y strings viejos)
    function formatTime(timestamp) {
        if (!timestamp) return 'Reciente';
        // Si es un string antiguo (ej: "Ahora mismo"), lo devolvemos tal cual
        if (isNaN(timestamp)) return timestamp; 
        
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }


    // 2. Renderizado del Perfil


    function renderProfileInfo() {
        const user = getCurrentUser();
        if (user) {
            const nameElem = document.getElementById('perfil-username-main');
            const atElem = document.getElementById('perfil-username-at');
            const bioElem = document.getElementById('perfil-bio');

            if(nameElem) nameElem.textContent = user.username;
            if(atElem) atElem.textContent = '@' + user.username;
            if(bioElem) bioElem.textContent = user.bio || 'Apasionado por la cocina. ¡Compartiendo mis mejores recetas!';
        }
    }

    // Función principal para crear el HTML de cada post
    function createMyPostElement(post) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        
        // Intentamos buscar al autor por ID, si no existe usamos datos del post (legacy)
        const author = post.authorId ? findUser(post.authorId) : { username: post.username, avatar: post.avatar };
        
        // Compatibilidad: La BBDD nueva usa 'title', la vieja 'content'
        const postText = post.title || post.content || "";
        
        // Renderizado de comentarios previos
        const commentsHtml = (post.comments || []).map(c => {
            const cAuthor = c.authorId ? findUser(c.authorId) : { username: "Usuario" };
            return `<p><strong>@${cAuthor?.username || 'Anon'}:</strong> ${c.content}</p>`;
        }).join('');

        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${author?.avatar || '../Imagenes/avatarDefault.png'}" alt="Usuario" class="user-img">
                <div>
                    <h4>${author?.username || 'Usuario'}</h4>
                    <span>${formatTime(post.createdAt || post.time)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${postText.replace(/\n/g, '<br>')}</p>
                ${post.img ? `<img src="${post.img}" alt="Imagen de receta" class="post-img">` : ''}
            </div>
            <div class="post-actions">
                <button class="like-btn" data-post-id="${post.id}" data-likes-start="${post.likes || 0}">
                    <span class="like-text">❤️ Me gusta</span> (<span class="like-count">${post.likes || 0}</span>)
                </button>
                <button class="comment-btn" data-post-id="${post.id}">💬 Comentar</button>
                
                <button class="btn-edit-post" data-post-id="${post.id}" style="margin-left:auto; font-size:0.8em;">📝 Editar</button>
                <button class="btn-delete-post" data-post-id="${post.id}" style="font-size:0.8em;">🗑️</button>
            </div>
            <div class="comments">${commentsHtml}</div>
        `;

        // --- Lógica de Listeners dentro del elemento ---

        // 1. Me Gusta
        const likeBtn = postDiv.querySelector(".like-btn");
        let countElement = likeBtn.querySelector('.like-count');
        let isLiked = post.liked || false;
        let count = parseInt(likeBtn.dataset.likesStart) || 0;
        
        if (isLiked) likeBtn.classList.add("liked");

        likeBtn.addEventListener("click", () => {
            isLiked = !isLiked;
            count = isLiked ? count + 1 : count - 1;
            countElement.textContent = count;
            likeBtn.classList.toggle("liked", isLiked);
            
            // Actualizar BBDD
            const p = currentPosts.find(item => item.id === post.id);
            if(p) { 
                p.likes = count; 
                p.liked = isLiked; 
                savePosts(currentPosts); 
            }
        });

        // 2. Comentar
        postDiv.querySelector(".comment-btn").addEventListener("click", () => {
            const commentText = prompt("Escribe tu comentario:");
            if (commentText && commentText.trim() !== "") {
                const commentsContainer = postDiv.querySelector('.comments');
                const newComment = document.createElement('p');
                newComment.innerHTML = `<strong>@${currentUser.username}:</strong> ${commentText}`; 
                commentsContainer.appendChild(newComment);
                commentsContainer.scrollTop = commentsContainer.scrollHeight;
                
                // Actualizar BBDD
                const p = currentPosts.find(item => item.id === post.id);
                if(p) { 
                    if(!p.comments) p.comments = [];
                    p.comments.push({ 
                        id: uid('c_'), 
                        authorId: currentUser.id, 
                        content: commentText, 
                        createdAt: Date.now() 
                    });
                    savePosts(currentPosts);
                }
            }
        });

        // 3. Editar
        postDiv.querySelector(".btn-edit-post").addEventListener('click', () => openEditModal(post));

        // 4. Eliminar
        postDiv.querySelector(".btn-delete-post").addEventListener('click', () => deletePost(post.id));

        return postDiv;
    }

    function renderMyPosts() {
        const perfilPostsContainer = document.querySelector(".perfil-posts");
        if (!perfilPostsContainer) return;

        // Filtrar posts del usuario logueado
        // NOTA: Si tus posts viejos no tienen authorId, usamos currentUser.id para que se muestren los nuevos
        const myPosts = currentPosts
            .filter(p => p.authorId === currentUser.id || (!p.authorId && p.username === '@TuUsuario')) 
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        // Limpieza segura: Elimina solo los elementos con clase .post o mensajes previos, mantiene el título (h3/h4)
        const existingPosts = perfilPostsContainer.querySelectorAll('.post, p.empty-msg');
        existingPosts.forEach(el => el.remove());

        if (myPosts.length === 0) {
            const p = document.createElement('p');
            p.className = 'empty-msg';
            p.textContent = "No has publicado ninguna receta todavía.";
            perfilPostsContainer.appendChild(p);
            return;
        }

        myPosts.forEach(post => {
            perfilPostsContainer.appendChild(createMyPostElement(post));
        });
    }


    // 3. Lógica de Edición y Borrado 


    function deletePost(postId) {
        if (!confirm("¿Estás seguro de eliminar esta receta?")) return;
        currentPosts = currentPosts.filter(p => p.id !== postId);
        savePosts(currentPosts);
        renderMyPosts();
    }

    // -- Modal Editar --
    const editPostModal = document.getElementById('editPostModal');
    const editModalContent = document.getElementById('editModalContent');
    const editModalPostId = document.getElementById('editModalPostId');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const editImagePreview = document.getElementById("editImagePreview");
    const editRemoveImageBtn = document.getElementById("editRemoveImageBtn");
    const editImagePreviewContainer = document.getElementById("editImagePreviewContainer");
    const editImageUploadInput = document.getElementById("editImageUpload");
    let editSelectedImageDataUrl = null;

    function openEditModal(post) {
        if(!editPostModal) return; // Seguridad por si no existe el HTML del modal
        
        const postText = post.title || post.content || "";
        editModalContent.value = postText.replace(/<br>/g, '\n');
        editModalPostId.value = post.id;
        editSelectedImageDataUrl = post.img || null; 
        
        if (post.img) {
            editImagePreview.src = post.img;
            editImagePreview.style.display = 'block';
            editRemoveImageBtn.style.display = 'block';
            editImagePreviewContainer.style.display = 'flex';
        } else {
            editImagePreview.style.display = 'none';
            editRemoveImageBtn.style.display = 'none';
            editImagePreviewContainer.style.display = 'none';
        }
        editPostModal.style.display = 'flex'; 
    }

    // Listeners del Modal Editar
    if(editImageUploadInput) {
        document.getElementById("editAddImgBtn")?.addEventListener('click', () => editImageUploadInput.click());
        
        editImageUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    editSelectedImageDataUrl = e.target.result; 
                    editImagePreview.src = editSelectedImageDataUrl;
                    editImagePreview.style.display = 'block';
                    editRemoveImageBtn.style.display = 'block';
                    editImagePreviewContainer.style.display = 'flex'; 
                };
                reader.readAsDataURL(file);
            }
        });

        editRemoveImageBtn?.addEventListener('click', () => {
            editSelectedImageDataUrl = null;
            editImageUploadInput.value = ''; 
            editImagePreview.style.display = 'none';
            editRemoveImageBtn.style.display = 'none';
            editImagePreviewContainer.style.display = 'none';
        });
        
        saveEditBtn?.addEventListener('click', () => {
            const postId = editModalPostId.value;
            const newContent = editModalContent.value.trim();
            
            if (!newContent && !editSelectedImageDataUrl) {
                alert("La publicación no puede quedar vacía.");
                return;
            }

            const postIndex = currentPosts.findIndex(p => p.id === postId);
            if (postIndex !== -1) {
                // Actualizamos tanto title como content por compatibilidad
                currentPosts[postIndex].title = newContent;
                currentPosts[postIndex].content = newContent; 
                currentPosts[postIndex].img = editSelectedImageDataUrl;
                
                savePosts(currentPosts);
                closeModal('editPostModal');
                renderMyPosts();
            }
        });

        document.querySelector('#editPostModal .modal-close')?.addEventListener('click', () => closeModal('editPostModal'));
    }


    // 4. Lógica Crear Publicación (Modal)


    const openModalBtn = document.getElementById("openModalBtn");
    const postModal = document.getElementById("postModal");
    const closeModalBtn = postModal?.querySelector(".modal-close");
    const modalNewPostBtn = document.getElementById("modalNewPostBtn");
    const modalImageUploadInput = document.getElementById("modalImageUpload");
    const modalImagePreview = document.getElementById("modalImagePreview");
    const modalRemoveImageBtn = document.getElementById("modalRemoveImageBtn");
    const modalImagePreviewContainer = document.getElementById("modalImagePreviewContainer");
    const modalAddImgBtn = document.getElementById("modalAddImgBtn");
    let modalSelectedImageFile = null;

    if (openModalBtn && postModal) {
        openModalBtn.addEventListener('click', () => { postModal.style.display = 'flex'; });
        closeModalBtn?.addEventListener('click', () => { postModal.style.display = 'none'; });
        
        // Cerrar al hacer clic fuera
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) postModal.style.display = 'none';
        });

        // Subida Imagen Nuevo Post
        modalAddImgBtn?.addEventListener('click', () => modalImageUploadInput.click());
        modalImageUploadInput?.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                modalSelectedImageFile = file; 
                const reader = new FileReader();
                reader.onload = (e) => {
                    modalImagePreview.src = e.target.result;
                    modalImagePreview.style.display = 'block';
                    modalRemoveImageBtn.style.display = 'block';
                    modalImagePreviewContainer.style.display = 'flex'; 
                };
                reader.readAsDataURL(file);
            }
        });

        modalRemoveImageBtn?.addEventListener('click', () => {
            modalSelectedImageFile = null;
            modalImageUploadInput.value = ''; 
            modalImagePreview.style.display = 'none';
            modalRemoveImageBtn.style.display = 'none';
            modalImagePreviewContainer.style.display = 'none';
        });

        // Publicar
        modalNewPostBtn?.addEventListener("click", () => {
            const contentInput = document.getElementById("modalNewPostContent");
            const postContent = contentInput.value.trim(); 

            const finalizePost = (imageUrl) => {
                if (postContent === "" && !imageUrl) {
                    alert("No puedes publicar una receta vacía.");
                    return;
                }

                const newPost = {
                    id: uid(),
                    title: postContent,    // Campo nuevo
                    content: postContent,  // Campo viejo (compatibilidad)
                    authorId: currentUser.id,
                    username: currentUser.username,
                    avatar: currentUser.avatar || "../Imagenes/avatarDefault.png",
                    createdAt: Date.now(),
                    img: imageUrl,
                    likes: 0,
                    liked: false,
                    comments: []
                };

                currentPosts.unshift(newPost);
                savePosts(currentPosts);

                // Resetear Modal
                contentInput.value = "";
                modalSelectedImageFile = null;
                modalImageUploadInput.value = ''; 
                modalImagePreview.style.display = 'none';
                modalRemoveImageBtn.style.display = 'none';
                modalImagePreviewContainer.style.display = 'none';
                postModal.style.display = 'none'; 

                renderMyPosts();
            };

            if (modalSelectedImageFile) {
                const reader = new FileReader();
                reader.onload = (e) => finalizePost(e.target.result);
                reader.readAsDataURL(modalSelectedImageFile);
            } else {
                finalizePost(null);
            }
        });
    }

    // 5. Lógica Seguidores/Siguiendo 

    
    const followersData = [
        { username: "@Juan", name: "Juan Pérez", avatar: "../Imagenes/Avatar4.jpeg" },
        { username: "@Ana", name: "Ana López", avatar: "../Imagenes/Avatar1.jpg" },
        { username: "@Mario", name: "Mario del Monte", avatar: "../Imagenes/Avatar3.jpg" }
    ];
    const followingData = [
        { username: "@Laura", name: "Laura Vaquero", avatar: "../Imagenes/Avatar5.jpeg", isFollowing: true }, 
        { username: "@Caro", name: "Carolina Hernandez", avatar: "../Imagenes/Avatar6.jpeg", isFollowing: true } 
    ];

    const userListModal = document.getElementById('userListModal');
    const userListCloseBtn = document.getElementById('userListClose');
    const userListTitle = document.getElementById('userListTitle');
    const userList = document.getElementById('userList');
    const showFollowersBtn = document.getElementById('showFollowers');
    const showFollowingBtn = document.getElementById('showFollowing');

    const openUserListModal = (titleText, users) => {
        if(!userListModal) return;
        userListTitle.textContent = titleText;
        userList.innerHTML = ''; 

        if (users.length === 0) {
            userList.innerHTML = '<li class="empty-list">No hay usuarios.</li>';
        }

        users.forEach(user => {
            const li = document.createElement('li');
            li.className = 'user-list-item';
            let isFollowing = (titleText === 'Siguiendo'); 
            const btnText = isFollowing ? 'Siguiendo' : 'Seguir';
            const btnClass = isFollowing ? 'follow-btn following' : 'follow-btn';

            li.innerHTML = `
              <img src="${user.avatar}" alt="${user.username}" class="user-list-avatar">
              <div class="user-list-info">
                <strong>${user.name}</strong>
                <span>${user.username}</span>
              </div>
              <button class="${btnClass}">${btnText}</button>
            `;
            
            const followBtn = li.querySelector('.follow-btn');
            followBtn.addEventListener('click', () => {
                isFollowing = !isFollowing; 
                if (isFollowing) {
                    followBtn.textContent = 'Siguiendo';
                    followBtn.classList.add('following');
                } else {
                    followBtn.textContent = 'Seguir';
                    followBtn.classList.remove('following');
                }
            });
            userList.appendChild(li);
        });
        
        userListModal.style.display = 'flex';
    };

    if(showFollowersBtn) showFollowersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openUserListModal('Seguidores', followersData);
    });
    
    if(showFollowingBtn) showFollowingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openUserListModal('Siguiendo', followingData);
    });

    if(userListCloseBtn) userListCloseBtn.addEventListener('click', () => userListModal.style.display = 'none');
    document.getElementById('userListBackdrop')?.addEventListener('click', () => userListModal.style.display = 'none');



    // 6. Inicialización Final

    
    renderProfileInfo();
    renderMyPosts();
    
    // Escuchar cambios en localStorage para mantener sincronizadas las pestañas
    window.addEventListener('storage', e => {
        if (e.key === 'posts' || e.key === 'users') {
            currentPosts = getPosts();
            renderProfileInfo();
            renderMyPosts();
        }
    });


});
