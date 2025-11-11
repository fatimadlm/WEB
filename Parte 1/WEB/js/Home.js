import { getPosts, savePosts, getCurrentUser, getUsers, seedDemo, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
  }

  searchInput.value = '';
  renderFiltered();
});

const postsContainer = document.getElementById('postsContainer');
const searchInput = document.getElementById('searchInput');
const newPostBtn = document.getElementById('newPostBtn');
const newPostContent = document.getElementById('newPostContent');
const imageUpload = document.getElementById('imageUpload'); // input type="file"
const currentUser = getCurrentUser();

let imageDataUrl = null; // Guardará la imagen subida como data URL para mostrar

// Manejar carga de imagen
imageUpload?.addEventListener('change', (e) => {
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

function renderFiltered() {
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

searchInput?.addEventListener('input', renderFiltered);

newPostBtn?.addEventListener('click', () => {
  const title = newPostContent.value.trim();
  if (!title) {
    return alert('No puedes publicar vacío.');
  }

  const posts = getPosts() || [];
  const newPost = {
    id: uid(),
    title,
    authorId: currentUser.id,
    createdAt: Date.now(),
    img: imageDataUrl, // Guardar data URL de la imagen subida o null
    comments: []
  };

  posts.unshift(newPost);
  savePosts(posts);

  // Reset input form
  newPostContent.value = '';
  imageUpload.value = '';
  imageDataUrl = null;

  renderFiltered();
});

window.addEventListener('storage', e => {
  if (e.key === 'posts' || e.key === 'users') {
    renderFiltered();
  }
});
// ---------- Recargar datos de prueba ----------
const refreshBtn = document.getElementById('refreshDemoBtn');
refreshBtn?.addEventListener('click', () => {
  if (confirm("¿Quieres recargar los datos de prueba? Se borrarán tus publicaciones actuales.")) {
    localStorage.clear(); // Limpia todo
    seedDemo();           // Vuelve a crear usuarios y posts demo
    renderFiltered();     // Refresca el feed
    alert("Datos de prueba recargados correctamente.");
  }
});

