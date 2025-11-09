// === Comprobación de administrador ===
// Función inmediata que bloquea el acceso si el usuario no es admin
(function guard() {
  const current = safeParse(localStorage.getItem('currentUser')) || {}; // Obtener usuario actual del localStorage
  if (current.role !== 'admin') { // Si no es admin
    alert('Acceso restringido. Debes ser administrador.');
    window.location.href = 'IniciarSesion.html'; // Redirigir a login
  }
})();

// === Atajo para querySelector ===
const $ = s => document.querySelector(s);

// === Estado inicial ===
let users = safeParse(localStorage.getItem('users')) || []; // Lista de usuarios
let posts = safeParse(localStorage.getItem('posts')) || []; // Lista de publicaciones

// === Elementos del DOM ===
const usersTbody = $('#usersTable tbody');       // Tabla de usuarios
const postsTbody = $('#postsTable tbody');       // Tabla de posts
const commentsTbody = $('#commentsTable tbody'); // Tabla de comentarios
const searchInput = $('#adminSearch');           // Input de búsqueda global

// === Inicialización robusta ===
// Si no hay datos válidos o necesitan migración, limpiar y cargar demo
if (!Array.isArray(users) || !Array.isArray(posts) || !users.length || !posts.length || needsMigration(users, posts)) {
  localStorage.clear();
  seedDemo(); // Cargar datos de ejemplo
  users = safeParse(localStorage.getItem('users')) || [];
  posts = safeParse(localStorage.getItem('posts')) || [];
}

// === Buscador global ===
searchInput?.addEventListener('input', () => renderAll(searchInput.value.trim().toLowerCase()));

// === Render inicial ===
// Limpiamos y cargamos demo nuevamente
localStorage.removeItem('users');
localStorage.removeItem('posts');
localStorage.removeItem('currentUser');
seedDemo();
renderAll(''); // Renderiza todas las tablas

// === Función principal de render ===
function renderAll(q = '') {
  users = safeParse(localStorage.getItem('users')) || [];
  posts = safeParse(localStorage.getItem('posts')) || [];
  renderUsers(q);    // Renderiza usuarios filtrados
  renderPosts(q);    // Renderiza publicaciones filtradas
  renderComments(q); // Renderiza comentarios filtrados
}

// === Render de usuarios ===
function renderUsers(q) {
  usersTbody.innerHTML = ''; // Limpiar tabla
  users
    .filter(u => matchAny([u.username, u.role, u.active ? 'activo' : 'bloqueado'], q)) // Filtrar por búsqueda
    .forEach(u => {
      const avatarURL = u.avatar || '../Imagenes/avatarDefault.png'; // Avatar por defecto
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>
          <img src="${avatarURL}" alt="@${escapeTxt(u.username)}" style="width:30px; height:30px; border-radius:50%; margin-right:8px; vertical-align:middle;">
          @${escapeTxt(u.username)}
        </td>
        <td><span class="badge neutral">${u.role || 'user'}</span></td>
        <td><span class="badge ${u.active === false ? 'warn' : 'success'}">${u.active === false ? 'bloqueado' : 'activo'}</span></td>
        <td class="actions">
          <button class="btn outline" data-act="toggle" data-id="${u.id}">${u.active === false ? 'Desbloquear' : 'Bloquear'}</button>
          <button class="btn danger" data-act="deleteUser" data-id="${u.id}">Eliminar</button>
        </td>
      `;
      usersTbody.appendChild(tr); // Agregar fila a la tabla
    });
  
  // Asignar eventos a los botones
  usersTbody.querySelectorAll('button').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'toggle') toggleUser(id);       // Bloquear/desbloquear usuario
      if (act === 'deleteUser') deleteUser(id);   // Eliminar usuario
    });
  });
}

// === Render de publicaciones ===
function renderPosts(q) {
  postsTbody.innerHTML = ''; // Limpiar tabla
  posts
    .filter(p => matchAny([p.title, userName(p.authorId), fmtDate(p.createdAt)], q)) // Filtrar por búsqueda
    .forEach(p => {
      const userAvatar = userAvatarURL(p.authorId); // Avatar del autor
      const thumb = p.img ? `<img src="${p.img}" alt="Foto publicación" style="width:40px; height:40px; object-fit:cover; border-radius:5px; margin-right:8px; vertical-align:middle;">` : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${thumb} ${escapeTxt(p.title || '(Sin título)')}</td>
        <td>
          <img src="${userAvatar}" alt="@${escapeTxt(userName(p.authorId))}" style="width:30px; height:30px; border-radius:50%; margin-right:5px; vertical-align:middle;">
          @${escapeTxt(userName(p.authorId))}
        </td>
        <td>${fmtDate(p.createdAt)}</td>
        <td>${(p.comments?.length || 0)}</td>
        <td class="actions">
          <button class="btn outline" data-act="viewComments" data-id="${p.id}">Ver comentarios</button>
          <button class="btn danger" data-act="deletePost" data-id="${p.id}">Borrar publicación</button>
        </td>
      `;
      postsTbody.appendChild(tr); // Agregar fila
    });

  // Eventos botones
  postsTbody.querySelectorAll('button').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'viewComments') scrollToCommentsOf(id); // Ver comentarios
      if (act === 'deletePost') deletePost(id);           // Eliminar post
    });
  });
}

