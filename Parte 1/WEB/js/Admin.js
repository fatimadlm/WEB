/* === Admin.js ===
   Panel cliente (Parte 1). Funciona con localStorage.
   Funciones:
   - Listar / buscar usuarios, publicaciones y comentarios
   - Bloquear / desbloquear usuario
   - Eliminar usuario (y su contenido)
   - Eliminar publicación
   - Eliminar comentario
*/

// ---------- Guardia: solo admin ----------
(function guard(){
  const current = safeParse(localStorage.getItem('currentUser')) || {};
  if (current.role !== 'admin') {
    alert('Acceso restringido. Debes ser administrador.');
    window.location.href = 'IniciarSesion.html';
  }
})();

// ---------- Shortcuts ----------
const $ = s => document.querySelector(s);

// ---------- Estado ----------
let users = safeParse(localStorage.getItem('users')) || [];
let posts = safeParse(localStorage.getItem('posts')) || [];

// Semilla de demo si no hay datos 
if (!users.length || !posts.length) seedDemo();

// ---------- Elementos ----------
const usersTbody = $('#usersTable tbody');
const postsTbody = $('#postsTable tbody');
const commentsTbody = $('#commentsTable tbody');
const searchInput = $('#adminSearch');

// Botones del menú principal: scroll a sección
document.querySelectorAll('.menu-btn').forEach(btn=>{
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) document.querySelector(target)?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

// Buscador global
searchInput?.addEventListener('input', () => renderAll(searchInput.value.trim().toLowerCase()));

// Render inicial
renderAll();

// ---------- Render ----------
function renderAll(q=''){
  // refrescamos de storage por si hubo cambios
  users = safeParse(localStorage.getItem('users')) || [];
  posts = safeParse(localStorage.getItem('posts')) || [];

  renderUsers(q);
  renderPosts(q);
  renderComments(q);
}

function renderUsers(q){
  usersTbody.innerHTML = '';
  users
    .filter(u => matchAny([u.username, u.role, u.active ? 'activo':'bloqueado'], q))
    .forEach(u => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>@${escapeTxt(u.username)}</td>
        <td><span class="badge neutral">${u.role || 'user'}</span></td>
        <td><span class="badge ${u.active===false ? 'warn' : 'success'}">${u.active===false ? 'bloqueado' : 'activo'}</span></td>
        <td class="actions">
          <button class="btn outline" data-act="toggle" data-id="${u.id || u.username}">
            ${u.active===false ? 'Desbloquear':'Bloquear'}
          </button>
          <button class="btn danger" data-act="deleteUser" data-id="${u.id || u.username}">
            Eliminar
          </button>
        </td>
      `;
      usersTbody.appendChild(tr);
    });

  usersTbody.querySelectorAll('button').forEach(btn=>{
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'toggle') toggleUser(id);
      if (act === 'deleteUser') deleteUser(id);
    });
  });
}

function renderPosts(q){
  postsTbody.innerHTML = '';
  posts
    .filter(p => matchAny([p.title, userName(p.authorId), fmtDate(p.createdAt)], q))
    .forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeTxt(p.title || '(Sin título)')}</td>
        <td>@${escapeTxt(userName(p.authorId))}</td>
        <td>${fmtDate(p.createdAt)}</td>
        <td>${(p.comments?.length || 0)}</td>
        <td class="actions">
          <button class="btn outline" data-act="viewComments" data-id="${p.id}">Ver comentarios</button>
          <button class="btn danger" data-act="deletePost" data-id="${p.id}">Borrar publicación</button>
        </td>
      `;
      postsTbody.appendChild(tr);
    });

  postsTbody.querySelectorAll('button').forEach(btn=>{
    const id = btn.getAttribute('data-id');
    const act = btn.getAttribute('data-act');
    btn.addEventListener('click', () => {
      if (act === 'viewComments') scrollToCommentsOf(id);
      if (act === 'deletePost') deletePost(id);
    });
  });
}

