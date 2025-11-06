// === Datos simulados ===
const currentUser = "@TuUsuario";
const currentUserAvatar = "../Imagenes/Avatar_TuUsuario.jpg"; // <--- CAMBIA ESTO por una imagen real

//ARRAY DE JSON DE POSTS 
let posts = [
  {
    username: "@Juan",
    avatar: "../Imagenes/Avatar1.jpg",
    time: "Hace 2 horas",
    content: "Hoy preparé una lasaña casera con salsa bechamel 🤤. ¡Aquí mi receta!",
    img: "../Imagenes/Lasanna.png",
    likes: 12,
    liked: false, // Controla si el usuario le ha dado like
    comments: [
      { username: "@CocineraAna", text: "¡Se ve deliciosa!" }
    ]
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
  }
];

// === FUNCIÓN PARA RENDERIZAR POSTS (MODIFICADA) ===
function renderPosts(postsArray) {
  const container = document.getElementById("postsContainer");
  if (!container) return; // Evita errores si no está en la página
  container.innerHTML = ""; 

  postsArray.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    
    const usernameParam = post.username.replace('@', '');
    
    // --- Lógica para el botón de Like ---
    const likedClass = post.liked ? 'liked' : '';
    const likedText = '❤️ Me gusta'; // MODIFICADO: El texto ya no cambia

    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="Usuario" class="user-img" />
        <div>
          <a href="MiPerfil.html?usuario=${usernameParam}" class="post-username-link">
            <h3>${post.username}</h3>
          </a>
          <span>${post.time}</span>
        </div>
      </div>

      <div class="post-content">
        <p>${post.content.replace(/\n/g, '<br>')}</p> 
        ${post.img ? `<img src="${post.img}" alt="Imagen de receta" class="post-img" />` : ""}
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
    container.appendChild(postDiv);
  });

  addEventListeners();
}

// === FUNCIÓN PARA AÑADIR EVENT LISTENERS (Likes y Comentarios) ===
function addEventListeners() {
  
  // Lógica de "Me Gusta" (Toggle)
  document.querySelectorAll(".like-btn[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      
      // Invierte el estado de "liked"
      posts[index].liked = !posts[index].liked;
      
      // Ajusta el contador
      if (posts[index].liked) {
        posts[index].likes++;
      } else {
        posts[index].likes--;
      }
      
      renderPosts(posts); // Re-renderiza para mostrar los cambios
    });
  });

  // Lógica de Comentar
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

// === Lógica del Buscador ===
function handleSearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = posts.filter(post => 
    post.username.toLowerCase().includes(query) ||
    post.content.toLowerCase().includes(query)
  );
  renderPosts(filtered);
}


// =============================================================
// --- LÓGICA PARA PUBLICADOR RÁPIDO (EN EL FEED) ---
// =============================================================
let selectedImageFile = null; 

function handleNewPost() {
  const contentInput = document.getElementById("newPostContent");
  const postContent = contentInput.value.trim(); 

  if (postContent === "" && !selectedImageFile) {
    alert("No puedes publicar una receta vacía.");
    return;
  }

  let imageUrl = null;
  if (selectedImageFile) {
      imageUrl = URL.createObjectURL(selectedImageFile);
  }

  const newPost = {
    username: currentUser,
    avatar: currentUserAvatar, 
    time: "Ahora mismo",
    content: postContent.replace(/\n/g, '<br>'), 
    img: imageUrl, 
    likes: 0,
    liked: false, // Añadido para consistencia
    comments: []
  };

  posts.unshift(newPost); 
  renderPosts(posts); 

  contentInput.value = "";
  selectedImageFile = null;
  document.getElementById("imageUpload").value = ''; 
  document.getElementById("imagePreview").style.display = 'none';
  document.getElementById("imagePreview").src = '#';
  document.getElementById("removeImageBtn").style.display = 'none';
  document.getElementById("imagePreviewContainer").style.display = 'none'; 
  document.getElementById("imagePreviewContainer").style.border = '1px dashed #d6b58e'; 
}

function setupImageUpload() {
    const addImgBtn = document.getElementById("addImgBtn");
    const imageUploadInput = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");
    const removeImageBtn = document.getElementById("removeImageBtn");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");

    addImgBtn.addEventListener('click', () => { imageUploadInput.click(); });

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
                imagePreviewContainer.style.border = 'none'; 
            };
            reader.readAsDataURL(file);
        } else {
            selectedImageFile = null;
            imagePreview.style.display = 'none';
            imagePreview.src = '#';
            removeImageBtn.style.display = 'none';
            imagePreviewContainer.style.display = 'none';
            imagePreviewContainer.style.border = '1px dashed #d6b58e';
        }
    });

    removeImageBtn.addEventListener('click', () => {
        selectedImageFile = null;
        imageUploadInput.value = ''; 
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        removeImageBtn.style.display = 'none';
        imagePreviewContainer.style.display = 'none';
        imagePreviewContainer.style.border = '1px dashed #d6b58e';
    });
}


