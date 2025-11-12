import { getCurrentUser, getEventos, saveEventos, seedDemo } from './BBDD.js';
//obtenemos al usuario actual
const currentUser = getCurrentUser();
if (!currentUser.id) {
  //Si no esta logueado
  alert('Debes iniciar sesión para acceder a esta página.');
  // Redirigimos al usuario a la página de login
  window.location.href = 'IniciarSesion.html';
  //Error
  throw new Error('Usuario no autenticado');
}

//Obtener eventos desde BBDD
let eventos = getEventos();

//Esperar a que la página cargue 
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(new Date());

  // Botones de navegación de mes
  document.getElementById('prevMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Formulario para añadir evento
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const fecha = document.getElementById('eventDate').value;
    const titulo = document.getElementById('eventTitle').value;
    const hora = document.getElementById('eventTime').value;

    if (!fecha || !titulo || !hora) {
      return alert("Completa todos los campos para añadir un evento.");
    }

    const nuevoEvento = { fecha, titulo, hora, creador: currentUser };

    eventos.push(nuevoEvento);
    saveEventos(eventos); // Guardar en BBDD.js

    e.target.reset();
    renderCalendar(new Date(fecha));
    alert(`Evento añadido por ${currentUser}`);
  });

  // Botón para recargar datos de prueba
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba de eventos? Se borrarán los actuales.")) {
      seedDemo();           // Recarga usimulacion
      eventos = getEventos(); // Actualizar eventos locales
      renderCalendar(new Date());
      alert("Datos demo recargados correctamente.");
    }
  });
});

// --- Función para renderizar calendario ---
function renderCalendar(date) {
  eventos = getEventos(); // Siempre recargar la versión más reciente

  const monthYear = document.getElementById('monthYear');
  const grid = document.getElementById('calendarGrid');
  const eventList = document.getElementById('eventList');

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                      'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  monthYear.textContent = `${monthNames[month]} ${year}`;
  monthYear.dataset.date = date.toISOString();

  grid.innerHTML = '';
  eventList.innerHTML = '<li>Selecciona un día del calendario para ver los eventos.</li>';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Espacios vacíos antes del primer día
  for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div'));

  // Crear los días del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = d;

    const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
    const dayEvents = eventos.filter(e => e.fecha === dateStr);

    if (dayEvents.length > 0) {
      dayDiv.classList.add('has-event');
      dayDiv.addEventListener('click', () => {
        eventList.innerHTML = '';
        dayEvents.forEach(ev => {
          const li = document.createElement('li');
          li.textContent = `${ev.titulo} — ${ev.hora} (por ${ev.creador})`;
          eventList.appendChild(li);
        });
      });
    }

    grid.appendChild(dayDiv);
  }
}
