/* Todo el código está envuelto en un 'DOMContentLoaded' 
  para que ninguna de sus funciones o variables sea "global" 
  y choque con otros scripts (como Eventos.js)
*/
document.addEventListener('DOMContentLoaded', () => {

  // === Datos simulados (ahora son locales a este script) ===
  const currentUser = "@TuUsuario";
  const currentUserAvatar = "../Imagenes/MiAvatar.jpg"; // Asumo que es tu avatar de perfil

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
      avatar: "../Imagenes/MiAvatar.jpg", 
      time: "Hace 1 día", 
      content: "Mi nueva receta: pasta carbonara cremosa", 
      img: "../Imagenes/carbonara.jpg", 
      likes: 12, 
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
      
      const usernameClean = post.username.replace('@', '');
      // Lógica de enlace al perfil
      const profilePage = post.username === currentUser ? "MiPerfil.html" : `Perfiles/Perfil${usernameClean}.html`; 
      
      const likedClass = post.liked ? 'liked' : '';
      const likedText = '❤️ Me gusta'; 

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
      container.appendChild(postDiv);
    });

    addEventListeners(); // Activar botones
  }

  // === FUNCIÓN PARA AÑADIR EVENT LISTENERS (Para Home.html) ===
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

  // === Lógica del Buscador (Para Home.html) ===
  function handleSearch() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = posts.filter(post =>
      post.username.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
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
      alert("No puedes publicar vacío."); 
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

    posts.unshift(newPost); 
    renderPosts(posts); 

    // Limpiar inputs
    contentInput.value = "";
    selectedImageFile = null;
    document.getElementById("imageUpload").value = '';
    document.getElementById("imagePreview").style.display = 'none';
    document.getElementById("imagePreviewContainer").style.display = 'none';
    document.getElementById("removeImageBtn").style.display = 'none';
  }

  function setupImageUpload() {
    const addImgBtn = document.getElementById("addImgBtn");
    const imageUploadInput = document.getElementById("imageUpload");
    const imagePreview = document.getElementById("imagePreview");
    const removeImageBtn = document.getElementById("removeImageBtn");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    if (!addImgBtn) return;

    addImgBtn.addEventListener('click', () => imageUploadInput.click()); 

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
      } else {
          selectedImageFile = null;
          imagePreview.style.display = 'none';
          removeImageBtn.style.display = 'none';
          imagePreviewContainer.style.display = 'none';
      }
    });

    removeImageBtn.addEventListener('click', () => {
      selectedImageFile = null; 
      imageUploadInput.value = '';
      imagePreview.style.display = 'none';
      removeImageBtn.style.display = 'none';
      imagePreviewContainer.style.display = 'none';
    });
  }

  // =============================================================
  // --- LÓGICA DEL MODAL (PARA TODAS LAS PÁGINAS) ---
  // =============================================================
  let modalSelectedImageFile = null;

  // Función para crear un post en MiPerfil.html
  function createMyPostElement(post) {
      const postDiv = document.createElement("div");
      postDiv.classList.add("post");

      const now = new Date();
      const timeString = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

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

      // Añadir listeners a los nuevos botones
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

  // Publicar desde el MODAL
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

    // --- ¡AQUÍ ESTÁ LA MAGIA CORREGIDA! ---
    const homePostsContainer = document.getElementById("postsContainer");
    // Busca el ID específico de TU perfil
    const miPerfilMain = document.getElementById("mi-perfil-main"); 

    if (homePostsContainer) {
        // Estamos en Home.html
        posts.unshift(newPost); 
        renderPosts(posts); 
    } else if (miPerfilMain) {
        // Estamos en MiPerfil.html
        // Busca el contenedor de posts DENTRO de tu perfil
        const perfilPostsContainer = miPerfilMain.querySelector(".perfil-posts");
        if (perfilPostsContainer) {
            const newPostElement = createMyPostElement(newPost);
            perfilPostsContainer.insertBefore(newPostElement, perfilPostsContainer.children[1]);
        }
    }
    // Si no es ninguno de los dos (ej. en PerfilJuan.html), no hace nada.

    // Limpiar y cerrar el modal
    contentInput.value = "";
    modalSelectedImageFile = null;
    document.getElementById("modalImageUpload").value = ''; 
    document.getElementById("modalImagePreview").style.display = 'none';
    document.getElementById("modalImagePreview").src = '#';
    document.getElementById("modalRemoveImageBtn").style.display = 'none';
    document.getElementById("modalImagePreviewContainer").style.display = 'none'; 
    
    document.getElementById("postModal").style.display = 'none'; // Cierra el modal
  }

  // Subir imagen del MODAL
  function setupModalImageUpload() {
      const addImgBtn = document.getElementById("modalAddImgBtn");
      const imageUploadInput = document.getElementById("modalImageUpload");
      const imagePreview = document.getElementById("modalImagePreview");
      const removeImageBtn = document.getElementById("modalRemoveImageBtn");
      const imagePreviewContainer = document.getElementById("modalImagePreviewContainer");

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
              };
              reader.readAsDataURL(file);
          } else {
              modalSelectedImageFile = null;
              imagePreview.style.display = 'none';
              removeImageBtn.style.display = 'none';
              imagePreviewContainer.style.display = 'none';
          }
      });

      removeImageBtn.addEventListener('click', () => {
          modalSelectedImageFile = null;
          imageUploadInput.value = ''; 
          imagePreview.style.display = 'none';
          removeImageBtn.style.display = 'none';
          imagePreviewContainer.style.display = 'none';
      });
  }

  // =============================================================
  // === CÓDIGO DE INICIALIZACIÓN (EL ARREGLO ESTÁ AQUÍ) ===
  // =============================================================
  
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
  
}); // === FIN DE ENCAPSULACIÓN ===