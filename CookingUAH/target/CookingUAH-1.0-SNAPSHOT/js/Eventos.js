document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtener eventos inyectados desde el JSP (incluye el campo tipo)
    let eventos = window.eventosDesdeBBDD || [];

    // 2. Configurar fecha mínima para el input (hoy)
    const hoy = new Date().toISOString().split('T')[0];
    const eventDateInput = document.getElementById('eventDate');
    if (eventDateInput) eventDateInput.min = hoy;

    // 3. Renderizado inicial del calendario
    renderCalendar(new Date(), eventos);

    // 4. Navegación del calendario (Mes anterior/siguiente)
    document.getElementById('prevMonth').addEventListener('click', () => {
        let currentDate = new Date(document.getElementById('monthYear').dataset.date);
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate, eventos);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        let currentDate = new Date(document.getElementById('monthYear').dataset.date);
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate, eventos);
    });

    // 5. Validación del formulario de creación
    const addEventForm = document.querySelector('.form-evento');
    if (addEventForm) {
        addEventForm.addEventListener('submit', (e) => {
            const fechaVal = document.getElementById('eventDate').value;
            if (fechaVal < hoy) {
                e.preventDefault();
                alert('No puedes crear eventos en fechas pasadas.');
            }
        });
    }
});

/**
 * Función principal para dibujar el calendario y gestionar clicks
 */
function renderCalendar(date, eventos) {
    const monthYear = document.getElementById('monthYear');
    const grid = document.getElementById('calendarGrid');
    const eventList = document.getElementById('eventList');
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    const dayLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    monthYear.textContent = `${monthNames[month]} ${year}`;
    monthYear.dataset.date = date.toISOString();
    grid.innerHTML = '';

    // --- AÑADIR CABECERA DE DÍAS (L-D) ---
    dayLabels.forEach(label => {
        const labelDiv = document.createElement('div');
        labelDiv.classList.add('calendar-weekday');
        labelDiv.textContent = label;
        grid.appendChild(labelDiv);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Ajuste para que el calendario empiece en Lunes (0=Lunes, 6=Domingo)
    let startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Espacios vacíos para los días del mes anterior
    for (let i = 0; i < startDay; i++) {
        const emptyDiv = document.createElement('div');
        grid.appendChild(emptyDiv);
    }

    // Dibujar los días del mes actual
    for (let d = 1; d <= lastDay.getDate(); d++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.textContent = d;

        const dateStr = `${year}-${(month + 1).toString().padStart(2,'0')}-${d.toString().padStart(2,'0')}`;
        
        // Filtrar eventos de este día específico
        const dayEvents = eventos.filter(e => e.fecha === dateStr);

        if (dayEvents.length > 0) {
            dayDiv.classList.add('has-event');
            dayDiv.addEventListener('click', () => {
                // Resaltar selección
                document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
                dayDiv.classList.add('selected');

                eventList.innerHTML = '';
                dayEvents.forEach(ev => {
                    const li = document.createElement('li');
                    li.classList.add('event-item');
                    
                    // Generar clase CSS limpia (sin tildes ni espacios) para el color del badge
                    const claseTipo = `tipo-${ev.tipo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')}`;
                    
                    li.innerHTML = `
                        <div class="event-card">
                            <strong>${ev.titulo}</strong>
                            <span class="badge-tipo ${claseTipo}">${ev.tipo}</span>
                            <span>Hora: ${ev.hora}</span>
                            <small>Organizado por: @${ev.creador}</small>
                        </div>
                    `;
                    eventList.appendChild(li);
                });
            });
        }
        grid.appendChild(dayDiv);
    }
}