import { getCurrentUser, getEventos, saveEventos, seedDemo } from './BBDD.js'; 
const currentUser = getCurrentUser(); // obtiene el usuario actual

if (!currentUser.id) { // verifica si hay usuario logueado
  alert('Debes iniciar sesion para acceder a esta pagina.'); // muestra alerta si no hay sesion
  window.location.href = 'IniciarSesion.html'; // redirige al login
  throw new Error('Usuario no autenticado'); // detiene el codigo
}

let eventos = getEventos(); // obtiene los eventos guardados

document.addEventListener('DOMContentLoaded', () => { // espera a que el DOM cargue completamente

  const hoy = new Date(); // obtiene la fecha actual
  const year = hoy.getFullYear(); // obtiene el año actual
  const month = (hoy.getMonth() + 1).toString().padStart(2, '0'); // obtiene el mes actual con dos digitos
  const day = hoy.getDate().toString().padStart(2, '0'); // obtiene el dia actual con dos digitos
  const hoyString = `${year}-${month}-${day}`; // crea la fecha en formato AAAA-MM-DD

  const eventDateInput = document.getElementById('eventDate'); // obtiene el input de fecha
  if (eventDateInput) { // si existe el input
    eventDateInput.min = hoyString; // establece la fecha minima como hoy
  }

  renderCalendar(new Date()); // muestra el calendario del mes actual

  document.getElementById('prevMonth').addEventListener('click', () => { // boton para mes anterior
    let currentDate = new Date(document.getElementById('monthYear').dataset.date); // obtiene fecha actual mostrada
    currentDate.setMonth(currentDate.getMonth() - 1); // resta un mes
    renderCalendar(currentDate); // renderiza el nuevo mes
  });

  document.getElementById('nextMonth').addEventListener('click', () => { // boton para mes siguiente
    let currentDate = new Date(document.getElementById('monthYear').dataset.date); // obtiene fecha actual mostrada
    currentDate.setMonth(currentDate.getMonth() + 1); // suma un mes
    renderCalendar(currentDate); // renderiza el nuevo mes
  });

  document.getElementById('addEventForm').addEventListener('submit', (e) => { // evento para enviar formulario
    e.preventDefault(); // evita que se recargue la pagina

    const fecha = document.getElementById('eventDate').value; // obtiene la fecha del formulario
    const titulo = document.getElementById('eventTitle').value; // obtiene el titulo del evento
    const hora = document.getElementById('eventTime').value; // obtiene la hora del evento

    if (!fecha || !titulo || !hora) { // verifica que todos los campos esten completos
      return alert('Completa todos los campos para anadir un evento.'); // muestra alerta si falta algo
    }

    const hoy = new Date(); // obtiene la fecha actual nuevamente
    const year = hoy.getFullYear(); // obtiene el año actual
    const month = (hoy.getMonth() + 1).toString().padStart(2, '0'); // obtiene el mes actual con dos digitos
    const day = hoy.getDate().toString().padStart(2, '0'); // obtiene el dia actual con dos digitos
    const hoyString = `${year}-${month}-${day}`; // crea la fecha en formato AAAA-MM-DD

    if (fecha < hoyString) { // valida que la fecha no sea anterior a hoy
      return alert('No puedes crear un evento en una fecha anterior al dia actual.'); // muestra alerta
    }

    const nuevoEvento = { fecha, titulo, hora, creador: currentUser.username }; // crea el nuevo evento

    eventos.push(nuevoEvento); // agrega el evento a la lista

    saveEventos(eventos); // guarda los eventos actualizados

    e.target.reset(); // limpia el formulario

    renderCalendar(new Date(fecha)); // actualiza el calendario

    alert(`Evento anadido por ${currentUser.username}`); // confirma al usuario
  });

  const refreshBtn = document.getElementById('refreshDemoBtn'); // obtiene el boton de recarga
  refreshBtn?.addEventListener('click', () => { // evento para recargar datos demo
    if (confirm('Quieres recargar los datos de prueba de eventos Se borraran los actuales')) { // pide confirmacion
      seedDemo(); // recarga los datos demo
      eventos = getEventos(); // actualiza la lista local
      renderCalendar(new Date()); // vuelve a renderizar el calendario
      alert('Datos demo recargados correctamente.'); // confirma la accion
    }
  });
});

function renderCalendar(date) { // funcion que muestra el calendario
  eventos = getEventos(); // obtiene la lista actualizada de eventos

  const monthYear = document.getElementById('monthYear'); // obtiene el elemento del mes y año
  const grid = document.getElementById('calendarGrid'); // obtiene la cuadricula del calendario
  const eventList = document.getElementById('eventList'); // obtiene la lista de eventos

  const year = date.getFullYear(); // obtiene el año
  const month = date.getMonth(); // obtiene el mes

  const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']; // nombres de los meses

  monthYear.textContent = `${monthNames[month]} ${year}`; // muestra mes y año
  monthYear.dataset.date = date.toISOString(); // guarda la fecha actual en dataset

  grid.innerHTML = ''; // limpia la cuadricula del calendario
  eventList.innerHTML = '<li>Selecciona un dia del calendario para ver los eventos.</li>'; // limpia la lista

  const firstDay = new Date(year, month, 1); // obtiene el primer dia del mes
  const lastDay = new Date(year, month + 1, 0); // obtiene el ultimo dia del mes

  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // calcula el dia de inicio del mes

  for (let i = 0; i < startDay; i++) grid.appendChild(document.createElement('div')); // crea espacios vacios al inicio

  for (let d = 1; d <= lastDay.getDate(); d++) { // recorre todos los dias del mes
    const dayDiv = document.createElement('div'); // crea un div para el dia
    dayDiv.classList.add('calendar-day'); // agrega clase
    dayDiv.textContent = d; // muestra el numero del dia

    const dateStr = `${year}-${(month + 1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`; // crea cadena de fecha

    const dayEvents = eventos.filter(e => e.fecha === dateStr); // filtra los eventos del dia

    if (dayEvents.length > 0) { // si hay eventos ese dia
      dayDiv.classList.add('has-event'); // marca el dia con evento
      dayDiv.addEventListener('click', () => { // evento para mostrar los eventos del dia
        eventList.innerHTML = ''; // limpia la lista
        dayEvents.forEach(ev => { // recorre los eventos del dia
          const li = document.createElement('li'); // crea un elemento de lista
          li.textContent = `${ev.titulo} - ${ev.hora} (por ${ev.creador})`; // agrega texto con la informacion
          eventList.appendChild(li); // lo agrega a la lista
        });
      });
    }

    grid.appendChild(dayDiv); // agrega el dia al calendario
  }
}
