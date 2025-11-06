// Espera a que la página de chat esté cargada
document.addEventListener('DOMContentLoaded', () => {

    // Comprobamos que estamos en la página de chat (buscando el chatInput)
    const chatInput = document.getElementById('chatInput');
    if (!chatInput) {
        // No estamos en la página de chat, no hacer nada
        return; 
    }

    const sendChatBtn = document.getElementById('sendChatBtn');
    const chatBox = document.getElementById('chatBox');

    // Función para enviar el mensaje
    const sendMessage = () => {
        const text = chatInput.value.trim();

        if (text === '') {
            return; // No enviar mensajes vacíos
        }

        // 1. Crear la nueva burbuja de chat
        const newBubble = document.createElement('div');
        newBubble.classList.add('chat-bubble', 'sent');
        
        // Obtenemos la hora actual (simple)
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

        // Usamos innerHTML para permitir saltos de línea
        newBubble.innerHTML = `
            <p>${text.replace(/\n/g, '<br>')}</p>
            <span>${timeString}</span>
        `;

        // 2. Añadir la burbuja al chat-box
        chatBox.appendChild(newBubble);

        // 3. Limpiar el input
        chatInput.value = '';

        // 4. Hacer scroll hasta el final
        chatBox.scrollTop = chatBox.scrollHeight;
        
        // 5. Devolver el foco al input
        chatInput.focus();
    };

    // --- Añadir Event Listeners ---

    // 1. Al hacer clic en "Enviar"
    sendChatBtn.addEventListener('click', sendMessage);

    // 2. Al pulsar "Enter"
    chatInput.addEventListener('keydown', (e) => {
        // Comprobamos si la tecla es "Enter" Y no se está pulsando "Shift"
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Evita el salto de línea por defecto del Enter
            sendMessage();
        }
        // Si pulsan Shift + Enter, sí permitirá un salto de línea (comportamiento normal)
    });

});