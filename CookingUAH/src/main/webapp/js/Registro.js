// Importamos los métodos necesariode BBDD.js
import { getUsers, saveUsers, uid } from './BBDD.js'

// Seleccionamos el formulario de registro
const registerForm = document.getElementById('registerForm')

// Listener del botón "Registrarse" con id 'submit'
registerForm.addEventListener('submit', function(e) {
  e.preventDefault()
  // Obtenemos los valores cada campo del formulario
  const nombre = document.getElementById('nombre').value.trim()
  const username = document.getElementById('username').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirmPassword').value

  // Comprobamos que las contraseñas sean iguales
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  // Obtenemos los usuarios actuales
  const users = getUsers()

  // Verificamos que el username o email no existan
  const userExists = users.some(user => user.username === username || user.email === email)
  if (userExists) {
    alert('El usuario o correo ya estan registrados')
    return
  }

  // Creamos el objeto del nuevo usuario
  const newUser = {
    id: uid('u_'),
    nombre,
    username,
    email,
    password,
    role: 'user',
    active: true,
    avatar: '../Imagenes/AvatarPorDefecto.webp'
  }

  // Agregamos el nuevo usuario al array
  users.push(newUser)

  // Guardamos los usuarios en la base de datos
  saveUsers(users)

  // Notificamos y redirigimos al login
  alert('Usuario registrado correctamente')
  registerForm.reset()
  window.location.href = 'IniciarSesion.html'
})
