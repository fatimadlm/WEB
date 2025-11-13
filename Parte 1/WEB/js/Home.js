import { getPosts, savePosts, getCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

  // Carga datos de prueba si no hay usuarios o publicaciones
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
    console.log('Datos demo cargados desde Home.js');
  }

  const currentUser = getCurrentUser();

  // Si no hay usuario logueado, redirige al login
  if (!currentUser || !currentUser.id) {
    if (!window.location.pathname.endsWith('IniciarSesion.html')) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'IniciarSesion.html';
      throw new Error('Usuario no autenticado');
    }
  }

  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput');
  const newPostBtn = document.getElementById('newPostBtn');
  const newPostContent = document.getElementById('newPostContent');

  // Referencias para el publicador rápido (con imagen)
  const imageUpload = document.getElementById('imageUpload');
  const addImgBtn = document.getElementById("addImgBtn");
  const imagePreview = document.getElementById("imagePreview");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  const removeImageBtn = document.getElementById("removeImageBtn");

  let imageDataUrl = null;

  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  
  // Muestra el modal cuando se hace clic
  openBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'block';
  });

  // Hacemos que el botón "Añadir Imagen" active el input[type=file]
  addImgBtn?.addEventListener('click', () => {
    imageUpload?.click(); 
  });

  // Cuando el usuario sube una imagen, muestra la previsualización
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

  // Botón para quitar la imagen seleccionada
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

  // Filtra las publicaciones según el texto de búsqueda
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

  // Actualiza los resultados de búsqueda en tiempo real
  searchInput?.addEventListener('input', renderFiltered);

  // Permite crear una nueva publicación
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

  // Actualiza la vista si cambian los datos en otra pestaña
  window.addEventListener('storage', e => {
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  // Botón para recargar los datos de prueba
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
      localStorage.clear();
      seedDemo();
      renderFiltered();
      alert("Datos de prueba recargados correctamente.");
    }
  });

  // Limpia el buscador y muestra todas las publicaciones al cargar la página
  if (searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

}); 
