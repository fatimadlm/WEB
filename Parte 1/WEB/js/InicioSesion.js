// 1. Importar funciones necesarias desde el archivo BBDD.js
// Estas funciones permiten obtener usuarios, crear datos de prueba y guardar el usuario actual
import { getUsers, seedDemo, saveCurrentUser } from './BBDD.js';

// 2. Comprobar si existen datos iniciales y cargarlos si es necesario
(function initData() {
  const users = getUsers(); // Obtener lista de usuarios guardados

  // Si no hay usuarios guardados, crear datos de ejemplo
  if (!users || users.length === 0) { 
    seedDemo(); // Generar datos de prueba en el almacenamiento local
    console.log('Datos demo cargados.');
  }
})();

// 3. Obtener el formulario de inicio de sesión desde el documento HTML
const loginForm = document.getElementById('loginForm');

// Crear un contenedor para mostrar mensajes de error debajo del formulario
const errorDiv = document.createElement('div');
errorDiv.style.color = 'red';
errorDiv.style.marginTop = '10px';
loginForm.appendChild(errorDiv); // Agregar el contenedor al formulario

// 4. Detectar cuando el usuario envía el formulario
loginForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Evitar que se recargue la página

  // Leer los valores introducidos por el usuario
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Obtener la lista actual de usuarios desde la base de datos
  const users = getUsers();
  // Buscar un usuario que coincida con el nombre ingresado
  const user = users.find(u => u.username === username);

  // Si el usuario no existe, mostrar mensaje de error
  if (!user) {
    errorDiv.textContent = 'No se encuentra este usuario';
    return;
  }

  // Si la contraseña no coincide, mostrar mensaje de error
  if (user.password !== password) {
    errorDiv.textContent = 'Contraseña incorrecta';
    return;
  }

  // Si el usuario está bloqueado, impedir el acceso
  if (user.active === false) {
    errorDiv.textContent = 'Este usuario está bloqueado.';
    return;
  }

  // Si todo está correcto, guardar el usuario actual como logueado
  saveCurrentUser(user);

  // Redirigir al usuario según su rol
  // Si es administrador, va a la página de administración
  // Si es usuario normal, va a la página principal
  if (user.role === 'admin') {
    window.location.href = 'Admin.html';
  } else {
    window.location.href = 'Home.html';
  }
});
