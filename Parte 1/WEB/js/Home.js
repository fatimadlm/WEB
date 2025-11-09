//  Datos simulados 
const currentUser = "@TuUsuario"; // Usuario actual
const currentUserAvatar = "../Imagenes/Avatar_TuUsuario.jpg"; // Imagen del usuario

//  Array de posts 
let posts = [
  { 
    username: "@Juan", 
    avatar: "../Imagenes/Avatar4.jpeg", 
    time: "Hace 2 horas", 
    content: "Hoy preparé una lasaña casera con salsa bechamel 🤤. ¡Aquí mi receta!", 
    img: "../Imagenes/Lasanna.png", 
    likes: 12, 
    liked: false, 
    comments: [{ username: "@CocineraAna", text: "¡Se ve deliciosa!" }] 
  },
  { 
    username: "@Ana", 
    avatar: "../Imagenes/Avatar1.jpg", 
    time: "Hace 5 horas", 
    content: "Pan casero con masa madre 😍 recién salido del horno.", 
    img: "../Imagenes/Pan.jpg", 
    likes: 42, 
    liked: false, 
    comments: [] 
  },
  { 
    username: "@Mario", 
    avatar: "../Imagenes/Avatar3.jpg", 
    time: "Hace 1 hora", 
    content: "Tacos al pastor 🌮, ¡los mejores de la ciudad!", 
    img: "../Imagenes/Tacos.jpg", 
    likes: 35, 
    liked: false, 
    comments: [{ username: "@Laura", text: "¡Quiero probarlos!" }] 
  },
  { 
    username: "@Laura", 
    avatar: "../Imagenes/Avatar5.jpeg", 
    time: "Hace 3 horas", 
    content: "Brownies de chocolate 🍫 con nueces, recién horneados.", 
    img: "../Imagenes/Brownie.jpg", 
    likes: 28, 
    liked: false, 
    comments: [] 
  },
  { 
    username: "@Caro", 
    avatar: "../Imagenes/Avatar6.jpeg", 
    time: "Hace 6 horas", 
    content: "Ensalada fresca de quinoa y aguacate 🥗, ideal para el verano.", 
    img: "../Imagenes/Ensalada.jpg", 
    likes: 18, 
    liked: false, 
    comments: [] 
  },
  { 
    username: "@TuUsuario", 
    avatar: "../Imagenes/Avatar1.jpg", 
    time: "Hace 1 día", 
    content: "Mi nueva receta: pasta carbonara cremosa", 
    img: "../Imagenes/carbonara.jpg", 
    likes: 12, 
    liked: false, 
    comments: [] 
  }
];


//Renderizar posts 
function renderPosts(postsArray) {
  const container = document.getElementById("postsContainer");
  if (!container) return; // Salir si no hay contenedor
  container.innerHTML = ""; // Limpiar contenedor

  postsArray.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const usernameClean = post.username.replace('@', ''); // Quitar @
const profilePage = `Perfiles/Perfil${usernameClean}.html`; 
    const likedClass = post.liked ? 'liked' : '';
    const likedText = '❤️ Me gusta';

    // HTML del post
    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="Usuario" class="user-img" />
        <div>
          <a href="${profilePage}" class="post-username-link">
            <h3>${post.username}</h3>
          </a>
          <span>${post.time}</span>
        </div>
      </div>

      <div class="post-content">
        <p>${post.content.replace(/\n/g, '<br>')}</p>
        ${post.img ? `<img src="${post.img}" alt="Imagen" class="post-img" />` : ""}
      </div>

      <div class="post-actions">
        <button class="like-btn ${likedClass}" data-index="${index}">
          ${likedText} (${post.likes})
        </button>
        <button class="comment-btn" data-index="${index}">💬 Comentar</button>
      </div>

      <div class="comments">
        ${post.comments.map(c => `<p><strong>${c.username}:</strong> ${c.text}</p>`).join("")}
      </div>
    `;
    container.appendChild(postDiv); // Agregar al contenedor
  });

  addEventListeners(); // Activar botones
}

// Botones de like y coment
function addEventListeners() {
  // Me gusta
  document.querySelectorAll(".like-btn[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      posts[index].liked = !posts[index].liked;
      posts[index].likes += posts[index].liked ? 1 : -1;
      renderPosts(posts);
    });
  });

  // Comentar
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const commentText = prompt("Escribe tu comentario:");
      if (commentText && commentText.trim() !== "") {
        posts[index].comments.push({ username: "@TuUsuario", text: commentText });
        renderPosts(posts);
      }
    });
  });
}

// Buscador 
function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = posts.filter(post =>
    post.username.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
  );
  renderPosts(filtered);
}

// Publicar desde feed 
let selectedImageFile = null;

function handleNewPost() {
  const contentInput = document.getElementById("newPostContent");
  const postContent = contentInput.value.trim();
  if (postContent === "" && !selectedImageFile) {
    alert("No puedes publicar vacío."); // Validar contenido
    return;
  }

  let imageUrl = selectedImageFile ? URL.createObjectURL(selectedImageFile) : null;

  const newPost = {
    username: currentUser,
    avatar: currentUserAvatar,
    time: "Ahora mismo",
    content: postContent.replace(/\n/g, '<br>'),
    img: imageUrl,
    likes: 0,
    liked: false,
    comments: []
  };

  posts.unshift(newPost); // Agregar al inicio
  renderPosts(posts); // Actualizar feed

  // Limpiar inputs
  contentInput.value = "";
  selectedImageFile = null;
  document.getElementById("imageUpload").value = '';
  document.getElementById("imagePreview").style.display = 'none';
}

//Subir imagen 
function setupImageUpload() {
  const addImgBtn = document.getElementById("addImgBtn");
  const imageUploadInput = document.getElementById("imageUpload");
  const imagePreview = document.getElementById("imagePreview");
  const removeImageBtn = document.getElementById("removeImageBtn");
  const imagePreviewContainer = document.getElementById("imagePreviewContainer");
  if (!addImgBtn) return;

  addImgBtn.addEventListener('click', () => imageUploadInput.click()); // Abrir selector

  imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        removeImageBtn.style.display = 'block';
        imagePreviewContainer.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    }
  });

  removeImageBtn.addEventListener('click', () => {
    selectedImageFile = null; // Quitar imagen
    imageUploadInput.value = '';
    imagePreview.style.display = 'none';
  });
}

// Inicializar página 
document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById("postsContainer");
  if (postsContainer) {
    document.getElementById("searchBtn").addEventListener("click", handleSearch); // Botón buscar
    document.getElementById("newPostBtn").addEventListener("click", handleNewPost); // Botón publicar
    setupImageUpload(); // Configurar subida de imagen
    renderPosts(posts); // Mostrar posts
  }
});
