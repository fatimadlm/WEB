import { getCurrentUser, getEventos, saveEventos, seedDemo } from './BBDD.js';

// Obtener el usuario actualmente logueado
const currentUser = getCurrentUser();

// Verificar si hay un usuario autenticado
if (!currentUser.id) {
  // Si no hay sesión iniciada, mostrar mensaje y redirigir al login
  alert('Debes iniciar sesión para acceder a esta página.');
  window.location.href = 'IniciarSesion.html';
  // Lanzar un error para detener la ejecución del código
  throw new Error('Usuario no autenticado');
}

// Obtener la lista de eventos almacenados
let eventos = getEventos();

// Esperar a que el contenido de la página esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

  // Mostrar el calendario del mes actual al cargar la página
  renderCalendar(new Date());

  // Botón para ir al mes anterior
  document.getElementById('prevMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  // Botón para ir al mes siguiente
  document.getElementById('nextMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Evento que maneja el formulario de agregar un nuevo evento
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que se recargue la página

    // Obtener los valores del formulario
    const fecha = document.getElementById('eventDate').value;
    const titulo = document.getElementById('eventTitle').value;
    const hora = document.getElementById('eventTime').value;

    // Verificar que todos los campos estén completos
    if (!fecha || !titulo || !hora) {
      return alert("Completa todos los campos para añadir un evento.");
    }

    // Crear un nuevo objeto evento
    const nuevoEvento = { fecha, titulo, hora, creador: currentUser.username };

    // Agregarlo al arreglo de eventos
    eventos.push(nuevoEvento);

    // Guardar los cambios en la base de datos (localStorage)
    saveEventos(eventos);

    // Limpiar el formulario
    e.target.reset();

    // Volver a renderizar el calendario para reflejar el nuevo evento
    renderCalendar(new Date(fecha));

    // Confirmar al usuario que el evento fue añadido
    alert(`Evento añadido por ${currentUser.username}`);
  });

  // Botón para recargar los datos de demostración
  const refreshBtn = document.getElementById('refreshDemoBtn');
  refreshBtn?.addEventListener('click', () => {
    if (confirm("¿Quieres recargar los datos de prueba de eventos? Se borrarán los actuales.")) {
      // Recargar los datos demo desde BBDD.js
      seedDemo();

      // Actualizar la lista local de eventos
      eventos = getEventos();

      // Volver a mostrar el calendario
      renderCalendar(new Date());

      // Notificar al usuario
      alert("Datos demo recargados correctamente.");
    }
  });
});

// Funcion que genera el calendario en pantalla
function renderCalendar(date) {
  // Cargar siempre la version mas reciente de los eventos
  eventos = getEventos();

  // Obtener elementos del DOM relacionados con el calendario
  const monthYear = document.getElementById('monthYear');
  const grid = document.getElementById('calendarGrid');
  const eventList = document.getElementById('eventList');

  // Obtener el año y el mes actual a partir del objeto Date
  const year = date.getFullYear();
  const month = date.getMonth();

  // Nombres de los meses para mostrar en pantalla
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio',
                      'Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  // Mostrar el mes y año actual en el encabezado
  monthYear.textContent = `${monthNames[month]} ${year}`;
  monthYear.dataset.date = date.toISOString(); // Guardar la fecha actual

  // Limpiar el contenido anterior del calendario y la lista de eventos
  grid.innerHTML = '';
  eventList.innerHTML = '<li>Selecciona un día del calendario para ver los eventos.</li>';

  // Calcular el primer y último día del mes actual
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // Determinar el día de la semana en que empieza el mes (0 = lunes)
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Crear los espacios vacíos antes del primer día del mes
  for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div'));

  // Crear los elementos de cada día del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day');
    dayDiv.textContent = d;

    // Formatear la fecha en formato AAAA-MM-DD
    const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;

    // Filtrar los eventos que coinciden con ese día
    const dayEvents = eventos.filter(e => e.fecha === dateStr);

    // Si hay eventos, marcar el día y permitir ver la lista
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

    // Añadir el día al calendario
    grid.appendChild(dayDiv);
  }
}
