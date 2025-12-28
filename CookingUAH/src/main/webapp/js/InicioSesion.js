import { getUsers, seedDemo, saveCurrentUser } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Carga inicial de datos si es la primera vez que se abre la web
    const users = getUsers();
    if (!users || users.length === 0) { 
        seedDemo();
        console.log('Datos demo generados en IniciarSesion.');
    }

    // 2. Referencias al DOM
    const loginForm = document.getElementById('loginForm');
    const errorDiv = document.createElement('div');
    errorDiv.style.color = 'red';
    errorDiv.style.marginTop = '10px';
    errorDiv.style.fontWeight = 'bold';
    if(loginForm) loginForm.appendChild(errorDiv);

    // 3. Lógica del Login
    if(loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Evita la recarga estándar

            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            // Obtener usuarios actualizados
            const currentUsers = getUsers();
            
            // Buscar coincidencia
            const user = currentUsers.find(u => u.username === usernameInput);

            // Validaciones
            if (!user) {
                errorDiv.textContent = 'El usuario no existe.';
                return;
            }

            if (user.password !== passwordInput) {
                errorDiv.textContent = 'Contraseña incorrecta.';
                return;
            }

            if (user.active === false) {
                errorDiv.textContent = 'Tu cuenta está desactivada. Contacta con el admin.';
                return;
            }

            // --- ÉXITO ---
            // 1. Guardamos al usuario en la sesión (localStorage)
            saveCurrentUser(user);

            // 2. Redirigimos según el rol
            if (user.role === 'admin') {
                window.location.href = 'Admin.html';
            } else {
                window.location.href = 'Home.html';
            }
        });
    }
});