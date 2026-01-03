import { 
  getMessages, saveMessages, getCurrentUser, uid, 
  getUsers, getPosts, savePosts, seedDemo 
} from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

  // Cargar demo si no hay datos
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo();
    console.log('Datos demo cargados');
  }

  // Usuario actual
  let currentUser = getCurrentUser();
  if (!currentUser || !currentUser.id) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'IniciarSesion.html';
    throw new Error('Usuario no autenticado');
  }

  // Referencias al DOM
  const chatList = document.querySelector('.chat-list');
  const chatPlaceholder = document.getElementById('chatPlaceholder');
  const chatActiveWindow = document.getElementById('chatActiveWindow');
  const chatBox = document.getElementById('chatBox');
  const chatUserName = document.getElementById('chatUserName');
  const chatInput = document.getElementById('chatInput');
  const sendChatBtn = document.getElementById('sendChatBtn');
  const refreshBtn = document.getElementById('refreshDemoBtn');
  const userSearch = document.getElementById('userSearch');
  const userSearchBtn = document.getElementById('userSearchBtn');

  // Modal de publicar
  const postModal = document.getElementById('postModal');
  const openModalBtn = document.getElementById('openModalBtn');
  const closeModalBtn = postModal?.querySelector('.modal-close');
  const modalNewPostContent = document.getElementById('modalNewPostContent');
  const modalImageUpload = document.getElementById('modalImageUpload');
  const modalAddImgBtn = document.getElementById('modalAddImgBtn');
  const modalImagePreview = document.getElementById('modalImagePreview');
  const modalImagePreviewContainer = document.getElementById('modalImagePreviewContainer');
  const modalRemoveImageBtn = document.getElementById('modalRemoveImageBtn');
  const modalNewPostBtn = document.getElementById('modalNewPostBtn');

  let modalImageDataUrl = null;
  let currentChatPartnerId = null;

  // Función para cargar los últimos mensajes en la lista de chats
  function loadChatPreviews() {
    const allMessages = getMessages();
    const lastMessageMap = new Map();

    allMessages.forEach(msg => {
      let partnerId = null;
      if (msg.senderId === currentUser.id) partnerId = msg.receiverId;
      else if (msg.receiverId === currentUser.id) partnerId = msg.senderId;
      else return;

      const existing = lastMessageMap.get(partnerId);
      if (!existing || msg.timestamp > existing.timestamp) lastMessageMap.set(partnerId, msg);
    });

    // Actualiza los chats visibles con los últimos mensajes
    document.querySelectorAll('.chat-list-item').forEach(item => {
      const partnerId = item.dataset.userId;
      const p = item.querySelector('.chat-last-message');
      if (!p) return;
      const lastMessage = lastMessageMap.get(partnerId);
      p.textContent = lastMessage
        ? (lastMessage.senderId === currentUser.id ? "Tú: " : "") + lastMessage.content
        : "No hay mensajes todavía.";
    });
  }

  // Función para cargar mensajes de una conversación
  function loadChatMessages(partnerId) {
    chatBox.innerHTML = '';
    const allMessages = getMessages();
    const conversation = allMessages
      .filter(msg => (msg.senderId === currentUser.id && msg.receiverId === partnerId) ||
                     (msg.senderId === partnerId && msg.receiverId === currentUser.id))
      .sort((a, b) => a.timestamp - b.timestamp);

    if (!conversation.length) {
      chatBox.innerHTML = '<p class="info">No hay mensajes. Di hola!</p>';
      return;
    }

    conversation.forEach(msg => {
      const type = msg.senderId === currentUser.id ? 'sent' : 'received';
      const bubble = document.createElement('div');
      bubble.classList.add('chat-bubble', type);
      const timeString = new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      bubble.innerHTML = `<p>${msg.content.replace(/\n/g, '<br>')}</p><span>${timeString}</span>`;
      chatBox.appendChild(bubble);
    });

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Función para enviar un mensaje
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text || !currentChatPartnerId) return;

    const now = Date.now();
    const newMsg = {
      id: uid('m_'),
      senderId: currentUser.id,
      receiverId: currentChatPartnerId,
      content: text,
      timestamp: now
    };

    const allMessages = getMessages();
    allMessages.push(newMsg);
    saveMessages(allMessages);

    const bubble = document.createElement('div');
    bubble.classList.add('chat-bubble', 'sent');
    const timeString = new Date(now).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    bubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p><span>${timeString}</span>`;
    chatBox.appendChild(bubble);
    chatInput.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;
    chatInput.focus();

    loadChatPreviews();
  }

  // Función para mostrar resultados de búsqueda
  function renderUserSearchResults(query) {
    // Si el campo está vacío, restauramos las conversaciones originales
    if (!query.trim()) {
      chatList.innerHTML = '';
      getUsers()
        .filter(u => u.id !== currentUser.id && u.role !== 'admin')
        .forEach(u => {
          const li = document.createElement('li');
          li.innerHTML = `
            <div class="chat-list-item" 
                 data-user-id="${u.id}" 
                 data-user-name="${u.username}" 
                 data-avatar="${u.avatar || '../Imagenes/avatarDefault.png'}"
                 role="button" tabindex="0">
              <img src="${u.avatar || '../Imagenes/avatarDefault.png'}" alt="Usuario" class="chat-avatar">
              <div class="chat-info">
                <h3>@${u.username}</h3>
                <p class="chat-last-message"></p>
              </div>
            </div>
          `;
          chatList.appendChild(li);
        });
      loadChatPreviews(); // Restauramos últimos mensajes
      return;
    }

    // Si hay búsqueda, filtramos y mostramos solo usuarios coincidentes
    const users = getUsers().filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase()) &&
      u.id !== currentUser.id
    );

    chatList.innerHTML = '';
    if (!users.length) {
      chatList.innerHTML = '<li>No se encontraron usuarios.</li>';
      return;
    }

    users.forEach(u => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div class="chat-list-item" 
             data-user-id="${u.id}" 
             data-user-name="${u.username}" 
             data-avatar="${u.avatar || '../Imagenes/avatarDefault.png'}"
             role="button" tabindex="0">
          <img src="${u.avatar || '../Imagenes/avatarDefault.png'}" alt="Usuario" class="chat-avatar">
          <div class="chat-info">
            <h3>@${u.username}</h3>
            <p class="chat-last-message"></p>
          </div>
        </div>
      `;
      chatList.appendChild(li);
    });
  }

  // Evento click sobre un chat
  chatList.addEventListener('click', e => {
    const chatItem = e.target.closest('.chat-list-item');
    if (!chatItem) return;

    document.querySelectorAll('.chat-list-item').forEach(i => i.classList.remove('selected'));
    chatItem.classList.add('selected');

    const partnerId = chatItem.dataset.userId;
    const partnerName = chatItem.dataset.userName;
    currentChatPartnerId = partnerId;

    chatPlaceholder.style.display = 'none';
    chatActiveWindow.style.display = 'flex';

    const profilePage = (partnerId === currentUser.id) ? "MiPerfil.html" : `Perfiles/Perfil${partnerName}.html`;
    chatUserName.innerHTML = `Chat con <a href="${profilePage}">@${partnerName}</a>`;

    loadChatMessages(partnerId);
  });

  // Enviar mensaje
  sendChatBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  });

  // Buscador de usuarios
  userSearch?.addEventListener('input', () => renderUserSearchResults(userSearch.value));
  userSearchBtn?.addEventListener('click', () => renderUserSearchResults(userSearch.value));

  // Botón recargar demo
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba?")) {
      localStorage.clear();
      seedDemo();
      loadChatPreviews();
      chatPlaceholder.style.display = 'flex';
      chatActiveWindow.style.display = 'none';
      alert("Simulación cargada");
    }
  });

  // Inicializamos la lista de chats
  loadChatPreviews();

  // Modal publicar
  openModalBtn?.addEventListener('click', () => postModal.style.display = 'flex');
  closeModalBtn?.addEventListener('click', () => postModal.style.display = 'none');
  postModal?.addEventListener('click', e => { if(e.target === postModal) postModal.style.display = 'none'; });

  modalAddImgBtn?.addEventListener('click', () => modalImageUpload.click());
  modalImageUpload?.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) {
      modalImageDataUrl = null;
      modalImagePreviewContainer.style.display = 'none';
      return;
    }
    const reader = new FileReader();
    reader.onload = event => {
      modalImageDataUrl = event.target.result;
      modalImagePreview.src = modalImageDataUrl;
      modalImagePreview.style.display = 'block';
      modalImagePreviewContainer.style.display = 'flex';
      modalRemoveImageBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  });

  modalRemoveImageBtn?.addEventListener('click', () => {
    modalImageDataUrl = null;
    modalImageUpload.value = '';
    modalImagePreview.src = '#';
    modalImagePreview.style.display = 'none';
    modalRemoveImageBtn.style.display = 'none';
    modalImagePreviewContainer.style.display = 'none';
  });

  modalNewPostBtn?.addEventListener('click', () => {
    const title = modalNewPostContent.value.trim();
    if (!title && !modalImageDataUrl) return alert('No puedes publicar vacío.');

    const posts = getPosts() || [];
    posts.unshift({
      id: uid(),
      title,
      authorId: currentUser.id,
      createdAt: Date.now(),
      img: modalImageDataUrl,
      likes: 0,
      liked: false,
      comments: []
    });
    savePosts(posts);

    modalNewPostContent.value = '';
    modalImageDataUrl = null;
    modalImageUpload.value = '';
    modalImagePreview.src = '#';
    modalImagePreview.style.display = 'none';
    modalRemoveImageBtn.style.display = 'none';
    modalImagePreviewContainer.style.display = 'none';
    postModal.style.display = 'none';

    alert('Publicación creada con éxito');
  });

});
// web/js/Mensajes.js

