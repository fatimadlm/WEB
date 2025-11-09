// Obtener usuario actual 
let currentUser = localStorage.getItem('currentUser'); // Intenta obtener el usuario del localStorage
if (!currentUser) { // Si no existe
  currentUser = prompt('Ingresa tu nombre de usuario:'); // Pedir al usuario que ingrese su nombre
  if (!currentUser) currentUser = 'Invitado';          // Si no escribe nada, usar "Invitado"
  localStorage.setItem('currentUser', currentUser);    // Guardar el usuario en localStorage para futuras visitas
}

//Eventos por defecto 
let eventos = JSON.parse(localStorage.getItem('eventos')); // Obtener eventos guardados en localStorage
if (!eventos) { // Si no existen
  // Crear algunos eventos de ejemplo
  eventos = [
    { fecha: '2025-11-10', titulo: 'Clase: Repostería artesanal', hora: '17:00', creador: 'Juan' },
    { fecha: '2025-11-15', titulo: 'Cata de vinos y quesos', hora: '19:00', creador: 'ChefMario' },
    { fecha: '2025-11-22', titulo: 'Taller: Cocina internacional', hora: '11:00', creador: 'Laura' },
    { fecha: '2025-11-25', titulo: 'Masterclass: Panes caseros', hora: '18:30', creador: 'Ana' }
  ];
  localStorage.setItem('eventos', JSON.stringify(eventos)); // Guardar los eventos de ejemplo
}

// esperar a que la página cargue 
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(new Date()); // Mostrar el calendario del mes actual

  // Botón mes anterior 
  document.getElementById('prevMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date); // Obtener fecha actual mostrada
    currentDate.setMonth(currentDate.getMonth() - 1); // Restar un mes
    renderCalendar(currentDate); // Renderizar calendario del mes anterior
  });

  // === Botón mes siguiente ===
  document.getElementById('nextMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date); // Obtener fecha actual
    currentDate.setMonth(currentDate.getMonth() + 1); // Sumar un mes
    renderCalendar(currentDate); // Renderizar calendario del mes siguiente
  });

  // === Añadir nuevo evento ===
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recarga de página al enviar el formulario

    const fecha = document.getElementById('eventDate').value; // Fecha del evento
    const titulo = document.getElementById('eventTitle').value; // Título del evento
    const hora = document.getElementById('eventTime').value; // Hora del evento

    // Obtener creador (usuario actual)
    const creador = localStorage.getItem('currentUser') || 'Invitado';

    const nuevoEvento = { fecha, titulo, hora, creador }; // Crear objeto del nuevo evento

    eventos.push(nuevoEvento); // Agregar al array de eventos
    localStorage.setItem('eventos', JSON.stringify(eventos)); // Guardar en localStorage

    e.target.reset(); // Limpiar formulario
    renderCalendar(new Date(fecha)); // Renderizar calendario mostrando el mes del evento
    alert(`Evento añadido por ${creador}`); // Confirmación al usuario
  });
});

// === Función para mostrar el calendario ===
function renderCalendar(date) {
  const monthYear = document.getElementById('monthYear'); // Elemento donde se muestra el mes y año
  const grid = document.getElementById('calendarGrid');   // Contenedor de los días
  const eventList = document.getElementById('eventList'); // Lista de eventos del día seleccionado

  const year = date.getFullYear(); // Año actual
  const month = date.getMonth();   // Mes actual (0-11)

  // Nombres de los meses
  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthYear.textContent = `${monthNames[month]} ${year}`; // Mostrar mes y año
  monthYear.dataset.date = date.toISOString(); // Guardar fecha actual en un dataset

  grid.innerHTML = ''; // Limpiar días previos
  eventList.innerHTML = '<li>Selecciona un día del calendario para ver los eventos.</li>'; // Mensaje inicial

  const firstDay = new Date(year, month, 1); // Primer día del mes
  const lastDay = new Date(year, month + 1, 0); // Último día del mes
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Ajustar inicio de la semana (lunes = 0)

  // Agregar espacios vacíos antes del primer día
  for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div'));

  // Crear los días del mes
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayDiv = document.createElement('div');
    dayDiv.classList.add('calendar-day'); // Clase para estilo
    dayDiv.textContent = d; // Número del día

    const dateStr = `${year}-${(month+1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`; // Formato YYYY-MM-DD
    const dayEvents = eventos.filter(e => e.fecha === dateStr); // Filtrar eventos del día

    if (dayEvents.length > 0) { // Si hay eventos
      dayDiv.classList.add('has-event'); // Marcar día con evento
      dayDiv.addEventListener('click', () => { // Al hacer click, mostrar eventos
        eventList.innerHTML = ''; // Limpiar lista
        dayEvents.forEach(ev => {
          const li = document.createElement('li');
          li.textContent = `${ev.titulo} — ${ev.hora}`; // Mostrar título y hora
          eventList.appendChild(li);
        });
      });
    }

    grid.appendChild(dayDiv); // Agregar día al calendario
  }
}
