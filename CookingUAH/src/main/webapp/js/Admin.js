/**
 * Lógica de interfaz para el panel de administración.
 * Gestiona únicamente el cambio de pestañas y el filtro de búsqueda visual.
 */
document.addEventListener('DOMContentLoaded', () => {
    guard();
    initTabs();
    initSearch();
});

/**
 * Verifica el rol del usuario desde la variable global definida en el JSP.
 */
function guard() {
    const role = window.currentUserRole;
    if (role !== 'admin') {
        alert('Acceso restringido. Debes ser administrador.');
        window.location.href = 'login.jsp'; 
    }
}

/**
 * Gestiona el intercambio de visibilidad entre las secciones del panel.
 */
function initTabs() {
    const buttons = document.querySelectorAll('.menu-btn');
    const sections = document.querySelectorAll('.card');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            
            // Ocultar todas las secciones excepto el menú de botones
            sections.forEach(s => {
                if (!s.classList.contains('card--menu')) {
                    s.style.display = 'none';
                }
            });
            
            // Mostrar la sección seleccionada
            const targetSection = document.querySelector(target);
            if (targetSection) targetSection.style.display = 'block';
            
            // Actualizar estilo del botón activo
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Inicialización: Mostrar por defecto la sección de usuarios
    sections.forEach(s => {
        if (s.id !== 'users' && !s.classList.contains('card--menu')) {
            s.style.display = 'none';
        }
    });
}

/**
 * Filtra las filas de las tablas existentes en el DOM según la búsqueda.
 */
function initSearch() {
    const searchInput = document.querySelector('#adminSearch');
    searchInput?.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase().trim();
        const rows = document.querySelectorAll('.table tbody tr');

        rows.forEach(row => {
            // No ocultar filas de "tabla vacía"
            if (row.cells.length === 1) return;
            
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    });
}