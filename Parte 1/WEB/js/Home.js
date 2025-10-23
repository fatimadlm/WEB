// === Datos simulados ===
const currentUser = "@TuUsuario";



//ARRAY DE JSON DE POSTS 
let posts = [
  {
    username: "@ChefJuan",
    avatar: "../Imagenes/Avatar1.jpg",
    time: "Hace 2 horas",
    content: "Hoy preparé una lasaña casera con salsa bechamel 🤤. ¡Aquí mi receta!",
    img: "../Imagenes/Lasanna.png",
    likes: 0,
    comments: [
      { username: "@CocineraAna", text: "¡Se ve deliciosa!" }
    ]
  },
  {
    username: "@SaborNatural",
    avatar: "../Imagenes/Avatar3.jpg",
    time: "Hace 5 horas",
    content: "Pan casero con masa madre 😍 recién salido del horno.",
    img: "../Imagenes/Pan.jpg",
    likes: 0,
    comments: []
  }
];

//POST
function renderPosts(postsArray) {
  const container = document.getElementById("postsContainer");
  container.innerHTML = ""; // Limpiar contenedor

  postsArray.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="Usuario" class="user-img" />
        <div>
          <h3>${post.username}</h3>
          <span>${post.time}</span>
        </div>
      </div>

      <div class="post-content">
        <p>${post.content}</p>
        ${post.img ? `<img src="${post.img}" alt="Imagen de receta" class="post-img" />` : ""}
      </div>

      <div class="post-actions">
        <button class="like-btn" data-index="${index}">❤️ Me gusta (${post.likes})</button>
        <button class="comment-btn" data-index="${index}">💬 Comentar</button>
      </div>

      <div class="comments">
        ${post.comments.map(c => `<p><strong>${c.username}:</strong> ${c.text}</p>`).join("")}
      </div>
    `;
    container.appendChild(postDiv);
  });

  addEventListeners();
}
//Boton del like
function addEventListeners() {
  // Me gusta
  document.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      posts[index].likes++;
      renderPosts(posts);
    });
  });

  // Comentar
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const commentText = prompt("Escribe tu comentario:");
      if(commentText) {
        posts[index].comments.push({ username: currentUser, text: commentText });
        renderPosts(posts);
      }
    });
  });
}

// === Buscador ===
document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = posts.filter(post => 
    post.username.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );
  renderPosts(filtered);
});

// === Inicializar página ===
renderPosts(posts);
