const usuarios = [
  {
    nombre: "Ana López",
    usuario: "analopez",
    correo: "ana@example.com",
    ubicacion: "Madrid, España",
    miembroDesde: "Enero 2024",
    bio: "Diseñadora UX/UI y amante del arte digital.",
    avatar: "ava.png"
  },
  {
    nombre: "Carlos Gómez",
    usuario: "cgomez",
    correo: "carlos@example.com",
    ubicacion: "Sevilla, España",
    miembroDesde: "Marzo 2023",
    bio: "Desarrollador full-stack apasionado por la música.",
    avatar: "carlos.png"
  },
  {
    nombre: "Lucía Vega",
    usuario: "lvega",
    correo: "lucia@example.com",
    ubicacion: "Valencia, España",
    miembroDesde: "Julio 2022",
    bio: "Ingeniera de datos curiosa por la IA aplicada.",
    avatar: "lucia.png"
  }
];

const contenedor = document.getElementById("contenedor-perfiles");

usuarios.forEach(u => {
  const perfilHTML = `
    <div class="perfil-container">
      <div class="perfil-header">
        <img src="${u.avatar}" alt="${u.nombre}" class="perfil-avatar">
        <h1 class="perfil-nombre">${u.nombre}</h1>
        <p class="perfil-usuario">@${u.usuario}</p>
      </div>
      <div class="perfil-info">
        <h2>Información</h2>
        <ul>
          <li><strong>Correo:</strong> ${u.correo}</li>
          <li><strong>Ubicación:</strong> ${u.ubicacion}</li>
          <li><strong>Miembro desde:</strong> ${u.miembroDesde}</li>
        </ul>
      </div>
      <div class="perfil-bio">
        <h2>Biografía</h2>
        <p>${u.bio}</p>
      </div>
    </div>`;
  contenedor.innerHTML += perfilHTML;
});
