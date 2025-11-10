document.addEventListener('DOMContentLoaded', () => {

    // AÑADIDO: Definimos el usuario actual (igual que en Home.js)
    const currentUser = "@TuUsuario"; 

    const chatList = document.querySelector('.chat-list');
    const chatPlaceholder = document.getElementById('chatPlaceholder');
    const chatActiveWindow = document.getElementById('chatActiveWindow');
    const chatBox = document.getElementById('chatBox');
    const chatUserName = document.getElementById('chatUserName');
    const chatInput = document.getElementById('chatInput');
    const sendChatBtn = document.getElementById('sendChatBtn');

    let currentChatUser = null; // Para saber qué chat está activo

    // 1. Lógica para cargar un chat
    chatList.addEventListener('click', async (e) => {
        const chatButton = e.target.closest('.chat-list-item');
        if (!chatButton) return; 

        document.querySelectorAll('.chat-list-item').forEach(btn => btn.classList.remove('selected'));
        chatButton.classList.add('selected');
        
        const userName = chatButton.dataset.user; // Ej: "Juan"
        currentChatUser = `@${userName}`; // Ej: "@Juan"
        const userAvatar = chatButton.dataset.avatar;

        chatPlaceholder.style.display = 'none';
        chatActiveWindow.style.display = 'flex';

        // --- LÍNEA MODIFICADA ---
        // Ahora comprueba si el chat es contigo mismo (MiPerfil.html) 
        // o con otro (Perfiles/PerfilJuan.html)
        const profilePage = currentChatUser === currentUser ? 
                              "MiPerfil.html" : 
                              `Perfiles/Perfil${userName}.html`;

        chatUserName.innerHTML = `Chat con <a href="${profilePage}">${currentChatUser}</a>`;
        // --- FIN DE MODIFICACIÓN ---

        // Cargar los mensajes
        await loadChatMessages(userName);
    });

    // 2. Función para cargar los mensajes desde los archivos snippet
    async function loadChatMessages(userName) {
        chatBox.innerHTML = '<p class="loading">Cargando mensajes...</p>';
        
        try {
            // El nombre del archivo debe coincidir (Ej: MensajesJuan.html)
            // MODIFICADO: Ruta de chat corregida
            const response = await fetch(`./Mensajes/Mensajes${userName}.html`); 
            if (!response.ok) {
                throw new Error('No se encontró el historial de chat.');
            }
            const messagesHtml = await response.text();
            chatBox.innerHTML = messagesHtml;
            
            chatBox.scrollTop = chatBox.scrollHeight;

        } catch (error) {
            console.error('Error al cargar mensajes:', error);
            chatBox.innerHTML = '<p class="error">No se pudieron cargar los mensajes.</p>';
        }
    }

    // 3. Lógica para enviar un mensaje (copiada y adaptada de Chat.js)
    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (text === '') return; 

        const newBubble = document.createElement('div');
        newBubble.classList.add('chat-bubble', 'sent');
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        newBubble.innerHTML = `
            <p>${text.replace(/\n/g, '<br>')}</p>
            <span>${timeString}</span>
        `;
        
        chatBox.appendChild(newBubble);
        chatInput.value = ''; // Limpiar input
        chatBox.scrollTop = chatBox.scrollHeight; // Scroll al final
        chatInput.focus();
    };

    // 4. Listeners para enviar
    sendChatBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

});