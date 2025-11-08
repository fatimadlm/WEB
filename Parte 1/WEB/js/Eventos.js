
// Obtener usuario actual
let currentUser = localStorage.getItem('currentUser');
if (!currentUser) {
  currentUser = prompt('Ingresa tu nombre de usuario:'); // Pedir nombre
  if (!currentUser) currentUser = 'Invitado';          // Si no escribe nada
  localStorage.setItem('currentUser', currentUser);    // Guardar en localStorage
}

// Eventos por defecto
let eventos = JSON.parse(localStorage.getItem('eventos'));
if (!eventos) {
  eventos = [
    { fecha: '2025-11-10', titulo: 'Clase: Repostería artesanal', hora: '17:00', creador: 'Juan' },
    { fecha: '2025-11-15', titulo: 'Cata de vinos y quesos', hora: '19:00', creador: 'ChefMario' },
    { fecha: '2025-11-22', titulo: 'Taller: Cocina internacional', hora: '11:00', creador: 'Laura' },
    { fecha: '2025-11-25', titulo: 'Masterclass: Panes caseros', hora: '18:30', creador: 'Ana' }
  ];
  localStorage.setItem('eventos', JSON.stringify(eventos)); // Guardar solo si no existían
}

// Esperar a que la página cargue
document.addEventListener('DOMContentLoaded', () => {
  renderCalendar(new Date()); // Mostrar calendario actual

  // Botón mes anterior
  document.getElementById('prevMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar(currentDate);
  });

  // Botón mes siguiente
  document.getElementById('nextMonth').addEventListener('click', () => {
    let currentDate = new Date(document.getElementById('monthYear').dataset.date);
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar(currentDate);
  });

  // Añadir nuevo evento
  document.getElementById('addEventForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const fecha = document.getElementById('eventDate').value;
    const titulo = document.getElementById('eventTitle').value;
    const hora = document.getElementById('eventTime').value;

    // Usar siempre el usuario actual del localStorage
    const creador = localStorage.getItem('currentUser') || 'Invitado';

    const nuevoEvento = { fecha, titulo, hora, creador };

    eventos.push(nuevoEvento);
    localStorage.setItem('eventos', JSON.stringify(eventos));

    e.target.reset();
    renderCalendar(new Date(fecha));
    alert(`✅ Evento añadido por ${creador}`);
  });
});

// Mostrar calendario
function renderCalendar(date) {
  const monthYear = document.getElementById('monthYear');
  const grid = document.getElementById('calendarGrid');
  const eventList = document.getElementById('eventList');

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  monthYear.textContent = `${monthNames[month]} ${year}`;
  monthYear.dataset.date = date.toISOString();

  grid.innerHTML = '';
  eventList.innerHTML = '<li>Selecciona un día del calendario para ver los eventos.</li>';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div'));

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
          li.textContent = `${ev.titulo} — ${ev.hora}`;
          eventList.appendChild(li);
        });
      });
    }

    grid.appendChild(dayDiv);
  }
}
