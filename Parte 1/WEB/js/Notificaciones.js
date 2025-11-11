import { getNotificaciones, saveNotificaciones, seedDemo, uid } from './BBDD.js';

const container = document.getElementById("notificationsContainer");
const refreshBtn = document.getElementById("refreshDemoBtn");

// ---------- Mostrar notificaciones ----------
function mostrarNotificaciones() {
  const notificaciones = getNotificaciones();
  container.innerHTML = "";

  if (notificaciones.length === 0) {
    container.innerHTML = "<p>No tienes notificaciones por ahora :( </p>";
    return;
  }

  notificaciones.forEach((n, index) => {
    const div = document.createElement("div");
    div.classList.add("notification-item");
    div.innerHTML = `
      <div>
        <p class="notification-text">${n.texto}</p>
        <small class="notification-time">${n.tiempo}</small>
      </div>
      <button class="delete-btn" data-index="${index}">❌</button>
    `;
    container.appendChild(div);
  });

  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      eliminarNotificacion(idx);
    });
  });
}

// ---------- Eliminar una notificación ----------
function eliminarNotificacion(index) {
  const notificaciones = getNotificaciones();
  notificaciones.splice(index, 1);
  saveNotificaciones(notificaciones);
  mostrarNotificaciones();
}

// ---------- Recargar datos demo ----------
refreshBtn?.addEventListener("click", () => {
  if (confirm("¿Quieres recargar las notificaciones de prueba?")) {
    seedDemo();
    mostrarNotificaciones();
    alert("Notificaciones  recargadas.");
  }
});

// ---------- Inicializar ----------
(function init() {
  if (!getNotificaciones().length) {
    seedDemo(); // Si no existen, crear demo
  }
  mostrarNotificaciones();
})();
