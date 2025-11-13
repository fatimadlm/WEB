///// BBDD.JS
//  Fichero creado para suplir la carencia de bases de datos en la primera parte de la práctica y
//  poder simular el funcionamiento de la página web en un entorno lo más parecido a la realidad
//  posible.

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

//Mensajes
export function getMessages() {
  return safeParse(localStorage.getItem('messages')) || [];
}

export function saveMessages(messages) {
  save('messages', messages);
}
//  Posts 
export function getPosts() {
  return safeParse(localStorage.getItem('posts')) || [];
}

export function savePosts(posts) {
  save('posts', posts);
}
//  Notificaciones
export function getNotificaciones() {
  return safeParse(localStorage.getItem('notificaciones')) || [];
}

export function saveNotificaciones(notifs) {
  save('notificaciones', notifs);
}
// Eventos 
export function getEventos() {
  return safeParse(localStorage.getItem('eventos')) || [];
}

export function saveEventos(eventos) {
  save('eventos', eventos);
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
    ,{ id: 'u9', username: 'TuUsuario', password: '1234', role: 'user', active: true, avatar: '../Imagenes/MiAvatar.jpg' }

  ];
  saveUsers(users);
  saveCurrentUser(users[1]);
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
    authorId: 'u9', // TuUsuario
    createdAt: Date.now() - 24 * 60 * 60 * 1000,
    img: "../Imagenes/Carbonara.jpg",
    likes: 12,
    liked: false,
    comments: []
  }
];

  savePosts(posts);

    const notificaciones = [
    { id: uid('n_'), texto: "@Ana le dio me gusta a tu receta de Mi primera receta: pasta carbonara cremosa.", tiempo: "Hace 10 minutos" },
    { id: uid('n_'), texto: "@Juan le dio me gusta a tu receta de Mi primera receta: pasta carbonara cremosa.", tiempo: "Hace 30 minutos" },
    { id: uid('n_'), texto: "@Juan te ha seguido.", tiempo: "Hace 1 hora" }
  ];

  save('notificaciones', notificaciones);
  const eventos = [
  { fecha: '2025-11-10', titulo: 'Clase: Repostería artesanal', hora: '17:00', creador: 'Juan' },
  { fecha: '2025-11-15', titulo: 'Cata de vinos y quesos', hora: '19:00', creador: 'Mario' },
  { fecha: '2025-11-22', titulo: 'Taller: Cocina internacional', hora: '11:00', creador: 'Laura' },
  { fecha: '2025-11-25', titulo: 'Masterclass: Panes caseros', hora: '18:30', creador: 'Ana' }
];
saveEventos(eventos);
const messages = [
    // Conversación con Juan (u4)
    { id: uid('m_'), senderId: 'u4', receiverId: 'u9', content: '¡Hola! Vi tu receta de lasaña y tuve que probarla.', timestamp: Date.now() - 36 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u4', receiverId: 'u9', content: 'Gracias por la receta de lasaña 😍', timestamp: Date.now() - 35 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u4', content: '¡Me alegro mucho de que te haya gustado, @Juan!', timestamp: Date.now() - 34 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u4', receiverId: 'u9', content: '¿Algún truco para la bechamel? A veces me salen grumos.', timestamp: Date.now() - 12 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u4', content: 'El truco es tamizar la harina y añadir la leche poco a poco, sin dejar de remover con varillas. ¡Y la leche templada!', timestamp: Date.now() - 11 * 60 * 60 * 1000 },

    // Conversación con Mario (u7)
    { id: uid('m_'), senderId: 'u7', receiverId: 'u9', content: '¡Hola! Tus tacos al pastor se ven increíbles 🔥 ¿Cómo consigues ese color tan bonito en la carne?', timestamp: Date.now() - 28 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u7', content: '¡Gracias, @Mario! Es por el achiote y un poco de chile guajillo. La clave está en la marinada.', timestamp: Date.now() - 27 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u7', receiverId: 'u9', content: '¿Cuánto tiempo los dejas marinar?', timestamp: Date.now() - 10 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u7', content: 'Unas 4 horas mínimo, pero si puedes dejarlos toda la noche, quedan mucho más sabrosos.', timestamp: Date.now() - 9 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u7', receiverId: 'u9', content: 'Genial, voy a probarlo este fin de semana. ¡Gracias por el tip!', timestamp: Date.now() - 8 * 60 * 60 * 1000 },
    
    // Conversación con Ana (u5)
    { id: uid('m_'), senderId: 'u5', receiverId: 'u9', content: '¡Hola! Vi tu publicación del pan de masa madre, se ve espectacular 😍', timestamp: Date.now() - 27 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u5', content: '¡Gracias, @Ana! Lleva su tiempo, pero vale la pena. ¿Tú también haces pan?', timestamp: Date.now() - 26 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u5', receiverId: 'u9', content: 'Sí, pero aún no logro que me quede con esa corteza crujiente. ¿Tienes algún consejo?', timestamp: Date.now() - 12 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u9', receiverId: 'u5', content: 'Usa vapor en el horno los primeros 20 minutos y deja fermentar la masa en frío toda la noche. ¡Es la clave!', timestamp: Date.now() - 11 * 60 * 60 * 1000 },
    { id: uid('m_'), senderId: 'u5', receiverId: 'u9', content: 'Perfecto, lo intentaré esta tarde. ¡Gracias por compartir!', timestamp: Date.now() - 10 * 60 * 60 * 1000 }
  ];
  saveMessages(messages);
}

// Generar ID único 
export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}

