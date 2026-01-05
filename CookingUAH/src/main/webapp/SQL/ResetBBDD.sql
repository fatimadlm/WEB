-- Borrar todo de nuevo
DELETE FROM likes;
DELETE FROM followers;
DELETE FROM notifications;
DELETE FROM events;
DELETE FROM messages;
DELETE FROM comments;
DELETE FROM posts;
DELETE FROM users;

-- REINICIAR EL CONTADOR (Esto es lo que faltaba)
ALTER TABLE users ALTER COLUMN id RESTART WITH 1;
ALTER TABLE posts ALTER COLUMN id RESTART WITH 1;