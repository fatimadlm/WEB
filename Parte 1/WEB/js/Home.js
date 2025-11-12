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

  // Se guardan las referencias a los elementos HTML que se van a usar
  const postsContainer = document.getElementById('postsContainer'); // contenedor donde se muestran los posts
  const searchInput = document.getElementById('searchInput'); // campo de búsqueda
  const newPostBtn = document.getElementById('newPostBtn'); // botón para publicar
  const newPostContent = document.getElementById('newPostContent'); // texto del nuevo post
  const imageUpload = document.getElementById('imageUpload'); // input para subir imagen

  let imageDataUrl = null; // aquí se guardará la imagen convertida a base64

  // Referencias para el modal (ventana emergente)
  const modal = document.getElementById('postModal');
  const openBtn = document.getElementById('openModalBtn');
  
  // Si existe el botón de abrir modal, al hacer clic se muestra la ventana
  openBtn?.addEventListener('click', () => {
     if(modal) modal.style.display = 'block';
  });
  // Aquí puedes agregar el botón o función para cerrar el modal

  // Cuando el usuario sube una imagen, se convierte a formato base64 para poder guardarla
  imageUpload?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) {
      imageDataUrl = null; // si no selecciona nada, no se guarda imagen
      return;
    }
    const reader = new FileReader(); // objeto para leer archivos
    reader.onload = function(event) {
      imageDataUrl = event.target.result; // guardamos la imagen convertida
    };
    reader.readAsDataURL(file); // convierte el archivo a base64
  });

  // Dibuja las publicaciones en pantalla
  function renderPosts(postsArray) {
    if (!postsContainer) return; // si no estamos en Home.html, no hace nada
    postsContainer.innerHTML = ''; // limpia el contenedor

    // Si no hay publicaciones, muestra un mensaje
    if (!postsArray || postsArray.length === 0) {
      postsContainer.innerHTML = '<p>No hay publicaciones.</p>';
      return;
    }

    const users = getUsers(); // se obtienen todos los usuarios para mostrar nombre y foto

    // Recorre todas las publicaciones y las agrega al HTML
    postsArray.forEach(post => {
      const author = users.find(u => u.id === post.authorId); // busca el autor del post
      const postDiv = document.createElement('div');
      postDiv.className = 'post';

      // estructura visual del post
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

      postsContainer.appendChild(postDiv); // lo muestra en la página
    });
  }

  // Filtra las publicaciones según el texto que el usuario escriba en el buscador
  function renderFiltered() {
    if (!searchInput) return;
    
    const posts = getPosts() || [];
    const q = (searchInput?.value || '').trim().toLowerCase(); // texto buscado
    let filtered = posts;

    // Si hay texto, se filtran los posts que lo contengan (en el título o nombre del autor)
    if (q.length > 0) {
      filtered = posts.filter(p => {
        const author = getUsers().find(u => u.id === p.authorId);
        return p.title.toLowerCase().includes(q) ||
               (author?.username && author.username.toLowerCase().includes(q));
      });
    }

    // Se muestran solo los resultados filtrados
    renderPosts(filtered);
  }

  // Cuando se escribe en el buscador, se actualizan los resultados en tiempo real
  searchInput?.addEventListener('input', renderFiltered);

  // Permite crear una nueva publicación
  newPostBtn?.addEventListener('click', () => {
    // Si no hay usuario logueado, no puede publicar
    if (!currentUser?.id) return alert('Debes iniciar sesión para publicar.');
    
    const title = newPostContent.value.trim();
    if (!title) {
      return alert('No puedes publicar vacío.');
    }

    const posts = getPosts() || [];
    const newPost = {
      id: uid(), // se genera un ID único
      title,
      authorId: currentUser.id,
      createdAt: Date.now(), // guarda la fecha actual
      img: imageDataUrl, // guarda la imagen subida
      comments: [] // inicia sin comentarios
    };

    posts.unshift(newPost); // agrega el nuevo post al inicio
    savePosts(posts); // lo guarda en localStorage

    // Limpia los campos después de publicar
    newPostContent.value = '';
    imageUpload.value = '';
    imageDataUrl = null;

    renderFiltered(); // actualiza la lista mostrada
  });

  // Si se cambian los datos en otra pestaña del navegador, se actualiza la vista automáticamente
  window.addEventListener('storage', e => {
    if (e.key === 'posts' || e.key === 'users') {
      renderFiltered();
    }
  });

  // Botón para recargar los datos de prueba
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
      localStorage.clear(); // borra todos los datos actuales
      seedDemo(); // vuelve a generar los datos de ejemplo
      renderFiltered(); // actualiza la pantalla
      alert("Datos de prueba recargados correctamente.");
    }
  });

  // Cuando se carga la página, se limpia el buscador y se muestran todas las publicaciones
  if (searchInput) {
    searchInput.value = '';
    renderFiltered();
  }

}); // Fin del evento DOMContentLoaded
