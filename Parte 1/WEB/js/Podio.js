import { getPosts, getUsers, seedDemo } from './BBDD.js'

document.addEventListener('DOMContentLoaded', () => {

  // si no hay usuarios o posts se cargan datos de prueba
  if (!(getUsers() && getUsers().length) || !(getPosts() && getPosts().length)) {
    seedDemo()
    console.log('Datos demo cargados desde Podio.js')
  }

  // obtener todos los posts y usuarios
  const posts = getPosts()
  const users = getUsers()

  // ordenar posts por likes y tomar los tres primeros
  let topPosts = posts.sort((a, b) => b.likes - a.likes).slice(0, 3)

  // obtener contenedor del podio
  const podio = document.getElementById('podio')
  
  // clases y colores para cada posicion del podio
  const clasesPodio = ["first", "second", "third"]
  const coloresPodio = ["#ffd700", "#c0c0c0", "#cd7f32"]

  // recorrer los top posts y agregarlos al podio
  topPosts.forEach((post, index) => {
    const author = users.find(u => u.id === post.authorId) || { username: 'Desconocido', avatar: '../Imagenes/avatarDefault.png' }

    const div = document.createElement('div')
    div.classList.add('podio-post', clasesPodio[index])
    div.style.backgroundColor = "#fff8f0"
    div.style.borderTop = `15px solid ${coloresPodio[index]}`

    // contenido del post
    div.innerHTML = `
      <div class="post-header">
        <img src="${author.avatar}" alt="${author.username}" class="avatar">
        <div>
          <strong>@${author.username}</strong><br>
          <small>${new Date(post.createdAt).toLocaleString()}</small>
        </div>
      </div>
      <p>${post.title}</p>
      <img src="${post.img}" alt="Post Image" class="post-img">
      <div class="likes"> ${post.likes} Likes</div>
    `
    podio.appendChild(div)
  })

})
