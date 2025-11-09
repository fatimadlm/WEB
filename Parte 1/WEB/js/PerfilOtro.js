document.addEventListener('DOMContentLoaded', () => {

  // Likes
  document.querySelectorAll(".perfil-posts .like-btn").forEach(btn => {
    const countElement = btn.querySelector('.like-count');
    let isLiked = false;
    let count = parseInt(btn.dataset.likesStart) || 0;

    btn.addEventListener("click", () => {
      isLiked = !isLiked;
      count = isLiked ? count + 1 : count - 1;
      countElement.textContent = count;
      btn.classList.toggle("liked", isLiked);
    });
  });

  // Comentarios
  document.querySelectorAll(".perfil-posts .comment-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const commentText = prompt("Escribe tu comentario:");
      if (commentText && commentText.trim() !== "") {
        const postElement = btn.closest('.post');
        const commentsContainer = postElement.querySelector('.comments');
        const newComment = document.createElement('p');
        newComment.innerHTML = `<strong>@TuUsuario:</strong> ${commentText}`;
        commentsContainer.appendChild(newComment);
        commentsContainer.scrollTop = commentsContainer.scrollHeight;
      }
    });
  });

});
