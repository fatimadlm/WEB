// BBDD.js
export function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

export function save(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

//  Usuarios 
export function getUsers() {
  return safeParse(localStorage.getItem('users')) || [];
}

export function saveUsers(users) {
  save('users', users);
}

//  Posts 
export function getPosts() {
  return safeParse(localStorage.getItem('posts')) || [];
}

export function savePosts(posts) {
  save('posts', posts);
}

// Usuario actual 
export function getCurrentUser() {
  return safeParse(localStorage.getItem('currentUser')) || { username: 'Invitado', role: 'user', avatar: '../Imagenes/MiAvatar.jpg' };
}

export function saveCurrentUser(user) {
  save('currentUser', user);
}
//Simulacion de datos iniciales
export function seedDemo() {
  const users = [
    { id: 'u_admin', username: 'admin', password: 'admin', role: 'admin', active: true, avatar: '../Imagenes/AvatarAdmin.jpg' },
    { id: 'u1', username: 'usuario1', password: '1234', role: 'user', active: true, avatar: '../Imagenes/AvatarPorDefecto.webp' },
    { id: 'u2', username: 'usuario2', password: '1234', role: 'user', active: true, avatar: '../Imagenes/AvatarPorDefecto.webp' },
    { id: 'u4', username: 'Juan', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar4.jpeg' },
    { id: 'u5', username: 'Ana', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar1.jpg' },
    { id: 'u6', username: 'Caro', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar6.jpeg' },
    { id: 'u7', username: 'Mario', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar3.jpg' },
    { id: 'u8', username: 'Laura', password: '1234', role: 'user', active: true, avatar: '../Imagenes/Avatar5.jpeg' }
  ];
  saveUsers(users);
  saveCurrentUser(users[0]);

const posts = [
  {
    id: 'p1',
    title: "Hoy preparé una lasaña casera con salsa bechamel 🤤. ¡Aquí mi receta!",
    authorId: 'u4', // Juan
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
    img: "../Imagenes/Lasanna.png",
    likes: 12,
    liked: false,
    comments: [
      { id: 'c1', authorId: 'u5', content: "¡Se ve deliciosa!", createdAt: Date.now() - 1.9 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 'p2',
    title: "Pan casero con masa madre 😍 recién salido del horno.",
    authorId: 'u5', // Ana
    createdAt: Date.now() - 5 * 60 * 60 * 1000,
    img: "../Imagenes/Pan.jpg",
    likes: 42,
    liked: false,
    comments: []
  },
  {
    id: 'p3',
    title: "Tacos al pastor 🌮, ¡los mejores de la ciudad!",
    authorId: 'u7', // Mario
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    img: "../Imagenes/Tacos.jpg",
    likes: 35,
    liked: false,
    comments: [
      { id: 'c2', authorId: 'u8', content: "¡Quiero probarlos!", createdAt: Date.now() - 0.9 * 60 * 60 * 1000 }
    ]
  },
  {
    id: 'p4',
    title: "Brownies de chocolate 🍫 con nueces, recién horneados.",
    authorId: 'u8', // Laura
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
    img: "../Imagenes/Brownie.jpg",
    likes: 28,
    liked: false,
    comments: []
  },
  {
    id: 'p5',
    title: "Ensalada fresca de quinoa y aguacate 🥗, ideal para el verano.",
    authorId: 'u6', // Caro
    createdAt: Date.now() - 6 * 60 * 60 * 1000,
    img: "../Imagenes/Ensalada.jpg",
    likes: 18,
    liked: false,
    comments: []
  },
  {
    id: 'p6',
    title: "Mi nueva receta: pasta carbonara cremosa",
    authorId: 'u1', // TuUsuario
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    img: "../Imagenes/Carbonara.jpg",
    likes: 12,
    liked: false,
    comments: []
  }
];

  savePosts(posts);
}

// --- Generar ID único ---
export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
