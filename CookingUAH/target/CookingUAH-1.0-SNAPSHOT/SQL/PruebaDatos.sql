INSERT INTO users (username, email, password, avatar, bio, role, active) VALUES 
('admin', 'admin@uah.es', 'admin', 'AvatarAdmin.jpg', 'Administrador del sistema', 'admin', true),
('TuUsuario', 'tuusuario@uah.es', '1234', 'MiAvatar.jpg', 'Amante de la cocina casera.', 'user', true),
('Juan', 'juan@uah.es', '1234', 'Avatar4.jpeg', 'Probando la cocina italiana.', 'user', true),
('Ana', 'ana@uah.es', '1234', 'Avatar1.jpg', 'Diseñadora UX/UI', 'user', true),
('Caro', 'caro@uah.es', '1234', 'Avatar6.jpeg', 'Aprendiendo a cocinar.', 'user', true),
('Mario', 'mario@uah.es', '1234', 'Avatar3.jpg', 'Fan de la comida mexicana.', 'user', true),
('Laura', 'laura@uah.es', '1234', 'Avatar5.jpeg', 'Me encanta la repostería.', 'user', true);


-- Posts (Ahora sí encontrará al usuario 3, 4 y 6)
INSERT INTO posts (user_id, title, image, likes_count) VALUES 
(3, 'Hoy preparé una lasaña casera con salsa bechamel. ¡Aquí mi receta!', 'Lasanna.png', 12),
(4, 'Pan casero con masa madre recién salido del horno.', 'Pan.jpg', 42),
(6, 'Tacos al pastor, ¡los mejores de la ciudad!', 'Tacos.jpg', 35);

-- Relaciones
INSERT INTO followers (follower_id, followed_id) VALUES (3, 4), (5, 4), (6, 3), (3, 6);

-- Comentarios (Usuario 4 comenta en el Post 1)
INSERT INTO comments (user_id, post_id, content) VALUES (4, 1, '¡Se ve deliciosa!');

-- Notificaciones
INSERT INTO notifications (user_id, text, type) VALUES 
(2, '@Ana le dio me gusta a tu receta', 'LIKE'),
(2, '@Juan te ha seguido', 'FOLLOW');

-- Eventos
INSERT INTO events (user_id, title, event_date, event_time, type) VALUES 
(3, 'Clase: Repostería artesanal', '2025-11-10', '17:00:00', 'TALLER');