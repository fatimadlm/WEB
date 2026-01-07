import { getUsers, saveUsers, getPosts, savePosts, getCurrentUser, seedDemo, safeParse } from './BBDD.js';

// Verifica que el usuario actual sea administrador (Conexión con JSP)
(function guard() {
  // Leemos el rol desde la variable global 'window.currentUserRole' 
  // que definiremos en el JSP
  const role = window.currentUserRole;

  if (role !== 'admin') {
    alert('Acceso restringido. Debes ser administrador.');
    // Redirigimos al JSP de login en lugar del HTML antiguo
    window.location.href = 'login.jsp'; 
  }
})();

// Atajo para querySelector
const $ = s => document.querySelector(s);

// Cargar usuarios y publicaciones desde localStorage
let users = getUsers();
let posts = getPosts();

// Obtener elementos del DOM
const usersTbody = $('#usersTable tbody');
const postsTbody = $('#postsTable tbody');
const commentsTbody = $('#commentsTable tbody');
const searchInput = $('#adminSearch');

// Comprobacion inicial de datos
if (!Array.isArray(users) || !Array.isArray(posts) || !users.length || !posts.length || needsMigration(users, posts)) {
  localStorage.clear();
  seedDemo();
  users = getUsers();
  posts = getPosts();
}

// Buscar mientras se escribe
searchInput?.addEventListener('input', () => renderAll(searchInput.value.trim().toLowerCase()));

// Render inicial de tablas
localStorage.removeItem('users');
localStorage.removeItem('posts');
localStorage.removeItem('currentUser');
seedDemo();
renderAll('');

// Funcion principal para renderizar todo
function renderAll(q = '') {
  users = getUsers();
  posts = getPosts();
  renderUsers(q);
  renderPosts(q);
  renderComments(q);
}

// Mostrar usuarios en la tabla
function renderUsers(q) {
  usersTbody.innerHTML = '';
  users
    .filter(u => matchAny([u.username, u.role, u.active ? 'activo' : 'bloqueado'], q))
    .forEach(u => {
      const avatarURL = u.avatar || '../Imagenes/avatarDefault.png';
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
      usersTbody.appendChild(tr);
    });

  // Agregar eventos a los botones de cada usuario
  usersTbody.querySelectorAll('button').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'toggle') toggleUser(id);
      if (act === 'deleteUser') deleteUser(id);
    });
  });
}

// Mostrar publicaciones en la tabla
function renderPosts(q) {
  postsTbody.innerHTML = '';
  posts
    .filter(p => matchAny([p.title, userName(p.authorId), fmtDate(p.createdAt)], q))
    .forEach(p => {
      const userAvatar = userAvatarURL(p.authorId);
      const thumb = p.img ? `<img src="${p.img}" alt="Foto publicacion" style="width:40px; height:40px; object-fit:cover; border-radius:5px; margin-right:8px; vertical-align:middle;">` : '';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${thumb} ${escapeTxt(p.title || '(Sin titulo)')}</td>
        <td>
          <img src="${userAvatar}" alt="@${escapeTxt(userName(p.authorId))}" style="width:30px; height:30px; border-radius:50%; margin-right:5px; vertical-align:middle;">
          @${escapeTxt(userName(p.authorId))}
        </td>
        <td>${fmtDate(p.createdAt)}</td>
        <td>${(p.comments?.length || 0)}</td>
        <td class="actions">
          <button class="btn outline" data-act="viewComments" data-id="${p.id}">Ver comentarios</button>
          <button class="btn danger" data-act="deletePost" data-id="${p.id}">Borrar publicacion</button>
        </td>
      `;
      postsTbody.appendChild(tr);
    });

  // Agregar eventos a los botones de cada publicacion
  postsTbody.querySelectorAll('button').forEach(btn => {
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'viewComments') scrollToCommentsOf(id);
      if (act === 'deletePost') deletePost(id);
    });
  });
}

// Mostrar comentarios en la tabla
function renderComments(q) {
  commentsTbody.innerHTML = '';
  posts.forEach(p => {
    (p.comments || [])
      .filter(c => matchAny([p.title, userName(c.authorId), c.content, fmtDate(c.createdAt)], q))
      .forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeTxt(p.title || '(Sin titulo)')}</td>
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

  // Agregar eventos a los botones de borrar comentario
  commentsTbody.querySelectorAll('[data-act="deleteComment"]').forEach(btn => {
    const pid = btn.getAttribute('data-pid');
    const cid = btn.getAttribute('data-cid');
    btn.addEventListener('click', () => deleteComment(pid, cid));
  });
}

// Cambia el estado de un usuario entre activo y bloqueado
function toggleUser(id) {
  const i = users.findIndex(u => u.id === id);
  if (i < 0) return;
  users[i].active = !users[i].active;
  saveUsers(users);
  renderAll(searchInput.value.trim().toLowerCase());
}

// Elimina un usuario y sus publicaciones
function deleteUser(id) {
  const u = users.find(x => x.id === id);
  if (!u) return;
  if (!confirm(`Eliminar al usuario @${u.username}? Tambien se eliminaran sus publicaciones y comentarios.`)) return;

  posts = posts
    .filter(p => p.authorId !== id)
    .map(p => ({ ...p, comments: (p.comments || []).filter(c => c.authorId !== id) }));

  users = users.filter(x => x.id !== id);
  saveUsers(users);
  savePosts(posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

// Elimina una publicacion y sus comentarios
function deletePost(id) {
  const p = posts.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`Eliminar la publicacion "${p.title || '(Sin titulo)'}" y todos sus comentarios?`)) return;
  posts = posts.filter(x => x.id !== id);
  savePosts(posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

// Elimina un comentario especifico de una publicacion
function deleteComment(postId, commentId) {
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  const c = (p.comments || []).find(x => x.id === commentId);
  if (!c) return;
  if (!confirm(`Eliminar el comentario de @${userName(c.authorId)}?`)) return;
  p.comments = (p.comments || []).filter(x => x.id !== commentId);
  savePosts(posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

// Muestra solo los comentarios de una publicacion y hace scroll hasta ellos
function scrollToCommentsOf(postId) {
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  searchInput.value = post.title || '';
  renderAll(searchInput.value.toLowerCase());
  document.querySelector('#comments')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Funciones
function userName(id) { return users.find(u => u.id === id)?.username || 'desconocido'; }
function userAvatarURL(id) { return users.find(u => u.id === id)?.avatar || '../Imagenes/avatarDefault.png'; }
function fmtDate(ts) { if (!ts) return '-'; try { return new Date(ts).toLocaleString(); } catch (_) { return '-'; } }
function matchAny(parts, q) { if (!q) return true; return parts.filter(Boolean).some(v => String(v).toLowerCase().includes(q)); }
function escapeTxt(s) { return String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
function needsMigration(u, p) { return u.some(x => !x.id) || (Array.isArray(p) && p.some(post => !post.id)); }
