import { getPosts, savePosts, getCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {
  
  // Si no hay usuarios o publicaciones guardadas en localStorage, se crean datos de ejemplo
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
    console.log('Datos demo cargados desde Home.js');
  }

  // Se obtiene el usuario que ha iniciado sesión
  const currentUser = getCurrentUser();

  // Si no hay usuario logueado, se redirige automáticamente a la página de inicio de sesión
  if (!currentUser || !currentUser.id) {
    if (!window.location.pathname.endsWith('IniciarSesion.html')) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'IniciarSesion.html';
      throw new Error('Usuario no autenticado');
    }
  }

  // --- REFERENCIAS A ELEMENTOS DEL DOM ---
  
  // Referencias del feed principal
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const newPostBtn = document.getElementById('newPostBtn');
  const newPostContent = document.getElementById('newPostContent');
  const imageUpload = document.getElementById('imageUpload');
  const addImgBtn = document.getElementById("addImgBtn");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const removeImageBtn = document.getElementById("removeImageBtn");
  
  let imageDataUrl = null; // Imagen para el feed rápido

  // Referencias del modal
  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.modal-close'); // Boton para cerrar el modal
  
  // Referencias del publicador del modal
  const modalNewPostContent = document.getElementById('modalNewPostContent');
  const modalImageUpload = document.getElementById('modalImageUpload');
  const modalAddImgBtn = document.getElementById('modalAddImgBtn');
  const modalImagePreview = document.getElementById('modalImagePreview');
  const modalImagePreviewContainer = document.getElementById('modalImagePreviewContainer');
  const modalRemoveImageBtn = document.getElementById('modalRemoveImageBtn');
  const modalNewPostBtn = document.getElementById('modalNewPostBtn');
  
  let modalImageDataUrl = null; // Variable separada para la imagen del modal

  // --- LOGICA DEL MODAL (ABRIR Y CERRAR) ---
  
  openBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'flex'; 
  });

  closeModalBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'none';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // --- LOGICA DE IMAGEN (MODAL) ---
  
  modalAddImgBtn?.addEventListener('click', () => {
    modalImageUpload?.click(); 
  });

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

  modalRemoveImageBtn?.addEventListener('click', () => {
      modalImageDataUrl = null;
      if(modalImageUpload) modalImageUpload.value = '';
      if(modalImagePreview) {
        modalImagePreview.src = '#';
        modalImagePreview.style.display = 'none';
      }
      if(modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'none';
      if(modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'none';
  });

  // --- LOGICA DE PUBLICACION (MODAL) ---
  modalNewPostBtn?.addEventListener('click', () => {
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = modalNewPostContent.value.trim();
    if (!title && !modalImageDataUrl) {
      return alert('No puedes publicar vacío.');
    }

    const posts = getPosts() || [];
    const newPost = {
      id: uid(),
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: modalImageDataUrl,
      likes: 0,     // Inicializa likes y liked al crear
      liked: false,
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

    // Limpiar campos del MODAL
    modalNewPostContent.value = '';
    modalImageDataUrl = null;
    if(modalImageUpload) modalImageUpload.value = '';
    if(modalImagePreview) {
      modalImagePreview.src = '#';
      modalImagePreview.style.display = 'none';
    }
    if(modalRemoveImageBtn) modalRemoveImageBtn.style.display = 'none';
    if(modalImagePreviewContainer) modalImagePreviewContainer.style.display = 'none';
    
    if (modal) modal.style.display = 'none';

    renderFiltered();
  });


  // --- LOGICA DEL FEED RAPIDO ---

  addImgBtn?.addEventListener('click', () => {
    imageUpload?.click(); 
  });

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

  removeImageBtn?.addEventListener('click', () => {
      imageDataUrl = null;
      if(imageUpload) imageUpload.value = '';
      if(imagePreview) {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
      }
      if(removeImageBtn) removeImageBtn.style.display = 'none';
      if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';
  });

  // --- LOGICA DE PUBLICACION (FEED RAPIDO) ---
  newPostBtn?.addEventListener('click', () => {
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = newPostContent.value.trim();
    if (!title && !imageDataUrl) {
      return alert('No puedes publicar vacío.');
    }

    const posts = getPosts() || [];
    const newPost = {
      id: uid(),
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: imageDataUrl,
      likes: 0,     // Inicializa likes y liked al crear
      liked: false,
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

    // Limpiar campos del FEED
    newPostContent.value = '';
    imageDataUrl = null;
    if(imageUpload) imageUpload.value = '';
    if(imagePreview) {
      imagePreview.src = '#';
      imagePreview.style.display = 'none';
    }
    if(removeImageBtn) removeImageBtn.style.display = 'none';
    if(imagePreviewContainer) imagePreviewContainer.style.display = 'none';

    renderFiltered();
  });


  // --- RENDERIZADO E INTERACTIVIDAD ---

  // Dibuja las publicaciones en pantalla
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

      // Comprueba si el post actual tiene 'like'
      const likedClass = post.liked ? 'liked' : '';

      postDiv.innerHTML = `
        <div class="post-header">
          <img src="${author?.avatar || '../Imagenes/avatarDefault.png'}" alt="Imagen de usuario" class="user-img" />
          <div>
            <h3>${author?.username || 'Desconocido'}</h3>
            <span>${new Date(post.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div class="post-content">
          <p>${post.title}</p>
          ${post.img ? `<img src="${post.img}" class="post-img" alt="Imagen publicación" />` : ''}
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
    
    // Despues de dibujar los botones, se les da funcionalidad
    addEventListeners();
  }

  // Esta función añade los listeners de 'click' a los botones de 
  // 'Me gusta' y 'Comentar' CADA VEZ que se redibujan los posts.
  function addEventListeners() {
    
    // Logica de Me Gusta
    document.querySelectorAll(".like-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.id;
        const posts = getPosts();
        const post = posts.find(p => p.id === postId);
        
        if (!post) return;

        // Alternar el 'like'
        post.liked = !post.liked;
        // Sumar o restar al contador
        post.likes = (post.likes || 0) + (post.liked ? 1 : -1);
        
        savePosts(posts); // Guardar el cambio
        renderFiltered(); // Volver a dibujar todo para que se actualice
      });
    });

    // Logica de Comentar
    document.querySelectorAll(".comment-btn[data-id]").forEach(btn => {
      btn.addEventListener("click", () => {
        const postId = btn.dataset.id;
        const commentText = prompt("Escribe tu comentario:");
        
        if (commentText && commentText.trim() !== "") {
          const posts = getPosts();
          const post = posts.find(p => p.id === postId);
          if (!post) return;

          // Crear el nuevo objeto comentario
          const newComment = {
            id: uid('c_'), // ID único para el comentario
            authorId: currentUser.id,
            content: commentText.trim(),
            createdAt: Date.now()
          };
          
          if (!post.comments) post.comments = []; // Asegurarse de que el array exista
          post.comments.push(newComment);
          
          savePosts(posts); // Guardar el nuevo comentario
          renderFiltered(); // Volver a dibujar todo
        }
      });
    });
  }


  // Filtra las publicaciones
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
    // Renderiza los posts filtrados
    renderPosts(filtered);
  }

  // Listener del buscador
  searchInput?.addEventListener('input', renderFiltered);

  // Listener de storage
  window.addEventListener('storage', e => {
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  // Botón Recargar Demo
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
      localStorage.clear();
      seedDemo();
      renderFiltered();
      alert("Datos de prueba recargados correctamente.");
    }
  });

  // Carga inicial
  if (searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

}); // Fin del DOMContentLoaded