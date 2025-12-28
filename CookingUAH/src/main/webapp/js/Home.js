import { getPosts, savePosts, getCurrentUser, saveCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

  // 1 SEGURIDAD Y DATOS
  // cargar demo si no hay datos
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
    console.log('Datos demo cargados desde Home.js');
  }

  // obtener usuario actual
  const currentUser = getCurrentUser();

  // proteccion si no tiene id salir
  if (!currentUser || !currentUser.id) {
    if (!window.location.pathname.endsWith('IniciarSesion.html')) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'IniciarSesion.html';
      throw new Error('Usuario no autenticado');
    }
  }

  // 2 CABECERA USUARIO Y LOGOUT
  // referencias del nav para nombre y avatar
  const navUsername = document.getElementById('navUsername'); 
  const navAvatar = document.getElementById('navAvatar');     

  if (currentUser) {
      if (navUsername) navUsername.textContent = currentUser.username;
      if (navAvatar) navAvatar.src = currentUser.avatar || '../Imagenes/avatarDefault.png';
  }

  // boton cerrar sesion
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
      btnLogout.addEventListener('click', (e) => {
          e.preventDefault();
          if (confirm("¿Seguro que quieres cerrar sesión?")) {
              saveCurrentUser(null); // Borramos la sesion
              window.location.href = 'IniciarSesion.html';
          }
      });
  }


  // 3 REFERENCIAS DEL FEED
  // referencias DOM para el feed y el modal
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const newPostBtn = document.getElementById('newPostBtn');
  const newPostContent = document.getElementById('newPostContent');
  const imageUpload = document.getElementById('imageUpload');
  const addImgBtn = document.getElementById("addImgBtn");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const removeImageBtn = document.getElementById("removeImageBtn");
  
  let imageDataUrl = null; 

  // referencias del modal
  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.modal-close'); 
  
  // referencias del publicador del modal
  const modalNewPostContent = document.getElementById('modalNewPostContent');
  const modalImageUpload = document.getElementById('modalImageUpload');
  const modalAddImgBtn = document.getElementById('modalAddImgBtn');
  const modalImagePreview = document.getElementById('modalImagePreview');
  const modalImagePreviewContainer = document.getElementById('modalImagePreviewContainer');
  const modalRemoveImageBtn = document.getElementById('modalRemoveImageBtn');
  const modalNewPostBtn = document.getElementById('modalNewPostBtn');
  
  let modalImageDataUrl = null;

  // 4 LOGICA DEL MODAL
  // abrir cerrar modal y cerrar al clicar fuera
  openBtn?.addEventListener('click', () => { if(modal) modal.style.display = 'flex'; });
  closeModalBtn?.addEventListener('click', () => { if(modal) modal.style.display = 'none'; });
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

  // accion para añadir imagen en modal
  modalAddImgBtn?.addEventListener('click', () => { modalImageUpload?.click(); });

  modalImageUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      modalImageDataUrl = null;
      if (modalImagePreview) modalImagePreview.style.display = 'none';
      if (modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'none';
      if (modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'none';
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      modalImageDataUrl = event.target.result;
      if (modalImagePreview) {
        modalImagePreview.src = modalImageDataUrl;
        modalImagePreview.style.display = 'block';
      }
      if (modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'block';
      if (modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  // quitar imagen modal
  modalRemoveImageBtn?.addEventListener('click', () => {
      modalImageDataUrl = null;
      if(modalImageUpload) modalImageUpload.value = '';
      if(modalImagePreview) { modalImagePreview.src = '#'; modalImagePreview.style.display = 'none'; }
      if(modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'none';
      if(modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'none';
  });

  // publicar desde modal
  modalNewPostBtn?.addEventListener('click', () => {
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = modalNewPostContent.value.trim();
    if (!title && !modalImageDataUrl) return alert('No puedes publicar vacío.');

    const posts = getPosts() || [];
    const newPost = {
      id: uid(),
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: modalImageDataUrl,
      likes: 0,
      liked: false,
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

    // limpiar modal despues de publicar
    modalNewPostContent.value = '';
    modalImageDataUrl = null;
    if(modalImageUpload) modalImageUpload.value = '';
    if(modalImagePreview) { modalImagePreview.src = '#'; modalImagePreview.style.display = 'none'; }
    if(modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'none';
    if(modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'none';
    
    if (modal) modal.style.display = 'none';
    renderFiltered();
  });


  // 5 LOGICA DEL FEED RAPIDO
  // boton para abrir selector de imagen rapido
  addImgBtn?.addEventListener('click', () => { imageUpload?.click(); });

  imageUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      imageDataUrl = null;
      if (imagePreview) imagePreview.style.display = 'none';
      if (removeImageBtn) removeImageBtn.style.display = 'none';
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'none';
      return;
    }
    const reader = new FileReader(); 
    reader.onload = function(event) {
      imageDataUrl = event.target.result;
      if (imagePreview) {
        imagePreview.src = imageDataUrl;
        imagePreview.style.display = 'block';
      }
      if (removeImageBtn) removeImageBtn.style.display = 'block';
      if (imagePreviewContainer) imagePreviewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  // quitar imagen rapido
  removeImageBtn?.addEventListener('click', () => {
      imageDataUrl = null;
      if(imageUpload) imageUpload.value = '';
      if(imagePreview) { imagePreview.src = '#'; imagePreview.style.display = 'none'; }
      if(removeImageBtn) removeImageBtn.style.display = 'none';
      if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';
  });

  // publicar feed rapido
  newPostBtn?.addEventListener('click', () => {
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = newPostContent.value.trim();
    if (!title && !imageDataUrl) return alert('No puedes publicar vacío.');

    const posts = getPosts() || [];
    const newPost = {
      id: uid(),
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: imageDataUrl,
      likes: 0,
      liked: false,
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

    // limpiar feed rapido despues de publicar
    newPostContent.value = '';
    imageDataUrl = null;
    if(imageUpload) imageUpload.value = '';
    if(imagePreview) { imagePreview.src = '#'; imagePreview.style.display = 'none'; }
    if(removeImageBtn) removeImageBtn.style.display = 'none';
    if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';

    renderFiltered();
  });


  // 6 RENDERIZADO
  // funcion para renderizar posts
  function renderPosts(postsArray) {
    if (!postsContainer) return;
    postsContainer.innerHTML = '';

    if (!postsArray || postsArray.length === 0) {
      postsContainer.innerHTML = '<p>No hay publicaciones.</p>';
      return;
    }

    const users = getUsers(); 

    postsArray.forEach(post => {
      const author = users.find(u => u.id === post.authorId);
      const postDiv = document.createElement('div');
      postDiv.className = 'post';

      const likedClass = post.liked ? 'liked' : '';

      // crear avatar y nombre con enlace si existe autor
      const authorAvatar = author
        ? `<a href="PerfilOtro.html?id=${author.id}">
            <img src="${author.avatar || '../Imagenes/avatarDefault.png'}" alt="Usuario" class="user-img" />
          </a>`
        : `<img src="../Imagenes/avatarDefault.png" alt="Usuario" class="user-img" />`;

      const authorName = author
        ? `<a href="PerfilOtro.html?id=${author.id}" class="post-author-link">
            <h3>${author.username}</h3>
          </a>`
        : `<h3>Desconocido</h3>`;

      postDiv.innerHTML = `
        <div class="post-header">
          ${authorAvatar} 
          <div>
            ${authorName} 
            <span>${new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div class="post-content">
          <p>${post.title}</p>
          ${post.img ? `<img src="${post.img}" class="post-img" alt="Post" />` : ''}
        </div>
        
        <div class="post-actions">
          <button class="like-btn ${likedClass}" data-id="${post.id}">
            ❤️ Me gusta (${post.likes || 0})
          </button>
          <button class="comment-btn" data-id="${post.id}">💬 Comentar</button>
        </div>

        <div class="comments">
          ${(post.comments || []).map(comment => {
            const commentAuthor = users.find(u => u.id === comment.authorId);
            return `<p><strong>${commentAuthor?.username || 'Usuario'}:</strong> ${comment.content}</p>`;
          }).join("")}
        </div>
        `;

      postsContainer.appendChild(postDiv);
    });
    
    addEventListeners();
  }

  // agregar listeners para likes y comentarios
  function addEventListeners() {
    // likes
    document.querySelectorAll(".like-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.id;
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;
        post.liked = !post.liked;
        post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
        
        savePosts(posts); 
        renderFiltered();
      });
    });

    // comentarios
    document.querySelectorAll(".comment-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.id;
        const commentText = prompt("Escribe tu comentario:");
        
        if (commentText && commentText.trim() !== "") {
          const posts = getPosts();
          const post = posts.find(p => p.id === postId);
          if (!post) return;

          const newComment = {
            id: uid('c_'),
            authorId: currentUser.id,
            content: commentText.trim(),
            createdAt: Date.now()
          };
          
          if (!post.comments) post.comments = [];
          post.comments.push(newComment);
          
          savePosts(posts);
          renderFiltered();
        }
      });
    });
  }

  // filtrar posts segun input de busqueda
  function renderFiltered() {
    if (!searchInput) return;
    const posts = getPosts() || [];
    const q = (searchInput?.value || '').trim().toLowerCase();
    let filtered = posts;

    if (q.length > 0) {
      filtered = posts.filter(p => {
        const author = getUsers().find(u => u.id === p.authorId);
        return p.title.toLowerCase().includes(q) ||
               (author?.username && author.username.toLowerCase().includes(q));
      });
    }
    renderPosts(filtered);
  }

  // listener para input de busqueda
  searchInput?.addEventListener('input', renderFiltered);

  // actualizar vista si cambia almacenamiento desde otra pestaña
  window.addEventListener('storage', e => {
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  // boton para recargar datos demo
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Recargar datos demo? Se borrarán tus posts.")) {
      localStorage.clear();
      seedDemo();
      renderFiltered();
      alert("Datos recargados.");
      window.location.reload(); // Recargar para asegurar sesion limpia
    }
  });

  // inicializar busqueda y render
  if (searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

});
