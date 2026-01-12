
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
  
        // Cerrar Modal directamente
        try {
          // Método 1: limpiar hash (desactiva :target)
          parent.location.hash = '';
          // Método 2 (fallback): forzar URL sin hash sin recargar
          if (parent.history && parent.history.replaceState) {
            parent.history.replaceState(null, document.title, parent.location.pathname + parent.location.search);
          }
        } catch (_) {}
  
        // resetea el formulario tras guardar
        // form.reset();
      }, 300);
    });
  })();
   document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('editProfile');
      const status = document.getElementById('status');
      const avatarInput = document.getElementById('avatar');
      const avatarPreview = document.getElementById('avatarPreview');
      const avatarContainer = document.querySelector('.avatar'); // Para ocultar el dash al mostrar img

      // --- 1. Previsualización de imagen ---
      avatarInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            avatarPreview.src = e.target.result;
            avatarPreview.style.display = 'block'; // Muestra la imagen
            avatarContainer.style.border = 'none'; // Quita el borde dash al poner imagen
            avatarContainer.style.backgroundColor = 'transparent'; // Fondo transparente
            avatarContainer.style.color = 'transparent'; // Oculta el icono de cámara base
          };
          reader.readAsDataURL(file);
        } else {
          avatarPreview.src = '#';
          avatarPreview.style.display = 'none';
          avatarContainer.style.border = '3px dashed #ffb74d'; // Restaura el borde
          avatarContainer.style.backgroundColor = '#ffe0b2'; // Restaura el fondo
          avatarContainer.style.color = '#e69b2e'; // Restaura el icono de cámara base
        }
      });

      // --- 2. Cierre del modal al guardar ---
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.textContent = 'Guardando…';
        
        // Simula el guardado y luego cierra el modal
        setTimeout(function () {
          status.textContent = '¡Cambios guardados!';
          // Envía un mensaje al padre (MiPerfil.html) para que cierre el modal
          try {
            parent.postMessage({ type: 'perfil:saved' }, '*');
            // Cierra el modal después de un breve retraso para que el usuario vea el mensaje
            setTimeout(() => {
              // Encuentra el enlace para cerrar el modal y simula un clic
              const closeLink = parent.document.querySelector('.modal__close');
              if (closeLink) {
                closeLink.click();
              }
            }, 500); // Cierra 0.5 segundos después de mostrar "Guardado"
          } catch (err) {
            console.error("No se pudo comunicar con el padre para cerrar el modal:", err);
            // Si hay un error, al menos podemos intentar cerrar de otra manera si el padre lo permite
            // O simplemente no cerrar si no hay padre (ej. si se abre la página directamente)
          }
        }, 1000); // Simula 1 segundo de guardado
      });
    });
  