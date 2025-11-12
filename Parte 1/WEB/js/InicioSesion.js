// 1. Importar funciones de BBDD.js
// (Esto solo funciona si se carga desde un servidor, ej: Live Server)
import { getUsers, seedDemo, saveCurrentUser } from './BBDD.js';

// 2. Cargar datos de prueba si no existen
(function initData() {
  const users = getUsers(); //
  // Esta es la comprobación que mencionaste. ¡Ya está aquí!
  if (!users || users.length === 0) { 
    seedDemo(); //
    console.log('Datos demo cargados.');
  }
})();

// 3. Configurar el formulario de login
const loginForm = document.getElementById('loginForm');

// Crear un espacio para mostrar errores
const errorDiv = document.createElement('div');
errorDiv.style.color = 'red';
errorDiv.style.marginTop = '10px';
loginForm.appendChild(errorDiv);

// 4. Manejar el envío del formulario
loginForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar que la página se recargue

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Buscar al usuario en la BBDD
  const users = getUsers(); //
  const user = users.find(u => u.username === username);

  // --- Comprobaciones ---
  if (!user) {
    errorDiv.textContent = 'No se encuentra este usuario';
    return;
  }
  if (user.password !== password) {
    errorDiv.textContent = 'Contraseña incorrecta';
    return;
  }
  if (user.active === false) { //
    errorDiv.textContent = 'Este usuario está bloqueado.';
    return;
  }

  // --- Login Correcto ---
  saveCurrentUser(user); //

  // Redirigir según el rol del usuario
  if (user.role === 'admin') { //
    window.location.href = 'Admin.html';
  } else {
    window.location.href = 'Home.html';
  }
});