// === Render de comentarios ===
function renderComments(q) {
  commentsTbody.innerHTML = ''; // Limpiar tabla
  posts.forEach(p => {
    (p.comments || [])
      .filter(c => matchAny([p.title, userName(c.authorId), c.content, fmtDate(c.createdAt)], q)) // Filtrar
      .forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeTxt(p.title || '(Sin título)')}</td>
          <td>@${escapeTxt(userName(c.authorId))}</td>
          <td>${escapeTxt(c.content)}</td>
          <td>${fmtDate(c.createdAt)}</td>
          <td class="actions">
            <button class="btn danger" data-act="deleteComment" data-pid="${p.id}" data-cid="${c.id}">Borrar</button>
          </td>
        `;
        commentsTbody.appendChild(tr);
      });
  });

  // Asignar eventos de borrado
  commentsTbody.querySelectorAll('[data-act="deleteComment"]').forEach(btn => {
    const pid = btn.getAttribute('data-pid');
    const cid = btn.getAttribute('data-cid');
    btn.addEventListener('click', () => deleteComment(pid, cid));
  });
}

// === Funciones de acción ===
function toggleUser(id) {
  const i = users.findIndex(u => u.id === id);
  if (i < 0) return;
  users[i].active = !users[i].active; // Cambia estado activo/bloqueado
  save('users', users);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deleteUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  if (!confirm(`¿Eliminar al usuario @${u.username}? También se eliminarán sus publicaciones y comentarios.`)) return;

  // Eliminar posts y comentarios del usuario
  posts = posts
    .filter(p => p.authorId !== id)
    .map(p => ({ ...p, comments: (p.comments || []).filter(c => c.authorId !== id) }));
  
  users = users.filter(x => x.id !== id);
  save('users', users);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deletePost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`¿Eliminar la publicación "${p.title || '(Sin título)'}" y todos sus comentarios?`)) return;
  posts = posts.filter(x => x.id !== id);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deleteComment(postId, commentId) {
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  const c = (p.comments || []).find(x => x.id === commentId);
  if (!c) return;
  if (!confirm(`¿Eliminar el comentario de @${userName(c.authorId)}?`)) return;
  p.comments = (p.comments || []).filter(x => x.id !== commentId);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

// Scroll a los comentarios de un post
function scrollToCommentsOf(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  searchInput.value = post.title || '';
  renderAll(searchInput.value.toLowerCase());
  document.querySelector('#comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// === Funciones utilitarias ===
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
function safeParse(s) { try { return JSON.parse(s); } catch (e) { return null; } }
function userName(id) { return users.find(u => u.id === id)?.username || 'desconocido'; }
function userAvatarURL(id) { return users.find(u => u.id === id)?.avatar || '../Imagenes/avatarDefault.png'; }
function fmtDate(ts) { if (!ts) return '-'; try { return new Date(ts).toLocaleString(); } catch (_) { return '-'; } }
function matchAny(parts, q) { if (!q) return true; return parts.filter(Boolean).some(v => String(v).toLowerCase().includes(q)); }
function escapeTxt(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function uid(p = 'id') { return p + Math.random().toString(36).slice(2, 9) + Date.now().toString(36); }
function needsMigration(u, p) { return u.some(x => !x.id) || (Array.isArray(p) && p.some(post => !post.id)); }

// Datos simulados
function seedDemo() {
  users = [
    { id: 'u_admin', username: 'admin', password: 'admin', role: 'admin', active: true, avatar: '../Imagenes/AvatarAdmin.jpg' },
    { id: 'u1', username: 'usuario1', password: '1234', role: 'user', active: true, avatar: '../Imagenes/AvatarPorDefecto.webp' },
    { id: 'u2', username: 'usuario2', password: '1234', role: 'user', active: true, avatar: '../Imagenes/AvatarPorDefecto.webp' },
    { id: 'u3', username: 'usuario3', password: '1234', role: 'user', active: true, avatar: '../Imagenes/AvatarPorDefecto.webp' },
    { id: 'u4', username: 'Juan', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar4.jpeg' },
    { id: 'u5', username: 'Ana', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar1.jpg' },
    { id: 'u6', username: 'Caro', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar6.jpeg' },
    { id: 'u7', username: 'Mario', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar3.jpg' },
    { id: 'u8', username: 'Laura', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar5.jpeg' }
  ];
  save('users', users);
  save('currentUser', users[0]);
  posts = [
    {
      id: 'p1',
      title: 'Hoy preparé una lasaña casera con salsa bechamel 🤤',
      authorId: 'u4',
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      img: '../Imagenes/Lasanna.png',
      comments: [
        { id: 'c1', authorId: 'u5', content: '¡Se ve deliciosa!', createdAt: Date.now() - 1.9 * 60 * 60 * 1000 }
      ]
    },
    {
      id: 'p2',
      title: 'Pan casero con masa madre 😍 recién salido del horno',
      authorId: 'u5',
      createdAt: Date.now() - 5 * 60 * 60 * 1000,
      img: '../Imagenes/Pan.jpg',
      comments: []
    },
    {
      id: 'p3',
      title: 'Tacos al pastor 🌮, ¡los mejores de la ciudad!',
      authorId: 'u7',
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      img: '../Imagenes/Tacos.jpg',
      comments: [
        { id: 'c2', authorId: 'u8', content: '¡Quiero probarlos!', createdAt: Date.now() - 0.9 * 60 * 60 * 1000 }
      ]
    },
    {
      id: 'p4',
      title: 'Brownies de chocolate 🍫 con nueces, recién horneados',
      authorId: 'u8',
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      img: '../Imagenes/Brownie.jpg',
      comments: []
    },
    {
      id: 'p5',
      title: 'Ensalada fresca de quinoa y aguacate 🥗, ideal para el verano',
      authorId: 'u6',
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      img: '../Imagenes/Ensalada.jpg',
      comments: []
    },
    {
      id: 'p6',
      title: 'Mi nueva receta: pasta carbonara cremosa',
      authorId: 'u1',
      createdAt: Date.now() - 24 * 60 * 60 * 1000,
      img: '../Imagenes/Carbonara.jpg',
      comments: []
    }
  ];
  save('posts', posts);
}