let partnerIdActual = null;
// Obtenemos el contexto de la aplicación desde un atributo del body o un input oculto
const contextPath = document.body.dataset.context; 

function cargarChat(id, nombre) {
    partnerIdActual = id;
    
    // UI Updates
    document.getElementById('chatPlaceholder').style.display = 'none';
    const activeWindow = document.getElementById('chatActiveWindow');
    if (activeWindow) activeWindow.style.display = 'flex';
    
    const userNameHeader = document.getElementById('chatUserName');
    if (userNameHeader) userNameHeader.innerText = "Chat con @" + nombre;
    
    console.log("Cargando mensajes con: " + id);
    refrescarMensajes();
}

function refrescarMensajes() {
    if (!partnerIdActual) return;
    
    fetch(`${contextPath}/MensajesServlet?accion=listar&conWho=${partnerIdActual}`)
        .then(response => {
            if (!response.ok) throw new Error('Error en la red');
            return response.text();
        })
        .then(html => {
            const box = document.getElementById('chatBox');
            if (box) {
                box.innerHTML = html;
                box.scrollTop = box.scrollHeight;
            }
        })
        .catch(err => console.error('Error en refresco:', err));
}

function enviarMensaje() {
    const input = document.getElementById('chatInput');
    const texto = input.value.trim();
    if (!texto || !partnerIdActual) return;

    fetch(`${contextPath}/MensajesServlet`, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `receptorId=${partnerIdActual}&contenido=${encodeURIComponent(texto)}`
    })
    .then(response => {
        if (response.ok) {
            input.value = '';
            refrescarMensajes();
        }
    })
    .catch(err => console.error('Error al enviar:', err));
}

// Configuración de eventos al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Escuchar tecla Enter en el input
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') enviarMensaje();
        });
    }

    // Intervalo de refresco automático cada 5 segundos
    setInterval(refrescarMensajes, 5000);
});
