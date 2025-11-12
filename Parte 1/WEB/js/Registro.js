import { getUsers, saveUsers, uid } from './BBDD.js'

// seleccionamos el formulario de registro
const registerForm = document.getElementById('registerForm')

// escuchamos el envio del formulario
registerForm.addEventListener('submit', function(e) {
  e.preventDefault()

  // obtenemos los valores de los campos
  const nombre = document.getElementById('nombre').value.trim()
  const username = document.getElementById('username').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirmPassword').value

  // comprobamos que las contraseñas sean iguales
  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden')
    return
  }

  // obtenemos los usuarios actuales
  const users = getUsers()

  // verificamos que el username o email no existan
  const userExists = users.some(user => user.username === username || user.email === email)
  if (userExists) {
    alert('El usuario o correo ya estan registrados')
    return
  }

  // creamos el objeto del nuevo usuario
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

  // agregamos el nuevo usuario al array
  users.push(newUser)

  // guardamos los usuarios en la base de datos
  saveUsers(users)

  // notificamos y redirigimos al login
  alert('Usuario registrado correctamente')
  registerForm.reset()
  window.location.href = 'IniciarSesion.html'
})
