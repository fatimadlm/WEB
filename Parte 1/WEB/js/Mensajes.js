import { getMessages, saveMessages, getCurrentUser, uid, getUsers, getPosts, seedDemo } from './BBDD.js';

/**
 *  Esperamos a que el HTML esté completamente cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    
    // Si no hay usuarios o publicaciones, cargamos los datos de ejemplo
    if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
      seedDemo()
      console.log('Simulación cargada')
    }

    // Obtenemos el usuario que ha iniciado sesión
    const currentUser = getCurrentUser()

    // Si no hay usuario, redirigimos al login
    if (!currentUser.id) {
        alert('Debes iniciar sesión para acceder a esta página.')
        window.location.href = 'IniciarSesion.html'
        throw new Error('Usuario no autenticado')
    }

    // Seleccionamos los elementos del DOM
    const chatList = document.querySelector('.chat-list')
    const chatPlaceholder = document.getElementById('chatPlaceholder')
    const chatActiveWindow = document.getElementById('chatActiveWindow')
    const chatBox = document.getElementById('chatBox')
    const chatUserName = document.getElementById('chatUserName')
    const chatInput = document.getElementById('chatInput')
    const sendChatBtn = document.getElementById('sendChatBtn')
    const refreshBtn = document.getElementById('refreshDemoBtn')

    // Guardamos el id del chat que está abierto
    let currentChatPartnerId = null

    /**
     *  Listener para los botones de la clase 'btn-refresh'
     */
    refreshBtn?.addEventListener('click', () => {
        // Se pregunta al usuario si quiere regargar los datos de prueba
        if (confirm("¿Quieres recargar los datos de prueba?")) {
        localStorage.clear()
        seedDemo()
        
        // Cargamos la vista previa
        loadChatPreviews()
        chatPlaceholder.style.display = 'flex'
        chatActiveWindow.style.display = 'none'
        
        // Avisamos que la carga ha sido completada
        alert("Simulación cargada")
      }
    })

    /**
     *  Función que carga la vista previa de los últimos mensajes
     */
    function loadChatPreviews() {
        const allMessages = getMessages()
        const lastMessageMap = new Map()

        allMessages.forEach(msg => {
            let partnerId = null
            if (msg.senderId === currentUser.id) partnerId = msg.receiverId
            else if (msg.receiverId === currentUser.id) partnerId = msg.senderId
            else return

            const existing = lastMessageMap.get(partnerId)
            if (!existing || msg.timestamp > existing.timestamp) {
                lastMessageMap.set(partnerId, msg)
            }
        })

        // Actualiza los textos en la lista de chats
        document.querySelectorAll('.chat-list-item').forEach(item => {
            const partnerId = item.dataset.userId
            const p = item.querySelector('.chat-last-message')
            if (!p) return

            const lastMessage = lastMessageMap.get(partnerId)
            if (lastMessage) {
                const prefix = lastMessage.senderId === currentUser.id ? "Tú: " : ""
                p.textContent = prefix + lastMessage.content
            } else {
                p.textContent = "No hay mensajes todavía."
            }
        })
    }

    // Cargamos las vistas previas al entrar a la página
    loadChatPreviews()

    // Al hacer clic en un chat de la lista
    chatList.addEventListener('click', (e) => {
        const chatButton = e.target.closest('.chat-list-item')
        if (!chatButton) return

        document.querySelectorAll('.chat-list-item').forEach(btn => btn.classList.remove('selected'))
        chatButton.classList.add('selected')
        
        const partnerId = chatButton.dataset.userId
        const partnerName = chatButton.dataset.userName
        
        if (!partnerId || !partnerName) {
            return console.error("Error: Falta data-user-id o data-user-name.")
        }

        currentChatPartnerId = partnerId
        chatPlaceholder.style.display = 'none'
        chatActiveWindow.style.display = 'flex'

        const profilePage = (partnerId === currentUser.id) ? "MiPerfil.html" : `Perfiles/Perfil${partnerName}.html`
        chatUserName.innerHTML = `Chat con <a href="${profilePage}">@${partnerName}</a>`

        loadChatMessages(currentUser.id, partnerId)
    })

    // Cargar todos los mensajes de una conversación
    function loadChatMessages(currentUserId, partnerId) {
        chatBox.innerHTML = ''
        
        const allMessages = getMessages()
        const conversation = allMessages
            .filter(msg => 
                (msg.senderId === currentUserId && msg.receiverId === partnerId) ||
                (msg.senderId === partnerId && msg.receiverId === currentUserId)
            )
            .sort((a, b) => a.timestamp - b.timestamp)
        
        if (conversation.length === 0) {
            chatBox.innerHTML = '<p class="info">No hay mensajes. Di hola!</p>'
            return
        }

        // Crear una burbuja por cada mensaje
        conversation.forEach(msg => {
            const type = msg.senderId === currentUserId ? 'sent' : 'received'
            const newBubble = document.createElement('div')
            newBubble.classList.add('chat-bubble', type)
            const timeString = new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })

            newBubble.innerHTML = `
                <p>${msg.content.replace(/\n/g, '<br>')}</p>
                <span>${timeString}</span>
            `
            chatBox.appendChild(newBubble)
        })
        
        chatBox.scrollTop = chatBox.scrollHeight
    }

    // Enviar un nuevo mensaje
    const sendMessage = () => {
        const text = chatInput.value.trim()
        if (text === '' || !currentChatPartnerId) return

        const now = Date.now()
        const newMessage = {
            id: uid('m_'),
            senderId: currentUser.id,
            receiverId: currentChatPartnerId,
            content: text,
            timestamp: now
        }

        const allMessages = getMessages()
        allMessages.push(newMessage)
        saveMessages(allMessages)

        // Mostrar el mensaje en pantalla
        const newBubble = document.createElement('div')
        newBubble.classList.add('chat-bubble', 'sent')
        const timeString = new Date(now).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        newBubble.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p><span>${timeString}</span>`
        chatBox.appendChild(newBubble)
        
        chatInput.value = ''
        chatBox.scrollTop = chatBox.scrollHeight
        chatInput.focus()

        loadChatPreviews()
    }

    // Botón de enviar mensaje
    sendChatBtn.addEventListener('click', sendMessage)
    
    // Enviar con Enter (sin Shift)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { 
            e.preventDefault()
            sendMessage()
        }
    })
})
