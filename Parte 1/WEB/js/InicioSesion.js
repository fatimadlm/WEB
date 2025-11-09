// === InicioSesion.js ===

// Seleccionamos el formulario
const loginForm = document.getElementById('loginForm');

// Contenedor de errores (debajo del formulario)
const errorDiv = document.createElement('div');
errorDiv.style.color = 'red';
errorDiv.style.marginTop = '10px';
loginForm.appendChild(errorDiv);

// --- Semilla de usuarios de prueba (si no existían) ---
if (!localStorage.getItem('users')) {
  const testUsers = [
    { username: 'usuario1', password: '1234', role: 'user', active: true },
    { username: 'usuario2', password: '1234', role: 'user', active: true },
    { username: 'usuario3', password: '1234', role: 'user', active: true },
    { username:'Juan', password:'1234', role:'user', active:true },
      { username:'Ana',  password:'1234', role:'user', active:true },
       { username: 'Caro', password: '1234', role: 'user', active: true },
    { username: 'Mario', password: '1234', role: 'user', active: true },
    { username: 'Laura', password: '1234', role: 'user', active: true }
  ];
  localStorage.setItem('users', JSON.stringify(testUsers));
}

// --- ADMIN fijo: crea o corrige siempre el usuario admin ---
(function ensureAdmin() {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const i = users.findIndex(u => (u.username || '').toLowerCase() === 'admin');

  const adminData = {
    username: 'admin',
    password: 'admin',   // clave de prueba
    role: 'admin',
    active: true
  };

  if (i === -1) {
    users.push(adminData);
  } else {
    users[i] = { ...users[i], ...adminData };
  }

  localStorage.setItem('users', JSON.stringify(users));
})();

// --- Manejar envío del formulario ---
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => u.username === username);

  if (!user) {
    errorDiv.textContent = 'No se encuentra este usuario';
    return;
  }
  if (user.password !== password) {
    errorDiv.textContent = 'Contraseña incorrecta';
    return;
  }
  if (user.active === false) {
    errorDiv.textContent = 'Este usuario está bloqueado.';
    return;
  }

  // Login OK
  localStorage.setItem('currentUser', JSON.stringify(user));

  // Redirige según rol
  if (user.role === 'admin') {
    window.location.href = 'Admin.html';
  } else {
    window.location.href = 'Home.html';
  }
});
