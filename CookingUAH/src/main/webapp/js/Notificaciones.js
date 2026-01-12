function eliminarNotif(id) {
    // Usamos contextPath en lugar de la expresión ${...}
    fetch(contextPath + '/MarcarLeidasServlet?id=' + id, {
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            const element = document.getElementById('notif-' + id);
            if (element) {
                element.style.transition = 'all 0.3s ease';
                element.style.opacity = '0';
                element.style.transform = 'translateX(20px)';
                setTimeout(() => {
                    element.remove();
                    // Opcional: Si la lista queda vacía, mostrar mensaje
                    const list = document.getElementById('notif-list');
                    if (list && list.children.length === 0) {
                        list.innerHTML = '<div style="text-align: center; padding: 50px; color: #888;"><p>No tienes notificaciones por el momento.</p></div>';
                    }
                }, 300);
            }
        }
    });
}

function marcarTodas() {
    fetch(contextPath + '/MarcarLeidasServlet', {
        method: 'POST'
    }).then(response => {
        if (response.ok) {
            location.reload();
        }
    });
}