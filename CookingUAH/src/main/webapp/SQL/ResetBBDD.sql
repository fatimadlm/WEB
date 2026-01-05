-- Eliminar datos existentes en orden inverso de jerarquía
DELETE FROM likes;
DELETE FROM followers;
DELETE FROM notifications;
DELETE FROM events;
DELETE FROM messages;
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM users;

-- Reiniciar contadores de identidad para Derby
ALTER TABLE users ALTER COLUMN id RESTART WITH 1;
ALTER TABLE posts ALTER COLUMN id RESTART WITH 1;
ALTER TABLE comments ALTER COLUMN id RESTART WITH 1;
ALTER TABLE messages ALTER COLUMN id RESTART WITH 1;
ALTER TABLE events ALTER COLUMN id RESTART WITH 1;
ALTER TABLE notifications ALTER COLUMN id RESTART WITH 1;