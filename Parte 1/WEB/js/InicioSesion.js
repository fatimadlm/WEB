// Seleccionamos el formulario y el contenedor de mensajes
const loginForm = document.getElementById('loginForm');

// Creamos un div para mostrar errores dentro del formulario
const errorDiv = document.createElement('div');
errorDiv.style.color = 'red';
errorDiv.style.marginTop = '10px';
loginForm.appendChild(errorDiv);



//Usuarios de prueba
if (!localStorage.getItem('users')) {
  const testUsers = [
    { username: 'usuario1', password: '1234' },
    { username: 'usuario2', password: '1234' },
    { username: 'usuario3', password: '1234' }
  ];
  localStorage.setItem('users', JSON.stringify(testUsers));
}


// Escuchamos el submit del formulario
loginForm.addEventListener('submit', function(e) {
  e.preventDefault(); // Evitamos recargar la página

  // Obtenemos los valores de los inputs y hacemos trim
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Obtenemos los usuarios registrados desde localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Buscamos un usuario que coincida con el username
  const user = users.find(user => user.username === username);

  if (!user) {
    // Usuario no existe
    errorDiv.textContent = 'No se encuentra este usuario';
  } else if (user.password !== password) {
    // Contraseña incorrecta
    errorDiv.textContent = 'Contraseña incorrecta';
  } else {
    // Login exitoso
    localStorage.setItem('currentUser', JSON.stringify(user)); // Guardamos usuario actual
    window.location.href = 'home.html'; // Redirigimos a la página principal
  }
});
