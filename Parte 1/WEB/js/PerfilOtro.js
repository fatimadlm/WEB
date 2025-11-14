import { getUsers, getPosts, savePosts, getCurrentUser, getFollows, saveFollows, uid } from './BBDD.js';

document.addEventListener('DOMContentLoaded', () => {

    // 1. Obtener el ID del usuario de la URL (ej: PerfilOtro.html?id=u5)
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');
    
    const allUsers = getUsers();
    const currentUser = getCurrentUser();
    let allPosts = getPosts();
    let allFollows = getFollows();

    // Validaciones de seguridad
    if (!currentUser || !currentUser.id) {
        window.location.href = 'IniciarSesion.html';
        return;
    }
    
    const targetUser = allUsers.find(u => u.id === targetUserId);

    // Si no existe el usuario o es el mismo que el logueado, redirigir
    if (!targetUser) {
        alert("Usuario no encontrado");
        window.location.href = 'Home.html';
        return;
    }
    if (targetUser.id === currentUser.id) {
        window.location.href = 'MiPerfil.html'; // Redirigir a su propio perfil
        return;
    }


    // 2. RENDERIZAR INFORMACIÓN DEL PERFIL

    document.getElementById('profileAvatar').src = targetUser.avatar || '../Imagenes/avatarDefault.png';
    document.getElementById('profileName').textContent = targetUser.name || targetUser.username;
    document.getElementById('profileUsername').textContent = '@' + targetUser.username;
    document.getElementById('profileBio').textContent = targetUser.bio || 'Sin biografía.';
    document.title = `Perfil de ${targetUser.username} - CookingUAH`;


    // 3. LÓGICA DE SEGUIDORES 
    
    const followersCountSpan = document.getElementById('followersCount');
    const followingCountSpan = document.getElementById('followingCount');
    const followBtn = document.getElementById('profileFollowBtn');

    // Calcular números iniciales
    const updateStats = () => {
        const followers = allFollows.filter(f => f.followedId === targetUser.id);
        const following = allFollows.filter(f => f.followerId === targetUser.id);
        followersCountSpan.textContent = followers.length;
        followingCountSpan.textContent = following.length;
        return { followers, following };
    };

    // Estado inicial del botón
    const checkFollowStatus = () => {
        const isFollowing = allFollows.some(f => f.followerId === currentUser.id && f.followedId === targetUser.id);
        if (isFollowing) {
            followBtn.textContent = 'Siguiendo';
            followBtn.classList.add('following');
        } else {
            followBtn.textContent = 'Seguir';
            followBtn.classList.remove('following');
        }
        return isFollowing;
    };

    updateStats();
    checkFollowStatus();

    // Click en botón Seguir/Dejar de seguir
    followBtn.addEventListener('click', () => {
        const isFollowing = checkFollowStatus();
        
        if (isFollowing) {
            // Dejar de seguir: Filtrar para quitar la relación
            allFollows = allFollows.filter(f => !(f.followerId === currentUser.id && f.followedId === targetUser.id));
        } else {
            // Seguir: Añadir relación
            allFollows.push({ followerId: currentUser.id, followedId: targetUser.id });
        }
        
        saveFollows(allFollows); // Guardar en BBDD
        checkFollowStatus();     // Actualizar botón
        updateStats();           // Actualizar números
    });


    // 4. RENDERIZAR PUBLICACIONES DEL USUARIO

    const postsContainer = document.getElementById('profilePostsContainer');
    
    // Filtrar posts de ESTE usuario
    const userPosts = allPosts.filter(p => p.authorId === targetUser.id).sort((a, b) => b.createdAt - a.createdAt);

    // Limpiar contenedor (manteniendo el título h3)
    const title = postsContainer.querySelector('h3');
    postsContainer.innerHTML = '';
    postsContainer.appendChild(title);

    if (userPosts.length === 0) {
        const p = document.createElement('p');
        p.textContent = "Este usuario aún no tiene publicaciones.";
        postsContainer.appendChild(p);
    } else {
        userPosts.forEach(post => {
            const postDiv = document.createElement('div');
            postDiv.classList.add('post');
            
            // Formato de fecha
            const date = new Date(post.createdAt);
            const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

            postDiv.innerHTML = `
                <div class="post-header">
                    <img src="${targetUser.avatar}" alt="Usuario" class="user-img" />
                    <div>
                        <h4>@${targetUser.username}</h4>
                        <span>${dateStr}</span>
                    </div>
                </div>
                <div class="post-content">
                    <p>${post.title}</p>
                    ${post.img ? `<img src="${post.img}" alt="Imagen post" class="post-img" />` : ''}
                </div>
                <div class="post-actions">
                    <button class="like-btn ${post.liked ? 'liked' : ''}" data-post-id="${post.id}">
                        <span class="like-text">❤️ Me gusta</span> (<span class="like-count">${post.likes}</span>)
                    </button>
                    <button class="comment-btn">💬 Comentar</button>
                </div>
                <div class="comments">
                    ${(post.comments || []).map(c => {
                        const cUser = allUsers.find(u => u.id === c.authorId) || { username: 'Desc.' };
                        return `<p><strong>@${cUser.username}:</strong> ${c.content}</p>`;
                    }).join('')}
                </div>
            `;

            // Lógica de Like y Comentar (Igual que en Home)
            const likeBtn = postDiv.querySelector('.like-btn');
            likeBtn.addEventListener('click', () => {
                post.liked = !post.liked;
                post.likes = post.liked ? post.likes + 1 : post.likes - 1;
                
                // Actualizar DOM
                likeBtn.classList.toggle('liked');
                likeBtn.querySelector('.like-count').textContent = post.likes;
                
                // Guardar en BBDD
                savePosts(allPosts);
            });

            const commentBtn = postDiv.querySelector('.comment-btn');
            commentBtn.addEventListener('click', () => {
                const text = prompt("Escribe un comentario:");
                if(text) {
                    if(!post.comments) post.comments = [];
                    post.comments.push({
                        id: uid('c'),
                        authorId: currentUser.id,
                        content: text,
                        createdAt: Date.now()
                    });
                    savePosts(allPosts);
                    // Recargar simple para ver el comentario (o agregar al DOM manualmente)
                    window.location.reload();
                }
            });

            postsContainer.appendChild(postDiv);
        });
    }


    // 5. MODAL DE LISTA DE USUARIOS (Seguidores/Siguiendo)

    const modal = document.getElementById('userListModal');
    const list = document.getElementById('userList');
    const titleElem = document.getElementById('userListTitle');
    
    const openList = (type) => {
        let usersToShow = [];
        // Recalcular relaciones actuales
        allFollows = getFollows(); 

        if (type === 'Seguidores') {
            // Buscar IDs que siguen al target
            const relations = allFollows.filter(f => f.followedId === targetUser.id);
            usersToShow = relations.map(r => allUsers.find(u => u.id === r.followerId)).filter(Boolean);
        } else {
            // Buscar IDs que el target sigue
            const relations = allFollows.filter(f => f.followerId === targetUser.id);
            usersToShow = relations.map(r => allUsers.find(u => u.id === r.followedId)).filter(Boolean);
        }

        titleElem.textContent = type;
        list.innerHTML = '';
        
        if(usersToShow.length === 0) {
            list.innerHTML = '<li>No hay usuarios.</li>';
        } else {
            usersToShow.forEach(u => {
                const li = document.createElement('li');
                li.className = 'user-list-item';
                // Enlace para ir al perfil de esa persona
                li.innerHTML = `
                    <a href="PerfilOtro.html?id=${u.id}" style="display:flex; align-items:center; text-decoration:none; color:inherit; width:100%;">
                        <img src="${u.avatar}" class="user-list-avatar">
                        <div class="user-list-info">
                            <strong>${u.name || u.username}</strong>
                            <span>@${u.username}</span>
                        </div>
                    </a>
                `;
                list.appendChild(li);
            });
        }
        modal.style.display = 'flex';
    };

    document.getElementById('showFollowers').addEventListener('click', (e) => {
        e.preventDefault();
        openList('Seguidores');
    });
    document.getElementById('showFollowing').addEventListener('click', (e) => {
        e.preventDefault();
        openList('Siguiendo');
    });

    document.getElementById('userListClose').addEventListener('click', () => modal.style.display = 'none');
    document.getElementById('userListBackdrop').addEventListener('click', () => modal.style.display = 'none');
});
