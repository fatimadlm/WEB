-- TABLA: users
-- Usando nombres de archivos exactos de las capturas
INSERT INTO users (username, email, password, avatar, bio, role, active) VALUES 
('admin', 'admin@uah.es', 'admin', 'AvatarAdmin.jpg', 'Administrador del sistema CookingUAH.', 'admin', true), -- ID 1
('Marta', 'marta@uah.es', '1234', 'MiAvatar.jpg', 'Amante de la cocina.', 'user', true), -- ID 2
('Juan', 'juan@uah.es', '1234', 'Avatar4.jpeg', 'Probando la cocina italiana. Muy bien.', 'user', true), -- ID 3
('Ana', 'ana@uah.es', '1234', 'Avatar1.jpg', 'Diseñadora UX/UI y cocinera aficionada.', 'user', true), -- ID 4
('Marcos', 'marcos@uah.es', '1234', 'Avatar2.webp', 'Especialista en platos rápidos para estudiantes.', 'user', true), -- ID 5
('Mario', 'mario@uah.es', '1234', 'Avatar3.jpg', 'Fanático de los tacos y la comida picante.', 'user', true), -- ID 6
('Laura', 'laura@uah.es', '1234', 'avatar_1767625059130_Avatar6.jpeg', 'Cocinando con estilo y mucha paciencia.', 'user', true); -- ID 7

-- TABLA: posts
INSERT INTO posts (user_id, title, image, likes_count) VALUES 
(3, 'Pasta Carbonara auténtica, sin nata.', 'Carbonara.jpg', 15), -- ID 1
(4, 'Lasaña casera con mucha bechamel.', 'Lasanna.png', 22), -- ID 2
(6, 'Tacos al pastor directo de mi cocina.', 'Tacos.jpg', 18), -- ID 3
(2, 'Brownie de chocolate súper jugoso.', 'Brownie.jpg', 30), -- ID 4
(5, 'Ensalada fresca de verano.', 'Ensalada.jpg', 5), -- ID 5
(7, 'Pan artesanal recién salido del horno.', 'Pan.jpg', 12), -- ID 6
(3, 'Comida familiar: de todo un poco.', 'Comida.jpg', 8); -- ID 7

--  TABLA: followers
INSERT INTO followers (follower_id, followed_id) VALUES 
(3, 4), (5, 4), (6, 3), (2, 3), (2, 4), (7, 2), (4, 2), (1, 2);

--  TABLA: likes
INSERT INTO likes (user_id, post_id) VALUES 
(2, 1), (3, 2), (4, 3), (7, 4), (5, 4), (6, 4), (1, 4), (4, 6);

--  TABLA: comments
INSERT INTO comments (user_id, post_id, content) VALUES 
(4, 1, '¡Se ve espectacular! ¿Usaste guanciale?'),
(2, 1, 'La hice ayer y me quedó increíble.'),
(3, 3, 'Ese color de la carne es perfecto.'),
(5, 4, '¿Puedes subir la receta del brownie?'),
(7, 6, 'Nada como el olor a pan recién hecho.');

-- TABLA: messages
INSERT INTO messages (sender_id, receiver_id, content) VALUES 
(3, 2, 'Hola Marta, ¿qué tal quedó la lasaña?'),
(2, 3, '¡Hola Juan! Muy rica, el truco es la nuez moscada.'),
(4, 2, 'Oye, ¿vienes al evento de apertura mañana?'),
(2, 4, '¡Claro! Allí nos vemos.'),
(5, 7, '¿Me prestas tu receta de pan artesanal?');

--  TABLA: events
INSERT INTO events (user_id, title, event_date, event_time, type) VALUES 
(1, 'Gran Apertura CookingUAH', '2026-01-15', '10:00:00', 'INAUGURACIÓN'),
(3, 'Taller de Pasta Italiana', '2026-02-10', '17:00:00', 'TALLER'),
(2, 'Concurso de Postres UAH', '2026-03-05', '12:30:00', 'COMPETICIÓN');

--  TABLA: notifications
INSERT INTO notifications (user_id, text, type, is_read) VALUES 
(2, '@Ana le dio me gusta a tu Brownie', 'LIKE', false),
(2, '@Juan te ha enviado un mensaje', 'MSG', false),
(2, '@Laura ha empezado a seguirte', 'FOLLOW', false),
(3, '@Mario comentó en tu Carbonara', 'COMMENT', false);