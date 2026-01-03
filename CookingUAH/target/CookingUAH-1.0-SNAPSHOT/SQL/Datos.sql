INSERT INTO users (username, password, role, active, avatar, bio, email) VALUES 
('admin', 'admin', 'admin', true, 'Imagenes/AvatarAdmin.jpg', 'Administrador del sistema', 'admin@uah.es'),
('TuUsuario', '1234', 'user', true, 'Imagenes/MiAvatar.jpg', 'Amante de la cocina casera.', 'tuusuario@uah.es'),
('Juan', '1234', 'user', true, 'Imagenes/Avatar4.jpeg', 'Probando la cocina italiana.', 'juan@uah.es'),
('Ana', '1234', 'user', true, 'Imagenes/Avatar1.jpg', 'Diseñadora UX/UI', 'ana@uah.es'),
('Caro', '1234', 'user', true, 'Imagenes/Avatar6.jpeg', 'Aprendiendo a cocinar.', 'caro@uah.es'),
('Mario', '1234', 'user', true, 'Imagenes/Avatar3.jpg', 'Fan de la comida mexicana.', 'mario@uah.es'),
('Laura', '1234', 'user', true, 'Imagenes/Avatar5.jpeg', 'Me encanta la repostería.', 'laura@uah.es');

INSERT INTO followers (follower_id, followed_id) VALUES (3, 4), (5, 4), (6, 3), (3, 6);

INSERT INTO posts (user_id, title, image, likes_count) VALUES 
(3, 'Hoy preparé una lasaña casera con salsa bechamel. ¡Aquí mi receta!', 'Imagenes/Lasanna.png', 12),
(4, 'Pan casero con masa madre recién salido del horno.', 'Imagenes/Pan.jpg', 42),
(6, 'Tacos al pastor, ¡los mejores de la ciudad!', 'Imagenes/Tacos.jpg', 35);

INSERT INTO comments (user_id, post_id, content) VALUES (4, 1, '¡Se ve deliciosa!');

INSERT INTO notifications (user_id, text, type) VALUES 
(2, '@Ana le dio me gusta a tu receta', 'LIKE'),
(2, '@Juan te ha seguido', 'FOLLOW');

INSERT INTO events (user_id, title, event_date, event_time, type) VALUES 
(3, 'Clase: Repostería artesanal', '2025-11-10', '17:00:00', 'TALLER');