-- 1. Ver Usuarios y sus IDs (Debe empezar en 1)
SELECT id, username, avatar, role FROM users;

-- 2. Ver Posts y a quién pertenecen (Clave ajena user_id)
SELECT id, user_id, title, image, likes_count FROM posts;

-- 3. Ver Seguidores (Relación entre IDs)
SELECT follower_id, followed_id FROM followers;

-- 4. Ver Comentarios vinculados a Posts
SELECT id, user_id, post_id, content FROM comments;