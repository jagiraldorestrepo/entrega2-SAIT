document.addEventListener("DOMContentLoaded", () => {
const form = document.getElementById("agregarMecanicoForm");
const personasList = document.getElementById("personas-list");

cargarPersonas();

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const rol = document.getElementById("rol").value;
  const nombre = document.getElementById("nombre").value;
  const id = document.getElementById("id").value;
  const fotoInput = document.getElementById("foto");
  const fotoFile = fotoInput.files[0];

  const personas = JSON.parse(localStorage.getItem("personas")) || [];

  const existe = personas.some(persona => persona.id === id);
  if (existe) {
      Swal.fire({
          icon: "error",
          title: "Error",
          text: "El ID ya está registrado. Ingresa un ID diferente.",
          showConfirmButton: true
      });
      return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
      const fotoUrl = e.target.result;

      const persona = { rol, nombre, id, foto: fotoUrl };

      guardarPersona(persona);
      mostrarPersona(persona);
      form.reset();

      Swal.fire({
          icon: "success",
          title: "Persona Agregada",
          text: `${nombre} ha sido guardado correctamente.`,
          showConfirmButton: false,
          timer: 2000
      });
  };

  if (fotoFile) {
      reader.readAsDataURL(fotoFile);
  } else {
      const defaultFotoUrl = "/imagenes/personaPredeterminada.png";
      const persona = { rol, nombre, id, foto: defaultFotoUrl };

      guardarPersona(persona);
      mostrarPersona(persona);
      form.reset();

      Swal.fire({
          icon: "success",
          title: "Persona Agregada",
          text: `${nombre} ha sido guardado correctamente.`,
          showConfirmButton: false,
          timer: 2000
      });
  }
});

function guardarPersona(persona) {
    const personas = JSON.parse(localStorage.getItem("personas")) || [];
    personas.push(persona);
    localStorage.setItem("personas", JSON.stringify(personas));
}

function cargarPersonas() {
    const personas = JSON.parse(localStorage.getItem("personas")) || [];
    personasList.innerHTML = ""; // Limpiar lista

    if (personas.length === 0) {
        personasList.innerHTML = "<p>No hay personas agregadas aún.</p>";
    } else {
        personas.forEach(mostrarPersona);
    }
}

function mostrarPersona(persona) {
    const card = document.createElement("div");
    card.classList.add("persona-card");

    card.innerHTML = `
        <img src="${persona.foto}" alt="${persona.nombre}">
        <h3>${persona.nombre}</h3>
        <p><strong>Rol:</strong> ${persona.rol}</p>
        <p><strong>ID:</strong> ${persona.id}</p>
        <button class="eliminar-btn" data-id="${persona.id}" aria-label="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="Red" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </button>
    `;

    card.querySelector(".eliminar-btn").addEventListener("click", () => {
        eliminarPersona(persona.id);
    });

    personasList.appendChild(card);
}

function eliminarPersona(id) {
    let personas = JSON.parse(localStorage.getItem("personas")) || [];
    personas = personas.filter(persona => persona.id !== id);
    localStorage.setItem("personas", JSON.stringify(personas));

    cargarPersonas();

    Swal.fire({
        icon: "warning",
        title: "Persona Eliminada",
        text: "La persona ha sido eliminada correctamente.",
        showConfirmButton: false,
        timer: 2000
    });
}
});
