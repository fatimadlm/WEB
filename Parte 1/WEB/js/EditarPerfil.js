(function () {
    const form = document.getElementById('editProfile');
    const status = document.getElementById('status');
  
    if (!form) return;
  
    form.addEventListener('submit', function (e) {
      e.preventDefault(); // evita “pantalla en blanco” dentro del iframe
  
      status && (status.textContent = 'Guardando…');
  
      // Simula guardado; cambia este timeout por tu fetch() cuando tengas backend
      setTimeout(function () {
        status && (status.textContent = '¡Cambios guardados!');
  
        // --- CERRAR MODAL DIRECTAMENTE DESDE EL IFRAME ---
        try {
          // Método 1: limpiar hash (desactiva :target)
          parent.location.hash = '';
          // Método 2 (fallback): forzar URL sin hash sin recargar
          if (parent.history && parent.history.replaceState) {
            parent.history.replaceState(null, document.title, parent.location.pathname + parent.location.search);
          }
        } catch (_) {}
  
        // (opcional) resetea el formulario tras guardar
        // form.reset();
      }, 300);
    });
  })();
  