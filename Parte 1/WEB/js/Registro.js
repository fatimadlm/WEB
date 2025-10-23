// Seleccionamos el formulario de registro
const registerForm = document.getElementById('registerForm');

// Escuchamos el evento submit del formulario
registerForm.addEventListener('submit', function (e) {
  e.preventDefault(); // Evitamos que el formulario recargue la página

  // Obtenemos los valores de los inputs
  const nombre = document.getElementById('nombre').value.trim();
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  // Validamos que las contraseñas coincidan
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  // Obtenemos los usuarios guardados en localStorage
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Verificamos si el username o email ya existen
  const userExists = users.some(user => user.username === username || user.email === email);
  if (userExists) {
    alert('El usuario o correo ya están registrados');
    return;
  }

  // Creamos un nuevo objeto de usuario
  const newUser = {
    nombre,
    username,
    email,
    password // Nota: en producción, nunca se guarda la contraseña en texto plano
  };

  // Guardamos el nuevo usuario en el arreglo y lo almacenamos
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  alert('Usuario registrado correctamente');
  registerForm.reset(); // Limpiamos el formulario
  window.location.href = 'IniciarSesion.html'; // Redirigimos al login
});
