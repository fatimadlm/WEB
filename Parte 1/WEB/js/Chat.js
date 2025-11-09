
// Detectamos el nombre del usuario con quien chatea 
const ruta = window.location.pathname;
const nombreArchivo = ruta.substring(ruta.lastIndexOf('/') + 1); 
const nombreUsuario = nombreArchivo.replace("Chat", "").replace(".html", ""); 

// Cargamos los mensajes
const chatBox = document.getElementById("chatBox");

async function cargarMensajes(usuario) {
  try {
    const response = await fetch(`../Mensajes/Mensajes${usuario}.html`);
    if (!response.ok) throw new Error("No se pudieron cargar los mensajes");
    const html = await response.text();
    chatBox.innerHTML = html;
  } catch (error) {
    chatBox.innerHTML = `<p class="error">No se pudieron cargar los mensajes del chat.</p>`;
    console.error(error);
  }
}

cargarMensajes(nombreUsuario);
