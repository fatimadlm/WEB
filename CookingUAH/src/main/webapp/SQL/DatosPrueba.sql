-- 1. SEGUIDORES ADICIONALES (Simulando una red más conectada)
INSERT INTO followers (follower_id, followed_id) VALUES 
(2, 3), (2, 4), (2, 6), -- Tú sigues a Juan, Ana y Mario
(4, 2), (3, 2), (6, 2), -- Ellos te siguen a ti
(5, 3), (5, 6), (7, 4), (7, 5), (4, 7);

-- 2. MÁS PUBLICACIONES (POSTS)
INSERT INTO posts (user_id, title, image, likes_count) VALUES 
(7, 'Mi primer intento de Red Velvet cake. ¿Qué os parece?', 'Imagenes/RedVelvet.jpg', 25),
(2, 'Receta rápida de pasta al pesto para un lunes con prisa.', 'Imagenes/Pesto.jpg', 15),
(5, 'Tortilla de patatas: ¿Con cebolla o sin cebolla? Abro debate.', 'Imagenes/Tortilla.jpg', 50),
(4, 'Mi rincón favorito para desayunar un domingo.', 'Imagenes/Desayuno.jpg', 30),
(6, 'Preparando unos chilaquiles muy picantes.', 'Imagenes/Chilaquiles.jpg', 18);

-- 3. INTERACCIONES: ME GUSTA (LIKES)
-- Juan(3), Ana(4) y Mario(6) le dan me gusta a tu post de pasta (ID 5)
INSERT INTO likes (user_id, post_id) VALUES (3, 5), (4, 5), (6, 5);
-- Tú(2) le das me gusta a los posts de los demás
INSERT INTO likes (user_id, post_id) VALUES (2, 1), (2, 2), (2, 3), (2, 4);
INSERT INTO likes (user_id, post_id) VALUES (5, 1), (7, 1), (3, 2);

-- 4. COMENTARIOS
INSERT INTO comments (user_id, post_id, content) VALUES 
(3, 5, 'Pásame la receta, el pesto es mi debilidad.'),
(2, 2, 'Ese pan se ve increíblemente crujiente, ¡buen trabajo Ana!'),
(6, 4, '¡Red Velvet! Mi pastel favorito sin duda.'),
(4, 6, 'Sin cebolla siempre, lo siento Jajaja.'),
(2, 1, 'Esa lasaña tiene una pinta espectacular Juan.');

-- 5. MENSAJES (Para probar tu sistema de chat)
INSERT INTO messages (sender_id, receiver_id, content, is_read) VALUES 
-- Conversación antigua con Juan (Ya la leíste)
(3, 2, '¡Hola! Vi que te gustó mi lasaña.', TRUE),
(2, 3, 'Sí, se ve genial. ¿Le pones algún queso especial?', TRUE),
(3, 2, 'Uso una mezcla de mozzarella y parmesano fresco.', TRUE),

-- Conversación NUEVA con Ana (Aún NO la has leído, para probar la notificación)
(4, 2, '¿Te apuntas al taller de repostería del día 10?', FALSE),
(2, 4, '¡Claro! Allí nos vemos.', TRUE); 
-- Nota: El último lo pones TRUE porque fuiste tú quien respondió, 
-- no tiene sentido que tengas un mensaje tuyo sin leer.

-- 6. EVENTOS
INSERT INTO events (user_id, title, event_date, event_time, type) VALUES 
(4, 'Degustación de Panes de Masa Madre', '2025-11-15', '10:30:00', 'DEGUSTACION'),
(2, 'Cena de Navidad CookingUAH', '2025-12-20', '21:00:00', 'REUNION'),
(6, 'Noche de Tacos y Margaritas', '2025-11-20', '20:00:00', 'FIESTA');

-- 7. NOTIFICACIONES
INSERT INTO notifications (user_id, text, type) VALUES 
(2, '@Mario ha comentado en tu receta', 'COMMENT'),
(2, '@Caro te ha enviado un mensaje', 'MESSAGE'),
(3, '@TuUsuario le dio me gusta a tu receta', 'LIKE'),
(4, '@TuUsuario te ha seguido', 'FOLLOW'),
(2, 'Recordatorio: Taller de Repostería mañana', 'EVENT');