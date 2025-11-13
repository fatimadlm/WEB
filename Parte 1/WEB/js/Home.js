import { getPosts, savePosts, getCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

  // Si no hay datos guardados, se cargan datos de prueba
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
    console.log('Datos demo cargados');
  }

  // Se obtiene el usuario logueado
  const currentUser = getCurrentUser();

  // Si no hay usuario logueado, redirige al login
  if (!currentUser || !currentUser.id) {
    if (!window.location.pathname.endsWith('IniciarSesion.html')) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'IniciarSesion.html';
      throw new Error('Usuario no autenticado');
    }
  }

  // Elementos HTML
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const newPostBtn = document.getElementById('newPostBtn');
  const newPostContent = document.getElementById('newPostContent');
  const imageUpload = document.getElementById('imageUpload');
  const addImgBtn = document.getElementById("addImgBtn");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const removeImageBtn = document.getElementById("removeImageBtn");

  let imageDataUrl = null; // Guarda la imagen seleccionada

  // Referencias al modal
  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeModalBtn = document.querySelector('.modal-close');

  const modalNewPostContent = document.getElementById('modalNewPostContent');
  const modalImageUpload = document.getElementById('modalImageUpload');
  const modalAddImgBtn = document.getElementById('modalAddImgBtn');
  const modalImagePreview = document.getElementById('modalImagePreview');
  const modalImagePreviewContainer = document.getElementById('modalImagePreviewContainer');
  const modalRemoveImageBtn = document.getElementById('modalRemoveImageBtn');
  const modalNewPostBtn = document.getElementById('modalNewPostBtn');

  let modalImageDataUrl = null; // Imagen del modal

  // Abrir el modal
  openBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'flex';
  });

  // Cerrar el modal
  closeModalBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'none';
  });

  modal?.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Subir imagen en el modal
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

  // Quitar imagen del modal
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

  // Publicar desde el modal
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
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

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

  // Añadir imagen en el feed rápido
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

  // Quitar imagen en el feed
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

  // Publicar en el feed rápido
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
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts);

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

  // Funciones para mostrar las publicaciones
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
      `;

      postsContainer.appendChild(postDiv);
    });
  }

  // Filtrar las publicaciones por búsqueda
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

  // Listener para el buscador
  searchInput?.addEventListener('input', renderFiltered);

  // Listener para el almacenamiento
  window.addEventListener('storage', e => {
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  // Botón para recargar datos de prueba
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
      localStorage.clear();
      seedDemo();
      renderFiltered();
      alert("Datos de prueba recargados.");
    }
  });

  // Carga inicial
  if (searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

}); 
