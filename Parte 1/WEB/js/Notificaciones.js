// ---------- Datos de ejemplo ----------
const demoData = [
  { texto: "@Ana comentó tu receta de Paella.", tiempo: "Hace 10 minutos" },
  { texto: "@Juan le dio 'me gusta' a tu receta de Croquetas.", tiempo: "Hace 30 minutos" },
  { texto: "@Caro te ha seguido.", tiempo: "Hace 1 hora" },
  { texto: "@Pedro ha publicado una nueva receta: Gazpacho.", tiempo: "Hace 2 horas" }
];

const STORAGE_KEY = "cookingUAH_notif_v1";
const container = document.getElementById("notificationsContainer");

// ---------- Mostrar notificaciones ----------
function mostrarNotificaciones() {
  const notificaciones = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  container.innerHTML = "";

  if (notificaciones.length === 0) {
    container.innerHTML = "<p>No tienes notificaciones por ahora 🍰</p>";
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
  const notificaciones = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  notificaciones.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notificaciones));
  mostrarNotificaciones();
}

// ---------- Recargar datos de prueba ----------
document.getElementById("refreshDemoBtn").addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  mostrarNotificaciones();
  alert("🔄 Datos de prueba recargados.");
});

// ---------- Inicializar ----------
(function init() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  }
  mostrarNotificaciones();
})();