function renderComments(q){
  commentsTbody.innerHTML = '';
  posts.forEach(p=>{
    (p.comments || [])
      .filter(c => matchAny([p.title, userName(c.authorId), c.content, fmtDate(c.createdAt)], q))
      .forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${escapeTxt(p.title || '(Sin título)')}</td>
          <td>@${escapeTxt(userName(c.authorId))}</td>
          <td>${escapeTxt(c.content)}</td>
          <td>${fmtDate(c.createdAt)}</td>
          <td class="actions">
            <button class="btn danger" data-act="deleteComment" data-pid="${p.id}" data-cid="${c.id}">
              Borrar
            </button>
          </td>
        `;
        commentsTbody.appendChild(tr);
      });
  });

  commentsTbody.querySelectorAll('[data-act="deleteComment"]').forEach(btn=>{
    const pid = btn.getAttribute('data-pid');
    const cid = btn.getAttribute('data-cid');
    btn.addEventListener('click', () => deleteComment(pid, cid));
  });
}

// ---------- Acciones ----------
function toggleUser(id){
  const i = users.findIndex(u => (u.id || u.username) === id);
  if (i < 0) return;
  users[i].active = users[i].active === false ? true : false;
  save('users', users);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deleteUser(id){
  const u = users.find(x => (x.id || x.username) === id);
  if (!u) return;
  if (!confirm(`¿Eliminar al usuario @${u.username}? También se eliminarán sus publicaciones y comentarios.`)) return;

  // Eliminar posts y comentarios del usuario
  posts = posts
    .filter(p => p.authorId !== (u.id || u.username))
    .map(p => ({ ...p, comments: (p.comments || []).filter(c => c.authorId !== (u.id || u.username)) }));

  // Eliminar usuario
  users = users.filter(x => (x.id || x.username) !== id);

  save('users', users);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deletePost(id){
  const p = posts.find(x => x.id === id);
  if (!p) return;
  if (!confirm(`¿Eliminar la publicación "${p.title}" y todos sus comentarios?`)) return;
  posts = posts.filter(x => x.id !== id);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

function deleteComment(postId, commentId){
  const p = posts.find(x => x.id === postId);
  if (!p) return;
  const c = (p.comments || []).find(x => x.id === commentId);
  if (!c) return;
  if (!confirm(`¿Eliminar el comentario de @${userName(c.authorId)}?`)) return;
  p.comments = (p.comments || []).filter(x => x.id !== commentId);
  save('posts', posts);
  renderAll(searchInput.value.trim().toLowerCase());
}

function scrollToCommentsOf(postId){
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  searchInput.value = post.title || '';
  renderAll(searchInput.value.toLowerCase());
  document.querySelector('#comments')?.scrollIntoView({behavior:'smooth', block:'start'});
}

// ---------- Utilidades ----------
function save(key, val){ localStorage.setItem(key, JSON.stringify(val)); }
function safeParse(s){ try { return JSON.parse(s); } catch(e){ return null; } }
function userName(id){ return users.find(u => (u.id || u.username) === id)?.username || 'desconocido'; }
function fmtDate(ts){ if(!ts) return '-'; try{ return new Date(ts).toLocaleString(); }catch(_){ return '-'; } }
function matchAny(parts, q){ if(!q) return true; return parts.filter(Boolean).some(v => String(v).toLowerCase().includes(q)); }
function escapeTxt(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }
function uid(p='id'){ return p + Math.random().toString(36).slice(2,9) + Date.now().toString(36); }

// ---------- Datos de demo (opcional) ----------
function seedDemo(){
  if (!users.length){
    users = [
      { id:'u_admin', username:'admin', password:'admin', role:'admin', active:true },
      { id:'u2', username:'carlos', password:'1234', role:'user', active:true },
      { id:'u3', username:'lucia',  password:'1234', role:'user', active:true }
    ];
    save('users', users);
    save('currentUser', users[0]); 
  }

  if (!posts.length){
    posts = [
      { id:'p1', title:'Carbonara auténtica', authorId:'u2', createdAt: Date.now()-86400000,
        comments:[
          { id:'c1', authorId:'u3', content:'¡Me salió genial!', createdAt: Date.now()-86000000 },
          { id:'c2', authorId:'u2', content:'Consejo: fuego suave', createdAt: Date.now()-85000000 }
        ]
      },
      { id:'p2', title:'Brownies perfectos', authorId:'u3', createdAt: Date.now()-46000000,
        comments:[
          { id:'c3', authorId:'u2', content:'Textura brutal 😍', createdAt: Date.now()-45000000 }
        ]
      }
    ];
    save('posts', posts);
  }
}