// =============================================================
// --- LÓGICA PARA EL MODAL DE PUBLICACIÓN ---
// =============================================================
let modalSelectedImageFile = null;

function handleModalNewPost() {
  const contentInput = document.getElementById("modalNewPostContent");
  const postContent = contentInput.value.trim(); 

  if (postContent === "" && !modalSelectedImageFile) {
    alert("No puedes publicar una receta vacía.");
    return;
  }

  let imageUrl = null;
  if (modalSelectedImageFile) {
      imageUrl = URL.createObjectURL(modalSelectedImageFile);
  }

  const newPost = {
    username: currentUser,
    avatar: currentUserAvatar, 
    time: "Ahora mismo",
    content: postContent.replace(/\n/g, '<br>'), 
    img: imageUrl, 
    likes: 0,
    liked: false, // Añadido para consistencia
    comments: []
  };

  posts.unshift(newPost); 
  renderPosts(posts); 

  // Limpiar y cerrar el modal
  contentInput.value = "";
  modalSelectedImageFile = null;
  document.getElementById("modalImageUpload").value = ''; 
  document.getElementById("modalImagePreview").style.display = 'none';
  document.getElementById("modalImagePreview").src = '#';
  document.getElementById("modalRemoveImageBtn").style.display = 'none';
  document.getElementById("modalImagePreviewContainer").style.display = 'none'; 
  document.getElementById("modalImagePreviewContainer").style.border = '1px dashed #d6b58e';
  
  document.getElementById("postModal").style.display = 'none'; // Cierra el modal
  
  alert("Tu receta ha sido publicada 🍲");
}

function setupModalImageUpload() {
    const addImgBtn = document.getElementById("modalAddImgBtn");
    const imageUploadInput = document.getElementById("modalImageUpload");
    const imagePreview = document.getElementById("modalImagePreview");
    const removeImageBtn = document.getElementById("modalRemoveImageBtn");
    const imagePreviewContainer = document.getElementById("modalImagePreviewContainer");

    addImgBtn.addEventListener('click', () => { imageUploadInput.click(); });

    imageUploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            modalSelectedImageFile = file; 
            const reader = new FileReader();
            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
                removeImageBtn.style.display = 'block';
                imagePreviewContainer.style.display = 'flex'; 
                imagePreviewContainer.style.border = 'none'; 
            };
            reader.readAsDataURL(file);
        } else {
            modalSelectedImageFile = null;
            imagePreview.style.display = 'none';
            imagePreview.src = '#';
            removeImageBtn.style.display = 'none';
            imagePreviewContainer.style.display = 'none';
            imagePreviewContainer.style.border = '1px dashed #d6b58e';
        }
    });

    removeImageBtn.addEventListener('click', () => {
        modalSelectedImageFile = null;
        imageUploadInput.value = ''; 
        imagePreview.style.display = 'none';
        imagePreview.src = '#';
        removeImageBtn.style.display = 'none';
        imagePreviewContainer.style.display = 'none';
        imagePreviewContainer.style.border = '1px dashed #d6b58e';
    });
}


// === INICIALIZAR PÁGINA ===
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica del Publicador Rápido (Feed) ---
    const searchBtn = document.getElementById("searchBtn");
    const newPostBtn = document.getElementById("newPostBtn");
    
    if(searchBtn) searchBtn.addEventListener("click", handleSearch);
    if(newPostBtn) newPostBtn.addEventListener("click", handleNewPost);
    
    // Solo ejecutar setupImageUpload si estamos en una página que lo tiene
    if (document.getElementById("addImgBtn")) {
        setupImageUpload();
    } 

    // --- Renderizado inicial ---
    renderPosts(posts);

    // --- Lógica del Modal ---
    const openModalBtn = document.getElementById("openModalBtn");
    const postModal = document.getElementById("postModal");
    const closeModalBtn = document.querySelector(".modal-close");
    const modalNewPostBtn = document.getElementById("modalNewPostBtn");

    // Solo ejecutar si los elementos del modal existen en esta página
    if (openModalBtn && postModal && closeModalBtn && modalNewPostBtn) {
        openModalBtn.addEventListener('click', () => { postModal.style.display = 'flex'; });
        closeModalBtn.addEventListener('click', () => { postModal.style.display = 'none'; });
        postModal.addEventListener('click', (e) => {
          if (e.target === postModal) { postModal.style.display = 'none'; }
        });
        window.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && postModal.style.display === 'flex') {
            postModal.style.display = 'none';
          }
        });

        // Conectar lógica al modal
        setupModalImageUpload();
        modalNewPostBtn.addEventListener("click", handleModalNewPost);
    }
});