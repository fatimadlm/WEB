// --- 🌟 CAMBIO 1: Importamos 'saveCurrentUser' ---
import { getUsers, getCurrentUser, saveCurrentUser } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

  // 1. SEGURIDAD Y DATOS
  let currentUser = getCurrentUser(); // Lo declaramos con 'let' para poder actualizarlo

  if (!currentUser || !currentUser.id) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'IniciarSesion.html';
    throw new Error('Usuario no autenticado');
  }

  // 2. REFERENCIAS DEL DOM
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  const usersContainer = document.getElementById('usersContainer');

  // 3. FUNCIÓN DE RENDERIZADO (Actualizada)
  function renderUsers(usersArray) {
    if (!usersContainer) return;
    usersContainer.innerHTML = ''; 

    if (!usersArray || usersArray.length === 0) {
      usersContainer.innerHTML = '<p class="no-results">No se encontraron usuarios.</p>';
      return;
    }

    // Asegurarnos de que el array de seguidos existe
    if (!currentUser.followingIds) {
      currentUser.followingIds = [];
    }

    usersArray.forEach(user => {
      const userCard = document.createElement('div');
      userCard.className = 'user-card';

      const profileUrl = `PerfilOtro.html?id=${user.id}`;
      const avatar = user.avatar || '../Imagenes/avatarDefault.png';

      // --- 🌟 CAMBIO 2: Lógica del botón 'Seguir' ---
      const isFollowing = currentUser.followingIds.includes(user.id);
      const buttonText = isFollowing ? 'Siguiendo' : 'Seguir';
      const buttonClass = isFollowing ? 'following' : '';

      // --- 🌟 CAMBIO 3: Nuevo HTML de la tarjeta con 2 botones ---
      userCard.innerHTML = `
        <img src="${avatar}" alt="Avatar de ${user.username}" class="user-card-avatar" />
        <h3 class="user-card-name">${user.username}</h3>
        
        <div class="user-card-actions">
          <a href="${profileUrl}" class="btn-perfil btn-secondary">Ver Perfil</a>
          
          <button 
            class="btn-follow btn-primary ${buttonClass}" 
            data-id="${user.id}"
          >
            ${buttonText}
          </button>
        </div>
      `;
      
      usersContainer.appendChild(userCard);
    });

    // --- 🌟 CAMBIO 4: Añadimos los listeners a los nuevos botones ---
    addFollowListeners();
  }

  // 4. FUNCIÓN DE FILTRADO (Sin cambios, pero ahora llama al nuevo render)
  function renderFiltered() {
    const allUsers = getUsers() || [];
    const query = searchInput.value.trim().toLowerCase();
    
    // Actualizamos la variable global por si ha cambiado (ej. en otra pestaña)
    currentUser = getCurrentUser(); 

    const filteredUsers = allUsers.filter(user => {
      const matchesQuery = user.username.toLowerCase().includes(query);
      const isNotCurrentUser = user.id !== currentUser.id;
      return matchesQuery && isNotCurrentUser;
    });

    renderUsers(filteredUsers);
  }

  // --- 🌟 CAMBIO 5: Nuevas funciones para manejar el 'Seguir' ---

  /**
   * Asigna el evento 'click' a todos los botones de 'Seguir'
   */
  function addFollowListeners() {
    document.querySelectorAll('.btn-follow[data-id]').forEach(button => {
      // Removemos el listener anterior para evitar duplicados al re-renderizar
      button.removeEventListener('click', handleFollowClick); 
      button.addEventListener('click', handleFollowClick);
    });
  }

  /**
   * Lógica que se ejecuta al pulsar 'Seguir' o 'Siguiendo'
   */
  function handleFollowClick(event) {
    const userIdToFollow = event.target.dataset.id;
    if (!userIdToFollow) return;

    // Volvemos a cargar el usuario actual para tener los datos más frescos
    currentUser = getCurrentUser();
    
    if (!currentUser.followingIds) {
      currentUser.followingIds = [];
    }

    const isFollowing = currentUser.followingIds.includes(userIdToFollow);

    if (isFollowing) {
      // --- Dejar de Seguir (Unfollow) ---
      currentUser.followingIds = currentUser.followingIds.filter(id => id !== userIdToFollow);
    } else {
      // --- Empezar a Seguir (Follow) ---
      currentUser.followingIds.push(userIdToFollow);
    }

    // Guardamos el usuario actualizado en localStorage
    saveCurrentUser(currentUser);
    
    // Volvemos a renderizar toda la lista para actualizar los botones
    renderFiltered(); 
  }

  // 5. EVENT LISTENERS (Sin cambios)
  searchInput?.addEventListener('input', renderFiltered);
  searchBtn?.addEventListener('click', renderFiltered);

  // Carga inicial
  renderFiltered();
});