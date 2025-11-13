import { getPosts, savePosts, getCurrentUser, getUsers, saveCurrentUser, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

    // Comprobación y carga de datos demo
    if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
        seedDemo();
        console.log('Datos demo cargados desde MiPerfil.js');
    }

    const currentUser = getCurrentUser();
    const allUsers = getUsers();
    let currentPosts = getPosts();

    // Redirección si no hay usuario logueado
    if (!currentUser.id) {
        alert('Debes iniciar sesión para acceder a esta página.');
        window.location.href = 'IniciarSesion.html';
        throw new Error('Usuario no autenticado');
    }
    
    // ====================================================
    // 1. Funciones de ayuda
    // ====================================================
    function findUser(id) {
        return allUsers.find(u => u.id === id);
    }
    
    // Cierra cualquier modal que use la clase .modal-backdrop
    function closeModal(modalId) {
        const modal = document.getElementById(modalId.replace('#', ''));
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    // Formatea un timestamp a hora local
    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    }

    // ====================================================
    // 2. Renderizado del perfil
    // ====================================================
    
    function renderProfileInfo() {
        const user = getCurrentUser();
        if (user) {
            document.getElementById('perfil-username-main').textContent = user.username;
            document.getElementById('perfil-username-at').textContent = '@' + user.username;
            document.getElementById('perfil-bio').textContent = user.bio || 'Apasionado por la cocina. ¡Compartiendo mis mejores recetas!';
        }
    }
    
    // Función para crear el HTML de una publicación (propia)
    function createMyPostElement(post) {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        const author = findUser(post.authorId);
        
        const commentsHtml = (post.comments || []).map(c => {
            const cAuthor = findUser(c.authorId);
            return `<p><strong>@${cAuthor?.username || 'Desconocido'}:</strong> ${c.content}</p>`;
        }).join('');
        
        postDiv.innerHTML = `
            <div class="post-header">
                <img src="${author?.avatar || '../Imagenes/avatarDefault.png'}" alt="Usuario" class="user-img">
                <div>
                    <h4>${author?.username || 'Desconocido'}</h4>
                    <span>${formatTime(post.createdAt)}</span>
                </div>
            </div>
            <div class="post-content">
                <p>${post.title.replace(/\n/g, '<br>')}</p>
                ${post.img ? `<img src="${post.img}" alt="Imagen de receta" class="post-img">` : ''}
            </div>
            <div class="post-actions">
                <button class="like-btn" data-post-id="${post.id}" data-likes-start="${post.likes}">
                    <span class="like-text">❤️ Me gusta</span> (<span class="like-count">${post.likes}</span>)
                </button>
                <button class="comment-btn" data-post-id="${post.id}">💬 Comentar</button>
                <button class="btn-edit-post" data-post-id="${post.id}">📝 Editar</button>
                <button class="btn-delete-post" data-post-id="${post.id}">🗑️ Eliminar</button>
            </div>
            <div class="comments">${commentsHtml}</div>
        `;

        // Lógica de Me Gusta
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
            
            const p = currentPosts.find(p => p.id === post.id);
            if(p) { p.likes = count; p.liked = isLiked; savePosts(currentPosts); }
        });
        
        // Lógica de Comentar
        postDiv.querySelector(".comment-btn").addEventListener("click", () => {
          const commentText = prompt("Escribe tu comentario:");
          
          if (commentText && commentText.trim() !== "") {
            const commentsContainer = postDiv.querySelector('.comments');
            const newComment = document.createElement('p');
            newComment.innerHTML = `<strong>@${currentUser.username}:</strong> ${commentText}`; 
            commentsContainer.appendChild(newComment);
            commentsContainer.scrollTop = commentsContainer.scrollHeight;
            
            const p = currentPosts.find(p => p.id === post.id);
            if(p) { 
                p.comments.push({ id: uid('c_'), authorId: currentUser.id, content: commentText, createdAt: Date.now() });
                savePosts(currentPosts);
            }
          }
        });
        
        // Lógica de Editar
        postDiv.querySelector(".btn-edit-post").addEventListener('click', () => {
            openEditModal(post);
        });
        
        // Lógica de Eliminar
        postDiv.querySelector(".btn-delete-post").addEventListener('click', () => {
            deletePost(post.id);
        });

        return postDiv;
    }
    
    function renderMyPosts() {
        const perfilPostsContainer = document.querySelector(".perfil-posts");
        if (!perfilPostsContainer) return;
        
        const myPosts = currentPosts
            .filter(p => p.authorId === currentUser.id)
            .sort((a, b) => b.createdAt - a.createdAt);
        
        // Eliminar todos los hijos excepto el <h3>
        while (perfilPostsContainer.children.length > 1) {
            perfilPostsContainer.removeChild(perfilPostsContainer.lastChild);
        }

        if (myPosts.length === 0) {
            const p = document.createElement('p');
            p.textContent = "No has publicado ninguna receta todavía.";
            perfilPostsContainer.appendChild(p);
            return;
        }

        myPosts.forEach(post => {
            perfilPostsContainer.appendChild(createMyPostElement(post));
        });
    }

    // ====================================================
    // 3. Lógica de Eliminación y Edición de Publicación
    // ====================================================
    
    function deletePost(postId) {
        if (!confirm("¿Estás seguro de que quieres eliminar esta publicación? Esta acción no se puede deshacer.")) {
            return;
        }
        
        currentPosts = currentPosts.filter(p => p.id !== postId);
        
        savePosts(currentPosts);
        renderMyPosts(); 
        alert("Publicación eliminada.");
    }

    // --- Modal de Edición ---
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
        editModalContent.value = post.title.replace(/<br>/g, '\n');
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
        editModalContent.focus();
    }
    
    document.getElementById("editAddImgBtn")?.addEventListener('click', () => { editImageUploadInput.click(); });

    editImageUploadInput?.addEventListener('change', (event) => {
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
        } else { 
            editSelectedImageDataUrl = null;
            editImagePreview.style.display = 'none';
            editRemoveImageBtn.style.display = 'none';
            editImagePreviewContainer.style.display = 'none';
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
        if (postIndex === -1) {
            alert("Error: Publicación no encontrada.");
            return;
        }

        currentPosts[postIndex].title = newContent;
        currentPosts[postIndex].img = editSelectedImageDataUrl;
        
        savePosts(currentPosts);
        closeModal('editPostModal');
        renderMyPosts();
        alert("Publicación actualizada con éxito.");
    });
    
    document.querySelector('#editPostModal .modal-close')?.addEventListener('click', (e) => {
        const targetId = e.target.dataset.target;
        if(targetId) closeModal(targetId);
    });

    // ====================================================
    // 4. Lógica de Creación de Publicación (Modal)
    // ====================================================

    const openModalBtn = document.getElementById("openModalBtn");
    const postModal = document.getElementById("postModal");
    const closeModalBtn = postModal?.querySelector(".modal-close"); 
    const modalNewPostBtn = document.getElementById("modalNewPostBtn");
    let modalSelectedImageFile = null;
    const modalImageUploadInput = document.getElementById("modalImageUpload");
    const modalImagePreview = document.getElementById("modalImagePreview");
    const modalRemoveImageBtn = document.getElementById("modalRemoveImageBtn");
    const modalImagePreviewContainer = document.getElementById("modalImagePreviewContainer");
    const modalAddImgBtn = document.getElementById("modalAddImgBtn");

    if (openModalBtn && postModal) {
      
        openModalBtn.addEventListener('click', () => { postModal.style.display = 'flex'; });
        closeModalBtn?.addEventListener('click', (e) => { 
            const targetId = e.target.dataset.target;
            if(targetId) closeModal(targetId);
        });
        postModal.addEventListener('click', (e) => {
            if (e.target === postModal) { postModal.style.display = 'none'; }
        });

        // Subida de imagen
        modalAddImgBtn?.addEventListener('click', () => { modalImageUploadInput.click(); });
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
            } else { 
                modalSelectedImageFile = null;
                modalImagePreview.style.display = 'none';
                modalRemoveImageBtn.style.display = 'none';
                modalImagePreviewContainer.style.display = 'none';
            }
        });
        modalRemoveImageBtn?.addEventListener('click', () => {
            modalSelectedImageFile = null;
            modalImageUploadInput.value = ''; 
            modalImagePreview.style.display = 'none';
            modalRemoveImageBtn.style.display = 'none';
            modalImagePreviewContainer.style.display = 'none';
        });

        // Lógica de Publicar
        modalNewPostBtn?.addEventListener("click", () => {
            const contentInput = document.getElementById("modalNewPostContent");
            const postContent = contentInput.value.trim(); 
            
            // Función para finalizar la publicación después de leer el archivo (si lo hay)
            const finalizePost = (imageUrl) => {
                if (postContent === "" && !imageUrl) {
                    alert("No puedes publicar una receta vacía.");
                    return;
                }
                
                const newPost = {
                    id: uid(),
                    title: postContent,
                    authorId: currentUser.id,
                    createdAt: Date.now(),
                    img: imageUrl, 
                    likes: 0,
                    liked: false, 
                    comments: []
                };

                currentPosts.unshift(newPost);
                savePosts(currentPosts);
                
                // Limpiar y cerrar
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

    // ====================================================
    // 5. Lógica de Seguidores/Siguiendo (Modales)
    // ====================================================

    // Datos demo para el modal
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
    const userListBackdrop = document.getElementById('userListBackdrop');
    const userListCloseBtn = document.getElementById('userListClose');
    const userListTitle = document.getElementById('userListTitle');
    const userList = document.getElementById('userList');
    const showFollowersBtn = document.getElementById('showFollowers');
    const showFollowingBtn = document.getElementById('showFollowing');

    const openUserListModal = (titleText, users) => {
      userListTitle.textContent = titleText;
      userList.innerHTML = ''; 

      if (users.length === 0) {
        userList.innerHTML = '<li class="empty-list">No hay usuarios que mostrar.</li>';
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

    const closeUserListModal = () => {
      userListModal.style.display = 'none';
    };

    if(showFollowersBtn) { 
      showFollowersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openUserListModal('Seguidores', followersData);
      });
    }
    
    if(showFollowingBtn) {
      showFollowingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openUserListModal('Siguiendo', followingData);
      });
    }

    if(userListCloseBtn) userListCloseBtn.addEventListener('click', closeUserListModal);
    if(userListBackdrop) userListBackdrop.addEventListener('click', closeUserListModal);


    // ====================================================
    // 6. Inicialización final y listeners
    // ====================================================
    
    renderProfileInfo();
    renderMyPosts();
    
    // Escucha cambios en localStorage para actualizar la vista del perfil
    window.addEventListener('storage', e => {
        if (e.key === 'posts' || e.key === 'users') {
            currentPosts = getPosts();
            renderProfileInfo();
            renderMyPosts();
        }
    });

});