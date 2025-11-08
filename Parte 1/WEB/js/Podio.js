// Array de posts
let posts = [
  {
    username: "@Juan",
    avatar: "../Imagenes/Avatar1.jpg",
    time: "Hace 2 horas",
    content: "Hoy preparé una lasaña casera con salsa bechamel 🤤. ¡Aquí mi receta!",
    img: "../Imagenes/Lasanna.png",
    likes: 12,
    liked: false,
    comments: [{ username: "@CocineraAna", text: "¡Se ve deliciosa!" }]
  },
  {
    username: "@Ana",
    avatar: "../Imagenes/Avatar3.jpg",
    time: "Hace 5 horas",
    content: "Pan casero con masa madre 😍 recién salido del horno.",
    img: "../Imagenes/Pan.jpg",
    likes: 42,
    liked: false,
    comments: []
  },
  {
    username: "@Mario",
    avatar: "../Imagenes/Avatar2.jpg",
    time: "Hace 1 hora",
    content: "Tacos al pastor 🌮, ¡los mejores de la ciudad!",
    img: "../Imagenes/Tacos.jpg",
    likes: 35,
    liked: false,
    comments: [{ username: "@Laura", text: "¡Quiero probarlos!" }]
  },
  {
    username: "@Laura",
    avatar: "../Imagenes/Avatar4.jpg",
    time: "Hace 3 horas",
    content: "Brownies de chocolate 🍫 con nueces, recién horneados.",
    img: "../Imagenes/Brownies.jpg",
    likes: 28,
    liked: false,
    comments: []
  },
  {
    username: "@Caro",
    avatar: "../Imagenes/Avatar5.jpg",
    time: "Hace 6 horas",
    content: "Ensalada fresca de quinoa y aguacate 🥗, ideal para el verano.",
    img: "../Imagenes/Ensalada.jpg",
    likes: 18,
    liked: false,
    comments: []
  }
];

// Ordenar posts por likes descendente y obtener top 3
let topPosts = posts.sort((a,b) => b.likes - a.likes).slice(0,3);

const podio = document.getElementById('podio');
const clasesPodio = ["second","first","third"]; // Izquierda-Centro-Derecha
const coloresPodio = ["#c0c0c0", "#ffd700", "#cd7f32"]; // Plata, Oro, Bronce

topPosts.forEach((post, index) => {
  const div = document.createElement('div');
  div.classList.add('podio-post', clasesPodio[index]);

  // Fondo tipo plataforma
  div.style.backgroundColor = "#fff8f0";
  div.style.borderTop = `15px solid ${coloresPodio[index]}`;

  div.innerHTML = `
    <div class="post-header">
      <img src="${post.avatar}" alt="${post.username}" class="avatar">
      <div>
        <strong>${post.username}</strong><br>
        <small>${post.time}</small>
      </div>
    </div>
    <p>${post.content}</p>
    <img src="${post.img}" alt="Post Image" class="post-img">
    <div class="likes">❤️ ${post.likes} Likes</div>
  `;
  podio.appendChild(div);
});
