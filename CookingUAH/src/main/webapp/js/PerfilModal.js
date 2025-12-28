(function () {
  // Obtener el modal con id editar
  const modal = document.getElementById('editar');
  if (!modal) return;

  // Obtener el iframe dentro del modal
  const iframe = modal.querySelector('.modal__iframe');

  // Funcion para cerrar el modal quitando el hash de la URL
  function closeModal() {
    if (location.hash === '#editar') {
      history.replaceState(null, document.title, location.pathname + location.search);
    }
  }

  // Escuchar la tecla Escape para cerrar el modal
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && location.hash === '#editar') {
      e.preventDefault();
      closeModal();
    }
  });

  // Escuchar mensajes del iframe para cerrar el modal cuando se guarda el perfil
  window.addEventListener('message', function (e) {
    if (e && e.data && e.data.type === 'perfil:saved') {
      closeModal();
    }
  });
})();
