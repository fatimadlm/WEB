-- 1. USUARIOS
CREATE TABLE users (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    role VARCHAR(20) DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE
);

-- 2. PUBLICACIONES
CREATE TABLE posts (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    user_id INT,
    title VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. COMENTARIOS
CREATE TABLE comments (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    user_id INT,
    post_id INT,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 4. MENSAJES
CREATE TABLE messages (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    sender_id INT,
    receiver_id INT,
    content VARCHAR(1000) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. EVENTOS
CREATE TABLE events (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    user_id INT,
    title VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    event_time TIME,
    type VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. NOTIFICACIONES
CREATE TABLE notifications (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
    user_id INT,
    text VARCHAR(500) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- TABLAS INTERMEDIAS

-- 7. SEGUIDORES
CREATE TABLE followers (
    follower_id INT,
    followed_id INT,
    PRIMARY KEY (follower_id, followed_id),
    FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 8. ME GUSTA 
CREATE TABLE likes (
    user_id INT,
    post_id INT,
    PRIMARY KEY (user_id, post_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);



-- CODIGO FATI V1 ---

-- -- 1. Usuarios 
-- CREATE TABLE users (
--     id VARCHAR(50) PRIMARY KEY,
--     username VARCHAR(50) UNIQUE NOT NULL,
--     name VARCHAR(100),
--     password VARCHAR(255) NOT NULL,
--     role VARCHAR(20) DEFAULT 'user',
--     active BOOLEAN DEFAULT TRUE,
--     avatar VARCHAR(255),
--     bio TEXT
-- );
--
-- -- 2. Seguidores (Relación muchos a muchos)
-- CREATE TABLE follows (
--     siguiendo_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     seguido_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     PRIMARY KEY (follower_id, followed_id)
-- );
--
-- -- 3. Publicaciones
-- CREATE TABLE posts (
--     id VARCHAR(50) PRIMARY KEY,
--     title TEXT NOT NULL,
--     autor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     img VARCHAR(255),
--     likes INT DEFAULT 0,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- -- 4. Comentarios
-- CREATE TABLE comments (
--     id VARCHAR(50) PRIMARY KEY,
--     post_id VARCHAR(50) REFERENCES posts(id) ON DELETE CASCADE,
--     autor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     content TEXT NOT NULL,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- -- 5. Mensajes 
-- CREATE TABLE messages (
--     id VARCHAR(50) PRIMARY KEY,
--     envia_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     receptor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
--     content TEXT NOT NULL,
--     timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
--
-- -- 6. Notificaciones 
-- CREATE TABLE notificaciones (
--     id VARCHAR(50) PRIMARY KEY,
--     tipo_accion VARCHAR(20) NOT NULL, -- 'LIKE', 'COMMENT', 'FOLLOW'
--     usuario_origen_id VARCHAR(50) NOT NULL, 
--     usuario_destino_id VARCHAR(50) NOT NULL,
--     post_id VARCHAR(50), -- NULL si es un 'FOLLOW'
--     fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     
--     CONSTRAINT fk_notif_origen FOREIGN KEY (usuario_origen_id) REFERENCES users(id) ON DELETE CASCADE,
--     CONSTRAINT fk_notif_destino FOREIGN KEY (usuario_destino_id) REFERENCES users(id) ON DELETE CASCADE,
--     CONSTRAINT fk_notif_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
-- );
--
-- -- 7. Eventos
-- CREATE TABLE eventos (
--     id SERIAL PRIMARY KEY,
--     fecha DATE NOT NULL,
--     titulo VARCHAR(255) NOT NULL,
--     hora TIME,
--     creador_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL
-- );