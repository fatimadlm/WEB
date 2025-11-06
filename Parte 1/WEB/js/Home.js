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

// === FUNCIÓN PARA RENDERIZAR POSTS (Para Home.html) ===
function renderPosts(postsArray) {
  const container = document.getElementById("postsContainer");
  if (!container) return; // Si no hay contenedor, no hacer nada
  container.innerHTML = ""; 

  postsArray.forEach((post, index) => {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");
    
    const usernameParam = post.username.replace('@', '');
    const likedClass = post.liked ? 'liked' : '';
    const likedText = '❤️ Me gusta'; // El texto ya no cambia

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

// === FUNCIÓN PARA AÑADIR EVENT LISTENERS (Para Home.html) ===
function addEventListeners() {
  
  // Lógica de "Me Gusta"
  document.querySelectorAll(".like-btn[data-index]").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      posts[index].liked = !posts[index].liked;
      if (posts[index].liked) {
        posts[index].likes++;
      } else {
        posts[index].likes--;
      }
      renderPosts(posts);
    });
  });

  // Lógica de Comentar
  document.querySelectorAll(".comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = btn.dataset.index;
      const commentText = prompt("Escribe tu comentario:");
      
      if (commentText && commentText.trim() !== "") {
        posts[index].comments.push({ username: "@TuUsuario", text: commentText });
        renderPosts(posts); 
        
        setTimeout(() => {
            const postElement = document.querySelectorAll('.post')[index];
            if (postElement) {
                const commentsContainer = postElement.querySelector('.comments');
                if (commentsContainer) {
                    commentsContainer.scrollTop = commentsContainer.scrollHeight;
                }
            }
        }, 0); 
      }
    });
  });
}

// === Lógica del Buscador (Para Home.html) ===
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
    liked: false, 
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

    // Guard para esta función
    if (!addImgBtn) return;

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
// --- LÓGICA PARA EL MODAL DE PUBLICACIÓN (ESTO FALTABA) ---
// =============================================================
let modalSelectedImageFile = null;

// AÑADIDA: Función para crear un post en MiPerfil.html
function createMyPostElement(post) {
    const postDiv = document.createElement("div");
    postDiv.classList.add("post");

    const now = new Date();
    const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    // Construye el HTML del nuevo post (idéntico al de MiPerfil.html)
    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${post.avatar}" alt="Usuario" class="user-img" />
        <div>
          <h4>${post.username}</h4>
          <span>${timeString}</span> 
        </div>
      </div>
      <div class="post-content">
        <p>${post.content.replace(/\n/g, '<br>')}</p>
        ${post.img ? `<img src="${post.img}" alt="Imagen de receta" class="post-img" />` : ""}
      </div>
      <div class="post-actions">
        <button class="like-btn" data-likes-start="0">
          <span class="like-text">❤️ Me gusta</span> (<span class="like-count">0</span>)
        </button>
        <button class="comment-btn">💬 Comentar</button>
      </div>
      <div class="comments"></div>
    `;

    // Añade los listeners para Like y Comentar (copiados de MiPerfil.html)
    const likeBtn = postDiv.querySelector(".like-btn");
    let isLiked = false;
    let count = 0;
    likeBtn.addEventListener("click", () => {
        isLiked = !isLiked;
        if (isLiked) { count++; likeBtn.classList.add("liked"); }
        else { count--; likeBtn.classList.remove("liked"); }
        likeBtn.querySelector('.like-count').textContent = count;
    });

    const commentBtn = postDiv.querySelector(".comment-btn");
    commentBtn.addEventListener("click", () => {
        const commentText = prompt("Escribe tu comentario:");
        if (commentText && commentText.trim() !== "") {
            const commentsContainer = postDiv.querySelector('.comments');
            const newComment = document.createElement('p');
            newComment.innerHTML = `<strong>@TuUsuario:</strong> ${commentText}`; 
            commentsContainer.appendChild(newComment);
            commentsContainer.scrollTop = commentsContainer.scrollHeight;
        }
    });

    return postDiv;
}


// AÑADIDA: Función que maneja el envío del modal
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
    liked: false, 
    comments: []
  };

  // --- ¡AQUÍ ESTÁ LA MAGIA! ---
  const homePostsContainer = document.getElementById("postsContainer");
  const perfilPostsContainer = document.querySelector(".perfil-posts");

  if (homePostsContainer) {
      // Estamos en Home.html
      posts.unshift(newPost); 
      renderPosts(posts); 
  } else if (perfilPostsContainer) {
      // Estamos en MiPerfil.html
      const newPostElement = createMyPostElement(newPost);
      // Inserta el nuevo post después del <h3>"Mis publicaciones"
      perfilPostsContainer.insertBefore(newPostElement, perfilPostsContainer.children[1]);
  }
  // --- FIN DE LA MAGIA ---


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
}

// AÑADIDA: Función que configura la subida de imagen del modal
function setupModalImageUpload() {
    const addImgBtn = document.getElementById("modalAddImgBtn");
    const imageUploadInput = document.getElementById("modalImageUpload");
    const imagePreview = document.getElementById("modalImagePreview");
    const removeImageBtn = document.getElementById("modalRemoveImageBtn");
    const imagePreviewContainer = document.getElementById("modalImagePreviewContainer");

    // Guard para esta función
    if (!addImgBtn) return; 

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


// =============================================================
// === INICIALIZAR PÁGINA (MODIFICADO) ===
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Lógica del Feed (SÓLO si estamos en Home.html) ---
    const postsContainer = document.getElementById("postsContainer");
    if (postsContainer) {
        const searchBtn = document.getElementById("searchBtn");
        const newPostBtn = document.getElementById("newPostBtn");
        
        if(searchBtn) searchBtn.addEventListener("click", handleSearch);
        if(newPostBtn) newPostBtn.addEventListener("click", handleNewPost);
        
        // Esta es la del FEED
        setupImageUpload();
        
        // Renderizar los posts del feed
        renderPosts(posts);
    }

    // --- Lógica del Modal (Se ejecuta en TODAS las páginas) ---
    const openModalBtn = document.getElementById("openModalBtn");
    const postModal = document.getElementById("postModal");
    const closeModalBtn = document.querySelector(".modal-close");
    const modalNewPostBtn = document.getElementById("modalNewPostBtn");

    // Comprueba que los elementos del modal existen en la página
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
        setupModalImageUpload(); // <-- Esta es la del MODAL
        modalNewPostBtn.addEventListener("click", handleModalNewPost);
    }
});