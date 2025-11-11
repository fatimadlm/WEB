(function () {
  const modal = document.getElementById('editar');
  if (!modal) return;

  const iframe = modal.querySelector('.modal__iframe');

  function closeModal() {
    // quita #editar sin recargar la página
    if (location.hash === '#editar') {
      history.replaceState(null, document.title, location.pathname + location.search);
    }
    // (opcional) resetear iframe para limpiar el formulario al cerrar:
    // if (iframe) iframe.src = iframe.src;
  }

  // Cerrar con tecla ESC
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && location.hash === '#editar') {
      e.preventDefault();
      closeModal();
    }
  });

  // Escuchar el mensaje del iframe cuando se guarda
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'perfil:saved') {
      // aquí podrías refrescar datos visibles si tuvieras backend
      closeModal();
      // (opcional) mostrar un toast rápido:
      // alert('Perfil guardado');
    }
  });
})();
