// Detectar con qué usuario se está chateando
const ruta = window.location.pathname; // Obtiene la ruta completa del archivo actual en el navegador
const nombreArchivo = ruta.substring(ruta.lastIndexOf('/') + 1); // Extrae solo el nombre del archivo (p.ej., "ChatJuan.html")
const nombreUsuario = nombreArchivo.replace("Chat", "").replace(".html", ""); // Elimina "Chat" y ".html" para obtener solo el nombre de usuario (p.ej., "Juan")

// Seleccionar el contenedor donde se mostrarán los mensajes 
const chatBox = document.getElementById("chatBox"); // Elemento div donde se cargarán los mensajes

// Función para cargar mensajes desde un archivo HTML 
async function cargarMensajes(usuario) {
  try {
    // Se hace una petición fetch al archivo correspondiente según el usuario
    const response = await fetch(`../Mensajes/Mensajes${usuario}.html`);
    if (!response.ok) throw new Error("No se pudieron cargar los mensajes"); // Manejo de error si falla la petición
    
    const html = await response.text(); // Obtener el contenido HTML del archivo
    chatBox.innerHTML = html; // Insertar los mensajes dentro del chatBox
  } catch (error) {
    // En caso de error, mostrar mensaje en pantalla y loguear el error en consola
    chatBox.innerHTML = `<p class="error">No se pudieron cargar los mensajes del chat.</p>`;
    console.error(error);
  }
}

// Ejecutar la función para cargar mensajes del usuario detectado 
cargarMensajes(nombreUsuario);
