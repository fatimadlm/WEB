import { getPosts, savePosts, getCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

// Toda la lógica DEBE ir dentro de este bloque
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Comprobar si los datos existen. Si no, crearlos.
  // (Este es el bloque que tenías mal)
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo(); //
    console.log('Datos demo cargados desde Home.js');
  }

  // 2. Obtener el usuario (DESPUÉS de cargar datos)
  const currentUser = getCurrentUser(); //

  // 3. Guardián de seguridad
  if (!currentUser || !currentUser.id) {
    // Comprobamos si estamos en la página de login para evitar un bucle
    if (!window.location.pathname.endsWith('IniciarSesion.html')) {
      alert('Debes iniciar sesión para acceder a esta página.');
      window.location.href = 'IniciarSesion.html';
      throw new Error('Usuario no autenticado');
    }
    // Si estamos en login, no hacemos nada.
    // Si Home.js se carga en Mensajes.html, el guardián de Mensajes.js actuará.
    // Esta lógica es principalmente para Home.html en sí.
    
    // NOTA: Si este script (Home.js) se carga en Mensajes.html,
    // el guardián de Mensajes.js (que es más estricto) se encargará.
    // Dejamos que el script de la PÁGINA ACTUAL (Mensajes.js) decida.
  }

  // 4. Todas las variables y funciones van AQUÍ DENTRO
  
  // (Estas variables son para Home.html, serán null en Mensajes.html, 
  // por eso usamos '?' para evitar errores)
  const postsContainer = document.getElementById('postsContainer');
  const searchInput = document.getElementById('searchInput'); //
  const newPostBtn = document.getElementById('newPostBtn');
  const newPostContent = document.getElementById('newPostContent');
  const imageUpload = document.getElementById('imageUpload');

  let imageDataUrl = null; 

  // --- Lógica del Modal (que se usa en Mensajes.html) ---
  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  
  // (El resto del código del modal que tengas...)
  openBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'block';
  });
  // (Añade aquí tu lógica para cerrar el modal)


  // --- Lógica específica de Home.js ---
  
  // Manejar carga de imagen
  imageUpload?.addEventListener('change', (e) => { //
    const file = e.target.files[0];
    if (!file) {
      imageDataUrl = null;
      return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
      imageDataUrl = event.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Función para dibujar los posts
  function renderPosts(postsArray) { //
    if (!postsContainer) return; // No hacer nada si no estamos en Home.html
    postsContainer.innerHTML = '';

    if (!postsArray || postsArray.length === 0) {
      postsContainer.innerHTML = '<p>No hay publicaciones.</p>';
      return;
    }

    const users = getUsers(); //

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

  // Función para filtrar posts
  function renderFiltered() { //
    if (!searchInput) return; // No hacer nada si no estamos en Home.html
    
    const posts = getPosts() || []; //
    const q = (searchInput?.value || '').trim().toLowerCase();
    let filtered = posts;
    if (q.length > 0) {
      filtered = posts.filter(p => {
        const author = getUsers().find(u => u.id === p.authorId); //
        return p.title.toLowerCase().includes(q) ||
               (author?.username && author.username.toLowerCase().includes(q));
      });
    }
    renderPosts(filtered);
  }

  // --- Asignar Eventos ---
  
  searchInput?.addEventListener('input', renderFiltered); //

  newPostBtn?.addEventListener('click', () => { //
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = newPostContent.value.trim();
    if (!title) {
      return alert('No puedes publicar vacío.');
    }

    const posts = getPosts() || []; //
    const newPost = {
      id: uid(), //
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: imageDataUrl, 
      comments: []
    };

    posts.unshift(newPost);
    savePosts(posts); //

    newPostContent.value = '';
    imageUpload.value = '';
    imageDataUrl = null;

    renderFiltered();
  });

  window.addEventListener('storage', e => { //
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  const refreshBtn = document.getElementById('refreshDemoBtn'); //
  refreshBtn?.addEventListener('click', () => { //
    if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
      localStorage.clear(); 
      seedDemo(); //
      renderFiltered(); 
      alert("Datos de prueba recargados correctamente.");
    }
  });

  // --- Carga inicial (solo si estamos en Home.html) ---
  if(searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

}); // Fin de DOMContentLoaded