-- Verificar usuarios registrados, sus roles y estados
SELECT id, username, email, role, active, avatar FROM users;
-- Ver las recetas subidas y a qué usuario pertenecen
SELECT id, user_id, title, image, likes_count, created_at FROM posts;

-- Consultar quién ha dado like a qué post
SELECT * FROM likes;

-- Consultar el contenido de los comentarios y su vinculación
SELECT id, user_id, post_id, content, created_at FROM comments;

-- Ver el historial de mensajes entre usuarios
SELECT id, sender_id, receiver_id, content, created_at FROM messages;

-- Consultar la red de seguidores/seguidos
SELECT follower_id, followed_id FROM followers;
-- Listar los eventos creados para el calendario
SELECT id, user_id, title, event_date, event_time, type FROM events;

-- Consultar las notificaciones pendientes de leer
SELECT id, user_id, text, type, is_read FROM notifications;