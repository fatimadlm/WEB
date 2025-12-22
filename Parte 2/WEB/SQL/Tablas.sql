-- 1. Usuarios 
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    active BOOLEAN DEFAULT TRUE,
    avatar VARCHAR(255),
    bio TEXT
);

-- 2. Seguidores (Relación muchos a muchos)
CREATE TABLE follows (
    siguiendo_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    seguido_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, followed_id)
);

-- 3. Publicaciones
CREATE TABLE posts (
    id VARCHAR(50) PRIMARY KEY,
    title TEXT NOT NULL,
    autor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    img VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Comentarios
CREATE TABLE comments (
    id VARCHAR(50) PRIMARY KEY,
    post_id VARCHAR(50) REFERENCES posts(id) ON DELETE CASCADE,
    autor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Mensajes 
CREATE TABLE messages (
    id VARCHAR(50) PRIMARY KEY,
    envia_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    receptor_id VARCHAR(50) REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Notificaciones 
CREATE TABLE notificaciones (
    id VARCHAR(50) PRIMARY KEY,
    tipo_accion VARCHAR(20) NOT NULL, -- 'LIKE', 'COMMENT', 'FOLLOW'
    usuario_origen_id VARCHAR(50) NOT NULL, 
    usuario_destino_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50), -- NULL si es un 'FOLLOW'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_notif_origen FOREIGN KEY (usuario_origen_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_destino FOREIGN KEY (usuario_destino_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notif_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE SET NULL
);

-- 7. Eventos
CREATE TABLE eventos (
    id SERIAL PRIMARY KEY,
    fecha DATE NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    hora TIME,
    creador_id VARCHAR(50) REFERENCES users(id) ON DELETE SET NULL
);