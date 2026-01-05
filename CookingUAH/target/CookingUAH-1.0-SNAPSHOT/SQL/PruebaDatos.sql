-- Tabla: users
INSERT INTO users (username, email, password, avatar, bio, role, active) VALUES 
('admin', 'admin@uah.es', 'admin', 'AvatarAdmin.jpg', 'Administrador del sistema', 'admin', true), -- ID 1
('TuUsuario', 'tuusuario@uah.es', '1234', 'MiAvatar.jpg', 'Amante de la cocina casera.', 'user', true), -- ID 2
('Juan', 'juan@uah.es', '1234', 'Avatar4.jpeg', 'Probando la cocina italiana.', 'user', true), -- ID 3
('Ana', 'ana@uah.es', '1234', 'Avatar1.jpg', 'Diseñadora UX/UI', 'user', true), -- ID 4
('Caro', 'caro@uah.es', '1234', 'Avatar6.jpeg', 'Aprendiendo a cocinar.', 'user', true), -- ID 5
('Mario', 'mario@uah.es', '1234', 'Avatar3.jpg', 'Fan de la comida mexicana.', 'user', true), -- ID 6
('Laura', 'laura@uah.es', '1234', 'Avatar5.jpeg', 'Me encanta la repostería.', 'user', true); -- ID 7

-- Tabla: posts
INSERT INTO posts (user_id, title, image, likes_count) VALUES 
(3, 'Hoy preparé una lasaña casera con salsa bechamel. ¡Aquí mi receta!', 'Lasanna.png', 1), -- ID 1
(4, 'Pan casero con masa madre recién salido del horno.', 'Pan.jpg', 1), -- ID 2
(6, 'Tacos al pastor, ¡los mejores de la ciudad!', 'Tacos.jpg', 1); -- ID 3

-- Tabla: followers (Seguidores)
INSERT INTO followers (follower_id, followed_id) VALUES (3, 4), (5, 4), (6, 3), (2, 3), (2, 4);

-- Tabla: likes
INSERT INTO likes (user_id, post_id) VALUES (2, 1), (3, 2), (4, 3);

-- Tabla: comments
INSERT INTO comments (user_id, post_id, content) VALUES 
(4, 1, '¡Se ve deliciosa! ¿Pasas la receta completa?'),
(2, 1, 'Yo la hice ayer y me quedó genial.'),
(3, 3, '¡Qué buena pinta tienen esos tacos!');

-- Tabla: messages (Para que CargarChatServlet tenga datos)
INSERT INTO messages (sender_id, receiver_id, content) VALUES 
(3, 2, 'Hola, ¿cómo hiciste la pasta ayer?'),
(2, 3, '¡Hola Juan! Seguí la receta de tu post.'),
(4, 2, '¿Te apuntas al taller de cocina del sábado?');

-- Tabla: events
INSERT INTO events (user_id, title, event_date, event_time, type) VALUES 
(1, 'Gran Apertura CookingUAH', '2025-12-25', '10:00:00', 'INAUGURACIÓN'),
(3, 'Clase: Repostería artesanal', '2025-11-10', '17:00:00', 'TALLER');

-- Tabla: notifications
INSERT INTO notifications (user_id, text, type, is_read) VALUES 
(2, '@Ana le dio me gusta a tu receta', 'LIKE', false),
(2, '@Juan ha comentado tu publicación', 'COMMENT', false),
(2, '@Mario te ha seguido', 'FOLLOW', false);