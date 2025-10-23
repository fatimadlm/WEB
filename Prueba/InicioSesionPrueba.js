const loginForm = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');

// Para pruebas: un usuario de ejemplo
if (!localStorage.getItem('users')) {
  const exampleUser = [{ username: 'admin', password: '1234' }];
  localStorage.setItem('users', JSON.stringify(exampleUser));
}

loginForm.addEventListener('submit', function(e){
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const user = users.find(u => u.username === username);

  if(!user) {
    errorDiv.textContent = 'No se encuentra este usuario';
  } else if(user.password !== password) {
    errorDiv.textContent = 'Contraseña incorrecta';
  } else {
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = 'home.html';
  }
});
