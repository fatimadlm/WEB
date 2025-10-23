// Seleccionamos el formulario de login
const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Evitamos que la página se recargue

  // Obtenemos los valores de los inputs
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  // Obtenemos los usuarios registrados desde localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Buscamos un usuario que coincida con el username y la contraseña
  const user = users.find(user => user.username === username && user.password === password);

  if (user) {
    alert(`Bienvenido, ${user.nombre}!`);
    // Guardamos el usuario actual en localStorage para usarlo en otras páginas
    localStorage.setItem('currentUser', JSON.stringify(user));

    // Redirigimos a la página principal de la red social
    window.location.href = 'home.html'; // Asegúrate de crear home.html
  } else {
    alert('Usuario o contraseña incorrectos');
  }
});
